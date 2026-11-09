import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneMockupProps {
  children: React.ReactNode;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ children }) => {
  return (
    <div className="relative mx-auto flex justify-center py-4 sm:py-8">
      {/* Phone Outer Chassis */}
      <div className="relative w-full max-w-[390px] h-[844px] bg-[#101513] rounded-[52px] p-3 shadow-[0_25px_70px_rgba(7,61,56,0.35),0_10px_25px_rgba(0,0,0,0.2)] border-[4px] border-slate-700/80 ring-1 ring-white/20 flex flex-col overflow-hidden">
        {/* Antenna bands / bezel details */}
        <div className="absolute top-24 -left-1 w-1 h-8 bg-slate-600/40 rounded-r" />
        <div className="absolute top-36 -left-1 w-1 h-12 bg-slate-600/40 rounded-r" />
        <div className="absolute top-52 -left-1 w-1 h-12 bg-slate-600/40 rounded-r" />
        <div className="absolute top-32 -right-1 w-1 h-16 bg-slate-600/40 rounded-l" />

        {/* Screen Bezel & Container */}
        <div className="relative w-full h-full bg-[#F3F5F4] rounded-[42px] overflow-hidden flex flex-col">
          {/* iOS Status Bar */}
          <div className="h-11 px-7 flex items-center justify-between text-xs font-semibold text-slate-900 bg-white/80 backdrop-blur-md shrink-0 z-40 select-none">
            <span className="font-mono text-xs font-bold tracking-tight">09:41</span>

            {/* Dynamic Island */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 w-28 h-6 bg-[#101513] rounded-full flex items-center justify-end px-2.5 gap-1.5 shadow-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#00796F]/30" />
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-slate-800">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-current" />
            </div>
          </div>

          {/* Interactive Application Screen Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>

          {/* iOS Bottom Home Bar Indicator */}
          <div className="h-5 bg-white shrink-0 flex items-center justify-center pointer-events-none z-40">
            <div className="w-32 h-1 bg-slate-900/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
