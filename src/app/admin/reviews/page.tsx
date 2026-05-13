'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiStar, FiTrash2, FiVideo, FiPlus } from 'react-icons/fi';
import { adminFetch } from '@/lib/admin-auth';

interface Review {
  _id: string;
  product?: { _id: string; name: string; slug: string };
  name: string;
  email?: string;
  companyName?: string;
  rating: number;
  title?: string;
  comment: string;
  videoUrl?: string;
  isApproved: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  source: string;
  createdAt: string;
}

interface ProductOpt { _id: string; name: string; slug: string }

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  // Manual-add state
  const [products, setProducts] = useState<ProductOpt[]>([]);
  const [addForm, setAddForm] = useState({
    product: '',
    name: '',
    companyName: '',
    rating: 5,
    title: '',
    comment: '',
    videoUrl: '',
    isFeatured: false,
  });

  const load = async () => {
    setLoading(true);
    const data = await adminFetch('/api/reviews?all=true');
    if (data.success) setReviews(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (showAdd && products.length === 0) {
      adminFetch('/api/products?limit=500&activeOnly=false').then((d: { success: boolean; data?: ProductOpt[] }) => {
        if (d.success && d.data) setProducts(d.data.map((p) => ({ _id: p._id, name: p.name, slug: p.slug })));
      });
    }
  }, [showAdd, products.length]);

  const update = async (id: string, body: Partial<Review>) => {
    const data = await adminFetch(`/api/reviews/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    if (data.success) {
      toast.success('Updated');
      load();
    } else {
      toast.error(data.error || 'Failed');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    const data = await adminFetch(`/api/reviews/${id}`, { method: 'DELETE' });
    if (data.success) {
      toast.success('Deleted');
      load();
    }
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.product || !addForm.name || !addForm.comment) {
      toast.error('Product, name and comment are required');
      return;
    }
    // Admin manual create — POST hits /api/reviews/[id] route which handles admin POST
    const data = await adminFetch('/api/reviews/new', {
      method: 'POST',
      body: JSON.stringify({ ...addForm, isApproved: true }),
    });
    if (data.success) {
      toast.success('Review added');
      setShowAdd(false);
      setAddForm({ product: '', name: '', companyName: '', rating: 5, title: '', comment: '', videoUrl: '', isFeatured: false });
      load();
    } else {
      toast.error(data.error || 'Failed');
    }
  };

  const filtered = reviews.filter((r) => {
    if (filter === 'pending') return !r.isApproved;
    if (filter === 'approved') return r.isApproved;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Reviews</h2>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="pending">Pending ({reviews.filter((r) => !r.isApproved).length})</option>
            <option value="approved">Approved ({reviews.filter((r) => r.isApproved).length})</option>
            <option value="all">All ({reviews.length})</option>
          </select>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg"
          >
            <FiPlus size={14} /> Add Review
          </button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={submitAdd} className="bg-white border border-slate-200 rounded-xl p-5 mb-6 space-y-3">
          <h3 className="font-semibold text-slate-800">Add Review Manually</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={addForm.product}
              onChange={(e) => setAddForm({ ...addForm, product: e.target.value })}
              required
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">Select product *</option>
              {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <select
              value={addForm.rating}
              onChange={(e) => setAddForm({ ...addForm, rating: parseInt(e.target.value, 10) })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s} ★ Rating</option>)}
            </select>
            <input
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              placeholder="Customer name *"
              required
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
            <input
              value={addForm.companyName}
              onChange={(e) => setAddForm({ ...addForm, companyName: e.target.value })}
              placeholder="Company (optional)"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
            <input
              value={addForm.title}
              onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
              placeholder="Review title (optional)"
              className="sm:col-span-2 px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
            <textarea
              value={addForm.comment}
              onChange={(e) => setAddForm({ ...addForm, comment: e.target.value })}
              placeholder="Review comment *"
              required
              rows={3}
              className="sm:col-span-2 px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none"
            />
            <input
              value={addForm.videoUrl}
              onChange={(e) => setAddForm({ ...addForm, videoUrl: e.target.value })}
              placeholder="Video URL (YouTube/Drive — optional)"
              className="sm:col-span-2 px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
            <label className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" checked={addForm.isFeatured} onChange={(e) => setAddForm({ ...addForm, isFeatured: e.target.checked })} />
              <span className="text-sm">Mark as featured</span>
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm border border-slate-300 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg">Save Review</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center p-12 bg-white border border-dashed border-slate-300 rounded-xl">
          <p className="text-slate-500 text-sm">No reviews in this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r._id} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800">{r.name}</p>
                    {r.companyName && <span className="text-xs text-slate-500">· {r.companyName}</span>}
                    {r.isVerified && <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full">VERIFIED</span>}
                    {r.isFeatured && <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">FEATURED</span>}
                    {r.source === 'admin' && <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full">MANUAL</span>}
                    {r.videoUrl && <FiVideo className="text-amber-500" size={14} />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Product: <strong>{r.product?.name || 'Unknown'}</strong>
                    {r.email && <> · {r.email}</>}
                    <> · {new Date(r.createdAt).toLocaleDateString()}</>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FiStar key={i} size={14} className={i <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
                  ))}
                </div>
              </div>
              {r.title && <p className="font-semibold text-slate-800">{r.title}</p>}
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{r.comment}</p>
              {r.videoUrl && (
                <a href={r.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 hover:underline mt-2 inline-block">
                  ▶ Watch video review
                </a>
              )}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                {!r.isApproved ? (
                  <button onClick={() => update(r._id, { isApproved: true })} className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
                    <FiCheck size={12} /> Approve
                  </button>
                ) : (
                  <button onClick={() => update(r._id, { isApproved: false })} className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg">
                    <FiX size={12} /> Unapprove
                  </button>
                )}
                <button onClick={() => update(r._id, { isFeatured: !r.isFeatured })} className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg ${r.isFeatured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 hover:bg-amber-50 text-slate-700'}`}>
                  <FiStar size={12} /> {r.isFeatured ? 'Featured' : 'Mark featured'}
                </button>
                <button onClick={() => remove(r._id)} className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg">
                  <FiTrash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
