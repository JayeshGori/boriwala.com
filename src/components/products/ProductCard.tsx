import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { FiMessageSquare } from 'react-icons/fi';
import { IProduct } from '@/types';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';

interface ProductCardProps {
  product: IProduct;
}

const conditionConfig: Record<string, { label: string; bg: string }> = {
  new: { label: 'NEW', bg: 'bg-emerald-500' },
  old: { label: 'USED', bg: 'bg-orange-500' },
  rejected: { label: 'REJECTED', bg: 'bg-red-500' },
};

const availConfig: Record<string, { label: string; color: string }> = {
  in_stock: { label: 'In Stock', color: 'text-green-600' },
  out_of_stock: { label: 'Out of Stock', color: 'text-red-500' },
  on_demand: { label: 'On Demand', color: 'text-amber-600' },
  make_to_order: { label: 'Make to Order', color: 'text-blue-600' },
};

export default function ProductCard({ product }: ProductCardProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
  const whatsappMessage = `Hi, I'm interested in: *${product.name}*\nPlease share pricing and availability details.`;

  const categoryName = typeof product.category === 'object' && product.category
    ? (product.category as { name: string }).name
    : '';

  const cond = conditionConfig[product.condition] || conditionConfig.new;
  const avail = availConfig[product.availability] || availConfig.in_stock;

  // Show up to 3 key specs
  const keySpecs = product.specifications?.slice(0, 3) || [];

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all overflow-hidden flex flex-col">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.images[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full text-white ${cond.bg}`}>
            {cond.label}
          </span>
          {product.isFeatured && (
            <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500 text-white">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between">
          {categoryName && (
            <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">{categoryName}</span>
          )}
          <span className={`text-xs font-medium ${avail.color}`}>{avail.label}</span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-slate-800 mt-1 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Key specs */}
        {keySpecs.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {keySpecs.map((s, i) => (
              <p key={i} className="text-xs text-slate-500 truncate">
                <span className="font-medium text-slate-600">{s.key}:</span> {s.value}
              </p>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-slate-100 mt-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              {product.showPrice && product.price ? (
                <span className="text-base font-bold text-slate-800">{formatPrice(product.price)}</span>
              ) : (
                <span className="text-xs font-medium text-amber-600">Contact for Price</span>
              )}
              {product.moq && (
                <span className="block text-xs text-slate-400">MOQ: {product.moq}</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/products/${product.slug}?enquiry=true`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FiMessageSquare size={13} /> Enquiry
            </Link>
            <a
              href={getWhatsAppLink(whatsappNumber, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FaWhatsapp size={14} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
