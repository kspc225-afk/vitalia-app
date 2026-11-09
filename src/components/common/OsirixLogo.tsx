import React from 'react';

interface OsirixLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  whiteVariant?: boolean;
}

export const OsirixLogo: React.FC<OsirixLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  whiteVariant = false,
}) => {
  const iconSizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Official Clinique Vitalia Emblem in refined slate/grey tones */}
      <div
        className={`${iconSizeMap[size]} rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
          whiteVariant
            ? 'bg-slate-800 border border-slate-700 text-white'
            : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white border border-slate-700/80'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/5 h-3/5 text-slate-100"
        >
          {/* Medical Cross + Vital Wave Monogram */}
          <path d="M12 3v18" />
          <path d="M3 12h5l2-4 4 8 2-4h5" />
        </svg>
      </div>

      {/* Brand typographic signature */}
      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-tight leading-none ${
            size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-3xl'
          } ${whiteVariant ? 'text-white' : 'text-slate-900'}`}
        >
          VITALIA
        </span>
        {showSubtitle && (
          <span
            className={`font-semibold tracking-wider uppercase ${
              size === 'sm' ? 'text-[9px]' : size === 'md' ? 'text-[10px]' : 'text-xs'
            } ${whiteVariant ? 'text-slate-300' : 'text-slate-500'}`}
          >
            Clinique médicale
          </span>
        )}
      </div>
    </div>
  );
};

export const VitaliaLogo = OsirixLogo;
