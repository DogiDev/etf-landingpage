// Automatizované ověření externích odkazů z etfData.ts
import { PUBLIC_ETF_COMPARISONS, LOCKED_ETF_DETAILS } from '../src/data/etfData.ts';

const urls = [];

for (const pair of PUBLIC_ETF_COMPARISONS) {
  if (pair.usEtf?.sources) {
    for (const s of pair.usEtf.sources) {
      urls.push({ ticker: pair.usEtf.ticker, title: s.title, url: s.url });
    }
  }
  if (pair.euEtf?.sources) {
    for (const s of pair.euEtf.sources) {
      urls.push({ ticker: pair.euEtf.ticker, title: s.title, url: s.url });
    }
  }
}

for (const [id, details] of Object.entries(LOCKED_ETF_DETAILS)) {
  if (details.euEtf?.sources) {
    for (const s of details.euEtf.sources) {
      urls.push({ id, ticker: details.euEtf.ticker, title: s.title, url: s.url });
    }
  }
}

console.log(`Testuji ${urls.length} zdrojových odkazů...`);

const results = [];
for (const item of urls) {
  try {
    const isSec = item.url.includes('sec.gov');
    const headers = {
      'User-Agent': isSec
        ? 'ETFResearch/1.0 (kontakt@etf-srovnani.cz)'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    };

    const res = await fetch(item.url, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(8000),
    });

    results.push({
      ticker: item.ticker,
      title: item.title,
      status: res.status,
      ok: res.status < 400,
    });
  } catch (err) {
    results.push({
      ticker: item.ticker,
      title: item.title,
      status: 'TIMEOUT/ERR',
      ok: false,
    });
  }
}

console.table(results);

