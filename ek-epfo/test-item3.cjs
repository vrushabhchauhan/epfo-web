// Verify Item 3
const { generateChatResponse } = require('./src/lib/chatAssistant.js');
const assert = require('assert');

(async () => {
  console.log('--- VERIFY ITEM 3: Chat Assistant Regex Order ---');

  const uanResp = generateChatResponse('how do I activate my UAN');
  console.log('UAN response:', uanResp);
  assert.ok(uanResp.includes('/uan/activate') || uanResp.includes('UAN') || uanResp.includes('activate'), 'Should return UAN activation rule');
  assert.ok(!uanResp.includes('I am a digital assistant'), 'Should not be the generic fallback');

  const grvResp = generateChatResponse('how do I file a grievance');
  console.log('Grievance response:', grvResp);
  assert.ok(grvResp.includes('grievance') || grvResp.includes('EPFiGMS'), 'Should return grievance rule');
  
  const pbResp = generateChatResponse('how do I check my passbook');
  console.log('Passbook response:', pbResp);
  assert.ok(pbResp.includes('passbook') || pbResp.includes('balance'), 'Should return passbook rule');

  console.log('✓ ITEM 3 VERIFICATION PASSED');
})();

