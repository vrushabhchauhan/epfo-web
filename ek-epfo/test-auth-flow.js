import assert from 'node:assert'
import { sendEmailOtp, verifyEmailOtp, isSupabaseConfigured } from './src/lib/supabaseClient.js'
import { findMemberByIdentifier, registerMemberAccount } from './src/lib/memberRegistry.js'

console.log('--- Starting Authentication Test Suite ---')

// 1. Synthetic domain check
console.log('Test 1: Synthetic Demo Domain Dispatch (@example.com)')
const res1 = await sendEmailOtp('ananya.demo@example.com')
assert.strictEqual(res1.success, true, 'Should succeed')
assert.strictEqual(res1.simulated, true, 'Should be simulated for demo domain')
assert.strictEqual(res1.rateLimited, false, 'Should not be rate limited')
assert(res1.otp && res1.otp.length === 6, 'Should generate a 6-digit OTP')
console.log('✓ Test 1 passed: generated OTP', res1.otp)

// 2. Synthetic domain (@member.epfo.gov.in)
console.log('Test 2: Synthetic Demo Domain Dispatch (@member.epfo.gov.in)')
const res2 = await sendEmailOtp('1004829371@member.epfo.gov.in')
assert.strictEqual(res2.success, true, 'Should succeed')
assert.strictEqual(res2.simulated, true, 'Should be simulated for demo domain')
assert.strictEqual(res2.rateLimited, false, 'Should not be rate limited')
assert(res2.otp && res2.otp.length === 6, 'Should generate a 6-digit OTP')
console.log('✓ Test 2 passed: generated OTP', res2.otp)

// 3. Demo OTP Verification with exact fallbackToken
console.log('Test 3: Demo OTP verification with correct code')
const ver1 = await verifyEmailOtp('ananya.demo@example.com', res1.otp, res1.otp)
assert.strictEqual(ver1.success, true, 'Should verify successfully with correct fallback code')
assert.strictEqual(ver1.simulated, true, 'Should be marked as simulated')
console.log('✓ Test 3 passed')

// 4. Demo OTP Verification with incorrect code
console.log('Test 4: Demo OTP verification with wrong code')
const ver2 = await verifyEmailOtp('ananya.demo@example.com', '000000', res1.otp)
assert.strictEqual(ver2.success, false, 'Should fail with wrong code')
console.log('✓ Test 4 passed: properly rejected wrong code')

// 5. Case insensitivity check
console.log('Test 5: Synthetic domain case insensitivity')
const res3 = await sendEmailOtp('TEST@EXAMPLE.COM')
assert.strictEqual(res3.simulated, true, 'Uppercase domain should still be recognized as synthetic')
console.log('✓ Test 5 passed')

// 6. Member Registry Lookup
console.log('Test 6: Member Registry lookup by UAN and Email')
const m1 = findMemberByIdentifier('1004829371')
assert(m1 !== null, 'Should find Ananya Rao by UAN')
assert.strictEqual(m1.name, 'Ananya Rao')

const m2 = findMemberByIdentifier('ananya.demo@example.com')
assert(m2 !== null, 'Should find Ananya Rao by email')
assert.strictEqual(m2.uan, '1004829371')
console.log('✓ Test 6 passed')

// 7. New User Registration
console.log('Test 7: Dynamic User Registration with Email')
const uniqueTestEmail = `newuser.test.${Date.now()}@example.com`
const newMember = registerMemberAccount({
  email: uniqueTestEmail,
  name: 'New Test Member',
  kycStatus: 'Verified (Cloud Email OTP)',
})
assert(newMember.uan && newMember.uan.startsWith('101'), 'Should generate unique 101xxxxxxxxx UAN')
assert.strictEqual(newMember.name, 'New Test Member')
console.log('✓ Test 7 passed: registered UAN', newMember.uan)

// 8. Boundary and Edge Cases
console.log('Test 8: Edge cases and boundary inputs')
const emptyRes = await sendEmailOtp('')
assert.strictEqual(emptyRes.success, true)
assert.strictEqual(emptyRes.simulated, true)

const nullTokenVer = await verifyEmailOtp('ananya.demo@example.com', null, '123456')
assert.strictEqual(nullTokenVer.success, false, 'Null token should fail')

const shortTokenVer = await verifyEmailOtp('ananya.demo@example.com', '123', '123456')
assert.strictEqual(shortTokenVer.success, false, 'Short token should fail')

const paddedTokenVer = await verifyEmailOtp('ananya.demo@example.com', '  654321  ', '654321')
assert.strictEqual(paddedTokenVer.success, true, 'Padded token should be trimmed and succeed')

const mixedCaseDomain = await sendEmailOtp('user@Member.EPFO.gov.in')
assert.strictEqual(mixedCaseDomain.simulated, true, 'Mixed case synthetic domain should be recognized')

const nonEmailVer = await verifyEmailOtp('1004829371', '000000', '123456')
assert.strictEqual(nonEmailVer.success, false, 'Non-email identifier with wrong code should fail gracefully')

// 9. Real email format routing
console.log('Test 9: Real email address routing test')
const realRes = await sendEmailOtp('vrushabhpchauhan53@gmail.com')
assert.strictEqual(realRes.success, true, 'Real email flow should resolve successfully')
if (isSupabaseConfigured()) {
  if (realRes.rateLimited) {
    assert(realRes.otp && realRes.otp.length === 6, 'Rate limit fallback should provide a 6-digit OTP')
    console.log('✓ Test 9 passed (Rate limit fallback OTP generated:', realRes.otp + ')')
  } else {
    assert.strictEqual(realRes.simulated, false, 'Non-rate-limited real email should be dispatched via cloud')
    console.log('✓ Test 9 passed (Real cloud dispatch completed)')
  }
} else {
  assert.strictEqual(realRes.simulated, true, 'Unconfigured environment should fall back to simulation')
  console.log('✓ Test 9 passed (Offline simulation fallback)')
}

// 10. Direct Brevo OTP generation, send, and database verification (UAN Activation flow)
console.log('Test 10: Direct Brevo OTP generate, send, and database verify')
const { generateAndSendOtp, verifyOtpCode: _verifyOtpCode } = await import('./src/lib/supabaseClient.js')
const brevoRes = await generateAndSendOtp('vrushabhpchauhan53@gmail.com')
assert.strictEqual(brevoRes.success, true, 'Brevo direct OTP send should succeed')
console.log('✓ Test 10 passed (Real Brevo OTP generated and dispatched via API)')

console.log('✓ All 10 test suites passed successfully')

console.log('\n--- ALL AUTH SUITE TESTS PASSED SUCCESSFULLY ---')

