'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FiInfo,
  FiChevronRight,
  FiRotateCcw,
  FiPackage,
  FiArrowRight,
  FiSettings,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { whatsappLink } from '@/lib/contact';

// ---------------------------------------------------------------------------
// Industry-standard formula (default mode):
//   Weight per bag (g) = (Width_inches × FabricWeight_g × CuttingLength_inches) / 39.37
//   CuttingLength = FinishedLength + BottomFold + TopHem
//
// "FabricWeight_g" is the trade unit: grams per 1-inch wide × 1-meter long strip.
//   - 1 "gram" ≈ 39.37 GSM    (e.g. 3 gram fabric ≈ 118 GSM)
// ---------------------------------------------------------------------------

const INCH_PER_METER = 39.37;

type Mode = 'industry' | 'gsm';

type Preset = {
  label: string;
  widthIn: number;
  lengthIn: number;
  fabricGram: number; // industry units
  bottomFold: number;
  topHem: boolean;
  note: string;
};

const PRESETS: Preset[] = [
  { label: 'Cement Bag 50 kg',   widthIn: 18, lengthIn: 30, fabricGram: 3.0, bottomFold: 1, topHem: false, note: '24"×36"-class, ~118 GSM' },
  { label: 'Rice / Grain 50 kg', widthIn: 19, lengthIn: 32, fabricGram: 2.5, bottomFold: 1, topHem: true,  note: 'Food grain woven PP' },
  { label: 'Rice / Grain 25 kg', widthIn: 16, lengthIn: 26, fabricGram: 2.0, bottomFold: 1, topHem: true,  note: '~79 GSM tubular' },
  { label: 'Sugar 50 kg',        widthIn: 22, lengthIn: 36, fabricGram: 2.8, bottomFold: 1, topHem: false, note: 'Sugar packaging' },
  { label: 'Fertilizer 50 kg',   widthIn: 18, lengthIn: 30, fabricGram: 2.5, bottomFold: 1, topHem: false, note: 'Standard fertilizer' },
  { label: 'BOPP Laminated',     widthIn: 16, lengthIn: 26, fabricGram: 2.5, bottomFold: 1, topHem: true,  note: 'Add lamination weight separately' },
];

export default function BagWeightCalculatorPage() {
  const [mode, setMode] = useState<Mode>('industry');

  // --- Industry inputs (inches + grams/inch·m) ---
  const [widthIn, setWidthIn] = useState<number>(24);
  const [lengthIn, setLengthIn] = useState<number>(36);
  const [fabricGram, setFabricGram] = useState<number>(3);
  const [bottomFold, setBottomFold] = useState<number>(1);
  const [topHem, setTopHem] = useState<boolean>(false);
  const [topHemSize, setTopHemSize] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1000);

  // --- GSM mode inputs ---
  const [widthCm, setWidthCm] = useState<number>(60);
  const [lengthCm, setLengthCm] = useState<number>(90);
  const [gsm, setGsm] = useState<number>(118);
  const [seamPct, setSeamPct] = useState<number>(5);

  // --- Industry calc ---
  const industryResult = useMemo(() => {
    const cutLen = lengthIn + bottomFold + (topHem ? topHemSize : 0);
    const perBag = (widthIn * fabricGram * cutLen) / INCH_PER_METER;
    const total = (perBag * quantity) / 1000;
    const equivGsm = fabricGram * INCH_PER_METER;
    return {
      cuttingLength: cutLen,
      perBagG: +perBag.toFixed(2),
      perBagKg: +(perBag / 1000).toFixed(4),
      totalKg: +total.toFixed(2),
      equivGsm: +equivGsm.toFixed(1),
    };
  }, [widthIn, lengthIn, fabricGram, bottomFold, topHem, topHemSize, quantity]);

  // --- GSM mode calc (flat tubular: front + back) ---
  const gsmResult = useMemo(() => {
    const areaCm2 = 2 * widthCm * lengthCm; // tubular = both panels
    const areaWithSeam = areaCm2 * (1 + Math.max(0, seamPct) / 100);
    const areaM2 = areaWithSeam / 10000;
    const perBag = areaM2 * Math.max(0, gsm);
    const total = (perBag * quantity) / 1000;
    return {
      areaM2: +areaM2.toFixed(4),
      perBagG: +perBag.toFixed(2),
      perBagKg: +(perBag / 1000).toFixed(4),
      totalKg: +total.toFixed(2),
    };
  }, [widthCm, lengthCm, gsm, seamPct, quantity]);

  const applyPreset = (p: Preset) => {
    setWidthIn(p.widthIn);
    setLengthIn(p.lengthIn);
    setFabricGram(p.fabricGram);
    setBottomFold(p.bottomFold);
    setTopHem(p.topHem);
  };

  const resetIndustry = () => {
    setWidthIn(24);
    setLengthIn(36);
    setFabricGram(3);
    setBottomFold(1);
    setTopHem(false);
    setTopHemSize(1);
    setQuantity(1000);
  };

  const resetGsm = () => {
    setWidthCm(60);
    setLengthCm(90);
    setGsm(118);
    setSeamPct(5);
    setQuantity(1000);
  };

  const r = mode === 'industry' ? industryResult : gsmResult;

  const enquiryMessage =
    `Hi, I'd like a quote for woven bags:\n` +
    (mode === 'industry'
      ? `• Size: ${widthIn}" × ${lengthIn}" (cutting ${widthIn}" × ${industryResult.cuttingLength}")\n` +
        `• Fabric: ${fabricGram} gram (~${industryResult.equivGsm} GSM)\n` +
        `• Bottom fold: ${bottomFold}"` + (topHem ? ` | Top hem: ${topHemSize}"` : '') + `\n`
      : `• Size: ${widthCm} × ${lengthCm} cm\n` +
        `• Fabric: ${gsm} GSM (tubular)\n`) +
    `• Weight: ${r.perBagG} g/bag\n` +
    `• Quantity: ${quantity.toLocaleString('en-IN')} pcs\n` +
    `• Total: ${r.totalKg.toLocaleString('en-IN')} kg\n` +
    `\nPlease share your best price.`;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
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
                Industry-standard weight estimation for woven PP / HDPE bags.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Mode switch */}
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mr-2">Method:</span>
          <button
            onClick={() => setMode('industry')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
              mode === 'industry'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            Trade Formula (inches / gram)
          </button>
          <button
            onClick={() => setMode('gsm')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
              mode === 'gsm'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <FiSettings size={14} />
            Technical (GSM)
          </button>
        </div>

        {/* Presets only for industry mode */}
        {mode === 'industry' && (
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
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {p.widthIn}"×{p.lengthIn}" · {p.fabricGram}g
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Bag Specifications</h2>
              <button
                onClick={mode === 'industry' ? resetIndustry : resetGsm}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                <FiRotateCcw size={12} /> Reset
              </button>
            </div>

            {mode === 'industry' ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                  <NumberField label='Width (inches)'  value={widthIn}    onChange={setWidthIn}    min={1} max={120} />
                  <NumberField label='Length (inches)' value={lengthIn}   onChange={setLengthIn}   min={1} max={120} help="Finished bag length" />
                  <NumberField
                    label='Fabric Weight (gram)'
                    value={fabricGram}
                    onChange={setFabricGram}
                    min={0.5}
                    max={10}
                    step={0.1}
                    help={`≈ ${(fabricGram * INCH_PER_METER).toFixed(0)} GSM`}
                  />
                  <NumberField label='Bottom Fold (inches)' value={bottomFold} onChange={setBottomFold} min={0} max={5} step={0.5} />
                  <div>
                    <label className="block">
                      <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Top Hemming
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 px-3 py-2.5 border border-slate-300 rounded-lg cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            checked={topHem}
                            onChange={(e) => setTopHem(e.target.checked)}
                          />
                          <span>{topHem ? 'Yes' : 'No'}</span>
                        </label>
                        {topHem && (
                          <input
                            type="number"
                            value={topHemSize}
                            min={0}
                            max={5}
                            step={0.5}
                            onChange={(e) => setTopHemSize(parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-2.5 border border-slate-300 rounded-lg text-sm tabular-nums"
                          />
                        )}
                      </div>
                    </label>
                  </div>
                  <NumberField label='Quantity (bags)' value={quantity} onChange={setQuantity} min={1} step={100} />
                </div>

                {/* Step-by-step breakdown */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 text-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3">
                    Step-by-step Calculation
                  </div>
                  <div className="space-y-1.5 text-slate-700 font-mono text-xs md:text-sm">
                    <div>1. Cutting length = {lengthIn} + {bottomFold}{topHem ? ` + ${topHemSize}` : ''} = <strong>{industryResult.cuttingLength}"</strong></div>
                    <div>2. {widthIn} × {fabricGram} = <strong>{(widthIn * fabricGram).toFixed(2)}</strong></div>
                    <div>3. {(widthIn * fabricGram).toFixed(2)} ÷ 39.37 = <strong>{((widthIn * fabricGram) / INCH_PER_METER).toFixed(4)} g/inch</strong></div>
                    <div>4. {((widthIn * fabricGram) / INCH_PER_METER).toFixed(4)} × {industryResult.cuttingLength} = <strong className="text-amber-700">{industryResult.perBagG} g per bag</strong></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                  <NumberField label='Width (cm)'  value={widthCm}  onChange={setWidthCm}  min={1} max={300} />
                  <NumberField label='Length (cm)' value={lengthCm} onChange={setLengthCm} min={1} max={300} />
                  <NumberField label='Fabric GSM'  value={gsm}      onChange={setGsm}      min={20} max={300} help="Grams per m²" />
                  <NumberField label='Seam Allowance (%)' value={seamPct} onChange={setSeamPct} min={0} max={20} help="Stitching extra" />
                  <NumberField label='Quantity (bags)' value={quantity} onChange={setQuantity} min={1} step={100} />
                </div>
                <div className="flex gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <FiInfo size={14} className="shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    Tubular weaving — fabric area = 2 × W × L (front + back of one tube cut).
                    Multiplies by (1 + seam%) for stitching allowance.
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Result panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1a73e8] via-[#0d3a8f] to-slate-900 text-white rounded-2xl p-6 md:p-7 sticky top-32 shadow-xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Result</h2>
              <p className="text-blue-100/70 text-xs mb-5">Per bag</p>

              <div className="mb-6">
                <div className="text-5xl font-extrabold tabular-nums">
                  {r.perBagG.toLocaleString('en-IN')}
                  <span className="text-2xl text-blue-200 ml-1">g</span>
                </div>
                <div className="text-sm text-blue-200 mt-1">
                  ≈ {r.perBagKg.toLocaleString('en-IN')} kg per bag
                </div>
              </div>

              <div className="space-y-3 border-t border-white/15 pt-5">
                {mode === 'industry' ? (
                  <>
                    <Row label="Cutting size" value={`${widthIn}" × ${industryResult.cuttingLength}"`} />
                    <Row label="Equivalent GSM" value={`${industryResult.equivGsm} g/m²`} />
                  </>
                ) : (
                  <Row label="Fabric area / bag" value={`${gsmResult.areaM2} m²`} />
                )}
                <Row label="Total bags" value={quantity.toLocaleString('en-IN')} />
                <Row
                  label="Total weight"
                  value={`${r.totalKg.toLocaleString('en-IN')} kg`}
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

        {/* Formula reference */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Formula Reference</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Trade Formula (Industry Standard)</h4>
              <code className="block bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-xs text-slate-700 mb-2">
                Weight (g) = (Width" × Fabric gram × Cutting Length") ÷ 39.37
              </code>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
                <li>Cutting Length = Finished Length + Bottom Fold + Top Hem</li>
                <li>39.37 inches = 1 meter (unit conversion)</li>
                <li>Used directly for tubular woven PP/HDPE</li>
                <li>"3 gram" fabric ≈ 118 GSM ; "2 gram" ≈ 79 GSM</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Technical (GSM)</h4>
              <code className="block bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-xs text-slate-700 mb-2">
                Weight (g) = 2 × W × L × (1 + seam%) × GSM ÷ 10000
              </code>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
                <li>Dimensions in cm, GSM in g/m²</li>
                <li>2× for tubular (front + back panel)</li>
                <li>Useful for engineering specs / spec sheets</li>
                <li>Tolerance: ±3–5% in actual production</li>
              </ul>
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
