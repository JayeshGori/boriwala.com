'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import type { IProduct } from '@/types';

interface Props {
  productId: string;
  categoryId?: string;
}

type Section = {
  key: string;
  title: string;
  subtitle: string;
  items: IProduct[];
};

export default function RelatedProductsSection({ productId, categoryId }: Props) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      const result: Section[] = [];
      const seen = new Set<string>([productId]);

      try {
        // 1) Related from same category
        if (categoryId) {
          const r = await fetch(`/api/products?category=${categoryId}&limit=8`).then((r) => r.json());
          if (r?.success) {
            const items = (r.data as IProduct[])
              .filter((p) => !seen.has(p._id))
              .slice(0, 4);
            items.forEach((i) => seen.add(i._id));
            if (items.length > 0) {
              result.push({
                key: 'related',
                title: 'Related Products',
                subtitle: 'From the same category',
                items,
              });
            }
          }
        }

        // 2) Featured products (fill out if related are few)
        if (result[0]?.items.length !== 4) {
          const f = await fetch('/api/products?featured=true&limit=8').then((r) => r.json());
          if (f?.success) {
            const items = (f.data as IProduct[])
              .filter((p) => !seen.has(p._id))
              .slice(0, 4);
            items.forEach((i) => seen.add(i._id));
            if (items.length > 0) {
              result.push({
                key: 'featured',
                title: 'Featured Products',
                subtitle: 'Most popular picks from Boriwala',
                items,
              });
            }
          }
        }

        // 3) New Arrivals (latest products from any category)
        const n = await fetch('/api/products?sort=newest&limit=8').then((r) => r.json());
        if (n?.success) {
          const items = (n.data as IProduct[])
            .filter((p) => !seen.has(p._id))
            .slice(0, 4);
          if (items.length > 0) {
            result.push({
              key: 'new',
              title: 'New Arrivals',
              subtitle: 'Recently added products',
              items,
            });
          }
        }
      } catch {
        // Silent
      }

      if (alive) {
        setSections(result);
        setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [productId, categoryId]);

  if (loading) {
    return (
      <div className="mt-16">
        <div className="h-7 w-48 bg-slate-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (sections.length === 0) return null;

  return (
    <div className="mt-16 space-y-12">
      {sections.map((sec) => (
        <section key={sec.key}>
          <div className="flex items-end justify-between mb-5 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{sec.title}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{sec.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {sec.items.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
