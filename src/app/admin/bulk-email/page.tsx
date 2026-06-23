'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-auth';
import toast from 'react-hot-toast';
import { FiSend, FiUsers, FiUserCheck, FiBell, FiMail, FiEye } from 'react-icons/fi';

type AudienceKey = 'approved-buyers' | 'all-buyers' | 'price-alert-subscribers';

interface Counts {
  'approved-buyers': number;
  'all-buyers': number;
  'price-alert-subscribers': number;
}

const AUDIENCES: { key: AudienceKey; label: string; desc: string; icon: typeof FiUsers }[] = [
  { key: 'approved-buyers', label: 'Approved buyers', desc: 'Active, approved B2B customers', icon: FiUserCheck },
  { key: 'all-buyers', label: 'All registered buyers', desc: 'Everyone who signed up (incl. pending)', icon: FiUsers },
  { key: 'price-alert-subscribers', label: 'Price-alert subscribers', desc: 'People tracking product prices', icon: FiBell },
];

const TEMPLATES: { key: string; label: string; heading: string; subject: string; body: string }[] = [
  {
    key: 'product',
    label: 'New Product Launch',
    heading: 'Introducing our latest product',
    subject: 'New Launch at Boriwala Trading',
    body: 'We are excited to announce a new addition to our catalogue.\n\nDescribe the product, key specs, MOQ and wholesale pricing here.',
  },
  {
    key: 'pricing',
    label: 'Pricing Update',
    heading: 'Updated wholesale pricing',
    subject: 'Pricing Update — Boriwala Trading',
    body: 'Our latest wholesale pricing is now live.\n\nList the products and revised rates here.',
  },
  {
    key: 'newsletter',
    label: 'Newsletter',
    heading: 'Boriwala Monthly Update',
    subject: 'Boriwala Newsletter',
    body: 'Share company news, offers and industry updates here.',
  },
];

export default function AdminBulkEmailPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [selected, setSelected] = useState<AudienceKey[]>(['approved-buyers']);
  const [manualEmails, setManualEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [heading, setHeading] = useState('');
  const [body, setBody] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    (async () => {
      const d = await adminFetch('/api/admin/bulk-email');
      if (d.success) setCounts(d.data);
    })();
  }, []);

  const toggle = (key: AudienceKey) =>
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const applyTemplate = (t: (typeof TEMPLATES)[number]) => {
    setHeading(t.heading);
    setSubject(t.subject);
    setBody(t.body);
  };

  const manualCount = manualEmails
    .split(/[\s,;]+/)
    .map((e) => e.trim())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)).length;

  const estimatedRecipients = () => {
    if (!counts) return manualCount;
    let n = 0;
    if (selected.includes('all-buyers')) n += counts['all-buyers'];
    else if (selected.includes('approved-buyers')) n += counts['approved-buyers'];
    if (selected.includes('price-alert-subscribers')) n += counts['price-alert-subscribers'];
    return n + manualCount; // upper bound (server de-dupes)
  };

  const bodyToHtml = (text: string) =>
    text
      .split(/\n{2,}/)
      .map((p) => `<p style="margin:0 0 14px 0;">${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');

  const send = async () => {
    if (!subject.trim()) return toast.error('Enter a subject');
    if (!body.trim()) return toast.error('Enter a message');
    if (selected.length === 0 && manualCount === 0) return toast.error('Pick an audience or add emails');

    if (!confirm(`Send this campaign to up to ${estimatedRecipients()} recipient(s)?`)) return;

    setSending(true);
    try {
      const d = await adminFetch('/api/admin/bulk-email', {
        method: 'POST',
        body: JSON.stringify({
          audiences: selected,
          manualEmails,
          subject,
          heading,
          bodyHtml: bodyToHtml(body),
          ctaLabel,
          ctaUrl,
        }),
      });
      if (d.success) {
        toast.success(d.message || 'Campaign sent');
        if (d.errors?.length) console.warn('Bulk email errors:', d.errors);
      } else {
        toast.error(d.error || 'Failed to send');
      }
    } catch {
      toast.error('Network error');
    }
    setSending(false);
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Bulk Email</h2>
        <p className="text-sm text-slate-500 mt-1">
          Send product launches, pricing updates and newsletters to your audience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer */}
        <div className="lg:col-span-2 space-y-5">
          {/* Templates */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Quick start</p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => applyTemplate(t)}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. New Launch: Premium PP Woven Bags"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Heading (inside email)</label>
              <input
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="Defaults to the subject if left blank"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={9}
                placeholder="Write your message. Leave a blank line between paragraphs."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-y"
              />
              <p className="text-xs text-slate-400 mt-1">Recipients are greeted by name automatically when available.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Button label (optional)</label>
                <input
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  placeholder="e.g. View Products"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Button link (optional)</label>
                <input
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="https://boriwala.com/products"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Audience + actions */}
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Audience</p>
            <div className="space-y-2">
              {AUDIENCES.map((a) => (
                <label
                  key={a.key}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selected.includes(a.key) ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(a.key)}
                    onChange={() => toggle(a.key)}
                    className="mt-1 accent-amber-500"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
                      <a.icon size={14} /> {a.label}
                      {counts && (
                        <span className="text-xs font-semibold text-amber-700">({counts[a.key]})</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{a.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Add emails manually</label>
              <textarea
                value={manualEmails}
                onChange={(e) => setManualEmails(e.target.value)}
                rows={3}
                placeholder="comma or newline separated"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-y"
              />
              {manualCount > 0 && <p className="text-xs text-green-600 mt-1">{manualCount} valid email(s)</p>}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-600">Estimated recipients</span>
              <span className="text-lg font-bold text-slate-800">{estimatedRecipients()}</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Duplicates across groups are removed automatically.</p>
            <button
              onClick={() => setShowPreview((v) => !v)}
              className="w-full mb-2 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              <FiEye size={15} /> {showPreview ? 'Hide preview' : 'Preview'}
            </button>
            <button
              onClick={send}
              disabled={sending}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg"
            >
              <FiSend size={15} /> {sending ? 'Sending…' : 'Send Campaign'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <FiMail size={13} /> Email preview
          </p>
          <div className="border border-slate-200 rounded-lg p-5 bg-slate-50">
            <p className="text-xs text-slate-400 mb-2">Subject: <span className="text-slate-700 font-medium">{subject || '(none)'}</span></p>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{heading || subject || '(heading)'}</h3>
            <p className="text-sm text-slate-600 mb-2">Hi [Customer name],</p>
            <div
              className="text-sm text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: bodyToHtml(body) || '<p>(message body)</p>' }}
            />
            {ctaLabel && ctaUrl && (
              <div className="mt-4">
                <span className="inline-block bg-amber-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
                  {ctaLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
