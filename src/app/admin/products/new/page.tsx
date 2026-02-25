'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminFetch, adminUpload } from '@/lib/admin-auth';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';

interface Category {
  _id: string;
  name: string;
  subcategories?: Category[];
}

interface Spec {
  key: string;
  value: string;
}

const defaultForm = {
  name: '',
  description: '',
  shortDescription: '',
  images: [] as string[],
  video: '',
  category: '',
  subcategory: '',
  condition: 'new' as 'new' | 'old',
  price: '',
  showPrice: false,
  specifications: [] as Spec[],
  moq: '',
  availability: 'in_stock',
  isFeatured: false,
  isActive: true,
  tags: '',
  material: '',
  productType: '',
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    adminFetch('/api/categories?parentOnly=true&activeOnly=false')
      .then((d) => { if (d.success) setCategories(d.data); });
  }, []);

  useEffect(() => {
    if (form.category) {
      const cat = categories.find((c) => c._id === form.category);
      setSubcategories(cat?.subcategories || []);
    } else {
      setSubcategories([]);
    }
  }, [form.category, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const data = await adminUpload(Array.from(files));
      if (data.success && data.data) {
        setForm({ ...form, images: [...form.images, ...data.data] });
        toast.success(`${data.data.length} image(s) uploaded`);
      } else {
        toast.error('Upload failed');
      }
    } catch {
      toast.error('Upload error');
    }
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const addSpec = () => {
    setForm({ ...form, specifications: [...form.specifications, { key: '', value: '' }] });
  };

  const updateSpec = (idx: number, field: 'key' | 'value', val: string) => {
    const specs = [...form.specifications];
    specs[idx][field] = val;
    setForm({ ...form, specifications: specs });
  };

  const removeSpec = (idx: number) => {
    setForm({ ...form, specifications: form.specifications.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.category) {
      toast.error('Name, description, and category are required');
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        price: form.price ? parseFloat(form.price) : null,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        specifications: form.specifications.filter((s) => s.key && s.value),
        subcategory: form.subcategory || null,
      };
      const data = await adminFetch('/api/products', { method: 'POST', body: JSON.stringify(body) });
      if (data.success) {
        toast.success('Product created');
        router.push('/admin/products');
      } else {
        toast.error(data.error || 'Failed to create product');
      }
    } catch {
      toast.error('Error creating product');
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
              <input type="text" name="shortDescription" value={form.shortDescription} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Brief one-line description" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={5} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Images & Video</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Product Images</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-100 group">
                    <Image src={img} alt="" fill className="object-cover" sizes="96px" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 transition-colors">
                  <FiUpload size={20} className="text-slate-400" />
                  <span className="text-xs text-slate-400 mt-1">{uploading ? '...' : 'Upload'}</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Video URL</label>
              <input type="text" name="video" value={form.video} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Video file URL or YouTube link" />
            </div>
          </div>
        </div>

        {/* Category & classification */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Classification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subcategory</label>
              <select name="subcategory" value={form.subcategory} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none">
                <option value="">None</option>
                {subcategories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
              <select name="condition" value={form.condition} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none">
                <option value="new">New</option>
                <option value="old">Used / Old</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
              <select name="availability" value={form.availability} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none">
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="on_demand">On Demand</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Material</label>
              <input type="text" name="material" value={form.material} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. Polypropylene" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Type</label>
              <input type="text" name="productType" value={form.productType} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. Woven Bags" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Pricing & Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="0.00" step="0.01" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="showPrice" checked={form.showPrice} onChange={handleChange} className="rounded" />
                <span className="text-sm font-medium text-slate-700">Show price on website</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Order Qty</label>
              <input type="text" name="moq" value={form.moq} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. 1000 pieces" />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Specifications</h3>
            <button type="button" onClick={addSpec} className="flex items-center gap-1 px-3 py-1.5 text-sm text-amber-600 hover:bg-amber-50 border border-amber-300 rounded-lg transition-colors">
              <FiPlus size={14} /> Add Row
            </button>
          </div>
          {form.specifications.length > 0 ? (
            <div className="space-y-2">
              {form.specifications.map((spec, idx) => (
                <div key={idx} className="flex gap-2">
                  <input type="text" value={spec.key} onChange={(e) => updateSpec(idx, 'key', e.target.value)} placeholder="Key (e.g. Material)" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                  <input type="text" value={spec.value} onChange={(e) => updateSpec(idx, 'value', e.target.value)} placeholder="Value (e.g. PP)" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                  <button type="button" onClick={() => removeSpec(idx)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No specifications added. Click &quot;Add Row&quot; to add.</p>
          )}
        </div>

        {/* Tags & toggles */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Tags & Options</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
              <input type="text" name="tags" value={form.tags} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="pp bag, woven, packaging" />
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="rounded" />
                <span className="text-sm font-medium text-slate-700">Featured product</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="rounded" />
                <span className="text-sm font-medium text-slate-700">Active (visible on website)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" disabled={saving} className="px-8 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg text-sm font-semibold transition-colors">
            {saving ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
