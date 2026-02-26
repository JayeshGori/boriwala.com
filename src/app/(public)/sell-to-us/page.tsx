'use client';

import { useState } from 'react';
import { FiCheckCircle, FiUpload, FiLink, FiPlus, FiX, FiPhone, FiArrowRight, FiPackage, FiTruck, FiDollarSign, FiShield } from 'react-icons/fi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const MATERIAL_TYPES = [
  { value: 'jute_bags', label: 'Jute Bags', emoji: '🧶' },
  { value: 'plastic_bags', label: 'Plastic Bags / PP Bags', emoji: '🛍️' },
  { value: 'bopp_bags', label: 'BOPP Bags', emoji: '📦' },
  { value: 'woven_sacks', label: 'Woven Sacks', emoji: '🪡' },
  { value: 'rafiya_granules', label: 'Rafiya / Granules', emoji: '⚙️' },
  { value: 'hdpe_bags', label: 'HDPE / LDPE Bags', emoji: '🔩' },
  { value: 'cement_bags', label: 'Cement / Fertilizer Bags', emoji: '🏗️' },
  { value: 'other', label: 'Other Material', emoji: '📋' },
];

const STEPS = [
  { icon: FiPhone, title: 'Submit Details', desc: 'Fill the form with your material info' },
  { icon: FiPackage, title: 'We Evaluate', desc: 'Our team reviews your material' },
  { icon: FiTruck, title: 'We Pickup', desc: 'We arrange pickup from your location' },
  { icon: FiDollarSign, title: 'Get Paid', desc: 'Instant payment on collection' },
];

export default function SellToUsPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    companyName: '',
    city: '',
    materialType: '',
    materialDescription: '',
    quantity: '',
  });
  const [videoLinks, setVideoLinks] = useState<string[]>(['']);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVideoLinkChange = (index: number, value: string) => {
    const updated = [...videoLinks];
    updated[index] = value;
    setVideoLinks(updated);
  };

  const addVideoLink = () => {
    if (videoLinks.length < 5) setVideoLinks([...videoLinks, '']);
  };

  const removeVideoLink = (index: number) => {
    setVideoLinks(videoLinks.filter((_, i) => i !== index));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos: string[] = [];

    for (const file of Array.from(files)) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Each photo must be under 2MB');
        continue;
      }
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newPhotos.push(dataUrl);
    }

    setPhotos([...photos, ...newPhotos].slice(0, 5));
    setUploading(false);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.materialType || !form.quantity) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const filteredVideoLinks = videoLinks.filter((v) => v.trim());
      const res = await fetch('/api/seller-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, videoLinks: filteredVideoLinks, photos }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch {
      alert('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center py-20">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-3">Thank You!</h1>
            <p className="text-slate-600 mb-2">Your enquiry has been submitted successfully.</p>
            <p className="text-slate-500 text-sm mb-8">Our team will review your material details and contact you within 24 hours.</p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
            >
              Back to Home
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-800 to-slate-900 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-green-400 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <FiTruck size={14} />
                We buy used bags & raw materials
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Sell Your Used
                <span className="block text-amber-400">Bags & Materials</span>
              </h1>
              <p className="text-lg sm:text-xl text-green-100 leading-relaxed max-w-2xl mb-8">
                We are one of the leading traders of jute bags, plastic bags, woven sacks, rafiya granules, and more.
                If you have surplus or used material — we offer the <strong className="text-white">best prices</strong> with instant payment.
              </p>
              <a
                href="#sell-form"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg rounded-xl transition-colors shadow-lg shadow-amber-500/30"
              >
                Sell Now <FiArrowRight size={20} />
              </a>
            </div>
          </div>
        </section>

        {/* What We Buy */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">What We Buy</h2>
              <p className="text-slate-500 max-w-lg mx-auto">We purchase a wide range of used and surplus packaging materials from industries across India.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {MATERIAL_TYPES.map((mat) => (
                <div
                  key={mat.value}
                  className="group p-5 bg-slate-50 hover:bg-green-50 border border-slate-100 hover:border-green-200 rounded-2xl text-center transition-all duration-300 cursor-default"
                >
                  <span className="text-3xl block mb-2">{mat.emoji}</span>
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-green-700 transition-colors">{mat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">How It Works</h2>
              <p className="text-slate-500">Simple 4-step process to sell your materials</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                      {i + 1}
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                      <Icon size={24} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Sell to Us */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">Why Sell to <span className="text-green-600">Boriwala?</span></h2>
                <div className="space-y-5">
                  {[
                    { icon: FiDollarSign, title: 'Best Market Prices', desc: 'We offer competitive rates above market average for quality materials.' },
                    { icon: FiTruck, title: 'Free Pickup Service', desc: 'We arrange transportation from your factory or warehouse at no extra cost.' },
                    { icon: FiShield, title: 'Instant Payment', desc: 'Get paid immediately upon material collection. No delays, no hassle.' },
                    { icon: FiCheckCircle, title: 'Trusted by 500+ Industries', desc: 'Years of experience dealing with factories, warehouses, and distributors.' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex gap-4">
                        <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                          <Icon size={20} className="text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 mb-0.5">{item.title}</h3>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 sm:p-10 text-white">
                <h3 className="text-2xl font-bold mb-4">Quick Contact</h3>
                <p className="text-green-100 mb-6">Prefer to talk directly? Reach us via phone or WhatsApp for an instant quote.</p>
                <div className="space-y-3">
                  <a
                    href="tel:+919999999999"
                    className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <FiPhone size={20} />
                    <div>
                      <p className="text-sm text-green-200">Call Us</p>
                      <p className="font-semibold">+91 99999 99999</p>
                    </div>
                  </a>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999'}?text=Hi, I want to sell used bags/materials. Please contact me.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.625-1.469A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.114 0-4.093-.663-5.717-1.792l-.41-.243-2.744.872.725-2.65-.267-.423A9.72 9.72 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/></svg>
                    <div>
                      <p className="text-sm text-green-200">WhatsApp</p>
                      <p className="font-semibold">Send Message</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seller Form */}
        <section id="sell-form" className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">Submit Your Material Details</h2>
              <p className="text-slate-500">Fill in the form below and we&#39;ll get back to you within 24 hours with the best offer.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-green-600 text-white rounded-md flex items-center justify-center text-xs font-bold">1</span>
                  Your Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 99999 99999"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@company.com"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company / Factory Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      placeholder="Your company name"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">City / Location *</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Mumbai, Surat, Ahmedabad"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Material Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-green-600 text-white rounded-md flex items-center justify-center text-xs font-bold">2</span>
                  Material Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Material Type *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {MATERIAL_TYPES.map((mat) => (
                        <button
                          key={mat.value}
                          type="button"
                          onClick={() => setForm({ ...form, materialType: mat.value })}
                          className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                            form.materialType === mat.value
                              ? 'border-green-400 bg-green-50 text-green-700 ring-2 ring-green-200'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          <span className="text-lg block mb-1">{mat.emoji}</span>
                          {mat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Quantity *</label>
                    <input
                      type="text"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 500 kg, 2 tons, 10,000 pieces"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description (optional)</label>
                    <textarea
                      name="materialDescription"
                      value={form.materialDescription}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Condition of the material, age, any special notes..."
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Media */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-green-600 text-white rounded-md flex items-center justify-center text-xs font-bold">3</span>
                  Photos & Videos
                </h3>

                {/* Photo Upload */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Upload Photos (max 5, under 2MB each)</label>
                  <div className="flex flex-wrap gap-3">
                    {photos.map((photo, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                        <img src={photo} alt={`Material ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                    {photos.length < 5 && (
                      <label className="w-20 h-20 border-2 border-dashed border-slate-300 hover:border-green-400 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors">
                        {uploading ? (
                          <svg className="animate-spin h-5 w-5 text-slate-400" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <>
                            <FiUpload size={16} className="text-slate-400 mb-1" />
                            <span className="text-[10px] text-slate-400">Add</span>
                          </>
                        )}
                        <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Video Links */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Video Links (YouTube, Google Drive, etc.)</label>
                  <div className="space-y-2">
                    {videoLinks.map((link, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="relative flex-1">
                          <FiLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="url"
                            value={link}
                            onChange={(e) => handleVideoLinkChange(i, e.target.value)}
                            placeholder="https://youtube.com/watch?v=... or drive.google.com/..."
                            className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          />
                        </div>
                        {videoLinks.length > 1 && (
                          <button type="button" onClick={() => removeVideoLink(i)} className="px-2 text-slate-400 hover:text-red-500 transition-colors">
                            <FiX size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                    {videoLinks.length < 5 && (
                      <button
                        type="button"
                        onClick={addVideoLink}
                        className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        <FiPlus size={14} /> Add another link
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Upload your material videos to YouTube or Google Drive and paste the link here.</p>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Enquiry <FiArrowRight size={18} />
                  </>
                )}
              </button>
              <p className="text-xs text-slate-400 text-center">By submitting, you agree to be contacted by our team regarding your material.</p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
