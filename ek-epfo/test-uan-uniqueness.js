// Test UAN uniqueness against live Supabase database and collision avoidance
import assert from 'node:assert';
import { generateUniqueUan } from './src/lib/memberRegistry.js';
import { checkUanExists, supabase, isSupabaseConfigured } from './src/lib/supabaseClient.js';

async function runUanUniquenessTests() {
  console.log('=== TEST 1: Supabase checkUanExists() function ===');
  console.log('Is Supabase configured:', isSupabaseConfigured());
  
  // Test with a known seed UAN
  const existingCheck = await checkUanExists('101928374650');
  console.log('Check for seeded UAN 101928374650 in DB:', existingCheck);

  // Test with non-existent random UAN
  const randomNonExistent = '101999999999';
  const nonExistentCheck = await checkUanExists(randomNonExistent);
  console.log(`Check for ${randomNonExistent} in DB:`, nonExistentCheck);

  console.log('\n=== TEST 2: Generate two UANs in separate contexts ===');
  const uan1 = await generateUniqueUan();
  console.log('Generated UAN 1:', uan1);
  assert.strictEqual(typeof uan1, 'string', 'UAN must be string');
  assert.strictEqual(uan1.length, 12, 'UAN must be exactly 12 digits');
  assert.match(uan1, /^101\d{9}$/, 'UAN must start with 101');

  const uan2 = await generateUniqueUan();
  console.log('Generated UAN 2:', uan2);
  assert.strictEqual(typeof uan2, 'string', 'UAN must be string');
  assert.strictEqual(uan2.length, 12, 'UAN must be exactly 12 digits');
  assert.match(uan2, /^101\d{9}$/, 'UAN must start with 101');

  assert.notStrictEqual(uan1, uan2, 'Two generated UANs must be completely distinct');
  console.log('✓ Both UANs are 12 digits and unique');

  console.log('\n=== TEST 3: Cross-check live DB existence for both UANs ===');
  const uan1InDb = await checkUanExists(uan1);
  const uan2InDb = await checkUanExists(uan2);
  console.log(`UAN 1 (${uan1}) exists in DB:`, uan1InDb);
  console.log(`UAN 2 (${uan2}) exists in DB:`, uan2InDb);
  assert.strictEqual(uan1InDb, false, 'Generated UAN 1 must not pre-exist in DB');
  assert.strictEqual(uan2InDb, false, 'Generated UAN 2 must not pre-exist in DB');

  console.log('\n=== ALL UAN UNIQUENESS & COLLISION TESTS PASSED! ===');
}

runUanUniquenessTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

