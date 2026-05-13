'use client';

import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import {
  FiChevronRight,
  FiCheck,
  FiX,
  FiClock,
  FiTruck,
  FiShield,
  FiAward,
  FiPackage,
  FiFileText,
  FiMapPin,
  FiInfo,
  FiLayers,
  FiSettings,
  FiStar,
  FiSend,
  FiBell,
} from 'react-icons/fi';
import EnquiryForm from '@/components/forms/EnquiryForm';
import ProductVideoPlayer from '@/components/products/ProductVideoPlayer';
import PriceDisplay from '@/components/products/PriceDisplay';
import DispatchBadge from '@/components/products/DispatchBadge';
import PurchaseFlow from '@/components/products/PurchaseFlow';
import RelatedProductsSection from '@/components/products/RelatedProductsSection';
import ReviewsSection from '@/components/products/ReviewsSection';
import PriceAlertWidget from '@/components/products/PriceAlertWidget';
import TransportEstimator from '@/components/products/TransportEstimator';
import { IProduct } from '@/types';
import { getWhatsAppLink } from '@/lib/utils';
import { useBuyerAuth } from '@/context/BuyerAuthContext';
import { WHATSAPP_NUMBER } from '@/lib/contact';

const conditionLabels: Record<string, { label: string; bg: string }> = {
  new: { label: 'NEW', bg: 'bg-emerald-500' },
  old: { label: 'USED', bg: 'bg-orange-500' },
  rejected: { label: 'REJECTED', bg: 'bg-red-500' },
};

const availabilityConfig: Record<string, { label: string; icon: typeof FiCheck; color: string }> = {
  in_stock: { label: 'In Stock', icon: FiCheck, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  out_of_stock: { label: 'Out of Stock', icon: FiX, color: 'text-red-700 bg-red-50 border-red-200' },
  on_demand: { label: 'On Demand', icon: FiClock, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  make_to_order: { label: 'Make to Order', icon: FiTruck, color: 'text-sky-700 bg-sky-50 border-sky-200' },
};

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showEnquiry, setShowEnquiry] = useState(searchParams.get('enquiry') === 'true');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const { isApproved, buyer } = useBuyerAuth();
  const canSeePrice = isApproved;

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProduct(d.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 aspect-square bg-slate-200 rounded-2xl" />
          <div className="lg:col-span-2 space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-32 bg-slate-200 rounded-2xl" />
            <div className="h-12 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h1>
        <p className="text-slate-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="px-6 py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const catObj = typeof product.category === 'object' ? (product.category as { name: string; slug?: string }) : null;
  const categoryName = catObj?.name || '';
  const categorySlug = catObj?.slug || '';
  const subObj = typeof product.subcategory === 'object' && product.subcategory ? (product.subcategory as { name: string; slug?: string }) : null;

  const whatsappNumber = WHATSAPP_NUMBER;
  const whatsappMsg = `Hi, I'm interested in: *${product.name}*\n\nPlease share pricing and availability details.\n\nThank you.`;

  const cond = conditionLabels[product.condition] || conditionLabels.new;
  const avail = availabilityConfig[product.availability] || availabilityConfig.in_stock;
  const AvailIcon = avail.icon;

  const attrs = [
    { label: 'GSM', value: product.gsm, color: 'from-violet-500 to-fuchsia-500' },
    { label: 'Thickness', value: product.thickness, color: 'from-sky-500 to-cyan-500' },
    { label: 'Weight', value: product.weight, color: 'from-emerald-500 to-teal-500' },
    { label: 'Capacity', value: product.capacity, color: 'from-amber-500 to-orange-500' },
    { label: 'Material', value: product.material, color: 'from-rose-500 to-pink-500' },
    { label: 'Size', value: product.size, color: 'from-indigo-500 to-blue-500' },
  ].filter((a) => !!a.value);

  const hasOverview = !!product.description;
  const hasSpecs =
    (product.specifications && product.specifications.length > 0) ||
    attrs.length > 0 ||
    (product.variants && product.variants.length > 0);

  const sectionNav = [
    hasOverview && { id: 'overview', label: 'Overview', icon: FiInfo },
    hasSpecs && { id: 'specs', label: 'Specifications', icon: FiLayers },
    { id: 'shipping', label: 'Shipping', icon: FiTruck },
    { id: 'how-to-order', label: 'How to Order', icon: FiSettings },
    { id: 'reviews', label: 'Reviews', icon: FiStar },
  ].filter(Boolean) as { id: string; label: string; icon: typeof FiInfo }[];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-slate-50 via-amber-50/30 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
            <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <FiChevronRight size={14} />
            <Link href="/products" className="hover:text-amber-600 transition-colors">Products</Link>
            {categoryName && (
              <>
                <FiChevronRight size={14} />
                <Link href={`/products?category=${categorySlug}`} className="hover:text-amber-600 transition-colors">{categoryName}</Link>
              </>
            )}
            {subObj && (
              <>
                <FiChevronRight size={14} />
                <Link href={`/products?category=${categorySlug}&subcategory=${subObj.slug}`} className="hover:text-amber-600 transition-colors">{subObj.name}</Link>
              </>
            )}
            <FiChevronRight size={14} />
            <span className="text-slate-800 font-semibold truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-white via-amber-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
            {/* Image gallery */}
            <div className="lg:col-span-3">
              <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                {product.images && product.images.length > 0 ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
                <span className={`absolute top-4 left-4 px-3 py-1 text-[11px] font-bold rounded-full text-white shadow-md ${cond.bg}`}>
                  {cond.label}
                </span>
                {product.isFeatured && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded-full text-white shadow-md bg-gradient-to-r from-violet-500 to-fuchsia-500">
                    <FiAward size={12} /> FEATURED
                  </span>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 mt-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${idx === activeImage ? 'border-amber-500 ring-2 ring-amber-200' : 'border-slate-200 hover:border-amber-300'}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {product.video && (
                <div className="mt-4">
                  <ProductVideoPlayer src={product.video} poster={product.images?.[0]} />
                </div>
              )}
            </div>

            {/* Buy box (sticky on desktop) */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                {categoryName && (
                  <Link href={`/products?category=${categorySlug}`} className="inline-block text-[11px] font-bold text-amber-600 uppercase tracking-widest hover:underline">
                    {categoryName}{subObj ? ` › ${subObj.name}` : ''}
                  </Link>
                )}
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1.5 leading-tight">{product.name}</h1>

                {/* Price card */}
                <div className="mt-5 p-5 bg-gradient-to-br from-amber-50 via-white to-orange-50/50 border border-amber-200 rounded-2xl shadow-sm">
                  <PriceDisplay product={product} canSeePrice={canSeePrice} isBuyer={!!buyer} />
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${avail.color}`}>
                      <AvailIcon size={13} />
                      {avail.label}
                    </span>
                    {product.moq && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <FiPackage size={13} /> MOQ: {product.moq}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <DispatchBadge status={product.dispatchStatus} days={product.dispatchDays} />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
                  <a
                    href={getWhatsAppLink(whatsappNumber, whatsappMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all"
                  >
                    <FaWhatsapp size={20} />
                    WhatsApp
                  </a>
                  <button
                    onClick={() => setShowEnquiry(!showEnquiry)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all"
                  >
                    <FiSend size={16} />
                    {showEnquiry ? 'Hide Form' : 'Send Enquiry'}
                  </button>
                </div>

                {/* Compact enquiry form */}
                {showEnquiry && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-amber-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Quick Enquiry</h3>
                    <EnquiryForm productName={product.name} productId={product._id} compact />
                  </div>
                )}

                {/* Trust mini-strip */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <FiShield className="text-emerald-600 shrink-0" size={16} />
                    <p className="text-[11px] font-semibold text-emerald-800 leading-tight">Verified Supplier</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-sky-50 border border-sky-100 rounded-lg">
                    <FiFileText className="text-sky-600 shrink-0" size={16} />
                    <p className="text-[11px] font-semibold text-sky-800 leading-tight">GST Invoice</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-lg">
                    <FiTruck className="text-amber-600 shrink-0" size={16} />
                    <p className="text-[11px] font-semibold text-amber-800 leading-tight">Pan-India Delivery</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-violet-50 border border-violet-100 rounded-lg">
                    <FiAward className="text-violet-600 shrink-0" size={16} />
                    <p className="text-[11px] font-semibold text-violet-800 leading-tight">Quality Assured</p>
                  </div>
                </div>

                {/* Price alert */}
                <PriceAlertWidget productId={product._id} productName={product.name} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION NAV (sticky pill bar) */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-y border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {sectionNav.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-full transition-colors"
              >
                <s.icon size={13} />
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* OVERVIEW */}
      {hasOverview && (
        <section id="overview" className="bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <SectionHeader icon={FiInfo} title="Overview" tint="sky" />
            <div className="mt-5 p-6 bg-gradient-to-br from-sky-50/40 to-white border border-slate-200 rounded-2xl">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        </section>
      )}

      {/* SPECIFICATIONS */}
      {hasSpecs && (
        <section id="specs" className="bg-slate-50/60 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <SectionHeader icon={FiLayers} title="Specifications" tint="violet" />

            {/* Attribute pills */}
            {attrs.length > 0 && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {attrs.map((a) => (
                  <div key={a.label} className="relative p-3.5 bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${a.color}`} />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{a.label}</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">{a.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-6 p-5 bg-white border border-slate-200 rounded-2xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
                  <FiSettings size={14} className="text-amber-600" /> Available Options
                </h3>
                <div className="space-y-4">
                  {product.variants.map((vg) => (
                    <div key={vg.name}>
                      <p className="text-sm font-semibold text-slate-700 mb-2">
                        {vg.name}
                        {selectedVariants[vg.name] && (
                          <span className="ml-2 text-amber-600 font-bold">: {selectedVariants[vg.name]}</span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {vg.values.map((val) => {
                          const active = selectedVariants[vg.name] === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setSelectedVariants((prev) => ({ ...prev, [vg.name]: active ? '' : val }))}
                              className={`px-3.5 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                                active
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-transparent text-white shadow-sm'
                                  : 'bg-white border-slate-300 text-slate-700 hover:border-amber-400 hover:text-amber-700'
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications table */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-6 bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Detailed Specifications</h3>
                </div>
                <div>
                  {product.specifications.map((spec, idx) => (
                    <div
                      key={idx}
                      className={`flex ${idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'} ${
                        idx !== product.specifications!.length - 1 ? 'border-b border-slate-100' : ''
                      }`}
                    >
                      <div className="w-1/3 px-5 py-3 text-sm font-semibold text-slate-600 border-r border-slate-200">{spec.key}</div>
                      <div className="flex-1 px-5 py-3 text-sm text-slate-800">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SHIPPING + ALERTS */}
      <section id="shipping" className="bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <SectionHeader icon={FiTruck} title="Shipping & Delivery" tint="emerald" />
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TransportEstimator fromPincode={product.stockPincode || '360003'} productWeightKg={parseFloat(product.weight || '100') || 100} />
            </div>
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 rounded-2xl">
              <FiMapPin size={22} className="text-emerald-600" />
              <h3 className="mt-2 font-bold text-slate-900">Dispatched From</h3>
              <p className="mt-1 text-sm text-slate-700">
                {product.stockPincode ? `Pincode ${product.stockPincode}` : 'Rajkot, Gujarat'}
              </p>
              <div className="mt-3 pt-3 border-t border-emerald-200">
                <p className="text-xs text-slate-600 leading-relaxed">
                  We ship across India via reliable transport partners. Bulk orders qualify for negotiated freight rates.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <FiCheck size={14} /> Door delivery available
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <FiCheck size={14} /> GST invoice on every order
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <FiCheck size={14} /> Insurance on request
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO ORDER (Purchase flow) */}
      <section id="how-to-order" className="bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <SectionHeader icon={FiSettings} title="How to Order" tint="amber" />
          <div className="mt-5">
            <PurchaseFlow productName={product.name} />
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <SectionHeader icon={FiStar} title="Customer Reviews" tint="rose" />
          <div className="mt-5">
            <ReviewsSection productId={product._id} productName={product.name} />
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="bg-slate-50/60 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <RelatedProductsSection
            productId={product._id}
            categoryId={typeof product.category === 'object' ? product.category?._id : (product.category as string | undefined)}
          />
        </div>
      </section>

      {/* MOBILE STICKY ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <a
            href={getWhatsAppLink(whatsappNumber, whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg"
          >
            <FaWhatsapp size={16} /> WhatsApp
          </a>
          <button
            onClick={() => {
              setShowEnquiry(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-lg"
          >
            <FiSend size={14} /> Enquire
          </button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Notify"
            className="inline-flex items-center justify-center w-10 h-10 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg"
          >
            <FiBell size={16} />
          </a>
        </div>
      </div>
      <div className="lg:hidden h-16" />
    </>
  );
}

// Reusable colored section header
function SectionHeader({
  icon: Icon,
  title,
  tint,
}: {
  icon: typeof FiInfo;
  title: string;
  tint: 'sky' | 'violet' | 'emerald' | 'amber' | 'rose';
}) {
  const tints: Record<string, { bg: string; text: string; ring: string }> = {
    sky: { bg: 'bg-gradient-to-br from-sky-500 to-cyan-500', text: 'text-sky-700', ring: 'ring-sky-100' },
    violet: { bg: 'bg-gradient-to-br from-violet-500 to-fuchsia-500', text: 'text-violet-700', ring: 'ring-violet-100' },
    emerald: { bg: 'bg-gradient-to-br from-emerald-500 to-teal-500', text: 'text-emerald-700', ring: 'ring-emerald-100' },
    amber: { bg: 'bg-gradient-to-br from-amber-500 to-orange-500', text: 'text-amber-700', ring: 'ring-amber-100' },
    rose: { bg: 'bg-gradient-to-br from-rose-500 to-pink-500', text: 'text-rose-700', ring: 'ring-rose-100' },
  };
  const t = tints[tint];
  return (
    <div className="flex items-center gap-3">
      <div className={`w-11 h-11 rounded-xl ${t.bg} ring-4 ${t.ring} flex items-center justify-center text-white shadow-sm`}>
        <Icon size={20} />
      </div>
      <div>
        <p className={`text-[11px] font-bold uppercase tracking-widest ${t.text}`}>Boriwala</p>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">{title}</h2>
      </div>
    </div>
  );
}
