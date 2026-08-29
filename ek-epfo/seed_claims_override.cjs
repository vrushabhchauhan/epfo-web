require('dotenv').config({ path: '.env.qa' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://vmiikhbveduhkfcrtrew.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.qa");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const uan = '101492810392';
  
  // First delete any existing to avoid duplicates
  await supabase.from('claims').delete().eq('uan', uan);

  const dummyClaims = [
    {
      claim_id: 'CLM-REJ-9921',
      uan,
      form_number: 'Form 31',
      claim_type: 'PF Advance (Illness)',
      amount_requested: 50000,
      filed_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'rejected',
      current_stage: 4,
      rejection_reason_code: 'KYC_MISMATCH',
      rejection_summary: 'Name mismatch with Aadhaar. Please update KYC and reapply.'
    },
    {
      claim_id: 'CLM-PEN-3829',
      uan,
      form_number: 'Form 19',
      claim_type: 'Final PF Settlement',
      amount_requested: 120000,
      filed_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'in_progress',
      current_stage: 2,
      rejection_reason_code: null,
      rejection_summary: null
    },
    {
      claim_id: 'CLM-SET-1022',
      uan,
      form_number: 'Form 31',
      claim_type: 'PF Advance (Marriage)',
      amount_requested: 30000,
      amount_disbursed: 30000,
      filed_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      settled_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'disbursed',
      current_stage: 5,
      rejection_reason_code: null,
      rejection_summary: null
    }
  ];

  const { data, error } = await supabase.from('claims').insert(dummyClaims).select();
  if (error) {
    console.error("Error inserting claims:", error);
  } else {
    console.log("Successfully seeded claims:", data.length);
  }
}

seed();

