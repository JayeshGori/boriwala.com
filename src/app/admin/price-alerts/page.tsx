'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiBell, FiSend, FiMail, FiPhone } from 'react-icons/fi';
import { adminFetch } from '@/lib/admin-auth';

interface Alert {
  _id: string;
  product?: { _id: string; name: string; slug: string };
  email?: string;
  whatsapp?: string;
  name?: string;
  isActive: boolean;
  notifiedAt?: string;
  createdAt: string;
}

interface ProductGroup {
  productId: string;
  productName: string;
  alerts: Alert[];
}

export default function AdminPriceAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const d = await adminFetch('/api/price-alerts');
    if (d.success) setAlerts(d.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Group alerts by product
  const groups: ProductGroup[] = [];
  for (const a of alerts) {
    const id = a.product?._id || 'unknown';
    let g = groups.find((x) => x.productId === id);
    if (!g) {
      g = { productId: id, productName: a.product?.name || '— deleted product —', alerts: [] };
      groups.push(g);
    }
    g.alerts.push(a);
  }

  const trigger = async (productId: string) => {
    const message = messages[productId]?.trim();
    if (!message) {
      toast.error('Enter a message to send');
      return;
    }
    setSending(productId);
    const d = await adminFetch('/api/price-alerts/trigger', {
      method: 'POST',
      body: JSON.stringify({ product: productId, message }),
    });
    if (d.success) {
      toast.success(d.message || 'Sent');
      setMessages({ ...messages, [productId]: '' });
      load();
    } else {
      toast.error(d.error || 'Failed');
    }
    setSending(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Price Alert Subscribers</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {alerts.length} active subscriber{alerts.length !== 1 ? 's' : ''} across {groups.length} product
            {groups.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl" />)}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center p-12 bg-white border border-dashed border-slate-300 rounded-xl">
          <FiBell size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No price alert subscriptions yet.</p>
          <p className="text-xs text-slate-400 mt-1">
            Buyers can subscribe via the <strong>Notify me</strong> widget on each product page.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map((g) => (
            <div key={g.productId} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{g.productName}</h3>
                  <p className="text-xs text-slate-500">
                    {g.alerts.length} subscriber{g.alerts.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                  {g.alerts.filter((a) => a.notifiedAt).length} notified
                </span>
              </div>

              {/* Subscribers list */}
              <div className="border border-slate-200 rounded-lg overflow-hidden mb-3">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
                    <tr>
                      <th className="text-left px-3 py-2">Subscriber</th>
                      <th className="text-left px-3 py-2 hidden sm:table-cell">Email</th>
                      <th className="text-left px-3 py-2 hidden sm:table-cell">WhatsApp</th>
                      <th className="text-left px-3 py-2">Subscribed</th>
                      <th className="text-left px-3 py-2">Last Sent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.alerts.map((a) => (
                      <tr key={a._id} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-medium text-slate-700">{a.name || '—'}</td>
                        <td className="px-3 py-2 text-slate-600 hidden sm:table-cell">
                          {a.email ? (
                            <span className="inline-flex items-center gap-1"><FiMail size={11} /> {a.email}</span>
                          ) : '—'}
                        </td>
                        <td className="px-3 py-2 text-slate-600 hidden sm:table-cell">
                          {a.whatsapp ? (
                            <span className="inline-flex items-center gap-1"><FiPhone size={11} /> {a.whatsapp}</span>
                          ) : '—'}
                        </td>
                        <td className="px-3 py-2 text-slate-500 text-xs">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 text-slate-500 text-xs">
                          {a.notifiedAt ? new Date(a.notifiedAt).toLocaleDateString() : <span className="text-slate-400">Never</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Trigger form */}
              {g.productId !== 'unknown' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Send Alert</p>
                  <textarea
                    value={messages[g.productId] || ''}
                    onChange={(e) => setMessages({ ...messages, [g.productId]: e.target.value })}
                    placeholder="e.g. Price reduced! Now ₹85 per kg. Limited time offer."
                    rows={2}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => trigger(g.productId)}
                      disabled={sending === g.productId}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-semibold rounded-lg"
                    >
                      <FiSend size={14} />
                      {sending === g.productId ? 'Sending...' : `Notify ${g.alerts.length} subscriber${g.alerts.length !== 1 ? 's' : ''}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
