'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '@/lib/admin-auth';
import { FiPackage, FiGrid, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';

interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  recentEnquiries: Array<{
    _id: string;
    name: string;
    email: string;
    productName?: string;
    createdAt: string;
    isResponded: boolean;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/dashboard')
      .then((d) => { if (d.success) setData(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
              <div className="h-8 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Products', value: data?.totalProducts || 0, icon: FiPackage, color: 'bg-blue-50 text-blue-600', href: '/admin/products' },
    { label: 'Categories', value: data?.totalCategories || 0, icon: FiGrid, color: 'bg-emerald-50 text-emerald-600', href: '/admin/categories' },
    { label: 'Total Enquiries', value: data?.totalEnquiries || 0, icon: FiMessageSquare, color: 'bg-purple-50 text-purple-600', href: '/admin/enquiries' },
    { label: 'Pending Enquiries', value: data?.pendingEnquiries || 0, icon: FiAlertCircle, color: 'bg-amber-50 text-amber-600', href: '/admin/enquiries?responded=false' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent enquiries */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">Recent Enquiries</h3>
          <Link href="/admin/enquiries" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
            View All
          </Link>
        </div>
        {data?.recentEnquiries && data.recentEnquiries.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {data.recentEnquiries.map((enq) => (
              <div key={enq._id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{enq.name}</p>
                  <p className="text-xs text-slate-500">{enq.email} {enq.productName && `— ${enq.productName}`}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${enq.isResponded ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {enq.isResponded ? 'Responded' : 'Pending'}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(enq.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-6 py-8 text-sm text-slate-500 text-center">No enquiries yet</p>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/products/new" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl p-6 text-center transition-colors">
          <FiPackage size={24} className="mx-auto mb-2" />
          <p className="font-semibold">Add Product</p>
        </Link>
        <Link href="/admin/categories" className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl p-6 text-center transition-colors">
          <FiGrid size={24} className="mx-auto mb-2" />
          <p className="font-semibold">Manage Categories</p>
        </Link>
        <Link href="/admin/enquiries" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-6 text-center transition-colors">
          <FiMessageSquare size={24} className="mx-auto mb-2" />
          <p className="font-semibold">View Enquiries</p>
        </Link>
      </div>
    </div>
  );
}
