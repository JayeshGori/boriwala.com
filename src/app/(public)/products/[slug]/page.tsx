'use client';

import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { FiChevronRight, FiCheck, FiX, FiClock, FiTruck } from 'react-icons/fi';
import EnquiryForm from '@/components/forms/EnquiryForm';
import ProductCard from '@/components/products/ProductCard';
import { IProduct } from '@/types';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { useBuyerAuth } from '@/context/BuyerAuthContext';

const conditionLabels: Record<string, { label: string; bg: string }> = {
  new: { label: 'NEW', bg: 'bg-emerald-500' },
  old: { label: 'USED', bg: 'bg-orange-500' },
  rejected: { label: 'REJECTED', bg: 'bg-red-500' },
};

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showEnquiry, setShowEnquiry] = useState(searchParams.get('enquiry') === 'true');
  const { isApproved, buyer } = useBuyerAuth();
  const canSeePrice = isApproved;

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProduct(d.data);
          const catId = typeof d.data.category === 'object' ? d.data.category._id : d.data.category;
          if (catId) {
            fetch(`/api/products?category=${catId}&limit=4`)
              .then((r) => r.json())
              .then((rd) => {
                if (rd.success) {
                  setRelated(rd.data.filter((p: IProduct) => p._id !== d.data._id).slice(0, 4));
                }
              });
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-slate-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
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

  const catObj = typeof product.category === 'object' ? product.category as { name: string; slug?: string } : null;
  const categoryName = catObj?.name || '';
  const categorySlug = catObj?.slug || '';
  const subObj = typeof product.subcategory === 'object' && product.subcategory ? product.subcategory as { name: string; slug?: string } : null;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
  const whatsappMsg = `Hi, I'm interested in: *${product.name}*\n\nPlease share pricing and availability details.\n\nThank you.`;

  const cond = conditionLabels[product.condition] || conditionLabels.new;

  const availabilityConfig: Record<string, { label: string; icon: typeof FiCheck; color: string }> = {
    in_stock: { label: 'In Stock', icon: FiCheck, color: 'text-green-600 bg-green-50' },
    out_of_stock: { label: 'Out of Stock', icon: FiX, color: 'text-red-600 bg-red-50' },
    on_demand: { label: 'On Demand', icon: FiClock, color: 'text-amber-600 bg-amber-50' },
    make_to_order: { label: 'Make to Order', icon: FiTruck, color: 'text-blue-600 bg-blue-50' },
  };
  const avail = availabilityConfig[product.availability] || availabilityConfig.in_stock;
  const AvailIcon = avail.icon;

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
            <Link href="/" className="hover:text-amber-600">Home</Link>
            <FiChevronRight size={14} />
            <Link href="/products" className="hover:text-amber-600">Products</Link>
            {categoryName && (
              <>
                <FiChevronRight size={14} />
                <Link href={`/products?category=${categorySlug}`} className="hover:text-amber-600">{categoryName}</Link>
              </>
            )}
            {subObj && (
              <>
                <FiChevronRight size={14} />
                <Link href={`/products?category=${categorySlug}&subcategory=${subObj.slug}`} className="hover:text-amber-600">{subObj.name}</Link>
              </>
            )}
            <FiChevronRight size={14} />
            <span className="text-slate-800 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image gallery */}
          <div>
            <div className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden mb-4">
              {product.images && product.images.length > 0 ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
              <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full text-white ${cond.bg}`}>
                {cond.label}
              </span>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImage ? 'border-amber-500' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {product.video && (
              <div className="mt-4 rounded-xl overflow-hidden">
                <video controls className="w-full rounded-xl" poster={product.images?.[0]}>
                  <source src={product.video} />
                </video>
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            {categoryName && (
              <Link href={`/products?category=${categorySlug}`} className="text-xs font-semibold text-amber-600 uppercase tracking-wider hover:underline">{categoryName}</Link>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{product.name}</h1>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              {product.showPrice && product.price ? (
                canSeePrice ? (
                  <span className="text-3xl font-bold text-slate-800">{formatPrice(product.price)}</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-slate-400 blur-sm select-none" aria-hidden>₹XX,XXX</span>
                    <Link
                      href={buyer ? '#' : '/login'}
                      className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      {buyer ? '⏳ Pending approval' : '🔒 Login to see price'}
                    </Link>
                  </div>
                )
              ) : (
                <span className="text-lg font-semibold text-amber-600">Contact for Price</span>
              )}
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${avail.color}`}>
                <AvailIcon size={14} />
                {avail.label}
              </span>
            </div>

            {product.moq && (
              <p className="text-sm text-slate-500 mt-2">Minimum Order: <span className="font-medium text-slate-700">{product.moq}</span></p>
            )}

            {product.description && (
              <div className="mt-6 prose prose-slate prose-sm max-w-none">
                <h3 className="text-base font-semibold text-slate-800 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-semibold text-slate-800 mb-3">Specifications</h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className={`flex ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                      <div className="w-1/3 px-4 py-2.5 text-sm font-medium text-slate-600 border-r border-slate-200">{spec.key}</div>
                      <div className="flex-1 px-4 py-2.5 text-sm text-slate-800">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a
                href={getWhatsAppLink(whatsappNumber, whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
              >
                <FaWhatsapp size={20} />
                WhatsApp Enquiry
              </a>
              <button
                onClick={() => setShowEnquiry(!showEnquiry)}
                className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
              >
                {showEnquiry ? 'Hide Form' : 'Send Enquiry'}
              </button>
            </div>

            {/* Enquiry form */}
            {showEnquiry && (
              <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Send Enquiry</h3>
                <EnquiryForm productName={product.name} productId={product._id} compact />
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
