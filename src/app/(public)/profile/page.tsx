'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiUser, FiPackage, FiLogOut, FiCheckCircle, FiClock, FiSave, FiLock } from 'react-icons/fi';
import { useBuyerAuth } from '@/context/BuyerAuthContext';

interface ProfileForm {
  name: string;
  phone: string;
  companyName: string;
  gstNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  currentPassword: string;
  newPassword: string;
}

interface BuyerEnquiry {
  _id: string;
  productName?: string;
  message: string;
  isResponded: boolean;
  createdAt: string;
}

const TABS = ['profile', 'enquiries', 'security'] as const;
type TabKey = (typeof TABS)[number];

export default function ProfilePage() {
  const { buyer, loading, isApproved, refresh, logout } = useBuyerAuth();
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('profile');
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    phone: '',
    companyName: '',
    gstNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    currentPassword: '',
    newPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [enquiries, setEnquiries] = useState<BuyerEnquiry[]>([]);
  const [enqLoading, setEnqLoading] = useState(false);

  useEffect(() => {
    if (!loading && !buyer) router.replace('/login?next=/profile');
  }, [buyer, loading, router]);

  useEffect(() => {
    if (buyer) {
      // buyer comes from BuyerAuthContext; fetch full profile (which now includes address fields)
      fetch('/api/auth/buyer-me')
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            setForm((f) => ({
              ...f,
              name: d.data.name || '',
              phone: d.data.phone || '',
              companyName: d.data.companyName || '',
              gstNumber: d.data.gstNumber || '',
              addressLine1: d.data.addressLine1 || '',
              addressLine2: d.data.addressLine2 || '',
              city: d.data.city || '',
              state: d.data.state || '',
              pincode: d.data.pincode || '',
            }));
          }
        });
    }
  }, [buyer]);

  useEffect(() => {
    if (tab === 'enquiries' && buyer) {
      setEnqLoading(true);
      fetch('/api/auth/buyer-enquiries')
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setEnquiries(d.data);
        })
        .finally(() => setEnqLoading(false));
    }
  }, [tab, buyer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, string> = {
        name: form.name,
        phone: form.phone,
        companyName: form.companyName,
        gstNumber: form.gstNumber,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      };
      if (tab === 'security' && form.newPassword) {
        body.currentPassword = form.currentPassword;
        body.newPassword = form.newPassword;
      }
      const res = await fetch('/api/auth/buyer-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Profile updated');
        await refresh();
        setForm({ ...form, currentPassword: '', newPassword: '' });
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch {
      toast.error('Network error');
    }
    setSaving(false);
  };

  if (loading || !buyer) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-64 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold">
              {buyer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{buyer.name}</h1>
              <p className="text-sm text-slate-500">{buyer.email}</p>
              {isApproved ? (
                <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                  <FiCheckCircle size={12} /> Approved Buyer
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">
                  <FiClock size={12} /> Pending Approval
                </span>
              )}
            </div>
          </div>
          <button
            onClick={async () => {
              await logout();
              router.push('/');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut size={14} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto">
          {[
            { key: 'profile', icon: FiUser, label: 'Profile & Address' },
            { key: 'enquiries', icon: FiPackage, label: 'My Enquiries' },
            { key: 'security', icon: FiLock, label: 'Security' },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key as TabKey)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === 'profile' && (
          <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">Personal &amp; Business Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Full Name *" name="name" value={form.name} onChange={handleChange} required />
              <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              <Field label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} className="sm:col-span-2" />
              <Field label="GST Number" name="gstNumber" value={form.gstNumber} onChange={handleChange} placeholder="e.g. 24AAAAA0000A1Z5" className="sm:col-span-2" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 pt-3 border-t border-slate-100">Delivery Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Address Line 1" name="addressLine1" value={form.addressLine1} onChange={handleChange} className="sm:col-span-2" />
              <Field label="Address Line 2" name="addressLine2" value={form.addressLine2} onChange={handleChange} className="sm:col-span-2" />
              <Field label="City" name="city" value={form.city} onChange={handleChange} />
              <Field label="State" name="state" value={form.state} onChange={handleChange} />
              <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} maxLength={6} />
            </div>
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-semibold rounded-lg">
                <FiSave size={14} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {tab === 'enquiries' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">My Enquiries</h2>
            {enqLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-lg" />)}
              </div>
            ) : enquiries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">No enquiries yet.</p>
                <Link href="/products" className="inline-block mt-3 text-amber-600 hover:underline text-sm font-medium">
                  Browse products →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {enquiries.map((e) => (
                  <div key={e._id} className="p-4 border border-slate-200 rounded-xl hover:border-amber-300 transition-colors">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800">{e.productName || 'General Enquiry'}</p>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{e.message}</p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        e.isResponded ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {e.isResponded ? <FiCheckCircle size={11} /> : <FiClock size={11} />}
                        {e.isResponded ? 'Responded' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      {new Date(e.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'security' && (
          <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 max-w-md">
            <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
            <Field type="password" label="Current Password" name="currentPassword" value={form.currentPassword} onChange={handleChange} />
            <Field type="password" label="New Password (min 6 chars)" name="newPassword" value={form.newPassword} onChange={handleChange} />
            <p className="text-xs text-slate-500">Leave blank to keep your current password.</p>
            <button type="submit" disabled={saving || !form.newPassword} className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg">
              <FiLock size={14} /> {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
      />
    </div>
  );
}
