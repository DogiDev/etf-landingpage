'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-900 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            ETF
          </div>
          <div>
            <div className="font-bold text-sm sm:text-base tracking-tight text-slate-900 leading-tight">
              Srovnávač ETF fondů
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 leading-none">
              NYSE (USA) vs. Evropské UCITS alternativy
            </div>
          </div>
        </div>

        {/* Verification status */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Ověřeno: 28. 10. 2026</span>
        </div>
      </div>
    </header>
  );
};
