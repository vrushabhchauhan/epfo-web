const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const BASE = 'http://localhost:5173';
  console.log('--- VERIFY ITEM 1: Death Claim Auth Guard ---');

  // Test logged out
  let ctx = await browser.newContext();
  let page = await ctx.newPage();
  await page.goto(BASE + '/claims/new/death/step-1');
  await page.waitForTimeout(1000);
  let url = page.url();
  console.log('Logged out user URL:', url);
  assert.ok(url.includes('/login'), 'Logged out user should be redirected to login');
  await ctx.close();

  // Test logged in
  ctx = await browser.newContext();
  page = await ctx.newPage();
  await page.goto(BASE + '/');
  await page.evaluate(() => {
    localStorage.setItem('ek_epfo_session', JSON.stringify({
      isAuthenticated: true,
      member: { name: 'Test Member', uan: '101123456789', employers: [{ name: 'Test Est', memberId: 'MH/123' }], totalAccumulation: 100 }
    }));
  });
  await page.goto(BASE + '/claims/new/death/step-1');
  await page.waitForTimeout(1000);
  url = page.url();
  console.log('Logged in user URL:', url);
  assert.ok(url.includes('/claims/new/death/step-1'), 'Logged in user should NOT be redirected');
  await ctx.close();

  console.log('✓ ITEM 1 VERIFICATION PASSED');
  await browser.close();
})();

