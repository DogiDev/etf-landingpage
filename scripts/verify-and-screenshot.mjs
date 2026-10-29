import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.join(process.cwd(), 'public', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('Spouštím Puppeteer pro ověření rozhraní a pořízení screenshotů...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // 1. Varianta alternatives (Mobil 390x844)
  const pageAlt = await browser.newPage();
  await pageAlt.setViewport({ width: 390, height: 844 });
  await pageAlt.goto('http://localhost:3000/?utm_content=alternatives', { waitUntil: 'networkidle0' });
  await pageAlt.screenshot({ path: path.join(SCREENSHOT_DIR, 'variant-alternatives-mobile-390.png') });
  await pageAlt.close();

  // 2. Varianta fees (Mobil 390x844)
  const pageFees = await browser.newPage();
  await pageFees.setViewport({ width: 390, height: 844 });
  await pageFees.goto('http://localhost:3000/?utm_content=fees', { waitUntil: 'networkidle0' });
  await pageFees.screenshot({ path: path.join(SCREENSHOT_DIR, 'variant-fees-mobile-390.png') });

  // 3. Rozbalený glosář
  await pageFees.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const gBtn = btns.find(b => b.textContent && b.textContent.includes('zkratky TER'));
    if (gBtn) gBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await pageFees.screenshot({ path: path.join(SCREENSHOT_DIR, 'glossary-expanded-mobile-390.png') });

  // 4. První srovnání
  await pageFees.evaluate(() => {
    document.getElementById('comparison-section')?.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));
  await pageFees.screenshot({ path: path.join(SCREENSHOT_DIR, 'first-comparison-mobile-390.png') });

  // 5. Odemknutí formulářem
  const emailInput = await pageFees.$('input[type="email"]');
  if (emailInput) {
    await emailInput.type('jan.novak@seznam.cz');
    const submitBtn = await pageFees.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();
    await new Promise(r => setTimeout(r, 1500));
    await pageFees.screenshot({ path: path.join(SCREENSHOT_DIR, 'unlocked-comparison-mobile-390.png') });
  }
  await pageFees.close();

  // 6. Desktop (1440x900)
  const pageDesk = await browser.newPage();
  await pageDesk.setViewport({ width: 1440, height: 900 });
  await pageDesk.goto('http://localhost:3000/?utm_content=alternatives', { waitUntil: 'networkidle0' });
  await pageDesk.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-1440x900-alternatives.png') });
  await pageDesk.close();

  await browser.close();
  console.log('Všechny testy a screenshoty úspěšně dokončeny.');
}

run().catch(err => {
  console.error('Chyba při běhu skriptu:', err);
  process.exit(1);
});

