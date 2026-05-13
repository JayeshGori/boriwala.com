'use client';

import { useEffect, useState } from 'react';
import { adminFetch, adminUpload } from '@/lib/admin-auth';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiUpload, FiArrowUp, FiArrowDown, FiEye, FiEyeOff, FiX, FiSave } from 'react-icons/fi';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  ctaText?: string;
  ctaUrl?: string;
  textPosition: 'left' | 'center' | 'right';
  overlay: boolean;
  badge?: string;
  order: number;
  isActive: boolean;
}

const emptyBanner: Omit<Banner, '_id'> = {
  title: '',
  subtitle: '',
  image: '',
  mobileImage: '',
  ctaText: '',
  ctaUrl: '',
  textPosition: 'left',
  overlay: true,
  badge: '',
  order: 0,
  isActive: true,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const d = await adminFetch('/api/banners?all=true');
      if (d.success) setBanners(d.data);
    } catch {
      toast.error('Failed to load banners');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing({ _id: '', ...emptyBanner, order: banners.length });
    setShowModal(true);
  };

  const openEdit = (b: Banner) => {
    setEditing({ ...b });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.title || !editing.image) {
      toast.error('Title and image are required');
      return;
    }
    try {
      const isNew = !editing._id;
      const url = isNew ? '/api/banners' : `/api/banners/${editing._id}`;
      const method = isNew ? 'POST' : 'PUT';
      const { _id, ...payload } = editing;
      void _id;
      const d = await adminFetch(url, { method, body: JSON.stringify(payload) });
      if (d.success) {
        toast.success(isNew ? 'Banner created' : 'Banner updated');
        closeModal();
        load();
      } else {
        toast.error(d.error || 'Save failed');
      }
    } catch {
      toast.error('Error saving banner');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      const d = await adminFetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (d.success) {
        toast.success('Deleted');
        load();
      } else {
        toast.error(d.error || 'Delete failed');
      }
    } catch {
      toast.error('Error deleting');
    }
  };

  const toggleActive = async (b: Banner) => {
    try {
      const d = await adminFetch(`/api/banners/${b._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !b.isActive }),
      });
      if (d.success) {
        toast.success(b.isActive ? 'Banner hidden' : 'Banner activated');
        load();
      }
    } catch {
      toast.error('Failed to toggle');
    }
  };

  const reorder = async (b: Banner, direction: -1 | 1) => {
    const sorted = [...banners].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((x) => x._id === b._id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const other = sorted[swapIdx];
    try {
      await Promise.all([
        adminFetch(`/api/banners/${b._id}`, { method: 'PUT', body: JSON.stringify({ order: other.order }) }),
        adminFetch(`/api/banners/${other._id}`, { method: 'PUT', body: JSON.stringify({ order: b.order }) }),
      ]);
      load();
    } catch {
      toast.error('Failed to reorder');
    }
  };

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hero Banners</h2>
          <p className="text-sm text-slate-500 mt-1">Manage homepage banner slider. Drag-equivalent reorder using arrows.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <FiPlus size={16} /> Add Banner
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-32" />
          ))}
        </div>
      ) : sortedBanners.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-3">🎨</div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">No banners yet</h3>
          <p className="text-sm text-slate-500 mb-5">Create your first hero banner to display on the homepage.</p>
          <button onClick={openCreate} className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium">
            <FiPlus className="inline mr-1" size={14} /> Create Banner
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedBanners.map((b, idx) => (
            <div
              key={b._id}
              className={`bg-white rounded-xl border ${b.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60'} overflow-hidden flex flex-col sm:flex-row`}
            >
              {/* Preview */}
              <div className="relative w-full sm:w-56 h-40 sm:h-auto shrink-0 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                {b.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold uppercase rounded">
                    {b.badge}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-400">#{idx + 1}</span>
                    <h4 className="text-base font-semibold text-slate-800">{b.title}</h4>
                    {!b.isActive && <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">HIDDEN</span>}
                  </div>
                  {b.subtitle && <p className="text-sm text-slate-500 line-clamp-2">{b.subtitle}</p>}
                  {b.ctaText && (
                    <span className="inline-block mt-1.5 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      CTA: {b.ctaText} → {b.ctaUrl || '(no URL)'}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button
                    onClick={() => reorder(b, -1)}
                    disabled={idx === 0}
                    className="p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 rounded"
                    title="Move up"
                  >
                    <FiArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => reorder(b, 1)}
                    disabled={idx === sortedBanners.length - 1}
                    className="p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 rounded"
                    title="Move down"
                  >
                    <FiArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => toggleActive(b)}
                    className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1 ${
                      b.isActive ? 'text-green-700 bg-green-50 hover:bg-green-100' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {b.isActive ? <FiEye size={12} /> : <FiEyeOff size={12} />}
                    {b.isActive ? 'Active' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => openEdit(b)}
                    className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded flex items-center gap-1"
                  >
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => remove(b._id)}
                    className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded flex items-center gap-1"
                  >
                    <FiTrash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && editing && <BannerModal banner={editing} setBanner={setEditing} onClose={closeModal} onSave={save} />}
    </div>
  );
}

/* ---------------- Banner edit modal ---------------- */
function BannerModal({
  banner,
  setBanner,
  onClose,
  onSave,
}: {
  banner: Banner;
  setBanner: (b: Banner) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'mobileImage') => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const d = await adminUpload([f]);
      if (d.success && d.data?.[0]) {
        setBanner({ ...banner, [field]: d.data[0] });
        toast.success('Uploaded');
      } else {
        toast.error('Upload failed');
      }
    } catch {
      toast.error('Upload error');
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">{banner._id ? 'Edit Banner' : 'Create Banner'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Banner Image *</label>
            {banner.image ? (
              <div className="relative w-full aspect-[16/6] rounded-lg overflow-hidden bg-slate-100 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={banner.image} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setBanner({ ...banner, image: '' })}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                  type="button"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-[16/6] border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-amber-400 transition-colors mb-2">
                <FiUpload size={28} className="text-slate-400 mb-2" />
                <span className="text-sm text-slate-500">{uploading ? 'Uploading...' : 'Click to upload (max 2MB)'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'image')} disabled={uploading} />
              </label>
            )}
            <input
              type="text"
              value={banner.image}
              onChange={(e) => setBanner({ ...banner, image: e.target.value })}
              placeholder="…or paste image URL"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Mobile image (optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Image (optional)</label>
            {banner.mobileImage && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-slate-100 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={banner.mobileImage} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setBanner({ ...banner, mobileImage: '' })}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  type="button"
                >
                  <FiTrash2 size={10} />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <label className="px-3 py-2 border border-slate-300 rounded-lg text-sm cursor-pointer hover:bg-slate-50">
                <FiUpload size={14} className="inline mr-1" /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'mobileImage')} disabled={uploading} />
              </label>
              <input
                type="text"
                value={banner.mobileImage || ''}
                onChange={(e) => setBanner({ ...banner, mobileImage: e.target.value })}
                placeholder="…or paste mobile image URL"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              value={banner.title}
              onChange={(e) => setBanner({ ...banner, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Big bold headline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
            <textarea
              value={banner.subtitle || ''}
              onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none"
              placeholder="Supporting line below title"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Badge</label>
              <input
                type="text"
                value={banner.badge || ''}
                onChange={(e) => setBanner({ ...banner, badge: e.target.value })}
                placeholder="NEW · OFFER · LIMITED"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Text Position</label>
              <select
                value={banner.textPosition}
                onChange={(e) => setBanner({ ...banner, textPosition: e.target.value as Banner['textPosition'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CTA Button Text</label>
              <input
                type="text"
                value={banner.ctaText || ''}
                onChange={(e) => setBanner({ ...banner, ctaText: e.target.value })}
                placeholder="Shop Now"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CTA URL</label>
              <input
                type="text"
                value={banner.ctaUrl || ''}
                onChange={(e) => setBanner({ ...banner, ctaUrl: e.target.value })}
                placeholder="/products"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={banner.overlay}
                onChange={(e) => setBanner({ ...banner, overlay: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium text-slate-700">Dark overlay (better text readability)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={banner.isActive}
                onChange={(e) => setBanner({ ...banner, isActive: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium text-slate-700">Active</span>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold disabled:bg-amber-300"
          >
            <FiSave size={14} /> Save Banner
          </button>
        </div>
      </div>
    </div>
  );
}
