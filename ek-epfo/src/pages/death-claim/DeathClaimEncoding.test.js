import fs from 'node:fs'
import test from 'node:test'
import assert from 'node:assert/strict'

const confirmation = fs.readFileSync(new URL('./DeathClaimConfirmationPage.jsx', import.meta.url), 'utf8')
const step4 = fs.readFileSync(new URL('./DeathClaimStep4Page.jsx', import.meta.url), 'utf8')

test('death claim confirmation text uses clean UTF-8 currency and emoji characters', () => {
  assert.match(confirmation, /₹4,93,600/)
  assert.match(confirmation, /•/)
  assert.match(confirmation, /🖨️ Download \/ Print Acknowledgment Receipt \(PDF\)/)
  assert.match(confirmation, /🔒/)
  assert.doesNotMatch(confirmation, /â‚¹|â€¢|ðŸ|â€”|â–£/)
})

test('death claim step 4 mask and summary use clean UTF-8 symbols', () => {
  assert.match(step4, /₹4,93,600/)
  assert.match(step4, /•/)
  assert.doesNotMatch(step4, /â‚¹|â€¢|â€”|ðŸ/)
})
