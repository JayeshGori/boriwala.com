'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'light';
  showTagline?: boolean;
}

const sizeMap = {
  sm: { name: 'text-xl', tagline: 'text-[8px]', icon: 'w-7 h-8', gap: 'gap-2' },
  md: { name: 'text-3xl', tagline: 'text-[10px]', icon: 'w-9 h-11', gap: 'gap-2.5' },
  lg: { name: 'text-4xl', tagline: 'text-xs', icon: 'w-11 h-14', gap: 'gap-3' },
  xl: { name: 'text-5xl', tagline: 'text-sm', icon: 'w-14 h-16', gap: 'gap-3.5' },
};

export default function Logo({ size = 'md', variant = 'default', showTagline = true }: LogoProps) {
  const s = sizeMap[size];
  const nameColor = variant === 'light' ? 'text-white' : 'text-[#1a73e8]';
  const taglineColor = variant === 'light' ? 'text-amber-400' : 'text-[#f46f25]';
  const lineColor = variant === 'light' ? 'bg-amber-400' : 'bg-[#f46f25]';

  return (
    <div className={`inline-flex items-center ${s.gap}`}>
      {/* Industrial Sack Bag Icon */}
      <svg
        viewBox="0 0 60 76"
        className={s.icon}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f46f25" />
            <stop offset="100%" stopColor="#ff8c42" />
          </linearGradient>
        </defs>
        {/* Shadow */}
        <ellipse cx="30" cy="72" rx="26" ry="3" fill="rgba(0,0,0,0.12)" />
        {/* Top tied portion */}
        <path
          d="M22 4 Q22 2 24 2 L36 2 Q38 2 38 4 L40 14 Q40 16 38 16 L22 16 Q20 16 20 14 Z"
          fill="#1a73e8"
        />
        {/* String tie */}
        <ellipse cx="30" cy="14" rx="14" ry="2.5" fill="#0d47a1" />
        {/* Bag body - sack shape with rounded bottom */}
        <path
          d="M14 16 Q10 16 9 20 L4 60 Q3 68 12 70 L48 70 Q57 68 56 60 L51 20 Q50 16 46 16 Z"
          fill="url(#bagGradient)"
          stroke="#d45a15"
          strokeWidth="1.5"
        />
        {/* Woven texture - horizontal */}
        <g stroke="white" strokeWidth="0.6" strokeOpacity="0.3">
          <line x1="10" y1="26" x2="50" y2="26" />
          <line x1="9" y1="32" x2="51" y2="32" />
          <line x1="8" y1="38" x2="52" y2="38" />
          <line x1="7" y1="44" x2="53" y2="44" />
          <line x1="7" y1="50" x2="53" y2="50" />
          <line x1="7" y1="56" x2="53" y2="56" />
          <line x1="8" y1="62" x2="52" y2="62" />
        </g>
        {/* Woven texture - vertical */}
        <g stroke="white" strokeWidth="0.6" strokeOpacity="0.3">
          <line x1="16" y1="20" x2="14" y2="66" />
          <line x1="22" y1="18" x2="21" y2="68" />
          <line x1="30" y1="18" x2="30" y2="68" />
          <line x1="38" y1="18" x2="39" y2="68" />
          <line x1="44" y1="20" x2="46" y2="66" />
        </g>
        {/* Highlight */}
        <path
          d="M12 22 Q10 40 13 64"
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.35"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span
          className={`${s.name} ${nameColor} font-[family-name:var(--font-bebas)] tracking-[0.15em]`}
          style={{ letterSpacing: '0.12em' }}
        >
          BORIWALA
        </span>
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`block h-[2px] w-3 ${lineColor} rounded-full`} />
            <span
              className={`${s.tagline} ${taglineColor} font-[family-name:var(--font-poppins)] font-semibold uppercase tracking-[0.25em]`}
            >
              Bags That Matter
            </span>
            <span className={`block h-[2px] w-3 ${lineColor} rounded-full`} />
          </div>
        )}
      </div>
    </div>
  );
}
