'use client';

import React, { useState, forwardRef } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, Lock } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { LOCKED_ETF_DETAILS } from '@/data/etfData';

interface LeadCaptureGateProps {
  isUnlocked: boolean;
  onUnlocked: (unlockedData: typeof LOCKED_ETF_DETAILS) => void;
  variant: 'fees' | 'alternatives';
}

export const LeadCaptureGate = forwardRef<HTMLDivElement, LeadCaptureGateProps>(
  ({ isUnlocked, onUnlocked, variant }, ref) => {
    const [email, setEmail] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [consent, setConsent] = useState(true);

    const handleFocus = () => {
      trackEvent('lead_form_start', variant);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email || !email.includes('@') || !email.includes('.')) {
        setStatus('error');
        setErrorMessage('Zadejte prosím platnou e-mailovou adresu (např. jmeno@email.cz).');
        return;
      }

      if (!consent) {
        setStatus('error');
        setErrorMessage('Pro odemknutí je vyžadován souhlas se zpracováním e-mailu.');
        return;
      }

      setStatus('loading');
      setErrorMessage('');

      trackEvent('lead_submit_attempt', variant);

      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            variant,
            hp: honeypot, // Anti-spam honeypot (bots fill hidden field, humans leave blank)
          }),
        });

        const data = await res.json();

        // Only unlock if server genuinely confirms persistent save and delivers the unlocked data
        if (res.ok && data.success && data.unlockedData) {
          setStatus('success');
          trackEvent('lead_submit_success', variant, {
            leadId: data.leadId,
            storage: data.storage,
          });

          try {
            localStorage.setItem('etf_lead_id', data.leadId);
            localStorage.setItem('etf_user_email', email.trim().toLowerCase());
          } catch {
            // ignore
          }

          setTimeout(() => {
            onUnlocked(data.unlockedData);
            trackEvent('comparison_unlocked', variant);

            const el = document.getElementById('comparison-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 400);
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'Uložení kontaktu do databáze selhalo. Zkuste to prosím znovu.');
        }
      } catch {
        setStatus('error');
        setErrorMessage('Chyba spojení se serverem. Zkontrolujte připojení k internetu.');
      }
    };

    if (isUnlocked) {
      return (
        <div ref={ref} className="my-8 max-w-5xl mx-auto px-4">
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Kompletní srovnání všech 5 fondů je odemčeno
                </div>
                <div className="text-xs sm:text-sm text-slate-600">
                  Zbývající fondy (BOND, BUXX a BCEM) jsou nyní plně zobrazeny v přehledu výše.
                </div>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-emerald-800 bg-white border border-emerald-200 px-3 py-1 rounded-full">
              Přístup aktivní
            </span>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className="my-10 max-w-5xl mx-auto px-4 scroll-mt-10">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="max-w-2xl mx-auto text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-3">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zbývají 3 fondy ke srovnání</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Odemkněte zbývající 3 srovnání přímo na této stránce
            </h3>

            <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
              Zatímco první 2 ukázky (energetika a čipy) vidíte výše zdarma, zbývající 3 srovnání – dluhopisový fond <strong className="text-slate-900">BOND</strong>, krátkodobý dolarový výnos <strong className="text-slate-900">BUXX</strong> a rozvíjející se trhy <strong className="text-slate-900">BCEM</strong> – vám odemkneme po zadání e-mailu. Data se ihned zobrazí přímo ve srovnávací tabulce výše včetně ověřených ISIN kódů pro nákup u brokera.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Anti-spam honeypot field - invisible to humans, caught by automated spambots */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="company_website">Prosím nevyplňujte toto pole</label>
                <input
                  type="text"
                  id="company_website"
                  name="company_website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={handleFocus}
                    placeholder="Zadejte váš e-mail (např. jmeno@email.cz)"
                    required
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Ukládám do databáze...</span>
                    </>
                  ) : (
                    <span>Odemknout srovnání</span>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-xl">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex items-start gap-2 pt-1 text-left">
                <input
                  type="checkbox"
                  id="consent-checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="consent-checkbox" className="text-xs text-slate-500 leading-normal cursor-pointer">
                  Souhlasím se zasíláním občasných věcných analýz a aktualizací ETF srovnání pro ČR. Žádný spam, odhlášení je možné kdykoliv jedním klikem.
                </label>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Odemkne se ihned ve srovnání výše</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Žádné stahování souborů ani PDF</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% zdarma bez závazků</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

LeadCaptureGate.displayName = 'LeadCaptureGate';
