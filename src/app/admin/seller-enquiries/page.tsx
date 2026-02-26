'use client';

import { useState, useEffect } from 'react';
import { FiPackage, FiPhone, FiMail, FiMapPin, FiExternalLink, FiTrash2, FiImage, FiVideo, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface SellerEnquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  companyName: string;
  city: string;
  materialType: string;
  materialDescription: string;
  quantity: string;
  videoLinks: string[];
  photos: string[];
  status: string;
  adminNotes: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-amber-100 text-amber-700' },
  { value: 'negotiating', label: 'Negotiating', color: 'bg-purple-100 text-purple-700' },
  { value: 'closed', label: 'Closed', color: 'bg-green-100 text-green-700' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
];

const MATERIAL_LABELS: Record<string, string> = {
  jute_bags: 'Jute Bags',
  plastic_bags: 'Plastic / PP Bags',
  bopp_bags: 'BOPP Bags',
  woven_sacks: 'Woven Sacks',
  rafiya_granules: 'Rafiya / Granules',
  hdpe_bags: 'HDPE / LDPE Bags',
  cement_bags: 'Cement / Fertilizer Bags',
  other: 'Other',
};

export default function AdminSellerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<SellerEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/admin/seller-enquiries');
      const data = await res.json();
      if (data.success) setEnquiries(data.enquiries);
    } catch {
      toast.error('Failed to load enquiries');
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/seller-enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) => prev.map((e) => (e._id === id ? { ...e, status } : e)));
        toast.success('Status updated');
      }
    } catch {
      toast.error('Failed to update');
    }
  };

  const updateNotes = async (id: string, adminNotes: string) => {
    try {
      await fetch(`/api/admin/seller-enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes }),
      });
    } catch {
      // silent
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    try {
      const res = await fetch(`/api/admin/seller-enquiries/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
        toast.success('Deleted');
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const getStatusInfo = (s: string) => STATUS_OPTIONS.find((o) => o.value === s) || STATUS_OPTIONS[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FiPackage size={24} /> Seller Enquiries
          </h1>
          <p className="text-sm text-slate-500 mt-1">Industries wanting to sell used bags & materials</p>
        </div>
        <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-600">
          {enquiries.length} total
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-24 bg-slate-100 rounded-xl" />
          ))}
        </div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <FiPackage size={40} className="mx-auto mb-3 opacity-50" />
          <p>No seller enquiries yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enquiries.map((enq) => {
            const statusInfo = getStatusInfo(enq.status);
            const isExpanded = expandedId === enq._id;

            return (
              <div key={enq._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {/* Summary Row */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : enq._id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-800 truncate">{enq.name}</p>
                      {enq.companyName && <span className="text-xs text-slate-400">({enq.companyName})</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><FiMapPin size={11} /> {enq.city}</span>
                      <span className="flex items-center gap-1"><FiPackage size={11} /> {MATERIAL_LABELS[enq.materialType] || enq.materialType}</span>
                      <span>{enq.quantity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:block">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    {isExpanded ? <FiChevronUp size={16} className="text-slate-400" /> : <FiChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-4">
                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-3">
                      <a href={`tel:${enq.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-green-400 transition-colors">
                        <FiPhone size={13} /> {enq.phone}
                      </a>
                      {enq.email && (
                        <a href={`mailto:${enq.email}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-green-400 transition-colors">
                          <FiMail size={13} /> {enq.email}
                        </a>
                      )}
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 hover:bg-green-100 transition-colors"
                      >
                        WhatsApp
                      </a>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
                        <FiCalendar size={12} /> {new Date(enq.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>

                    {/* Description */}
                    {enq.materialDescription && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">Description</p>
                        <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200">{enq.materialDescription}</p>
                      </div>
                    )}

                    {/* Photos */}
                    {enq.photos.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1"><FiImage size={12} /> Photos ({enq.photos.length})</p>
                        <div className="flex gap-2 flex-wrap">
                          {enq.photos.map((photo, i) => (
                            <a key={i} href={photo} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-green-400 transition-all">
                              <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Video Links */}
                    {enq.videoLinks.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1"><FiVideo size={12} /> Video Links</p>
                        <div className="space-y-1">
                          {enq.videoLinks.map((link, i) => (
                            <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                              <FiExternalLink size={13} /> {link.length > 60 ? link.slice(0, 60) + '...' : link}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status + Notes */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                        <select
                          value={enq.status}
                          onChange={(e) => updateStatus(enq._id, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        >
                          {STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Admin Notes</label>
                        <input
                          type="text"
                          defaultValue={enq.adminNotes}
                          onBlur={(e) => updateNotes(enq._id, e.target.value)}
                          placeholder="Add notes..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    {/* Delete */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => deleteEnquiry(enq._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
