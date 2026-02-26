'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-auth';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiTrash2, FiUser, FiMail, FiPhone, FiBriefcase, FiClock } from 'react-icons/fi';

interface Buyer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const data = await adminFetch(`/api/admin/buyers?status=${filter}`);
      if (data.success) setBuyers(data.data);
    } catch {
      toast.error('Failed to load buyers');
    }
    setLoading(false);
  };

  useEffect(() => { fetchBuyers(); }, [filter]);

  const handleApprove = async (id: string, approve: boolean) => {
    try {
      const data = await adminFetch(`/api/admin/buyers/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isApproved: approve }),
      });
      if (data.success) {
        toast.success(approve ? 'Buyer approved' : 'Buyer approval revoked');
        fetchBuyers();
      } else {
        toast.error(data.error || 'Action failed');
      }
    } catch {
      toast.error('Error updating buyer');
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const data = await adminFetch(`/api/admin/buyers/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: active }),
      });
      if (data.success) {
        toast.success(active ? 'Buyer activated' : 'Buyer deactivated');
        fetchBuyers();
      }
    } catch {
      toast.error('Error updating buyer');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete buyer "${name}"? This cannot be undone.`)) return;
    try {
      const data = await adminFetch(`/api/admin/buyers/${id}`, { method: 'DELETE' });
      if (data.success) {
        toast.success('Buyer deleted');
        fetchBuyers();
      }
    } catch {
      toast.error('Error deleting buyer');
    }
  };

  const pendingCount = buyers.filter(b => !b.isApproved).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Buyer Management</h2>
          <p className="text-sm text-slate-500 mt-1">Approve or reject buyer registrations to control pricing access</p>
        </div>
        {pendingCount > 0 && (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
            {pendingCount} pending approval{pendingCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all' as const, label: 'All Buyers' },
          { key: 'pending' as const, label: 'Pending' },
          { key: 'approved' as const, label: 'Approved' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === tab.key
                ? 'bg-amber-500 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse h-24" />
          ))}
        </div>
      ) : buyers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <FiUser size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-1">No buyers found</h3>
          <p className="text-sm text-slate-500">
            {filter === 'pending' ? 'No pending registrations.' : 'No registered buyers yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {buyers.map((buyer) => (
            <div key={buyer._id} className={`bg-white rounded-xl border p-4 ${!buyer.isActive ? 'opacity-60 border-slate-200' : buyer.isApproved ? 'border-green-200' : 'border-amber-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${buyer.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {buyer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800 text-sm">{buyer.name}</h3>
                      {buyer.isApproved ? (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">Approved</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">Pending</span>
                      )}
                      {!buyer.isActive && (
                        <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs font-medium rounded-full">Deactivated</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><FiMail size={12} /> {buyer.email}</span>
                      {buyer.phone && <span className="flex items-center gap-1"><FiPhone size={12} /> {buyer.phone}</span>}
                      {buyer.companyName && <span className="flex items-center gap-1"><FiBriefcase size={12} /> {buyer.companyName}</span>}
                      <span className="flex items-center gap-1"><FiClock size={12} /> {new Date(buyer.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!buyer.isApproved ? (
                    <button
                      onClick={() => handleApprove(buyer._id, true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <FiCheck size={14} /> Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(buyer._id, false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <FiX size={14} /> Revoke
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleActive(buyer._id, !buyer.isActive)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${buyer.isActive ? 'border-slate-300 text-slate-600 hover:bg-slate-50' : 'border-green-300 text-green-600 hover:bg-green-50'}`}
                  >
                    {buyer.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(buyer._id, buyer.name)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete buyer"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
