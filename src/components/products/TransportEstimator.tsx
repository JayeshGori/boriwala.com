'use client';

import { useState } from 'react';
import { FiTruck, FiMapPin, FiInfo } from 'react-icons/fi';

interface Props {
  fromPincode?: string;
  productWeightKg?: number;
}

interface EstimateData {
  fromPincode: string;
  toPincode: string;
  distanceKm: number;
  estCostMin: number;
  estCostMax: number;
  estDeliveryDays: number;
  note: string;
}

export default function TransportEstimator({ fromPincode = '360003', productWeightKg = 100 }: Props) {
  const [pincode, setPincode] = useState('');
  const [weight, setWeight] = useState(productWeightKg.toString());
  const [data, setData] = useState<EstimateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calc = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setData(null);
    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit Indian pincode');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/transport-estimate?from=${fromPincode}&to=${pincode}&weight=${weight}`);
      const j = await res.json();
      if (j.success) setData(j.data);
      else setError(j.error || 'Failed to estimate');
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="mt-6 p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl">
      <div className="flex items-center gap-2 mb-3">
        <FiTruck className="text-amber-600" size={20} />
        <h3 className="text-sm sm:text-base font-semibold text-slate-800">Estimate Transport Cost</h3>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        Enter your delivery pincode for an approximate transport cost &amp; ETA. Final freight is confirmed at order time.
      </p>

      <form onSubmit={calc} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="relative sm:col-span-1">
          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Delivery pincode"
            inputMode="numeric"
            maxLength={6}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Total weight (kg)"
          min={1}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-semibold rounded-lg"
        >
          {loading ? 'Calculating...' : 'Estimate'}
        </button>
      </form>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {data && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Distance</p>
              <p className="text-lg font-bold text-slate-900">~{data.distanceKm} km</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Approx Cost</p>
              <p className="text-lg font-bold text-slate-900">
                ₹{data.estCostMin.toLocaleString('en-IN')}–₹{data.estCostMax.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Delivery</p>
              <p className="text-lg font-bold text-slate-900">~{data.estDeliveryDays} days</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-amber-800 flex items-start gap-1.5">
            <FiInfo size={14} className="mt-0.5 shrink-0" />
            {data.note}
          </p>
        </div>
      )}
    </div>
  );
}
