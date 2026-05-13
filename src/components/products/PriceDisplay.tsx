'use client';

import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { priceUnitLabel, gstSuffix } from '@/lib/pricing';
import type { IProduct } from '@/types';

interface Props {
  product: IProduct;
  canSeePrice: boolean;
  isBuyer: boolean;
  large?: boolean;
}

export default function PriceDisplay({ product, canSeePrice, isBuyer, large = true }: Props) {
  const hasPrice = product.showPrice && typeof product.price === 'number' && product.price > 0;

  if (!hasPrice) {
    return (
      <div className="flex flex-col">
        <span className={`${large ? 'text-2xl' : 'text-lg'} font-bold text-amber-600`}>
          Contact for Best Price
        </span>
        <span className="text-xs text-slate-500 mt-0.5">
          Wholesale &amp; bulk pricing on enquiry
        </span>
      </div>
    );
  }

  const unit = priceUnitLabel(product.priceUnit);
  const gst = gstSuffix(product.gstIncluded, product.gstRate);

  if (!canSeePrice) {
    return (
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className={`${large ? 'text-2xl' : 'text-lg'} font-bold text-slate-400 blur-sm select-none`} aria-hidden>
            ₹XX,XXX
          </span>
          <span className="text-xs font-medium text-slate-500">{unit}</span>
        </div>
        <Link
          href={isBuyer ? '#' : '/login'}
          className="mt-1.5 inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 text-xs font-medium rounded-lg transition-colors w-fit"
        >
          {isBuyer ? '⏳ Pending approval' : '🔒 Login to view price'}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={`${large ? 'text-3xl' : 'text-xl'} font-bold text-slate-900`}>
          {formatPrice(product.price!)}
        </span>
        <span className="text-sm font-semibold text-slate-600">{unit}</span>
      </div>
      <span
        className={`mt-1 text-xs font-semibold inline-flex items-center gap-1 ${
          product.gstIncluded ? 'text-green-700' : 'text-slate-500'
        }`}
      >
        {product.gstIncluded ? (
          <>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            {gst}
          </>
        ) : (
          gst
        )}
      </span>
    </div>
  );
}
