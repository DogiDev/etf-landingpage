export interface EtfSource {
  title: string;
  url: string;
  type: 'official' | 'prospectus' | 'justetf' | 'sec';
  note?: string;
}

export interface EtfPair {
  id: string;
  sectorName: string;
  category: 'equity' | 'bond' | 'money-market';
  isFreePreview: boolean;
  usEtf: {
    ticker: string;
    name: string;
    primaryExchange: string; // Must be NYSE (XNYS)
    expenseRatioLabel: string;
    expenseRatioValue: number;
    strategy: string;
    index: string;
    inceptionDate: string;
    manager: string;
    sources: EtfSource[];
  };
  euEtf: {
    ticker: string;
    name: string;
    isin: string;
    exchanges: string[];
    terLabel: string;
    terValue: number;
    strategy: string;
    index: string;
    distributionType: 'Accumulating' | 'Distributing' | 'Acc & Dist';
    currency: string;
    sources: EtfSource[];
  } | null; // null when locked in public payload
  comparison: {
    feeDifference: number; // raw arithmetic difference
    feeDifferenceContext: string; // Explains what the difference means
    keyDifferences: string[];
    indexComparison: string;
    czechInvestorContext: string;
  } | null;
  verificationDate: string;
}

/**
 * ETF Data Architecture & Security Boundary:
 * 
 * 1. PUBLIC_ETF_COMPARISONS:
 *    Shipped in the initial client HTML/JS bundle for all visitors.
 *    - Pairs 1 & 2 (DRLL vs SXLE, SHOC vs SMH): Full data shown immediately (Freemium Teaser).
 *    - Pairs 3, 4, 5 (BUXX, BOND, BCEM): Contains ONLY the US ETF teaser information.
 *      The European UCITS counterpart (euEtf) and detailed strategic comparison (comparison)
 *      are set to null. They CANNOT be extracted by inspecting the initial client JavaScript bundle.
 * 
 * 2. LOCKED_ETF_DETAILS:
 *    Retained strictly on the server and exported to API routes (/api/leads and /api/leads/verify).
 *    Delivered over HTTP only after a genuine database confirmation of lead persistence.
 */
export const PUBLIC_ETF_COMPARISONS: EtfPair[] = [
  {
    id: 'drll-vs-sxle',
    sectorName: 'Americká energetika',
    category: 'equity',
    isFreePreview: true,
    usEtf: {
      ticker: 'DRLL',
      name: 'Strive U.S. Energy ETF',
      primaryExchange: 'NYSE',
      expenseRatioLabel: 'Expense Ratio',
      expenseRatioValue: 0.41,
      strategy: 'Pasivní expozice vůči americkým energetickým společnostem (ExxonMobil, Chevron, ConocoPhillips). Klade důraz na návratnost kapitálu.',
      index: 'Bloomberg US Energy Select Index (od 11. 4. 2024)',
      inceptionDate: '8. 8. 2022',
      manager: 'EA Advisers (Empowered Funds, LLC) / Sub-adviser: Strive Asset Management, LLC',
      sources: [
        {
          title: 'Oficiální produktová stránka DRLL',
          url: 'https://www.strivefunds.com/drll',
          type: 'official',
        },
        {
          title: 'Oficiální prospekt Strive (PDF)',
          url: 'https://www.strivefunds.com/documents/FG/strive_funds/fund_docs/638127_Strive_Prospectus.pdf',
          type: 'prospectus',
        },
      ],
    },
    euEtf: {
      ticker: 'SXLE',
      name: 'SPDR S&P U.S. Energy Select Sector UCITS ETF',
      isin: 'IE00BWBXM492',
      exchanges: ['Xetra (EUR)', 'LSE (USD)', 'SIX', 'Euronext'],
      terLabel: 'TER (Total Expense Ratio)',
      terValue: 0.15,
      strategy: 'Pasivní replikace amerického energetického sektoru s pravidly diverzifikace UCITS.',
      index: 'S&P Energy Select Sector Daily Capped 35/20 Index',
      distributionType: 'Accumulating',
      currency: 'USD (obchodovatelné i v EUR)',
      sources: [
        {
          title: 'Oficiální produktový profil SSGA / SPDR',
          url: 'https://www.ssga.com/uk/en_gb/intermediary/etfs/funds/spdr-sp-us-energy-select-sector-ucits-etf-sxle-gy',
          type: 'official',
        },
        {
          title: 'Nezávislý profil JustETF',
          url: 'https://www.justetf.com/en/etf-profile.html?isin=IE00BWBXM492',
          type: 'justetf',
        },
      ],
    },
    comparison: {
      feeDifference: 0.26,
      feeDifferenceContext: 'Pasivní sektorové indexy – SPDR má o 0,26 % p.a. nižší nákladovost.',
      keyDifferences: [
        'Rozdíl v indexu a cappingu: DRLL sleduje Bloomberg US Energy Select Index (bez cappingu vah), zatímco SPDR sleduje S&P Energy Select Sector Daily Capped 35/20 Index (největší společnost smí tvořit max. 35 % fondu, ostatní max. 20 % dle UCITS pravidel; změna z dřívějšího 25/20 cappingu proběhla v březnu 2025).',
        'Dostupnost v ČR (PRIIPs): SPDR má vydaný evropský KID a je přímo k dispozici u českých brokerů; DRLL evropský KID nevydává.',
      ],
      indexComparison: 'Oba fondy drží prakticky totožné jádro americké energetiky (Exxon, Chevron), SPDR má však navíc regulatorní zastropování maximální váhy jedné akcie.',
      czechInvestorContext: 'Akumulační třída SPDR automaticky reinvestuje dividendy uvnitř fondu.',
    },
    verificationDate: '28. 10. 2026',
  },
  {
    id: 'shoc-vs-smh',
    sectorName: 'Polovodiče & AI hardware',
    category: 'equity',
    isFreePreview: true,
    usEtf: {
      ticker: 'SHOC',
      name: 'Strive U.S. Semiconductor ETF',
      primaryExchange: 'NYSE',
      expenseRatioLabel: 'Expense Ratio',
      expenseRatioValue: 0.40,
      strategy: 'Pasivní expozice vůči americkým polovodičovým lídrům (Nvidia, Broadcom, AMD, Qualcomm).',
      index: 'Bloomberg US Listed Semiconductors Select Total Return Index (od 21. 3. 2024)',
      inceptionDate: '5. 10. 2022',
      manager: 'EA Advisers (Empowered Funds, LLC) / Sub-adviser: Strive Asset Management, LLC',
      sources: [
        {
          title: 'Oficiální produktová stránka SHOC',
          url: 'https://www.strivefunds.com/shoc',
          type: 'official',
        },
        {
          title: 'Oficiální prospekt Strive (PDF)',
          url: 'https://www.strivefunds.com/documents/FG/strive_funds/fund_docs/638127_Strive_Prospectus.pdf',
          type: 'prospectus',
        },
      ],
    },
    euEtf: {
      ticker: 'SMH / VVSM',
      name: 'VanEck Semiconductor UCITS ETF',
      isin: 'IE00BMC38736',
      exchanges: ['Xetra (EUR)', 'LSE (USD)', 'Euronext Amsterdam', 'Borsa Italiana'],
      terLabel: 'TER (Total Expense Ratio)',
      terValue: 0.35,
      strategy: 'Pasivní expozice 25 největším světovým výrobcům polovodičů s limitem 10 % váhy na jednu společnost.',
      index: 'MarketVector US Listed Semiconductor 10% Capped Screened Index',
      distributionType: 'Accumulating',
      currency: 'USD (obchodovatelné i v EUR na Xetře)',
      sources: [
        {
          title: 'Oficiální produktový profil VanEck Europe',
          url: 'https://www.vaneck.com/nl/en/investments/semiconductor-etf/',
          type: 'official',
        },
        {
          title: 'Nezávislý profil JustETF',
          url: 'https://www.justetf.com/en/etf-profile.html?isin=IE00BMC38736',
          type: 'justetf',
        },
      ],
    },
    comparison: {
      feeDifference: 0.05,
      feeDifferenceContext: 'Pasivní sektorové indexy – VanEck má o 0,05 % p.a. nižší nákladovost.',
      keyDifferences: [
        'Omezení koncentrace: VanEck striktně limituje váhu každého jednotlivého titulu na max. 10 % (pravidlo UCITS), SHOC tento evropský strop nemá.',
        'Zahraniční hráči přes ADR: VanEck zahrnuje klíčové neamerické giganty kótované v USA (TSMC, ASML), což SHOC v tomto rozsahu nedělá.',
        'Dostupnost: VanEck splňuje evropskou regulaci UCITS a má vydaný KID.',
      ],
      indexComparison: 'Oba cílí na polovodičový sektor, VanEck však kombinuje globální dodavatelský řetězec a diverzifikační strop.',
      czechInvestorContext: 'Běžně dostupný u brokerů působících v ČR s možností nákupu v EUR i USD.',
    },
    verificationDate: '28. 10. 2026',
  },
  {
    id: 'buxx-vs-jpsa',
    sectorName: 'USD Krátkodobý dluhový výnos',
    category: 'money-market',
    isFreePreview: false,
    usEtf: {
      ticker: 'BUXX',
      name: 'Strive Enhanced Income Short Maturity ETF',
      primaryExchange: 'NYSE',
      expenseRatioLabel: 'Expense Ratio',
      expenseRatioValue: 0.26,
      strategy: 'Aktivně řízené ETF zaměřené na krátkodobá aktiva investičního stupně ve strukturovaném úvěru (CLO, ABS) a podnikových dluhopisech s krátkou durací.',
      index: 'Aktivní správa – nesleduje pasivní index',
      inceptionDate: '9. 8. 2023',
      manager: 'EA Advisers / Sub-advisers: Strive Asset Management & Angel Oak Capital Advisors, LLC',
      sources: [
        {
          title: 'Oficiální produktová stránka BUXX',
          url: 'https://www.strivefunds.com/buxx',
          type: 'official',
        },
        {
          title: 'Oficiální prospekt BUXX (PDF)',
          url: 'https://www.strivefunds.com/documents/FG/strive_funds/fund_docs/638178_Strive_Prospectus.pdf',
          type: 'prospectus',
        },
      ],
    },
    euEtf: null, // Gated until verified email save
    comparison: null,
    verificationDate: '28. 10. 2026',
  },
  {
    id: 'bond-vs-usag',
    sectorName: 'Americký trh dluhopisů celkově',
    category: 'bond',
    isFreePreview: false,
    usEtf: {
      ticker: 'BOND',
      name: 'PIMCO Active Bond Exchange-Traded Fund',
      primaryExchange: 'NYSE',
      expenseRatioLabel: 'Net Expense Ratio 0,54 % (Gross: 0,56 %)',
      expenseRatioValue: 0.54,
      strategy: 'Aktivně řízené portfolio kvalitních amerických dluhopisů investičního stupně. Manažeři PIMCO aktivně řídí duraci a výběr emisí.',
      index: 'Srovnávací benchmark: Bloomberg U.S. Aggregate Index',
      inceptionDate: '29. 2. 2012 (převod na parket NYSE: 14. 11. 2022)',
      manager: 'Pacific Investment Management Company LLC (PIMCO)',
      sources: [
        {
          title: 'Produktová stránka PIMCO Active Bond',
          url: 'https://www.pimco.com/us/en/investments/etf/pimco-active-bond-exchange-traded-fund/usetf-usd',
          type: 'official',
        },
        {
          title: 'Hlášení SEC Form N-CSR potvrzující listing NYSE',
          url: 'https://www.sec.gov/Archives/edgar/data/1450011/000119312526382370/d105698dncsr.htm',
          type: 'sec',
        },
      ],
    },
    euEtf: null,
    comparison: null,
    verificationDate: '28. 10. 2026',
  },
  {
    id: 'bcem-vs-jrem',
    sectorName: 'Akcie rozvíjejících se trhů (Emerging Markets)',
    category: 'equity',
    isFreePreview: false,
    usEtf: {
      ticker: 'BCEM',
      name: 'Baron Emerging Markets Select ETF',
      primaryExchange: 'NYSE',
      expenseRatioLabel: 'Total Annual Fund Operating Expenses',
      expenseRatioValue: 0.80,
      strategy: 'Aktivně řízené akciové ETF zaměřené na koncentrovaný výběr lídrů s vysokým růstovým potenciálem na rozvíjejících se trzích.',
      index: 'Srovnávací benchmark: MSCI Emerging Markets Index',
      inceptionDate: '8. 4. 2026',
      manager: 'BAMCO, Inc. (Baron Capital Group)',
      sources: [
        {
          title: 'Produktová stránka Baron Capital BCEM',
          url: 'https://www.baroncapitalgroup.com/product-detail/baron-emerging-markets-select-etf-bcem',
          type: 'official',
        },
        {
          title: 'Prospekt SEC Form 485BPOS',
          url: 'https://www.sec.gov/Archives/edgar/data/2081199/000119312526063204/d20607d485bpos.htm',
          type: 'sec',
        },
      ],
    },
    euEtf: null,
    comparison: null,
    verificationDate: '28. 10. 2026',
  },
];

// 2. PROTECTED DATA: Delivered by server ONLY after successful lead persistence in database
export const LOCKED_ETF_DETAILS: Record<
  string,
  {
    euEtf: NonNullable<EtfPair['euEtf']>;
    comparison: NonNullable<EtfPair['comparison']>;
  }
> = {
  'buxx-vs-jpsa': {
    euEtf: {
      ticker: 'JPSA / JPPA',
      name: 'JPMorgan USD Ultra-Short Income Active UCITS ETF',
      isin: 'IE00BG8BCY43',
      exchanges: ['Xetra (EUR)', 'LSE (USD)', 'Borsa Italiana', 'SIX'],
      terLabel: 'TER (Total Expense Ratio)',
      terValue: 0.18,
      strategy: 'Aktivně řízené institucionální portfolio krátkodobých dluhopisů v USD investičního stupně, komerčních cenných papírů a bankovních depozit.',
      index: 'Aktivní správa – benchmark ICE BofA US 3-Month Treasury Bill Index',
      distributionType: 'Accumulating',
      currency: 'USD',
      sources: [
        {
          title: 'Oficiální stránka J.P. Morgan Asset Management',
          url: 'https://am.jpmorgan.com/gb/en/asset-management/adv/products/jpm-usd-ultra-short-income-ucits-etf-usd-acc-ie00bg8bcy43',
          type: 'official',
        },
        {
          title: 'Nezávislý profil JustETF',
          url: 'https://www.justetf.com/en/etf-profile.html?isin=IE00BG8BCY43',
          type: 'justetf',
        },
      ],
    },
    comparison: {
      feeDifference: 0.08,
      feeDifferenceContext: 'Aktivní správa – JPMorgan má TER 0,18 % vs. BUXX 0,26 % p.a.',
      keyDifferences: [
        'Odlišné úvěrové riziko: BUXX využívá sub-advisora Angel Oak s významným podílem strukturovaných úvěrů (CLO). JPMorgan drží konzervativnější portfolio institucionálních firemních dluhopisů a bankovních depozit.',
        'Akumulační třída (Acc): Evropský JPSA reinvestuje výnosy přímo do hodnoty podílového listu.',
        'Regulace: BUXX pro český retail postrádá KID, JPSA je v ČR plně dostupný.',
      ],
      indexComparison: 'Oba fondy jsou aktivně spravované pro generování pravidelného výnosu v USD při duraci pod 1 rok.',
      czechInvestorContext: 'Vhodné pro držení volné dolarové hotovosti s výnosem navázaným na sazby Fedu.',
    },
  },
  'bond-vs-usag': {
    euEtf: {
      ticker: 'USAG',
      name: 'SPDR Bloomberg U.S. Aggregate Bond UCITS ETF',
      isin: 'IE00B459R192',
      exchanges: ['Xetra (EUR)', 'LSE (USD)', 'Euronext', 'SIX'],
      terLabel: 'TER (Total Expense Ratio)',
      terValue: 0.17,
      strategy: 'Pasivní replikace celého amerického dluhopisového trhu investičního stupně.',
      index: 'Bloomberg U.S. Aggregate Index',
      distributionType: 'Distributing',
      currency: 'USD',
      sources: [
        {
          title: 'Oficiální stránka SSGA / SPDR',
          url: 'https://www.ssga.com/uk/en_gb/intermediary/etfs/funds/spdr-bloomberg-us-aggregate-bond-ucits-etf-dist-usag-gy',
          type: 'official',
        },
        {
          title: 'Nezávislý profil JustETF',
          url: 'https://www.justetf.com/en/etf-profile.html?isin=IE00B459R192',
          type: 'justetf',
        },
        {
          title: 'Alternativa iShares Core US Aggregate (IUAA, Acc)',
          url: 'https://www.justetf.com/en/etf-profile.html?isin=IE00BYXYYM63',
          type: 'justetf',
          note: 'ISIN IE00BYXYYM63, TER 0,25 % (akumulační varianta)',
        },
      ],
    },
    comparison: {
      feeDifference: 0.37,
      feeDifferenceContext: 'Aktivní správa (PIMCO 0,54 % net) vs. pasivní index (SPDR 0,17 % TER).',
      keyDifferences: [
        'Aktivní vs. pasivní přístup: U fondu PIMCO platíte manažerům poplatek 0,54 % za pokus překonat trh aktivním časováním durace. SPDR za 0,17 % pouze pasivně kopíruje index.',
        'Poplatkový waiver u PIMCO: Smluvní snížení poplatku (waiver) na 0,54 % má v oficiální dokumentaci stanovenou platnost do 31. 10. 2026. Pokud nedojde k jeho prodloužení, uplatní se základní hrubá nákladovost Gross Expense Ratio 0,56 % (čímž by rozdíl oproti SPDR 0,17 % vzrostl na 0,39 p.b.). Platnost waiveru po 31. 10. 2026 je nutné v materiálech PIMCO revalidovat.',
        'Rozdíl 0,37 % neodráží stejný produkt: Nejde o identickou službu za nižší cenu, ale o volbu mezi aktivním manažerem a nízkonákladovým pasivním indexem.',
      ],
      indexComparison: 'Oba fondy se poměřují vůči stejnému benchmarku Bloomberg U.S. Aggregate Index.',
      czechInvestorContext: 'Základní složka konzervativní části portfolia pro vyvážení akcií.',
    },
  },
  'bcem-vs-jrem': {
    euEtf: {
      ticker: 'JREM / JREA',
      name: 'JPMorgan Global Emerging Markets Active UCITS ETF',
      isin: 'IE00BF4G6Z54',
      exchanges: ['Xetra (EUR)', 'LSE (USD)', 'Borsa Italiana', 'SIX'],
      terLabel: 'TER (Total Expense Ratio)',
      terValue: 0.30,
      strategy: 'Aktivně řízené ETF využívající fundamentální výzkum a kvantitativní modely J.P. Morgan pro výběr titulů rozvíjejících se trhů.',
      index: 'Srovnávací benchmark: MSCI Emerging Markets Index',
      distributionType: 'Accumulating',
      currency: 'USD (obchodovatelné i v EUR)',
      sources: [
        {
          title: 'Oficiální produktový profil J.P. Morgan',
          url: 'https://am.jpmorgan.com/gb/en/asset-management/adv/products/jpmorgan-global-emerging-markets-research-enhanced-index-equity-esg-active-ucits-etf-usd-acc-ie00bf4g6z54',
          type: 'official',
        },
        {
          title: 'Nezávislý profil JustETF',
          url: 'https://www.justetf.com/en/etf-profile.html?isin=IE00BF4G6Z54',
          type: 'justetf',
        },
      ],
    },
    comparison: {
      feeDifference: 0.50,
      feeDifferenceContext: 'Koncentrovaný aktivní výběr (Baron 0,80 %) vs. kvantitativní model (JPMorgan 0,30 %).',
      keyDifferences: [
        'Zásadní odlišnost strategií: Baron BCEM je koncentrovaný výběr vysoce růstových firem s poplatkem 0,80 %, zatímco JPMorgan za 0,30 % uplatňuje kvantitativně řízenou diverzifikovanou strategii. Nejde o přímou kopii portfolia!',
        'Dostupnost pro EU retail: Baron BCEM nemá evropský KID a pro běžného českého retailového investora není u brokerů přímo dostupný.',
        'Rozdíl 0,50 % p.a. reflektuje odlišnou filozofii správy aktiv, nikoliv pouhou slevu na stejném portfoliu.',
      ],
      indexComparison: 'Oba fondy mají stejný srovnávací benchmark (MSCI Emerging Markets Index).',
      czechInvestorContext: 'Expozice na rozvíjející se trhy (Čína, Indie, Tchaj-wan, Brazílie) v režimu UCITS.',
    },
  },
};
