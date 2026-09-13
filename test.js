import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174');
  await new Promise(r => setTimeout(r, 5000)); // wait for React
  
  const content = await page.evaluate(() => document.getElementById('root').innerHTML);
  console.log("ROOT HTML:", content.substring(0, 500));
  
  await browser.close();
})();
