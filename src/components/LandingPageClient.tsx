'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { InteractiveComparison } from '@/components/InteractiveComparison';
import { LeadCaptureGate } from '@/components/LeadCaptureGate';
import { Footer } from '@/components/Footer';
import { DebugAnalyticsDrawer } from '@/components/DebugAnalyticsDrawer';
import { trackEvent } from '@/lib/analytics';
import {
  EtfPair,
  PUBLIC_ETF_COMPARISONS,
  LOCKED_ETF_DETAILS,
} from '@/data/etfData';

export const LandingPageClient: React.FC = () => {
  const searchParams = useSearchParams();

  // Variant determination from URL query parameter (utm_content)
  const [variant, setVariant] = useState<'fees' | 'alternatives'>('fees');
  const [pairs, setPairs] = useState<EtfPair[]>(PUBLIC_ETF_COMPARISONS);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const leadGateRef = useRef<HTMLDivElement>(null);

  // Helper to merge unlocked records into the public list
  const applyUnlockedData = (unlockedData: typeof LOCKED_ETF_DETAILS) => {
    setPairs((prev) =>
      prev.map((p) => {
        if (unlockedData[p.id]) {
          return {
            ...p,
            euEtf: unlockedData[p.id].euEtf,
            comparison: unlockedData[p.id].comparison,
          };
        }
        return p;
      })
    );
    setIsUnlocked(true);
  };

  useEffect(() => {
    const utmContent = searchParams.get('utm_content');
    let resolvedVariant: 'fees' | 'alternatives' = 'fees';
    if (utmContent === 'alternatives') {
      resolvedVariant = 'alternatives';
    } else if (utmContent === 'fees') {
      resolvedVariant = 'fees';
    }
    setVariant(resolvedVariant);

    // Secure session verification: Check with server if lead genuinely exists
    try {
      const storedLeadId = localStorage.getItem('etf_lead_id');
      const storedEmail = localStorage.getItem('etf_user_email');

      if (storedLeadId && storedEmail) {
        fetch('/api/leads/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: storedLeadId, email: storedEmail }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.unlockedData) {
              applyUnlockedData(data.unlockedData);
            } else {
              // Non-existent or forged lead: clean local storage
              localStorage.removeItem('etf_lead_id');
              localStorage.removeItem('etf_user_email');
            }
          })
          .catch(() => {
            // Non-blocking on network failure
          });
      }
    } catch {
      // ignore
    }

    trackEvent('landing_view', resolvedVariant, {
      path: window.location.pathname,
      referrer: document.referrer || 'direct',
    });
    trackEvent('variant_displayed', resolvedVariant, {
      resolvedFrom: utmContent ? 'utm_content' : 'default',
    });
  }, [searchParams]);

  const handleScrollToComparison = () => {
    const el = document.getElementById('comparison-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFocusLeadCapture = () => {
    if (leadGateRef.current) {
      leadGateRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = leadGateRef.current.querySelector('input[type="email"]') as HTMLInputElement | null;
      if (input) {
        setTimeout(() => input.focus(), 300);
      }
    }
  };

  const handleUnlocked = (unlockedData: typeof LOCKED_ETF_DETAILS) => {
    applyUnlockedData(unlockedData);
  };

  const handleResetUnlock = () => {
    try {
      localStorage.removeItem('etf_lead_id');
      localStorage.removeItem('etf_user_email');
    } catch {
      // ignore
    }
    setPairs(PUBLIC_ETF_COMPARISONS);
    setIsUnlocked(false);
    trackEvent('comparison_interaction', variant, { action: 'manual_reset_unlock' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 1. Modern Institutional Header */}
      <Header />

      <main className="flex-1">
        {/* 2. Direct Value Hero (Tailored to utm_content with educational preview) */}
        <Hero variant={variant} onScrollToComparison={handleScrollToComparison} />

        {/* 3. The Core ETF Comparison Matrix */}
        <InteractiveComparison
          pairs={pairs}
          isUnlocked={isUnlocked}
          onFocusLeadCapture={handleFocusLeadCapture}
          variant={variant}
        />

        {/* 4. Streamlined Email Lead Gate */}
        <LeadCaptureGate
          ref={leadGateRef}
          isUnlocked={isUnlocked}
          onUnlocked={handleUnlocked}
          variant={variant}
        />
      </main>

      {/* 5. Clean Institutional Footer */}
      <Footer />

      {/* 6. Developer Analytics Audit Drawer (Dev environment only) */}
      <DebugAnalyticsDrawer
        currentVariant={variant}
        isUnlocked={isUnlocked}
        onResetUnlock={handleResetUnlock}
      />
    </div>
  );
};
