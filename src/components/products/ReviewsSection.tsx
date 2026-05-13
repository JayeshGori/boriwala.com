'use client';

import { useEffect, useState } from 'react';
import { FiStar, FiCheckCircle, FiVideo, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ProductVideoPlayer from './ProductVideoPlayer';
import { useBuyerAuth } from '@/context/BuyerAuthContext';

interface Review {
  _id: string;
  name: string;
  companyName?: string;
  rating: number;
  title?: string;
  comment: string;
  videoUrl?: string;
  imageUrls?: string[];
  isVerified?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

interface Stats {
  count: number;
  avg: number;
  distribution: Record<number, number>;
}

interface Props {
  productId: string;
  productName: string;
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar
          key={i}
          size={size}
          className={i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
        />
      ))}
    </span>
  );
}

export default function ReviewsSection({ productId, productName }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { buyer } = useBuyerAuth();

  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/reviews?product=${productId}`).then((r) => r.json());
      if (r.success) {
        setReviews(r.data || []);
        setStats(r.stats);
      }
    } catch {
      /* */
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    if (buyer) {
      setName(buyer.name);
      setEmail(buyer.email);
      setCompanyName(buyer.companyName || '');
    }
  }, [buyer]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write your review');
      return;
    }
    if (!buyer && (!name.trim() || !email.trim())) {
      toast.error('Name and email are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: productId,
          name,
          email,
          companyName,
          rating,
          title,
          comment,
          videoUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Review submitted! It will appear after approval.');
        setShowForm(false);
        setTitle('');
        setComment('');
        setVideoUrl('');
        setRating(5);
      } else {
        toast.error(data.error || 'Submission failed');
      }
    } catch {
      toast.error('Network error');
    }
    setSubmitting(false);
  };

  const featured = reviews.filter((r) => r.isFeatured);
  const regular = reviews.filter((r) => !r.isFeatured);
  const videoReviews = reviews.filter((r) => r.videoUrl);

  return (
    <section className="mt-12 sm:mt-16">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Customer Reviews</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Verified buyer feedback for <strong className="text-slate-700">{productName}</strong>
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Stats */}
      {stats && stats.count > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
          <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl">
            <p className="text-5xl font-bold text-slate-900">{stats.avg.toFixed(1)}</p>
            <Stars value={stats.avg} size={18} />
            <p className="text-xs text-slate-500 mt-1">
              Based on <strong>{stats.count}</strong> review{stats.count !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="md:col-span-2 p-4 bg-white border border-slate-200 rounded-xl">
            {[5, 4, 3, 2, 1].map((s) => {
              const c = stats.distribution[s] || 0;
              const pct = stats.count > 0 ? (c / stats.count) * 100 : 0;
              return (
                <div key={s} className="flex items-center gap-2 mb-1.5 last:mb-0">
                  <span className="w-6 text-xs font-medium text-slate-600">{s}★</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-xs text-slate-500 text-right">{c}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Write review form */}
      {showForm && (
        <form onSubmit={submit} className="p-5 sm:p-6 bg-white border border-amber-200 rounded-2xl mb-6 space-y-4">
          <h3 className="font-semibold text-slate-800">Share your experience</h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating *</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}
                  className="p-1"
                >
                  <FiStar
                    size={28}
                    className={
                      i <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-slate-500">{rating} of 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name *"
              required
              disabled={!!buyer}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-50"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email *"
              required
              disabled={!!buyer}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-50"
            />
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company name (optional)"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none md:col-span-2"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Review title (optional)"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none md:col-span-2"
            />
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product *"
            required
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
              <FiVideo size={14} /> Video Review URL (optional)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube / Drive / direct video URL"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <p className="text-xs text-slate-400 mt-1">
              Have a video testimonial? Upload to YouTube/Drive (public) and paste the link here.
            </p>
          </div>

          {buyer && (
            <p className="text-xs text-green-700 flex items-center gap-1">
              <FiCheckCircle size={14} /> You&apos;ll receive a verified-buyer badge after approval.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-semibold rounded-lg"
            >
              <FiSend size={14} /> {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Video testimonials */}
      {videoReviews.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <FiVideo className="text-amber-500" /> Video Testimonials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoReviews.slice(0, 6).map((r) => (
              <div key={r._id + '-vid'} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <ProductVideoPlayer src={r.videoUrl!} />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800 truncate">{r.name}</p>
                    <Stars value={r.rating} size={14} />
                  </div>
                  {r.companyName && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{r.companyName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All reviews list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center p-10 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
          <p className="text-slate-500 text-sm">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...featured, ...regular].map((r) => (
            <div
              key={r._id}
              className={`p-4 sm:p-5 bg-white border rounded-xl ${
                r.isFeatured ? 'border-amber-300 shadow-sm' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                      {r.name}
                      {r.isVerified && (
                        <span title="Verified buyer" className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full">
                          <FiCheckCircle size={10} /> VERIFIED
                        </span>
                      )}
                      {r.isFeatured && (
                        <span className="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                          FEATURED
                        </span>
                      )}
                    </p>
                    {r.companyName && <p className="text-xs text-slate-500">{r.companyName}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <Stars value={r.rating} />
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              {r.title && <p className="font-semibold text-slate-800 mt-3">{r.title}</p>}
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
