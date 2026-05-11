'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FiInfo, FiChevronRight, FiRotateCcw, FiPackage, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { whatsappLink } from '@/lib/contact';

type BagType = 'flat' | 'bottom_gusset' | 'side_gusset' | 'full_gusset';

const BAG_TYPES: { value: BagType; label: string; desc: string }[] = [
  { value: 'flat', label: 'Flat / Tubular', desc: 'No gusset (open mouth)' },
  { value: 'bottom_gusset', label: 'Bottom Gusset', desc: 'Folded bottom only' },
  { value: 'side_gusset', label: 'Side Gusset', desc: 'Folded sides only' },
  { value: 'full_gusset', label: 'Full Gusset (Box)', desc: 'Side + bottom gusset' },
];

const PRESETS: { label: string; w: number; l: number; gsm: number; type: BagType; gusset: number; note: string }[] = [
  { label: 'Cement Bag 50 kg', w: 45, l: 75, gsm: 70, type: 'flat', gusset: 0, note: 'Standard PP woven cement bag' },
  { label: 'Rice/Grain 25 kg', w: 40, l: 65, gsm: 60, type: 'flat', gusset: 0, note: 'Food grain PP woven bag' },
  { label: 'Rice/Grain 50 kg', w: 48, l: 80, gsm: 75, type: 'flat', gusset: 0, note: 'Heavy duty food grain bag' },
  { label: 'BOPP Laminated 25 kg', w: 40, l: 65, gsm: 100, type: 'bottom_gusset', gusset: 10, note: '~70 GSM PP + ~30 GSM BOPP' },
  { label: 'Sugar Bag 50 kg', w: 55, l: 90, gsm: 80, type: 'flat', gusset: 0, note: 'Sugar packaging woven bag' },
  { label: 'Fertilizer 50 kg', w: 45, l: 75, gsm: 75, type: 'flat', gusset: 0, note: 'Fertilizer PP woven bag' },
];

function calculateArea(type: BagType, w: number, l: number, gusset: number) {
  // All inputs in cm. Returns area in cm² for ONE bag's flat fabric.
  // Formulas approximate industry standards for woven PP/HDPE bags.
  const W = Math.max(0, w);
  const L = Math.max(0, l);
  const G = Math.max(0, gusset);
  switch (type) {
    case 'flat':
      // Front + Back panel
      return 2 * W * L;
    case 'bottom_gusset':
      // Front + Back + Bottom flap (W × G)
      return 2 * W * L + W * G;
    case 'side_gusset':
      // Two side panels added
      return 2 * W * L + 2 * G * L;
    case 'full_gusset':
      // Front + Back + 2 sides + bottom
      return 2 * W * L + 2 * G * L + W * G;
  }
}

export default function BagWeightCalculatorPage() {
  const [bagType, setBagType] = useState<BagType>('flat');
  const [width, setWidth] = useState<number>(45);
  const [length, setLength] = useState<number>(75);
  const [gusset, setGusset] = useState<number>(0);
  const [gsm, setGsm] = useState<number>(70);
  const [seamPct, setSeamPct] = useState<number>(5);
  const [quantity, setQuantity] = useState<number>(1000);

  const result = useMemo(() => {
    const areaCm2 = calculateArea(bagType, width, length, gusset);
    const seamFactor = 1 + (Math.max(0, seamPct) / 100);
    const areaWithSeamCm2 = areaCm2 * seamFactor;
    const areaM2 = areaWithSeamCm2 / 10000;
    const weightG = areaM2 * Math.max(0, gsm);
    const totalKg = (weightG * Math.max(0, quantity)) / 1000;
    const fabricM2Total = areaM2 * Math.max(0, quantity);
    return {
      areaM2: +areaM2.toFixed(4),
      weightG: +weightG.toFixed(2),
      weightKg: +(weightG / 1000).toFixed(4),
      totalKg: +totalKg.toFixed(2),
      fabricM2Total: +fabricM2Total.toFixed(2),
    };
  }, [bagType, width, length, gusset, gsm, seamPct, quantity]);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setBagType(p.type);
    setWidth(p.w);
    setLength(p.l);
    setGusset(p.gusset);
    setGsm(p.gsm);
  };

  const reset = () => {
    setBagType('flat');
    setWidth(45);
    setLength(75);
    setGusset(0);
    setGsm(70);
    setSeamPct(5);
    setQuantity(1000);
  };

  const enquiryMessage =
    `Hi, I'd like a quote for woven bags:\n` +
    `• Type: ${BAG_TYPES.find((b) => b.value === bagType)?.label}\n` +
    `• Size: ${width} × ${length} cm` +
    (gusset > 0 ? ` (Gusset ${gusset} cm)` : '') +
    `\n• Fabric: ${gsm} GSM\n` +
    `• Estimated weight: ${result.weightG} g/bag\n` +
    `• Quantity: ${quantity.toLocaleString('en-IN')} pcs\n` +
    `\nPlease share your best price.`;

  const gussetEnabled = bagType !== 'flat';

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb header */}
      <div className="bg-slate-800 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link href="/" className="hover:text-amber-400">Home</Link>
            <FiChevronRight size={12} />
            <span>Tools</span>
            <FiChevronRight size={12} />
            <span className="text-white">Bag Weight Calculator</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <FiPackage size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white">Bag Weight Calculator</h1>
              <p className="text-sm md:text-base text-slate-300 mt-1">
                Estimate woven bag weight from fabric GSM, size & quantity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Presets */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Quick Presets</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="text-left px-3 py-2.5 bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 rounded-lg transition-colors group"
                title={p.note}
              >
                <div className="text-xs font-semibold text-slate-800 group-hover:text-amber-700">{p.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{p.w}×{p.l} cm · {p.gsm} GSM</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Bag Specifications</h2>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                <FiRotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Bag type */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Bag Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {BAG_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setBagType(t.value)}
                    className={`text-left p-3 rounded-lg border-2 transition-all ${
                      bagType === t.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`text-sm font-semibold ${bagType === t.value ? 'text-amber-700' : 'text-slate-800'}`}>
                      {t.label}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <NumberField label="Width (cm)" value={width} onChange={setWidth} min={1} max={300} />
              <NumberField label="Length (cm)" value={length} onChange={setLength} min={1} max={300} />
              <NumberField
                label="Gusset (cm)"
                value={gusset}
                onChange={setGusset}
                min={0}
                max={100}
                disabled={!gussetEnabled}
                help={!gussetEnabled ? 'Not applicable for flat bags' : undefined}
              />
              <NumberField label="Fabric GSM" value={gsm} onChange={setGsm} min={20} max={300} help="Grams per square meter" />
              <NumberField label="Seam Allowance (%)" value={seamPct} onChange={setSeamPct} min={0} max={20} help="Extra fabric for stitching" />
              <NumberField label="Quantity" value={quantity} onChange={setQuantity} min={1} step={100} />
            </div>

            {/* Info note */}
            <div className="flex gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <FiInfo size={14} className="shrink-0 mt-0.5 text-blue-600" />
              <div>
                <strong>How it's calculated:</strong> Fabric area is computed from the bag's flat layout
                (front + back + gusset panels), multiplied by GSM and seam allowance. Actual weight may vary
                ±3–5% based on weaving tolerance, lamination, printing and stitching thread.
              </div>
            </div>
          </div>

          {/* Result panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1a73e8] via-[#0d3a8f] to-slate-900 text-white rounded-2xl p-6 md:p-7 sticky top-32 shadow-xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Result</h2>
              <p className="text-blue-100/70 text-xs mb-5">Per bag</p>

              <div className="mb-6">
                <div className="text-5xl font-extrabold tabular-nums">
                  {result.weightG.toLocaleString('en-IN')}
                  <span className="text-2xl text-blue-200 ml-1">g</span>
                </div>
                <div className="text-sm text-blue-200 mt-1">≈ {result.weightKg.toLocaleString('en-IN')} kg per bag</div>
              </div>

              <div className="space-y-3 border-t border-white/15 pt-5">
                <Row label="Fabric area / bag" value={`${result.areaM2} m²`} />
                <Row label="Total bags" value={quantity.toLocaleString('en-IN')} />
                <Row label="Total fabric needed" value={`${result.fabricM2Total.toLocaleString('en-IN')} m²`} />
                <Row
                  label="Total weight"
                  value={`${result.totalKg.toLocaleString('en-IN')} kg`}
                  highlight
                />
              </div>

              <div className="mt-6 space-y-2">
                <a
                  href={whatsappLink(enquiryMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-500 hover:bg-green-600 font-semibold rounded-xl transition-colors text-sm"
                >
                  <FaWhatsapp size={18} /> Get Quote on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 font-semibold rounded-xl transition-colors text-sm"
                >
                  Send Enquiry <FiArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  disabled,
  help,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  help?: string;
}) {
  return (
    <label className={`block ${disabled ? 'opacity-50' : ''}`}>
      <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step || 1}
        disabled={disabled}
        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm tabular-nums focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-colors disabled:bg-slate-100"
      />
      {help && <p className="text-[10px] text-slate-500 mt-1">{help}</p>}
    </label>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-blue-200">{label}</span>
      <span className={`font-bold tabular-nums ${highlight ? 'text-amber-300 text-base' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}
