const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('http://localhost:5173/donor-register', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'd:\\fularani\\Fularani-Foundation\\screenshot-register.png', fullPage: true });

  await page.goto('http://localhost:5173/donor-register?role=volunteer', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'd:\\fularani\\Fularani-Foundation\\screenshot-volunteer.png', fullPage: true });

  await browser.close();
  console.log('Screenshots taken');
})();
