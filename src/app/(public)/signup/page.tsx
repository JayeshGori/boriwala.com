'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiUser, FiPhone, FiBriefcase, FiLock, FiArrowRight, FiArrowLeft, FiCheck, FiShield, FiTrendingUp, FiUsers, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STEPS = [
  {
    id: 'email',
    title: 'Join the Network',
    subtitle: "Let's start with your email",
    story: 'Over 500+ businesses trust Boriwala for their packaging needs. Join India\'s growing B2B packaging marketplace.',
    stat: '500+',
    statLabel: 'Trusted Businesses',
    icon: FiTrendingUp,
  },
  {
    id: 'personal',
    title: 'Tell us about you',
    subtitle: 'We\'d love to know who we\'re working with',
    story: 'Every great partnership starts with a name. We believe in building lasting relationships, not just transactions.',
    stat: '15+',
    statLabel: 'Years of Experience',
    icon: FiUsers,
  },
  {
    id: 'business',
    title: 'Your Business',
    subtitle: 'Help us serve you better',
    story: 'Knowing your business helps us recommend the right products, negotiate better rates, and prioritize your orders.',
    stat: '200+',
    statLabel: 'Products Available',
    icon: FiPackage,
  },
  {
    id: 'password',
    title: 'Secure your account',
    subtitle: 'Almost there! Create a strong password',
    story: 'Your pricing data and order history are confidential. We use industry-standard encryption to keep your information safe.',
    stat: '100%',
    statLabel: 'Data Security',
    icon: FiShield,
  },
];

export default function BuyerSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    email: '',
    name: '',
    phone: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(timer);
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const goTo = (next: number) => {
    if (animating) return;
    setDirection(next > step ? 'forward' : 'back');
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 250);
  };

  const validateStep = (): boolean => {
    if (step === 0) {
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
    }
    if (step === 1) {
      if (!form.name.trim()) {
        toast.error('Please enter your name');
        return false;
      }
    }
    if (step === 3) {
      if (form.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
      }
      if (form.password !== form.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      goTo(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) goTo(step - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          companyName: form.companyName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
    setLoading(false);
  };

  const currentStep = STEPS[step];
  const StepIcon = currentStep.icon;
  const progress = ((step + 1) / STEPS.length) * 100;

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center animate-[fadeInUp_0.6s_ease-out]">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-[scaleIn_0.4s_ease-out]">
            <FiCheck size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-3">Welcome aboard! 🎉</h1>
          <p className="text-slate-500 mb-2 text-lg">Your account has been created successfully.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-6 mb-8 text-left">
            <h3 className="font-semibold text-amber-800 mb-2">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <p className="text-sm text-amber-700">Our team will review your registration within <strong>24 hours</strong></p>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <p className="text-sm text-amber-700">Once approved, you&apos;ll get <strong>full access to product pricing</strong></p>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <p className="text-sm text-amber-700">Start placing bulk enquiries and get <strong>the best B2B rates</strong></p>
              </div>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            Login to your account <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">

          {/* Left side - Story panel */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  B
                </div>
                <span className="font-bold text-white text-lg">Boriwala</span>
              </div>

              <div className={`transition-all duration-300 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                  <StepIcon size={24} className="text-amber-400" />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {currentStep.story}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-amber-400">{currentStep.stat}</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">{currentStep.statLabel}</span>
                </div>
              </div>
            </div>

            {/* Step indicators */}
            <div className="relative z-10 flex gap-2 mt-8">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i <= step ? 'bg-amber-400 flex-[2]' : 'bg-slate-700 flex-1'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:col-span-3 p-6 lg:p-8 flex flex-col">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 font-medium">Step {step + 1} of {STEPS.length}</span>
                <span className="text-xs text-amber-600 font-semibold">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Step title */}
            <div className={`mb-6 transition-all duration-300 ${animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              <h2 className="text-xl font-bold text-slate-800">{currentStep.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{currentStep.subtitle}</p>
            </div>

            {/* Step content */}
            <div
              className={`flex-1 transition-all duration-300 ${
                animating
                  ? direction === 'forward'
                    ? 'opacity-0 translate-x-8'
                    : 'opacity-0 -translate-x-8'
                  : 'opacity-100 translate-x-0'
              }`}
              onKeyDown={handleKeyDown}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address *</label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        ref={inputRef}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        autoComplete="email"
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-shadow"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">We&apos;ll never share your email. Used only for account access.</p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        ref={inputRef}
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        autoComplete="name"
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-shadow"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 99999 99999"
                        autoComplete="tel"
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-shadow"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Optional — helps us reach you faster for order updates.</p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Company / Business Name</label>
                    <div className="relative">
                      <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        ref={inputRef}
                        type="text"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="e.g. ABC Packaging Pvt. Ltd."
                        autoComplete="organization"
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-shadow"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Optional — helps us verify your business and unlock bulk pricing faster.</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      <span className="font-semibold text-slate-700">💡 Pro tip:</span> Businesses with a company name get
                      <span className="text-amber-600 font-semibold"> approved 2x faster</span> as it helps our team verify your account quickly.
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Create Password *</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        ref={inputRef}
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Min. 6 characters"
                        autoComplete="new-password"
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-shadow"
                      />
                    </div>
                    {form.password.length > 0 && (
                      <div className="flex gap-1.5 mt-2">
                        {[1, 2, 3, 4].map((lvl) => (
                          <div
                            key={lvl}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              form.password.length >= lvl * 3
                                ? form.password.length >= 10
                                  ? 'bg-green-400'
                                  : form.password.length >= 6
                                  ? 'bg-amber-400'
                                  : 'bg-red-400'
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password *</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-shadow"
                      />
                    </div>
                    {form.confirmPassword.length > 0 && form.password === form.confirmPassword && (
                      <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                        <FiCheck size={12} /> Passwords match
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
              {step > 0 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <FiArrowLeft size={16} /> Back
                </button>
              ) : (
                <Link href="/login" className="text-sm text-slate-400 hover:text-amber-600 transition-colors">
                  Already have an account?
                </Link>
              )}

              <button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/20 text-sm"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </>
                ) : step === STEPS.length - 1 ? (
                  <>Create Account <FiCheck size={16} /></>
                ) : (
                  <>Continue <FiArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
