'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { adminFetch, adminUpload } from '@/lib/admin-auth';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  parent: string | null;
  order: number;
  isActive: boolean;
  subcategories?: Category[];
}

const emptyForm = { name: '', description: '', image: '', icon: '', parent: '', order: 0, isActive: true };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    const data = await adminFetch('/api/categories?parentOnly=true&activeOnly=false');
    if (data.success) setCategories(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = (parentId?: string) => {
    setEditingId(null);
    setForm({ ...emptyForm, parent: parentId || '' });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
      icon: cat.icon || '',
      parent: cat.parent || '',
      order: cat.order,
      isActive: cat.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const body = { ...form, parent: form.parent || null };
      let data;
      if (editingId) {
        data = await adminFetch(`/api/categories/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        data = await adminFetch('/api/categories', { method: 'POST', body: JSON.stringify(body) });
      }
      if (data.success) {
        toast.success(editingId ? 'Category updated' : 'Category created');
        setShowModal(false);
        fetchCategories();
      } else {
        toast.error(data.error || 'Failed');
      }
    } catch { toast.error('Error saving category'); }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" and its subcategories?`)) return;
    const data = await adminFetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (data.success) {
      toast.success('Deleted');
      fetchCategories();
    } else {
      toast.error(data.error || 'Delete failed');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const data = await adminUpload([files[0]]);
    if (data.success && data.data?.[0]) {
      setForm({ ...form, image: data.data[0] });
      toast.success('Image uploaded');
    } else {
      toast.error('Upload failed');
    }
  };

  if (loading) {
    return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-20" />)}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Categories</h2>
        <button onClick={() => openCreate()} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">
          <FiPlus size={16} /> Add Category
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                {cat.image ? (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                    <Image src={cat.image} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-xl">
                    {cat.icon || '📦'}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-slate-800">{cat.name}</h3>
                  <p className="text-xs text-slate-500">{cat.slug} · Order: {cat.order}</p>
                </div>
                {!cat.isActive && <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">Inactive</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openCreate(cat._id)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Add subcategory">
                  <FiPlus size={16} />
                </button>
                <button onClick={() => openEdit(cat)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                  <FiEdit2 size={16} />
                </button>
                <button onClick={() => handleDelete(cat._id, cat.name)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            {cat.subcategories && cat.subcategories.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                <div className="space-y-2">
                  {cat.subcategories.map((sub) => (
                    <div key={sub._id} className="flex items-center justify-between pl-6 py-2">
                      <div>
                        <p className="text-sm font-medium text-slate-700">↳ {sub.name}</p>
                        <p className="text-xs text-slate-400">{sub.slug}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(sub)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors"><FiEdit2 size={14} /></button>
                        <button onClick={() => handleDelete(sub._id, sub.name)} className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"><FiTrash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">No categories yet. Create your first category!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold">{editingId ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><FiX size={20} /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Icon (emoji)</label>
                <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="📦" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm" />
                {form.image && (
                  <div className="relative w-20 h-20 mt-2 rounded-lg overflow-hidden bg-slate-100">
                    <Image src={form.image} alt="" fill className="object-cover" sizes="80px" />
                  </div>
                )}
              </div>
              {form.parent && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Parent Category</label>
                  <p className="text-sm text-slate-500">This will be a subcategory</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Active</label>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg text-sm font-medium transition-colors">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
