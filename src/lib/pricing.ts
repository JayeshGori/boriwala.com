import type { PriceUnit, DispatchStatus } from '@/types';

const UNIT_LABELS: Record<PriceUnit, string> = {
  piece: 'Per Piece',
  kg: 'Per KG',
  set: 'Per Set',
  meter: 'Per Meter',
  roll: 'Per Roll',
  bag: 'Per Bag',
  dozen: 'Per Dozen',
  box: 'Per Box',
};

export function priceUnitLabel(unit?: PriceUnit | string): string {
  if (!unit) return 'Per Piece';
  return UNIT_LABELS[unit as PriceUnit] || 'Per Unit';
}

export function gstSuffix(included?: boolean, rate?: number): string {
  if (included) return `(incl. ${rate ?? 18}% GST)`;
  return `+ ${rate ?? 18}% GST`;
}

export interface DispatchInfo {
  label: string;
  description: string;
  tone: 'green' | 'amber';
}

export function dispatchInfo(status?: DispatchStatus | string, customDays?: number | null): DispatchInfo {
  if (status === 'in_production') {
    const days = customDays && customDays > 0 ? customDays : 7;
    return {
      label: 'In Production',
      description: `Minimum ${days >= 7 ? `${Math.round(days / 7)} week${days >= 14 ? 's' : ''}` : `${days} days`} required for dispatch`,
      tone: 'amber',
    };
  }
  // ready_stock (default)
  const days = customDays && customDays > 0 ? customDays : 2;
  return {
    label: 'Ready Stock',
    description: `Dispatch within ${days} working day${days === 1 ? '' : 's'}`,
    tone: 'green',
  };
}
