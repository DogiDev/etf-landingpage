import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Srovnání ETF: NYSE vs. Evropské UCITS alternativy | Přehled pro investory 2026',
  description:
    'Srozumitelné srovnání vybraných ETF z New York Stock Exchange a jejich evropských UCITS alternativ. Reálná nákladovost (TER), burzy, ISIN a věcné rozdíly ve strategiích.',
  keywords: [
    'ETF srovnání',
    'NYSE ETF',
    'UCITS alternativy',
    'TER poplatky',
    'investování pro začátečníky',
    'DRLL',
    'SHOC',
    'BOND',
    'BUXX',
    'BCEM',
  ],
  authors: [{ name: 'ETF Srovnávač pro ČR' }],
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className="scroll-smooth bg-slate-50 text-slate-900">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
