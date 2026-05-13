'use client';

import { useState } from 'react';
import { FiBell, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useBuyerAuth } from '@/context/BuyerAuthContext';

interface Props {
  productId: string;
  productName: string;
}

export default function PriceAlertWidget({ productId, productName }: Props) {
  const { buyer } = useBuyerAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(buyer?.name || '');
  const [email, setEmail] = useState(buyer?.email || '');
  const [whatsapp, setWhatsapp] = useState(buyer?.phone || '');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !whatsapp) {
      toast.error('Please provide at least an email or WhatsApp number');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/price-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: productId, name, email, whatsapp }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        toast.success(data.message || 'Subscribed!');
      } else {
        toast.error(data.error || 'Failed');
      }
    } catch {
      toast.error('Network error');
    }
    setSubmitting(false);
  };

  if (done) {
    return (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
        <FiCheck className="text-green-600 shrink-0" size={20} />
        <p className="text-sm text-green-800">
          You&apos;ll be notified when <strong>{productName}</strong> price or stock changes.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
        >
          <FiBell size={16} /> Notify me of price &amp; stock updates
        </button>
      ) : (
        <form onSubmit={submit} className="p-4 bg-white border border-amber-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <FiBell className="text-amber-600" />
            <p className="text-sm font-semibold text-slate-800">
              Get alerts for <span className="text-amber-700">{productName}</span>
            </p>
          </div>
          <p className="text-xs text-slate-500">We&apos;ll notify you of price changes, restock or special offers. Provide email or WhatsApp.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="WhatsApp number"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-1.5 text-sm font-semibold bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg">
              {submitting ? 'Subscribing...' : 'Subscribe to Alerts'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
