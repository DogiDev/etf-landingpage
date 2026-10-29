import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 py-10 px-4 text-xs">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Methodology note */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Metodika a ověření dat (Stav k 28. 10. 2026)</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            Tento přehled porovnává ETF s doloženým primárním listingem přímo na hlavní burze New York Stock Exchange (NYSE, MIC kód: <code>XNYS</code>). Fondy obchodované na platformách NYSE Arca nebo Nasdaq nejsou do srovnání zařazeny. Údaje o nákladech (Expense Ratio, Net Expense Ratio, TER) vycházejí přímo z oficiálních podání u americké Komise pro cenné papíry (SEC) a z produktových listů správců (PIMCO, Strive / Empowered Funds, Baron Capital, SSGA / SPDR, VanEck, J.P. Morgan Asset Management).
          </p>
        </div>

        {/* Regulatory disclaimer */}
        <div className="space-y-2 text-slate-500 leading-relaxed border-t border-slate-100 pt-4 text-xs">
          <p>
            <strong>Právní upozornění:</strong> Obsah této stránky má výhradně informativní a vzdělávací charakter a nepředstavuje investiční doporučení, finanční poradenství ani nabídku k nákupu cenných papírů podle zákona č. 256/2004 Sb., o podnikání na kapitálovém trhu. Investování do cenných papírů a ETF fondů je spojeno s rizikem kolísání hodnoty a ztráty investovaného kapitálu. Minulá výkonnost nezaručuje budoucí výnosy.
          </p>
          <p>
            Dostupnost jednotlivých fondů u konkrétního brokera v ČR závisí na vydání dokumentu klíčových informací (KID / PRIIPs) v českém jazyce a na obchodních podmínkách zprostředkovatele.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
          <div>
            © 2026 ETF Srovnávač • Nezávislý přehled pro investory v České republice
          </div>
          <div className="flex items-center gap-4">
            <span>Datum ověření: 28. 10. 2026</span>
            <span>Verze 2.0 (Modern Light UX)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
