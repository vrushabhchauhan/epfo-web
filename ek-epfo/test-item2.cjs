const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', err => { errors.push(err.message); });
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const BASE = 'http://localhost:5173';
  
  console.log('--- VERIFY ITEM 2: Form 13 Transfer ---');
  // First go to root to set localstorage
  await page.goto(BASE + '/');
  await page.evaluate(() => {
    localStorage.setItem('ek_epfo_session', JSON.stringify({
      isAuthenticated: true,
      member: { name: 'Test Member', uan: '101123456789', employers: [{ name: 'Test Est', memberId: 'MH/123' }], totalAccumulation: 100 }
    }));
  });
  
  // Navigate directly to /transfers, which should now bypass login since session is in localStorage
  await page.goto(BASE + '/transfers', { waitUntil: 'networkidle' });
  
  console.log('Clicking Initiate Transfer button...');
  await page.click('button:has-text("Initiate New Form 13 Transfer")');
  await page.waitForTimeout(500);
  
  // Fill modal
  await page.click('button[type="submit"]:has-text("Submit Form 13 Transfer Request")');
  await page.waitForTimeout(500);
  
  const historyText = await page.locator('.transfer-history-card tbody').innerText();
  console.log('History table text:\n', historyText);
  
  assert.ok(historyText.includes('TRF-'), 'Expected TRF- id in history');
  // There shouldn't be crash errors.
  const appErrors = errors.filter(e => !e.includes('401') && !e.includes('row-level security'));
  assert.strictEqual(appErrors.length, 0, 'Expected 0 application crash errors, got: ' + JSON.stringify(appErrors));
  
  console.log('✓ ITEM 2 VERIFICATION PASSED');
  await browser.close();
})();

