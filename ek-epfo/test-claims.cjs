const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const BASE = 'http://localhost:5173';
  console.log('--- VERIFY CLAIM FIX ---');

  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  
  await page.goto(BASE + '/');
  await page.evaluate(() => {
    localStorage.setItem('ek_epfo_session', JSON.stringify({
      isAuthenticated: true,
      member: { uan: '101492810392', email: 'vrushabhpchauhan53@gmail.com', name: 'Vrushabh Chauhan' }
    }));
  });

  console.log('Navigating to /claims...');
  await page.goto(BASE + '/claims', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); 
  
  const claimsText = await page.locator('.claims-layout').innerText();
  
  assert.ok(claimsText.includes('CLM-REJ-9921'), 'Should have the seeded Rejected claim');
  assert.ok(claimsText.includes('CLM-PEN-3829'), 'Should have the seeded Pending claim');
  assert.ok(claimsText.includes('CLM-SET-1022'), 'Should have the seeded Settled claim');

  console.log('Navigating to /claims/new to submit a new claim...');
  await page.click('a[href="/claims/new"], button:has-text("File a New Claim")');
  await page.waitForTimeout(2000);

  console.log('Filling out form...');
  await page.selectOption('#advance-reason', { value: 'medical' }).catch(() => {});
  await page.fill('#claim-amount', '5000').catch(() => {});
  
  const submitBtn = await page.locator('button[type="submit"]');
  if (await submitBtn.count() > 0) {
    await submitBtn.click();
    console.log('Clicked submit');
    await page.waitForTimeout(3000); 
  } else {
    console.log('Could not find submit button');
  }

  console.log('Clicking "View All Claims"...');
  await page.click('a:has-text("View All Claims")').catch(() => page.goto(BASE + '/claims', { waitUntil: 'networkidle' }));
  await page.waitForTimeout(3000);
  
  const finalClaimsText = await page.locator('.claims-layout').innerText();
  
  assert.ok(finalClaimsText.includes('4 Records'), 'Should now have 4 claims');
  
  console.log('✓ CLAIM BUG FIX VERIFICATION FINISHED (UI script run complete)');
  await browser.close();
})();

