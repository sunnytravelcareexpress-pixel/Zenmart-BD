import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const ZenmartLogo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
  showText = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Circular Emblem Logo from User Upload */}
      <div
        className={`${iconSizes[size]} relative flex-shrink-0 rounded-full overflow-hidden shadow-xs border ${
          isLight ? 'border-white/20 bg-white' : 'border-slate-200 bg-white'
        } flex items-center justify-center p-0.5`}
      >
        {!imageError ? (
          <img
            src="/zenmart-logo.png"
            alt="Zenmart - স্মার্ট কেনাকাটা"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          /* SVG vector fallback with same circular gradient and shopping cart growth arrow */
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="circleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0891b2" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" stroke="url(#circleGrad)" strokeWidth="4" fill="#ffffff" />
            <path d="M30 35H40L46 60H65L72 42H44" stroke="#0891b2" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="48" cy="67" r="3.5" fill="#0891b2" />
            <circle cx="63" cy="67" r="3.5" fill="#0891b2" />
            <path d="M42 52L49 43L55 50L72 30M72 30V38M72 30H64" stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className={`font-extrabold ${titleSizes[size]} tracking-tight flex items-baseline`}>
            <span className={isLight ? 'text-white font-bold' : 'text-[#0e4b5c] font-black'}>Zenmart</span>
            <span className="text-[#ea580c] font-black ml-0.5">BD</span>
          </div>
          <span
            className={`font-semibold text-[11px] sm:text-[12px] font-['Hind_Siliguri',_sans-serif] tracking-wide ${
              isLight ? 'text-slate-300' : 'text-[#008a90]'
            }`}
          >
            স্মার্ট কেনাকাটা
          </span>
        </div>
      )}
    </div>
  );
};
