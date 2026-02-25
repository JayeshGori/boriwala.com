'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-auth';
import toast from 'react-hot-toast';
import { FiSearch, FiDownload, FiCheck, FiTrash2, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';

interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  companyName: string;
  productName: string;
  quantity: string;
  message: string;
  isResponded: boolean;
  respondedAt?: string;
  notes?: string;
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [responded, setResponded] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: page.toString(), limit: '20' });
    if (search) params.set('search', search);
    if (responded) params.set('responded', responded);
    const data = await adminFetch(`/api/enquiries?${params.toString()}`);
    if (data.success) {
      setEnquiries(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    }
    setLoading(false);
  };

  useEffect(() => { fetchEnquiries(); }, [page, search, responded]);

  const handleMarkResponded = async (id: string) => {
    const data = await adminFetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isResponded: true }),
    });
    if (data.success) {
      toast.success('Marked as responded');
      fetchEnquiries();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    const data = await adminFetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    if (data.success) {
      toast.success('Deleted');
      fetchEnquiries();
    }
  };

  const handleExport = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
    window.open(`/api/enquiries/export?token=${token}`, '_blank');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Enquiries</h2>
          <p className="text-sm text-slate-500">{total} total enquiries</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition-colors">
          <FiDownload size={16} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, product..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">Search</button>
        </form>
        <select
          value={responded}
          onChange={(e) => { setResponded(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
        >
          <option value="">All Status</option>
          <option value="false">Pending</option>
          <option value="true">Responded</option>
        </select>
      </div>

      {/* Enquiry cards */}
      <div className="space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-20 border border-slate-200" />)
        ) : enquiries.length > 0 ? (
          enquiries.map((enq) => (
            <div key={enq._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded(expanded === enq._id ? null : enq._id)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${enq.isResponded ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{enq.name} — <span className="text-slate-500">{enq.email}</span></p>
                    <p className="text-xs text-slate-400">{enq.productName && `Product: ${enq.productName} · `}{formatDate(enq.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${enq.isResponded ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {enq.isResponded ? 'Responded' : 'Pending'}
                  </span>
                  {expanded === enq._id ? <FiChevronUp size={16} className="text-slate-400" /> : <FiChevronDown size={16} className="text-slate-400" />}
                </div>
              </div>

              {expanded === enq._id && (
                <div className="border-t border-slate-100 px-5 py-4 bg-slate-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase">Phone</p>
                      <p className="text-sm text-slate-700">{enq.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase">Company</p>
                      <p className="text-sm text-slate-700">{enq.companyName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase">Quantity</p>
                      <p className="text-sm text-slate-700">{enq.quantity || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase">Product</p>
                      <p className="text-sm text-slate-700">{enq.productName || '—'}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-medium text-slate-400 uppercase mb-1">Message</p>
                    <p className="text-sm text-slate-700 whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200">{enq.message}</p>
                  </div>
                  <div className="flex gap-2">
                    {!enq.isResponded && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkResponded(enq._id); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                      >
                        <FiCheck size={14} /> Mark Responded
                      </button>
                    )}
                    <a
                      href={`tel:${enq.phone}`}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Call
                    </a>
                    <a
                      href={`mailto:${enq.email}`}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Email
                    </a>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(enq._id); }}
                      className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 border border-red-200 text-sm rounded-lg transition-colors ml-auto"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <FiX size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No enquiries found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border border-slate-300 rounded text-sm disabled:opacity-50 hover:bg-slate-50">Previous</button>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border border-slate-300 rounded text-sm disabled:opacity-50 hover:bg-slate-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
