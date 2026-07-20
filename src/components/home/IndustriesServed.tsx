'use client';

import {
  FiSun,
  FiHome,
  FiBox,
  FiDroplet,
  FiFeather,
  FiLayers,
  FiScissors,
  FiTruck,
  FiSettings,
  FiShoppingBag,
} from 'react-icons/fi';
import { IconType } from 'react-icons';

interface Industry {
  name: string;
  description: string;
  Icon: IconType;
}

const industries: Industry[] = [
  { name: 'Agriculture', Icon: FiSun, description: 'Grain, seed & produce packaging' },
  { name: 'Construction', Icon: FiHome, description: 'Cement & building material bags' },
  { name: 'Food & Grain', Icon: FiBox, description: 'Food-grade storage & transport' },
  { name: 'Chemicals', Icon: FiDroplet, description: 'Chemical-resistant packaging' },
  { name: 'Fertilizers', Icon: FiFeather, description: 'Fertilizer & agri-input bags' },
  { name: 'Cement', Icon: FiLayers, description: 'Heavy-duty cement sacks' },
  { name: 'Textiles', Icon: FiScissors, description: 'Textile & garment packaging' },
  { name: 'Logistics', Icon: FiTruck, description: 'Shipping & warehousing solutions' },
  { name: 'Manufacturing', Icon: FiSettings, description: 'Industrial raw material packaging' },
  { name: 'Retail', Icon: FiShoppingBag, description: 'Branded retail packaging' },
];

export default function IndustriesServed() {
  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">
            Our Reach
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Industries We Serve</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Trusted packaging solutions across diverse sectors
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {industries.map((ind) => (
            <div
              key={ind.name}
              className="group relative flex flex-col items-center text-center gap-3 p-6 rounded-2xl
                bg-white/5 backdrop-blur-sm border border-white/10
                hover:border-[#1a73e8]/60 hover:shadow-[0_0_24px_rgba(26,115,232,0.15)]
                transition-all duration-300"
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl
                  bg-[#1a73e8]/10 text-[#1a73e8] group-hover:bg-[#1a73e8]/20
                  transition-colors duration-300"
              >
                <ind.Icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold leading-tight">{ind.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{ind.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
