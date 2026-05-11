'use client';

import { useEffect, useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiActivity } from 'react-icons/fi';

type Price = {
  _id: string;
  name: string;
  grade?: string;
  category: 'polymer' | 'jute';
  unit: string;
  price: number;
  trend: 'up' | 'down' | 'flat';
  changePct: number;
  source: string;
};

export default function PriceTicker() {
  const [prices, setPrices] = useState<Price[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/prices', { cache: 'no-store' });
        const data = await res.json();
        if (!cancelled && data.success) setPrices(data.data || []);
      } catch {
        /* silent */
      }
    };
    load();
    const id = setInterval(load, 5 * 60 * 1000); // refresh every 5 min
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (prices.length === 0) return null;

  // Duplicate list for seamless marquee loop
  const items = [...prices, ...prices];

  return (
    <div className="bg-gradient-to-r from-[#0d3a8f] via-[#1a73e8] to-[#0d3a8f] text-white text-xs border-b border-blue-900/50 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-stretch">
        {/* Label */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#f46f25] font-bold uppercase tracking-wider text-[10px] shrink-0">
          <FiActivity size={12} className="animate-pulse" />
          Live Rates
        </div>

        {/* Marquee */}
        <div className="relative flex-1 overflow-hidden group">
          <div className="ticker-track flex items-center gap-6 py-1.5 whitespace-nowrap will-change-transform">
            {items.map((p, i) => {
              const TrendIcon =
                p.trend === 'up' ? FiTrendingUp : p.trend === 'down' ? FiTrendingDown : FiMinus;
              const trendColor =
                p.trend === 'up'
                  ? 'text-emerald-300'
                  : p.trend === 'down'
                  ? 'text-red-300'
                  : 'text-slate-300';
              return (
                <span key={`${p._id}-${i}`} className="inline-flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      p.category === 'polymer' ? 'bg-white/15' : 'bg-amber-500/30'
                    }`}
                  >
                    {p.category === 'polymer' ? 'PLY' : 'JUTE'}
                  </span>
                  <span className="font-semibold">{p.name}</span>
                  {p.grade && <span className="text-blue-200/80">[{p.grade}]</span>}
                  <span className="font-bold tabular-nums">
                    {p.unit.replace('₹/', '₹')}{p.price.toLocaleString('en-IN')}
                  </span>
                  <span className={`inline-flex items-center gap-0.5 font-semibold ${trendColor}`}>
                    <TrendIcon size={11} />
                    {p.changePct !== 0 ? `${Math.abs(p.changePct).toFixed(2)}%` : '—'}
                  </span>
                  <span className="text-blue-200/40">•</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .ticker-track {
          animation: ticker 60s linear infinite;
        }
        .group:hover .ticker-track {
          animation-play-state: paused;
        }
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
