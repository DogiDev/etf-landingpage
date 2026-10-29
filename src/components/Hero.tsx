'use client';

import React from 'react';
import { ArrowDown, CheckCircle2, ChevronRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface HeroProps {
  variant: 'fees' | 'alternatives';
  onScrollToComparison: () => void;
}

export const Hero: React.FC<HeroProps> = ({ variant, onScrollToComparison }) => {
  const isAlternatives = variant === 'alternatives';

  const handleCtaClick = () => {
    trackEvent('comparison_interaction', variant, { action: 'hero_cta_click' });
    onScrollToComparison();
  };

  return (
    <section className="bg-white border-b border-slate-200/80 pt-8 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy (Left column on desktop, full width on mobile) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Nezávislé srovnání pro investory v ČR</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.2] mb-4">
              {isAlternatives
                ? 'Mnohá americká ETF nejsou u běžných brokerů dostupná. Zde jsou jejich evropské alternativy.'
                : 'Kolik stojí ETF zalistovaná na burze NYSE a jak se liší od evropských alternativ?'}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
              {isAlternatives
                ? 'Z důvodu chybějícího klíčového informačního dokumentu (PRIIPs KID) většina běžných brokerů v EU neumožňuje retailovým klientům přímý nákup těchto amerických fondů. Připravili jsme přehled evropských UCITS alternativ se stejným zaměřením, ověřenými ISIN kódy a srozumitelným vysvětlením rozdílů.'
                : 'Srovnáváme vybraná ETF s primárním listingem na burze NYSE a jejich evropské UCITS protějšky. Podívejte se na roční poplatky (Expense Ratio vs. TER), sledované indexy a zjistěte, proč odlišná nákladovost nemusí znamenat identickou investiční strategii.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleCtaClick}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Prohlédnout srovnání fondů</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <div className="text-xs text-slate-500 flex items-center gap-2 justify-center sm:justify-start px-2 py-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>První 2 srovnání níže ihned zdarma</span>
              </div>
            </div>
          </div>

          {/* Educational Visual Preview Snippet (Right column on desktop) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Náhled: Jak srovnání funguje
              </div>

              {/* Mini US card */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 mb-2.5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900 font-mono text-sm">DRLL</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    USA • Burza NYSE
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-medium">Strive U.S. Energy ETF</div>
                <div className="mt-2 text-xs text-slate-500 flex items-baseline justify-between">
                  <span>Poplatek správce:</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">0,41 % ročně</span>
                </div>
              </div>

              {/* Connecting difference badge */}
              <div className="flex items-center justify-center my-1 text-xs text-slate-500 font-medium gap-1">
                <span className="h-px bg-slate-200 flex-1" />
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-semibold">
                  Rozdíl v nákladech: 0,26 % p.a.
                </span>
                <span className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Mini EU card */}
              <div className="bg-white border border-emerald-200/80 rounded-xl p-3.5 mt-2.5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-700 font-mono text-sm">SXLE</span>
                  <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">
                    Evropa (UCITS) • V ČR dostupné
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-medium">SPDR S&P U.S. Energy UCITS ETF</div>
                <div className="mt-2 text-xs text-slate-500 flex items-baseline justify-between">
                  <span>Roční náklad (TER):</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">0,15 % ročně</span>
                </div>
              </div>

              <p className="mt-3 text-[12px] text-slate-500 leading-normal">
                💡 <strong>Věcný rozdíl:</strong> Oba fondy drží americké ropné giganty (Exxon, Chevron). Evropský fond však uplatňuje regulatorní indexový strop 35/20 – největší společnost smí tvořit max. 35 % fondu a ostatní max. 20 % (v souladu s UCITS pravidly).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
