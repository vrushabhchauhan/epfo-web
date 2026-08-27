import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'))
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Real Email OTP Auth
export async function sendEmailOtp(email) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase credentials not found. Using simulated OTP delivery.')
    return { success: true, simulated: true, otp: '582914' }
  }

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })
    if (error) throw error
    return { success: true, simulated: false, data }
  } catch (err) {
    console.error('Error sending Supabase OTP:', err.message)
    return { success: false, error: err.message }
  }
}

export async function verifyEmailOtp(email, token) {
  if (!isSupabaseConfigured()) {
    return { success: true, simulated: true }
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    if (error) throw error
    return { success: true, simulated: false, session: data.session, user: data.user }
  } catch (err) {
    console.error('Error verifying Supabase OTP:', err.message)
    return { success: false, error: err.message }
  }
}

// Cloud Database CRUD operations
export async function getCloudMember(uan = '1004829371') {
  if (!isSupabaseConfigured()) return null
  try {
    const { data, error } = await supabase.from('members').select('*').eq('uan', uan).maybeSingle()
    if (error) throw error
    return data
  } catch (err) {
    console.warn('Cloud member fetch fallback:', err.message)
    return null
  }
}

export async function getCloudMemberByEmail(email) {
  if (!isSupabaseConfigured() || !email) return null
  try {
    const { data, error } = await supabase.from('members').select('*').eq('email', email.trim().toLowerCase()).maybeSingle()
    if (error) throw error
    return data
  } catch (err) {
    console.warn('Cloud member email fetch fallback:', err.message)
    return null
  }
}

export async function upsertCloudMember(memberRecord) {
  if (!isSupabaseConfigured() || !memberRecord?.uan) return { success: true }
  try {
    const row = {
      uan: String(memberRecord.uan).trim(),
      name: memberRecord.name || 'Member',
      email: memberRecord.email ? memberRecord.email.trim().toLowerCase() : null,
      phone: memberRecord.phone || memberRecord.mobile || '9876544821',
      phone_masked: memberRecord.phoneMasked || (memberRecord.mobile ? `••••••${String(memberRecord.mobile).slice(-4)}` : '••••••4821'),
      dob: memberRecord.dob || '1992-06-15',
      gender: memberRecord.gender || 'Not specified',
      kyc_status: memberRecord.kycStatus || 'Verified (Aadhaar OTP)',
      bank_name: memberRecord.bankName || 'State Bank of India',
      bank_ifsc: memberRecord.bankIfsc || 'SBIN0001234',
      bank_account_masked: memberRecord.bankAccountMasked || '•••• •••• 4821',
    }

    const { data, error } = await supabase.from('members').upsert([row], { onConflict: 'uan' }).select()
    if (error) throw error

    // Initialize balance record if not present
    await supabase.from('balances').upsert([
      {
        uan: row.uan,
        total_accumulation: memberRecord.totalAccumulation || 493600,
        employee_share_total: memberRecord.employeeShareTotal || 248200,
        employer_share_total: memberRecord.employerShareTotal || 162400,
        eps_pension_fund_total: memberRecord.epsPensionFundTotal || 83000,
        interest_rate_annual: '8.25%',
        interest_accrued_fy26: 18450,
      }
    ], { onConflict: 'uan' })

    return { success: true, data }
  } catch (err) {
    console.error('Error upserting member to Supabase cloud:', err.message)
    return { success: false, error: err.message }
  }
}

export async function getCloudClaims(uan = '1004829371') {
  if (!isSupabaseConfigured()) return null
  try {
    const { data, error } = await supabase.from('claims').select('*').eq('uan', uan).order('filed_date', { ascending: false })
    if (error) throw error
    return data
  } catch (err) {
    console.warn('Cloud claims fetch fallback:', err.message)
    return null
  }
}

export async function insertCloudClaim(claim) {
  if (!isSupabaseConfigured()) return { success: true }
  try {
    const { data, error } = await supabase.from('claims').insert([claim]).select()
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    console.error('Cloud claim insert error:', err.message)
    return { success: false, error: err.message }
  }
}

export async function insertCloudGrievance(grievance) {
  if (!isSupabaseConfigured()) return { success: true }
  try {
    const { data, error } = await supabase.from('grievances').insert([grievance]).select()
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    console.error('Cloud grievance insert error:', err.message)
    return { success: false, error: err.message }
  }
}

export async function getCloudGrievances(uan = '1004829371') {
  if (!isSupabaseConfigured()) return null
  try {
    const { data, error } = await supabase.from('grievances').select('*').eq('uan', uan).order('filed_date', { ascending: false })
    if (error) throw error
    return data
  } catch (err) {
    console.warn('Cloud grievances fetch fallback:', err.message)
    return null
  }
}

export async function updateCloudClaimStatus(claimId, updates) {
  if (!isSupabaseConfigured()) return { success: true }
  try {
    const { data, error } = await supabase.from('claims').update(updates).eq('claim_id', claimId).select()
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    console.error('Cloud claim update error:', err.message)
    return { success: false, error: err.message }
  }
}
