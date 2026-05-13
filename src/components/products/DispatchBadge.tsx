'use client';

import { FiTruck, FiClock } from 'react-icons/fi';
import { dispatchInfo } from '@/lib/pricing';
import type { DispatchStatus } from '@/types';

interface Props {
  status?: DispatchStatus | string;
  days?: number | null;
}

export default function DispatchBadge({ status, days }: Props) {
  const info = dispatchInfo(status, days);
  const Icon = info.tone === 'green' ? FiTruck : FiClock;
  const colors =
    info.tone === 'green'
      ? 'bg-green-50 border-green-200 text-green-800'
      : 'bg-amber-50 border-amber-200 text-amber-800';

  return (
    <div className={`inline-flex items-start gap-2 px-3 py-2 border rounded-lg ${colors}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="text-sm leading-tight">
        <p className="font-semibold">{info.label}</p>
        <p className="text-xs opacity-90">{info.description}</p>
      </div>
    </div>
  );
}
