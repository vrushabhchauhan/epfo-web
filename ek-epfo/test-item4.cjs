const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const BASE = 'http://localhost:5173';
  console.log('--- VERIFY ITEM 4: Chat Options Flow ---');

  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  
  // Navigate to site
  await page.goto(BASE + '/');
  
  // Click chat widget button
  console.log('Opening chat widget...');
  await page.click('.chat-widget__toggle');
  await page.waitForTimeout(500);

  // Type "grievance"
  console.log('Typing "grievance"...');
  await page.fill('#epfo-chat-input', 'grievance');
  await page.click('form.chat-widget__form button[type="submit"]');
  await page.waitForTimeout(1000);

  // Check if buttons appeared
  console.log('Checking for quick-reply buttons...');
  const buttons = await page.$$('.chat-option-btn');
  assert.ok(buttons.length >= 2, 'Should have at least 2 option buttons');
  
  const btnTexts = await Promise.all(buttons.map(b => b.innerText()));
  console.log('Found buttons:', btnTexts);
  assert.ok(btnTexts.includes('Escalate Issue'), 'Should have Escalate Issue button');

  // Click Escalate Issue
  console.log('Clicking Escalate Issue...');
  await page.click('.chat-option-btn:has-text("Escalate Issue")');
  await page.waitForTimeout(1000);

  // Verify response
  const messages = await page.$$('.chat-bubble');
  const msgTexts = await Promise.all(messages.map(m => m.innerText()));
  console.log('Chat messages:', msgTexts);
  
  const escalatingMsg = msgTexts.find(m => m.includes('Escalating to field office'));
  assert.ok(escalatingMsg, 'Should append Escalating to field office message');

  console.log('✓ ITEM 4 VERIFICATION PASSED');
  await browser.close();
})();

