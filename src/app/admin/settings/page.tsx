'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-auth';
import toast from 'react-hot-toast';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

interface Settings {
  companyName: string;
  tagline: string;
  phone: string[];
  email: string[];
  address: string;
  whatsappNumber: string;
  googleMapEmbed: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    youtube: string;
  };
  aboutUs: string;
  aboutUsShort: string;
  experience: string;
  infrastructure: string;
  certifications: string[];
  strengths: string[];
  heroTitle: string;
  heroSubtitle: string;
}

const defaultSettings: Settings = {
  companyName: '',
  tagline: '',
  phone: [''],
  email: [''],
  address: '',
  whatsappNumber: '',
  googleMapEmbed: '',
  socialLinks: { facebook: '', instagram: '', linkedin: '', twitter: '', youtube: '' },
  aboutUs: '',
  aboutUsShort: '',
  experience: '',
  infrastructure: '',
  certifications: [],
  strengths: [],
  heroTitle: '',
  heroSubtitle: '',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    adminFetch('/api/settings')
      .then((d) => { if (d.success && d.data) setSettings({ ...defaultSettings, ...d.data }); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await adminFetch('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      if (data.success) {
        toast.success('Settings saved');
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch {
      toast.error('Error saving settings');
    }
    setSaving(false);
  };

  const updateArrayField = (field: 'phone' | 'email' | 'certifications' | 'strengths', idx: number, value: string) => {
    const arr = [...settings[field]];
    arr[idx] = value;
    setSettings({ ...settings, [field]: arr });
  };

  const addArrayItem = (field: 'phone' | 'email' | 'certifications' | 'strengths') => {
    setSettings({ ...settings, [field]: [...settings[field], ''] });
  };

  const removeArrayItem = (field: 'phone' | 'email' | 'certifications' | 'strengths', idx: number) => {
    setSettings({ ...settings, [field]: settings[field].filter((_, i) => i !== idx) });
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'contact', label: 'Contact' },
    { id: 'social', label: 'Social' },
    { id: 'about', label: 'About' },
    { id: 'hero', label: 'Hero' },
  ];

  if (loading) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-32" />)}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg text-sm font-medium transition-colors">
          <FiSave size={16} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl space-y-6">
        {/* General */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">General Information</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input type="text" value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
              <input type="text" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
              <input type="text" value={settings.experience} onChange={(e) => setSettings({ ...settings, experience: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="15+ Years" />
            </div>
          </div>
        )}

        {/* Contact */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Contact Information</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Numbers</label>
              {settings.phone.map((ph, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="text" value={ph} onChange={(e) => updateArrayField('phone', idx, e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                  {settings.phone.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('phone', idx)} className="p-2 text-red-400 hover:text-red-600"><FiTrash2 size={16} /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('phone')} className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"><FiPlus size={14} /> Add Phone</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Addresses</label>
              {settings.email.map((em, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="text" value={em} onChange={(e) => updateArrayField('email', idx, e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                  {settings.email.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('email', idx)} className="p-2 text-red-400 hover:text-red-600"><FiTrash2 size={16} /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('email')} className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"><FiPlus size={14} /> Add Email</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <textarea value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number (with country code, no +)</label>
              <input type="text" value={settings.whatsappNumber} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="919999999999" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Google Map Embed Code</label>
              <textarea value={settings.googleMapEmbed} onChange={(e) => setSettings({ ...settings, googleMapEmbed: e.target.value })} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none font-mono" />
            </div>
          </div>
        )}

        {/* Social */}
        {activeTab === 'social' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Social Links</h3>
            {(['facebook', 'instagram', 'linkedin', 'twitter', 'youtube'] as const).map((platform) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">{platform}</label>
                <input
                  type="text"
                  value={settings.socialLinks[platform]}
                  onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [platform]: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder={`https://${platform}.com/...`}
                />
              </div>
            ))}
          </div>
        )}

        {/* About */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">About Us Content</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
              <textarea value={settings.aboutUsShort} onChange={(e) => setSettings({ ...settings, aboutUsShort: e.target.value })} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full About Us</label>
              <textarea value={settings.aboutUs} onChange={(e) => setSettings({ ...settings, aboutUs: e.target.value })} rows={6} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Infrastructure</label>
              <textarea value={settings.infrastructure} onChange={(e) => setSettings({ ...settings, infrastructure: e.target.value })} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Strengths</label>
              {settings.strengths.map((s, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="text" value={s} onChange={(e) => updateArrayField('strengths', idx, e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                  <button type="button" onClick={() => removeArrayItem('strengths', idx)} className="p-2 text-red-400 hover:text-red-600"><FiTrash2 size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('strengths')} className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"><FiPlus size={14} /> Add Strength</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Certifications</label>
              {settings.certifications.map((c, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="text" value={c} onChange={(e) => updateArrayField('certifications', idx, e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                  <button type="button" onClick={() => removeArrayItem('certifications', idx)} className="p-2 text-red-400 hover:text-red-600"><FiTrash2 size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('certifications')} className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"><FiPlus size={14} /> Add Certification</button>
            </div>
          </div>
        )}

        {/* Hero */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Hero Section</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Title</label>
              <input type="text" value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Subtitle</label>
              <textarea value={settings.heroSubtitle} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
