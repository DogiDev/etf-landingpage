import React, { Suspense } from 'react';
import { LandingPageClient } from '@/components/LandingPageClient';

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
            <span>Načítám ověřená data ETF...</span>
          </div>
        </div>
      }
    >
      <LandingPageClient />
    </Suspense>
  );
}

