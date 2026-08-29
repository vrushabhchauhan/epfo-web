const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const BASE = 'http://localhost:5173';
  console.log('--- VERIFY GRIEVANCES FIX ---');

  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  
  await page.goto(BASE + '/');
  await page.evaluate(() => {
    localStorage.setItem('ek_epfo_session', JSON.stringify({
      isAuthenticated: true,
      member: { uan: '101492810392', email: 'vrushabhpchauhan53@gmail.com', name: 'Vrushabh Chauhan' }
    }));
  });

  console.log('Navigating to /grievance...');
  await page.goto(BASE + '/grievance', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); 
  
  const text = await page.locator('.grievance-layout').innerText();
  console.log(text.substring(0, 500));
  
  assert.ok(text.includes('PF withdrawal claim pending') || text.includes('pending beyond SLA'), 'Should have the OPEN grievance');
  assert.ok(text.includes('KYC name mismatch') || text.includes('resolved') || text.includes('Resolved'), 'Should have the RESOLVED grievance');
  assert.ok(text.includes('Incorrect employer contribution'), 'Should have the ESCALATED grievance');
  assert.ok(text.includes('CLM-PEN-3829') || text.includes('CLM-REJ-9921'), 'Should show the linked transaction ID');
  
  console.log('✓ GRIEVANCES BUG FIX VERIFICATION FINISHED');
  await browser.close();
})();
