'use client';

import React, { useState } from 'react';
import { EtfPair } from '@/data/etfData';
import { ExternalLink, ChevronDown, ChevronUp, Lock, HelpCircle, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface InteractiveComparisonProps {
  pairs: EtfPair[];
  isUnlocked: boolean;
  onFocusLeadCapture: () => void;
  variant: 'fees' | 'alternatives';
}

export const InteractiveComparison: React.FC<InteractiveComparisonProps> = ({
  pairs,
  isUnlocked,
  onFocusLeadCapture,
  variant,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'equity' | 'bond'>('all');
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const [showGlossary, setShowGlossary] = useState(false);

  const toggleSources = (id: string) => {
    const nextState = !expandedSources[id];
    setExpandedSources((prev) => ({ ...prev, [id]: nextState }));
    if (nextState) {
      trackEvent('comparison_interaction', variant, {
        action: 'expand_sources',
        pairId: id,
      });
    }
  };

  const filteredPairs = pairs.filter((pair) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'equity') return pair.category === 'equity';
    if (selectedCategory === 'bond') return pair.category === 'bond' || pair.category === 'money-market';
    return true;
  });

  return (
    <section id="comparison-section" className="py-12 px-4 max-w-5xl mx-auto scroll-mt-10">
      {/* Section Introduction */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full inline-block mb-2">
              Hlavní část
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Srovnání ETF: Americké originály z NYSE vs. Evropské alternativy
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Vybrali jsme 5 konkrétních fondů s primárním listingem na parketu New York Stock Exchange a k nim dohledali nejbližší evropské UCITS alternativy s vysvětlením klíčových rozdílů.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                trackEvent('comparison_interaction', variant, { action: 'filter_category', category: 'all' });
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vše (5)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('equity');
                trackEvent('comparison_interaction', variant, { action: 'filter_category', category: 'equity' });
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'equity'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Akcie (3)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('bond');
                trackEvent('comparison_interaction', variant, { action: 'filter_category', category: 'bond' });
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'bond'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dluhopisy (2)
            </button>
          </div>
        </div>

        {/* Human Glossary Dropdown for beginners */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowGlossary(!showGlossary)}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Co znamenají zkratky TER, ISIN, Expense Ratio a UCITS? (Vysvětlení lidskou řečí)</span>
            {showGlossary ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showGlossary && (
            <div className="mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-2.5 leading-relaxed">
              <div>
                <strong className="text-slate-900">TER (Total Expense Ratio) / Expense Ratio:</strong> Celkový roční náklad fondu, který si správce průběžně odečítá z hodnoty investice. Například při TER 0,15 % platíte 150 Kč ročně na každých 100 000 Kč investice. Žádný poplatek neposíláte zvlášť, je už započten v tržní ceně fondu.
              </div>
              <div>
                <strong className="text-slate-900">ISIN kód:</strong> Mezinárodní 12místné identifikační číslo cenného papíru (např. IE00BWBXM492). Stačí jej zkopírovat a vložit do vyhledávání v aplikaci vašeho brokera (např. XTB, Fio, Portu, Degiro), abyste bezpečně našli přesně tento fond.
              </div>
              <div>
                <strong className="text-slate-900">UCITS:</strong> Evropská regulatorní směrnice chránící běžné investory. Fondy s označením UCITS mají přísná pravidla pro rozložení rizika (diverzifikaci) a jsou plně legálně dostupné pro nákup v České republice.
              </div>
              <div>
                <strong className="text-slate-900">Proč mnohá americká ETF nelze u běžných brokerů koupit přímo?</strong> Evropská unie (regulace PRIIPs) vyžaduje od fondů povinný klíčový informační dokument (KID v češtině). Americké fondy na burze NYSE jej nevydávají, protože se řídí americkou komisí SEC. Většina běžných brokerů v ČR proto jejich přímý nákup retailovým investorům nenabízí.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Cards Stack */}
      <div className="space-y-8">
        {filteredPairs.map((pair, index) => {
          const isItemLocked = !pair.isFreePreview && !isUnlocked;
          const isSourcesOpen = !!expandedSources[pair.id];
          const eu = pair.euEtf;
          const comparison = pair.comparison;
          const isReady = !isItemLocked && eu !== null && comparison !== null;

          return (
            <div
              key={pair.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-5 transition-shadow hover:shadow-md"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center font-mono">
                    {index + 1}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {pair.sectorName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {pair.isFreePreview ? (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium px-2.5 py-0.5 rounded-full">
                      Plně otevřená ukázka
                    </span>
                  ) : isUnlocked ? (
                    <span className="bg-slate-100 text-slate-800 font-medium px-2.5 py-0.5 rounded-full">
                      Odemčeno
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Uzamčeno bez e-mailu</span>
                    </span>
                  )}
                  <span className="text-slate-400 hidden sm:inline">• Ověřeno k {pair.verificationDate}</span>
                </div>
              </div>

              {/* Main Comparison Block: Vertical on mobile, 2 columns on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. US Fund Card */}
                <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Americký originál (NYSE)
                      </span>
                      <span className="text-xs bg-slate-200/80 text-slate-700 font-medium px-2 py-0.5 rounded">
                        V ČR bez KID nedostupné
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="text-2xl font-black font-mono tracking-tight text-slate-900">
                        {pair.usEtf.ticker}
                      </span>
                      <div className="text-right">
                        <div className="text-[11px] text-slate-500 leading-none">Roční náklad fondu</div>
                        <div className="text-lg font-bold font-mono text-slate-900">
                          {pair.usEtf.expenseRatioValue.toFixed(2)} % p.a.
                        </div>
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-slate-800 mb-3">
                      {pair.usEtf.name}
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-slate-600 border-t border-slate-200/80 pt-3">
                      <div>
                        <strong className="text-slate-800">Do čeho investuje: </strong>
                        <span>{pair.usEtf.strategy}</span>
                      </div>
                      <div>
                        <strong className="text-slate-800">Sledovaný index: </strong>
                        <span>{pair.usEtf.index}</span>
                      </div>
                      <div>
                        <strong className="text-slate-800">Primární burza: </strong>
                        <span>{pair.usEtf.primaryExchange} (New York Stock Exchange)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                    Správce fondu: {pair.usEtf.manager}
                  </div>
                </div>

                {/* 2. European UCITS Alternative Card */}
                <div className="flex flex-col justify-between">
                  {!isReady || !eu ? (
                    /* Locked State */
                    <div className="h-full min-h-[220px] bg-slate-50 border border-dashed border-slate-300 rounded-xl p-5 flex flex-col justify-center items-start">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Evropská UCITS alternativa
                      </div>
                      <div className="text-base font-bold text-slate-900 mb-2">
                        Evropská alternativa k {pair.usEtf.ticker}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mb-4 max-w-sm leading-relaxed">
                        Konkrétní evropský fond, jeho přesný ISIN kód pro nákup u brokera, poplatek TER a srovnání investičních strategií se odemknou po zadání e-mailu.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          trackEvent('comparison_interaction', variant, {
                            action: 'click_locked_card_btn',
                            pairId: pair.id,
                          });
                          onFocusLeadCapture();
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Odemknout data srovnání e-mailem</span>
                      </button>
                    </div>
                  ) : (
                    /* Unlocked European Data */
                    <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                            Evropská alternativa (UCITS)
                          </span>
                          <span className="text-xs bg-emerald-100/90 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                            Dostupné u brokerů v ČR
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <span className="text-2xl font-black font-mono tracking-tight text-emerald-800">
                            {eu.ticker}
                          </span>
                          <div className="text-right">
                            <div className="text-[11px] text-emerald-800 leading-none">Roční náklad (TER)</div>
                            <div className="text-lg font-bold font-mono text-emerald-700">
                              {eu.terValue.toFixed(2)} % p.a.
                            </div>
                          </div>
                        </div>

                        <div className="text-sm font-semibold text-slate-800 mb-3">
                          {eu.name}
                        </div>

                        <div className="space-y-2 text-xs sm:text-sm text-slate-600 border-t border-emerald-200/60 pt-3">
                          <div>
                            <strong className="text-slate-800">Kód pro brokera (ISIN): </strong>
                            <span className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300 text-xs font-semibold">
                              {eu.isin}
                            </span>
                          </div>
                          <div>
                            <strong className="text-slate-800">Do čeho investuje: </strong>
                            <span>{eu.strategy}</span>
                          </div>
                          <div>
                            <strong className="text-slate-800">Burzy v Evropě: </strong>
                            <span>{eu.exchanges.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-800 font-medium">
                        Třída fondu: {eu.distributionType}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Strategic Difference & Context (Visible when unlocked) */}
              {isReady && eu && comparison && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
                  {/* Cost comparison difference */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <span className="text-xs font-semibold text-slate-600 uppercase">
                      Porovnání nákladů a správy:
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
                      {comparison.feeDifferenceContext}
                    </span>
                  </div>

                  {/* Bullet points explaining the differences */}
                  <div className="text-xs sm:text-sm text-slate-700 space-y-2">
                    <div className="font-semibold text-slate-900">
                      V čem se fondy konkrétně liší:
                    </div>
                    {comparison.keyDifferences.map((diff, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{diff}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Primary Sources */}
                  <div className="pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => toggleSources(pair.id)}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>
                        Oficiální zdroje a prospekty emitentů ({pair.usEtf.sources.length + eu.sources.length})
                      </span>
                      {isSourcesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isSourcesOpen && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-semibold text-slate-500 uppercase">
                            Zdroje amerického fondu (NYSE):
                          </div>
                          {pair.usEtf.sources.map((src, i) => (
                            <a
                              key={i}
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                trackEvent('comparison_interaction', variant, {
                                  action: 'click_source',
                                  url: src.url,
                                  ticker: pair.usEtf.ticker,
                                });
                              }}
                              className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs"
                            >
                              <span className="truncate pr-2 font-medium">{src.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            </a>
                          ))}
                        </div>

                        <div className="space-y-1.5">
                          <div className="text-[11px] font-semibold text-slate-500 uppercase">
                            Zdroje evropského UCITS fondu:
                          </div>
                          {eu.sources.map((src, i) => (
                            <a
                              key={i}
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                trackEvent('comparison_interaction', variant, {
                                  action: 'click_source',
                                  url: src.url,
                                  ticker: eu.ticker,
                                });
                              }}
                              className="flex items-center justify-between p-2.5 bg-white border border-emerald-200 rounded-lg text-emerald-800 hover:text-emerald-900 hover:border-emerald-400 transition-colors shadow-2xs"
                            >
                              <span className="truncate pr-2 font-medium">{src.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
