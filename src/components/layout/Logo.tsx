'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'light';
  showTagline?: boolean;
}

const sizeMap = {
  sm: { name: 'text-xl' },
  md: { name: 'text-3xl' },
  lg: { name: 'text-4xl' },
  xl: { name: 'text-5xl' },
};

export default function Logo({ size = 'md', variant = 'default' }: LogoProps) {
  const s = sizeMap[size];
  const nameColor = variant === 'light' ? 'text-white' : 'text-[#1a73e8]';
  const dotComColor = variant === 'light' ? 'text-amber-400' : 'text-[#f46f25]';

  return (
    <span
      className={`inline-flex items-baseline ${s.name} font-[family-name:var(--font-bebas)] tracking-[0.12em] leading-none`}
    >
      <span className={nameColor}>BORIWALA</span>
      <span className={dotComColor}>.COM</span>
    </span>
  );
}
