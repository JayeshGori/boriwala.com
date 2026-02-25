import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { IProduct } from '@/types';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
  const whatsappMessage = `Hi, I'm interested in: ${product.name}. Please share more details and pricing.`;

  const categoryName = typeof product.category === 'object' && product.category
    ? (product.category as { name: string }).name
    : '';

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all overflow-hidden">
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
          {/* Condition badge */}
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full ${
            product.condition === 'new'
              ? 'bg-emerald-500 text-white'
              : 'bg-orange-500 text-white'
          }`}>
            {product.condition === 'new' ? 'NEW' : 'USED'}
          </span>
          {product.isFeatured && (
            <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500 text-white">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        {categoryName && (
          <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">{categoryName}</span>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-base font-semibold text-slate-800 mt-1 line-clamp-2 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.shortDescription && (
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.shortDescription}</p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div>
            {product.showPrice && product.price ? (
              <span className="text-lg font-bold text-slate-800">{formatPrice(product.price)}</span>
            ) : (
              <span className="text-sm font-medium text-amber-600">Contact for Price</span>
            )}
            {product.moq && (
              <span className="block text-xs text-slate-400">MOQ: {product.moq}</span>
            )}
          </div>
          <a
            href={getWhatsAppLink(whatsappNumber, whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="WhatsApp enquiry"
            onClick={(e) => e.stopPropagation()}
          >
            <FaWhatsapp size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
