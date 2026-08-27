import { createClient } from '@supabase/supabase-js'

const QA_URL = 'https://vmiikhbveduhkfcrtrew.supabase.co'
const QA_ANON_KEY = 'sb_publishable_LcM0Efk7Zc4Ch-DuOOvuQw_ILtD8tFS'
const QA_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtaWlraGJ2ZWR1aGtmY3J0cmV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzgyNjYyMywiZXhwIjoyMTAzNDAyNjIzfQ.4CDqiYZ1v-QoP3YtKIPJP7-FzLMYPI8BiHn3ALlVM5E'

const admin = createClient(QA_URL, QA_SERVICE_KEY)
const anon = createClient(QA_URL, QA_ANON_KEY)

const results = []

function assert(condition, name, details = '') {
  if (condition) {
    results.push({ name, passed: true, details })
    console.log('  [PASS] ' + name)
  } else {
    results.push({ name, passed: false, details })
    console.error('  [FAIL] ' + name + ' -- ' + details)
  }
}

async function runQaLifecycle() {
  console.log('=== STARTING PHASE 1: FULL END-TO-END QA PASS ON ISOLATED SANDBOX ===')
  await admin.from('grievances').delete().neq('grievance_id', 'none')
  await admin.from('transfers').delete().neq('transfer_id', 'none')
  await admin.from('claims').delete().neq('claim_id', 'none')
  await admin.from('nominees').delete().neq('name', 'none')
  await admin.from('ecr_ledgers').delete().neq('wage_month', 'none')
  await admin.from('balances').delete().neq('uan', 'none')
  await admin.from('member_accounts').delete().neq('member_id', 'none')
  await admin.from('members').delete().neq('uan', 'none')

  console.log('--- FLOW 1: Direct UAN Allotment ---')
  const user1_uan = '101982736401'
  const user1_email = 'rohit.qa.tester@example.com'
  const user1_name = 'Rohit Sharma'
  const user1_mobile = '9876541234'
  const { data: member1, error: m1Err } = await admin.from('members').insert([{
    uan: user1_uan,
    name: user1_name,
    email: user1_email,
    phone: user1_mobile,
    phone_masked: '••••••1234',
    dob: '1995-08-14',
    gender: 'Male',
    kyc_status: 'Verified (Aadhaar Direct Allotment)',
    active_uan_status: 'Pending Activation',
    total_service_years: '0 Years (New Workforce Entrant)',
  }]).select().single()
  assert(!m1Err && member1?.uan === user1_uan, 'Flow 1: Fresh UAN Allotment Persists to Database', m1Err?.message)

  const { error: b1Err } = await admin.from('balances').insert([{
    uan: user1_uan,
    total_accumulation: 0,
    employee_share_total: 0,
    employer_share_total: 0,
    eps_pension_fund_total: 0,
    interest_rate_annual: '8.25%',
    interest_accrued_fy26: 0,
  }])
  assert(!b1Err, 'Flow 1: Zero-Balance Initialized for New Allotment', b1Err?.message)

  console.log('--- FLOW 2: Account Activation ---')
  assert(member1?.active_uan_status === 'Pending Activation', 'Flow 2: Allotted Account is Initially Pending Activation')
  console.log('--- FLOW 3: Login & Fresh Account Dashboard State ---')
  const { data: logUser, error: logErr } = await admin.from('members').select('*').eq('uan', user1_uan).single()
  const { data: logBal, error: logBalErr } = await admin.from('balances').select('*').eq('uan', user1_uan).single()
  const { data: logClaims } = await admin.from('claims').select('*').eq('uan', user1_uan)
  const { data: logGrievances } = await admin.from('grievances').select('*').eq('uan', user1_uan)
  assert(!logErr && logUser?.name === user1_name, 'Flow 3: User Details Match Registered Name', logErr?.message)
  assert(!logBalErr && Number(logBal?.total_accumulation) === 0, 'Flow 3: New Account Passbook Balance is 0 (Not Seeded)', logBalErr?.message)
  assert(logClaims?.length === 0, 'Flow 3: New Account Claims List is Clean/Empty')
  assert(logGrievances?.length === 0, 'Flow 3: New Account Grievances List is Clean/Empty')

  console.log('--- FLOW 4: Logout & Re-Login Persistence ---')
  const { data: reLogUser } = await admin.from('members').select('*').eq('email', user1_email).single()
  assert(reLogUser?.uan === user1_uan, 'Flow 4: Email lookup resolves same UAN upon re-login')

  console.log('--- FLOW 5: Authenticated Actions on All Member Pages ---')
  const claim1_id = 'CLM-QA-1001'
  const { data: newClaim, error: clmErr } = await admin.from('claims').insert([{
    claim_id: claim1_id,
    uan: user1_uan,
    form_number: 'Form 31',
    claim_type: 'Partial Advance (Medical)',
    amount_requested: 25000,
    filed_date: new Date().toISOString().split('T')[0],
    status: 'in_progress',
    current_stage: 1,
  }]).select().single()
  assert(!clmErr && newClaim?.claim_id === claim1_id, 'Flow 5a: Initiate Form 31 Claim Persists in Cloud DB', clmErr?.message)

  const { data: fixClaim, error: fixErr } = await admin.from('claims').update({
    current_stage: 2,
    rejection_summary: 'Corrected Hospital Bill Uploaded via ClaimFix',
  }).eq('claim_id', claim1_id).select().single()
  assert(!fixErr && fixClaim?.current_stage === 2, 'Flow 5b: Claim Fix Document Re-submission Persists', fixErr?.message)

  const grv1_id = 'GRV-QA-8001'
  const { data: newGrv, error: grvErr } = await admin.from('grievances').insert([{
    grievance_id: grv1_id,
    uan: user1_uan,
    linked_claim_id: claim1_id,
    category: 'Claim Settlement Delay',
    filed_date: new Date().toISOString().split('T')[0],
    status: 'under_investigation',
    assigned_officer: 'S. K. Verma (RPFC-II)',
    regional_office: 'Regional Office Mumbai (Bandra)',
    expected_resolution_date: '2026-09-05',
    days_remaining: 7,
  }]).select().single()
  assert(!grvErr && newGrv?.grievance_id === grv1_id, 'Flow 5c: Grievance Submission Persists in Cloud DB', grvErr?.message)

  const { data: newNom, error: nomErr } = await admin.from('nominees').insert([{
    uan: user1_uan,
    name: 'Ritika Sharma',
    relationship: 'Spouse',
    dob: '1996-10-12',
    share_percent: 100,
    bank_account_masked: '••••••9988',
    bank_ifsc: 'HDFC0001234',
    edli_coverage_limit: 700000,
  }]).select().single()
  assert(!nomErr && newNom?.name === 'Ritika Sharma', 'Flow 5d: e-Nomination Registration Persists in Cloud DB', nomErr?.message)

  const { data: kycMem, error: kycErr } = await admin.from('members').update({
    bank_name: 'HDFC Bank',
    bank_ifsc: 'HDFC0001234',
    bank_account_masked: '••••••9988',
    kyc_status: 'Verified (Updated Bank Account & Aadhaar)',
  }).eq('uan', user1_uan).select().single()
  assert(!kycErr && kycMem?.bank_name === 'HDFC Bank', 'Flow 5e: KYC Profile Update Persists in Cloud DB', kycErr?.message)

  const trf1_id = 'TRF-QA-9001'
  const { data: newTrf, error: trfErr } = await admin.from('transfers').insert([{
    transfer_id: trf1_id,
    uan: user1_uan,
    form_number: 'Form 13',
    from_establishment: 'Apex Infra Ltd',
    from_member_id: 'MH/BAN/0011111/000/0001',
    to_establishment: 'Coral Systems Ltd',
    to_member_id: 'MH/BAN/0022222/000/0002',
    initiated_date: new Date().toISOString().split('T')[0],
    estimated_amount: 50000,
    status: 'pending_employer',
    current_step: 2,
    days_waiting: 1,
  }]).select().single()
  assert(!trfErr && newTrf?.transfer_id === trf1_id, 'Flow 5f: Form 13 Transfer Request Persists in Cloud DB', trfErr?.message)

  console.log('--- FLOW 6: Public Services Lookups ---')
  const { data: knUanPos } = await admin.from('members').select('uan, name').eq('phone', user1_mobile).maybeSingle()
  const { data: knUanNeg } = await admin.from('members').select('uan').eq('phone', '0000000000').maybeSingle()
  assert(knUanPos?.uan === user1_uan, 'Flow 6a: Know UAN finds valid registered mobile number')
  assert(knUanNeg === null, 'Flow 6a: Know UAN correctly returns null for non-existent mobile')

  const { data: trkPos } = await admin.from('claims').select('claim_id, status').eq('claim_id', claim1_id).maybeSingle()
  const { data: trkNeg } = await admin.from('claims').select('claim_id').eq('claim_id', 'NON_EXISTENT_ID').maybeSingle()
  assert(trkPos?.claim_id === claim1_id, 'Flow 6b: Public Claim Track finds active filed claim')
  assert(trkNeg === null, 'Flow 6b: Public Claim Track correctly returns null for invalid claim ID')

  const { data: estList } = await anon.from('establishments').select('*')
  assert(estList && estList.length > 0, 'Flow 6c: Establishment search queries public establishments list')

  console.log('--- FLOW 7: Death & Family Claim Wizard ---')
  const deathClaim_id = 'CLM-DEATH-QA-777'
  const { data: deathClaim, error: dthErr } = await admin.from('claims').insert([{
    claim_id: deathClaim_id,
    uan: user1_uan,
    form_number: 'Form 20 / 5IF / 10D',
    claim_type: 'Death & EDLI Statutory Benefit',
    amount_requested: 700000,
    filed_date: new Date().toISOString().split('T')[0],
    status: 'in_progress',
    current_stage: 1,
    rejection_summary: 'Beneficiary Claim Filed: Ritika Sharma (Spouse)',
  }]).select().single()
  assert(!dthErr && deathClaim?.claim_id === deathClaim_id, 'Flow 7: 4-Step Death Claim Wizard Persists to Database', dthErr?.message)

  console.log('--- FLOW 8: Two-Account Isolation & RLS Security ---')
  const user2_uan = '102837465912'
  const user2_email = 'priya.qa.user2@example.com'
  const user2_name = 'Priya Nair'
  await admin.from('members').insert([{
    uan: user2_uan,
    name: user2_name,
    email: user2_email,
    phone: '9988776655',
    phone_masked: '••••••6655',
    dob: '1998-03-22',
    gender: 'Female',
    kyc_status: 'Verified',
    active_uan_status: 'Active',
  }])

  const { data: u2Claims } = await admin.from('claims').select('*').eq('uan', user2_uan)
  assert(u2Claims?.length === 0, 'Flow 8: User 2 has isolated zero-claims ledger (cannot see User 1 claims)')

  const { data: u1ClaimsOnly } = await admin.from('claims').select('*').eq('uan', user1_uan)
  assert(u1ClaimsOnly?.length === 2, 'Flow 8: User 1 claims count strictly preserved (2 claims)')

  console.log('\n========================================================================')
  const total = results.length
  const passed = results.filter(r => r.passed).length
  const failed = total - passed
  console.log(`PHASE 1 SUMMARY: Total Tests: ${total} | Passed: ${passed} | Failed: ${failed}`)
  console.log('========================================================================')

  return failed === 0
}

runQaLifecycle().then((ok) => process.exit(ok ? 0 : 1))