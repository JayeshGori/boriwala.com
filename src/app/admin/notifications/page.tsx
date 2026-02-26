'use client';

import { useState, useEffect } from 'react';
import { FiBell, FiSend, FiSmartphone, FiClock, FiCheckCircle, FiAlertCircle, FiTag, FiTrendingDown, FiPackage, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface NotificationRecord {
  _id: string;
  title: string;
  body: string;
  type: string;
  sentCount: number;
  failedCount: number;
  sentAt: string;
}

const TYPES = [
  { value: 'offer', label: 'Offer / Deal', icon: FiTag, color: 'text-amber-600 bg-amber-50' },
  { value: 'price_drop', label: 'Price Drop', icon: FiTrendingDown, color: 'text-green-600 bg-green-50' },
  { value: 'new_product', label: 'New Product', icon: FiPackage, color: 'text-blue-600 bg-blue-50' },
  { value: 'general', label: 'General', icon: FiInfo, color: 'text-slate-600 bg-slate-50' },
];

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('offer');
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deviceCount, setDeviceCount] = useState<number | null>(null);

  useEffect(() => {
    fetchHistory();
    fetchDeviceCount();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (data.success) setHistory(data.notifications);
    } catch {
      console.error('Failed to fetch history');
    }
    setLoading(false);
  };

  const fetchDeviceCount = async () => {
    try {
      const res = await fetch('/api/admin/notifications/devices');
      const data = await res.json();
      if (data.success) setDeviceCount(data.count);
    } catch {
      console.error('Failed to fetch device count');
    }
  };

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error('Title and message are required');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, type }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Notification sent to ${data.stats.sent} devices!`);
        setTitle('');
        setBody('');
        fetchHistory();
        fetchDeviceCount();
      } else {
        toast.error(data.error || 'Failed to send');
      }
    } catch {
      toast.error('Network error');
    }
    setSending(false);
  };

  const getTypeInfo = (t: string) => TYPES.find((x) => x.value === t) || TYPES[3];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FiBell size={24} /> Push Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">Send offers, price drops, and announcements to app users</p>
        </div>
        {deviceCount !== null && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <FiSmartphone size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-700">{deviceCount} registered device{deviceCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Compose Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Compose Notification</h2>

        {/* Type Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Notification Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    type === t.value
                      ? 'border-amber-400 bg-amber-50 text-amber-700 ring-2 ring-amber-200'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Icon size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 🔥 Flat 20% Off on All BOPP Tapes!"
            maxLength={100}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">{title.length}/100 characters</p>
        </div>

        {/* Body */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="e.g. Limited time offer! Get 20% off on all BOPP tapes. Order now before stock runs out."
            rows={3}
            maxLength={500}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">{body.length}/500 characters</p>
        </div>

        {/* Preview */}
        {(title || body) && (
          <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-xs text-slate-400 uppercase font-medium mb-2">Preview</p>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">B</div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{title || 'Notification title'}</p>
                <p className="text-sm text-slate-600 mt-0.5">{body || 'Notification message...'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={sending || !title.trim() || !body.trim()}
          className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-lg transition-colors"
        >
          {sending ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </>
          ) : (
            <>
              <FiSend size={16} /> Send to All Devices
            </>
          )}
        </button>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FiClock size={18} /> Notification History
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-16 bg-slate-100 rounded-lg" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <FiBell size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications sent yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((n) => {
              const typeInfo = getTypeInfo(n.type);
              const TypeIcon = typeInfo.icon;
              return (
                <div key={n._id} className="flex items-start gap-3 p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${typeInfo.color}`}>
                    <TypeIcon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.body}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-400">
                        {new Date(n.sentAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <FiCheckCircle size={11} /> {n.sentCount} sent
                      </span>
                      {n.failedCount > 0 && (
                        <span className="flex items-center gap-1 text-xs text-red-500">
                          <FiAlertCircle size={11} /> {n.failedCount} failed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
