'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-auth';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiRefreshCw, FiTrendingUp, FiTrendingDown, FiMinus, FiLock, FiUnlock, FiRotateCcw } from 'react-icons/fi';

interface Price {
  _id: string;
  name: string;
  grade?: string;
  category: 'polymer' | 'jute';
  unit: string;
  price: number;
  previousPrice: number;
  trend: 'up' | 'down' | 'flat';
  changePct: number;
  source: string;
  sourceUrl?: string;
  manualOverride: boolean;
  isActive: boolean;
  displayOrder: number;
  note?: string;
  lastUpdated: string;
}

const emptyForm = {
  name: '',
  grade: '',
  category: 'polymer' as 'polymer' | 'jute',
  unit: '₹/kg',
  price: 0,
  source: 'Manual',
  sourceUrl: '',
  manualOverride: false,
  isActive: true,
  displayOrder: 0,
  note: '',
};

export default function AdminPricesPage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [scraping, setScraping] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    const data = await adminFetch('/api/admin/prices');
    if (data.success) setPrices(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p: Price) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      grade: p.grade || '',
      category: p.category,
      unit: p.unit,
      price: p.price,
      source: p.source,
      sourceUrl: p.sourceUrl || '',
      manualOverride: p.manualOverride,
      isActive: p.isActive,
      displayOrder: p.displayOrder,
      note: p.note || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    setSaving(true);
    const path = editingId ? `/api/admin/prices/${editingId}` : '/api/admin/prices';
    const method = editingId ? 'PATCH' : 'POST';
    const data = await adminFetch(path, { method, body: JSON.stringify(form) });
    if (data.success) {
      toast.success(editingId ? 'Price updated' : 'Price added');
      setShowModal(false);
      fetchPrices();
    } else {
      toast.error(data.error || 'Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this price entry?')) return;
    const data = await adminFetch(`/api/admin/prices/${id}`, { method: 'DELETE' });
    if (data.success) {
      toast.success('Deleted');
      fetchPrices();
    }
  };

  const quickPriceUpdate = async (p: Price, newPrice: number) => {
    if (!newPrice || newPrice === p.price) return;
    const data = await adminFetch(`/api/admin/prices/${p._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ price: newPrice }),
    });
    if (data.success) {
      toast.success(`${p.name} updated to ${p.unit}${newPrice}`);
      fetchPrices();
    }
  };

  const toggleField = async (p: Price, field: 'isActive' | 'manualOverride') => {
    const data = await adminFetch(`/api/admin/prices/${p._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ [field]: !p[field] }),
    });
    if (data.success) fetchPrices();
  };

  const resetDefaults = async () => {
    if (!confirm('This will DELETE all existing price rows and recreate the 5 default rows (PP, HDPE, LLDPE, Jute, Jute MSP). Continue?')) return;
    const data = await adminFetch('/api/admin/prices/reset', { method: 'POST' });
    if (data.success) {
      toast.success('Defaults restored');
      fetchPrices();
    } else {
      toast.error(data.error || 'Reset failed');
    }
  };

  const triggerScrape = async () => {
    setScraping(true);
    try {
      const res = await fetch('/api/cron/scrape-prices');
      const data = await res.json();
      if (data.success) {
        toast.success(
          `Scrape complete — polymers updated: ${data.report?.polymer?.updated || 0}, jute updated: ${data.report?.jute?.updated || 0}`
        );
        fetchPrices();
      } else {
        toast.error(data.error || 'Scrape failed');
      }
    } catch {
      toast.error('Scrape request failed');
    }
    setScraping(false);
  };

  const polymer = prices.filter((p) => p.category === 'polymer');
  const jute = prices.filter((p) => p.category === 'jute');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Market Prices</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage live polymer & jute prices shown in the website header ticker.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={resetDefaults}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
            title="Wipe all rows and recreate the 5 default rows"
          >
            <FiRotateCcw size={16} /> Reset to Defaults
          </button>
          <button
            onClick={triggerScrape}
            disabled={scraping}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
          >
            <FiRefreshCw size={16} className={scraping ? 'animate-spin' : ''} />
            {scraping ? 'Fetching...' : 'Run Auto-Scrape'}
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium"
          >
            <FiPlus size={16} /> Add Price
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-6">
        <strong>Sources:</strong> Polymers from Plastemart (best-effort scrape). Jute from AGMARKNET via data.gov.in (set <code className="bg-amber-100 px-1 rounded">DATA_GOV_API_KEY</code>). 
        Toggle <FiLock size={11} className="inline" /> Lock on a row to prevent auto-scraper from overwriting your manual price.
        Cron runs daily at 04:00 UTC via Vercel (set <code className="bg-amber-100 px-1 rounded">CRON_SECRET</code> for security).
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : (
        <div className="space-y-8">
          <PriceTable title="Polymers" items={polymer} onEdit={openEdit} onDelete={handleDelete} onQuickUpdate={quickPriceUpdate} onToggle={toggleField} />
          <PriceTable title="Jute" items={jute} onEdit={openEdit} onDelete={handleDelete} onQuickUpdate={quickPriceUpdate} onToggle={toggleField} />
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold">{editingId ? 'Edit' : 'Add'} Price</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name *">
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. PP Raffia" className="input" />
                </Field>
                <Field label="Grade">
                  <input type="text" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="e.g. H110MA" className="input" />
                </Field>
                <Field label="Category *">
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as 'polymer' | 'jute' })} className="input">
                    <option value="polymer">Polymer</option>
                    <option value="jute">Jute</option>
                  </select>
                </Field>
                <Field label="Unit *">
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input">
                    <option value="₹/kg">₹/kg</option>
                    <option value="₹/quintal">₹/quintal</option>
                    <option value="₹/ton">₹/ton</option>
                  </select>
                </Field>
                <Field label="Price *">
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="input" />
                </Field>
                <Field label="Display Order">
                  <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} className="input" />
                </Field>
                <Field label="Source">
                  <input type="text" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="RIL / GAIL / AGMARKNET / Manual" className="input" />
                </Field>
                <Field label="Source URL">
                  <input type="url" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} className="input" />
                </Field>
              </div>
              <Field label="Note">
                <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={2} className="input resize-none" />
              </Field>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  Show in ticker
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.manualOverride} onChange={(e) => setForm({ ...form, manualOverride: e.target.checked })} />
                  Lock (no auto-scrape)
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5 border-t bg-slate-50">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          outline: none;
        }
        :global(.input:focus) {
          border-color: #f59e0b;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-700 mb-1">{label}</span>
      {children}
    </label>
  );
}

function PriceTable({
  title,
  items,
  onEdit,
  onDelete,
  onQuickUpdate,
  onToggle,
}: {
  title: string;
  items: Price[];
  onEdit: (p: Price) => void;
  onDelete: (id: string) => void;
  onQuickUpdate: (p: Price, newPrice: number) => void;
  onToggle: (p: Price, field: 'isActive' | 'manualOverride') => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b bg-slate-50">
        <h2 className="font-semibold text-slate-800">{title} ({items.length})</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Price</th>
              <th className="text-left px-4 py-2">Change</th>
              <th className="text-left px-4 py-2">Source</th>
              <th className="text-left px-4 py-2">Updated</th>
              <th className="text-left px-4 py-2">Flags</th>
              <th className="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => {
              const TrendIcon = p.trend === 'up' ? FiTrendingUp : p.trend === 'down' ? FiTrendingDown : FiMinus;
              const trendColor = p.trend === 'up' ? 'text-emerald-600' : p.trend === 'down' ? 'text-red-600' : 'text-slate-400';
              return (
                <tr key={p._id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-2">
                    <div className="font-semibold text-slate-800">{p.name}</div>
                    {p.grade && <div className="text-xs text-slate-500">{p.grade}</div>}
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={p.price}
                      onBlur={(e) => {
                        const v = parseFloat(e.target.value);
                        if (v && v !== p.price) onQuickUpdate(p, v);
                      }}
                      className="w-24 px-2 py-1 border border-slate-200 rounded text-sm tabular-nums"
                    />
                    <span className="text-xs text-slate-500 ml-1">{p.unit}</span>
                  </td>
                  <td className={`px-4 py-2 ${trendColor}`}>
                    <span className="inline-flex items-center gap-1 font-medium">
                      <TrendIcon size={14} />
                      {p.changePct !== 0 ? `${p.changePct > 0 ? '+' : ''}${p.changePct}%` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">{p.source}</td>
                  <td className="px-4 py-2 text-xs text-slate-500">
                    {new Date(p.lastUpdated).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => onToggle(p, 'isActive')}
                        title={p.isActive ? 'Active in ticker' : 'Hidden'}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {p.isActive ? 'LIVE' : 'OFF'}
                      </button>
                      <button
                        onClick={() => onToggle(p, 'manualOverride')}
                        title={p.manualOverride ? 'Locked from auto-scraper' : 'Auto-scrape allowed'}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold inline-flex items-center gap-1 ${p.manualOverride ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {p.manualOverride ? <FiLock size={10} /> : <FiUnlock size={10} />}
                        {p.manualOverride ? 'LOCK' : 'AUTO'}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => onEdit(p)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => onDelete(p._id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded">
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
