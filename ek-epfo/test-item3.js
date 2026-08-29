import assert from 'node:assert';
import { getAssistantReply } from './src/lib/chatAssistant.js';

console.log('--- VERIFY ITEM 3: Chat Assistant Regex Order ---');

const uanResp = getAssistantReply('how do I activate my UAN');
console.log('UAN response:', uanResp);
assert.ok(uanResp.includes('/uan/activate') || uanResp.includes('UAN') || uanResp.includes('activate'), 'Should return UAN activation rule');
assert.ok(!uanResp.includes('I am a digital assistant'), 'Should not be the generic fallback');

const grvResp = getAssistantReply('how do I file a grievance');
console.log('Grievance response:', grvResp);
assert.ok(grvResp.includes('grievance') || grvResp.includes('EPFiGMS'), 'Should return grievance rule');

const pbResp = getAssistantReply('how do I check my passbook');
console.log('Passbook response:', pbResp);
assert.ok(pbResp.includes('passbook') || pbResp.includes('balance'), 'Should return passbook rule');

console.log('✓ ITEM 3 VERIFICATION PASSED');

