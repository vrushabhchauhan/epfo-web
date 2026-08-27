import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || ''
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || ''

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'))
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Dynamic OTP generator for demo / SMS simulation / rate-limit fallback
function generateRandomOtp(email) {
  const code = String(Math.floor(100000 + Math.random() * 900000))
  try {
    if (typeof window !== 'undefined') {
      if (email) sessionStorage.setItem(`pending_otp_${email}`, code)
      sessionStorage.setItem('pending_otp_last', code)
    }
  } catch {
    // Fallback on storage error
  }
  return code
}

// Real Email OTP Auth
export async function sendEmailOtp(email) {
  const cleanEmail = (email || '').trim().toLowerCase()
  const isSyntheticDemo = !cleanEmail || !cleanEmail.includes('@') || cleanEmail.endsWith('@member.epfo.gov.in') || cleanEmail.endsWith('@example.com')

  if (!isSupabaseConfigured() || isSyntheticDemo) {
    const dynamicOtp = generateRandomOtp(cleanEmail)
    return { success: true, simulated: true, otp: dynamicOtp, rateLimited: false }
  }

  try {
    try {
      if (typeof window !== 'undefined') {
        if (cleanEmail) sessionStorage.removeItem(`pending_otp_${cleanEmail}`)
        sessionStorage.removeItem('pending_otp_last')
      }
    } catch {}

    const { data, error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true,
      },
    })
    if (error) {
      const isRateLimit = error.message?.toLowerCase().includes('rate limit') || error.status === 429
      if (isRateLimit) {
        const dynamicOtp = generateRandomOtp(cleanEmail)
        console.warn('Supabase cloud email rate limit reached. Activating dynamic fallback OTP.')
        return { success: true, simulated: true, rateLimited: true, otp: dynamicOtp }
      }
      throw error
    }
    return { success: true, simulated: false, data }
  } catch (err) {
    const isRateLimit = err.message?.toLowerCase().includes('rate limit') || err.status === 429
    if (isRateLimit) {
      const dynamicOtp = generateRandomOtp(cleanEmail)
      return { success: true, simulated: true, rateLimited: true, otp: dynamicOtp }
    }
    console.error('Error sending Supabase OTP:', err.message)
    return { success: false, error: err.message }
  }
}

export async function verifyEmailOtp(email, token, fallbackToken = null) {
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanToken = String(token || '').trim()
  const cleanFallback = String(fallbackToken || '').trim()
  const storedOtp = typeof window !== 'undefined'
    ? (sessionStorage.getItem(`pending_otp_${cleanEmail}`) || sessionStorage.getItem('pending_otp_last'))
    : null

  const isDemoMatch = Boolean(
    (storedOtp && cleanToken === storedOtp.trim()) ||
    (cleanFallback && cleanToken === cleanFallback)
  )

  if (isDemoMatch) {
    try {
      if (cleanEmail && typeof window !== 'undefined') sessionStorage.removeItem(`pending_otp_${cleanEmail}`)
      if (typeof window !== 'undefined') sessionStorage.removeItem('pending_otp_last')
    } catch {}
    return { success: true, simulated: true }
  }

  const isSyntheticDemo = !cleanEmail || !cleanEmail.includes('@') || cleanEmail.endsWith('@member.epfo.gov.in') || cleanEmail.endsWith('@example.com')
  if (!isSupabaseConfigured() || isSyntheticDemo) {
    return { success: false, error: 'Invalid verification code. Please check and re-enter.' }
  }

  if (!cleanToken || cleanToken.length !== 6) {
    return { success: false, error: 'Please enter a valid 6-digit verification code.' }
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'email',
    })
    if (error) {
      throw error
    }
    return { success: true, simulated: false, session: data.session, user: data.user }
  } catch (err) {
    console.error('Error verifying Supabase OTP:', err.message)
    return { success: false, error: err.message }
  }
}

// Cloud Database CRUD operations
export async function getCloudMember(uan) {
  if (!isSupabaseConfigured() || !uan) return null
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
        total_accumulation: memberRecord.totalAccumulation ?? 0,
        employee_share_total: memberRecord.employeeShareTotal ?? 0,
        employer_share_total: memberRecord.employerShareTotal ?? 0,
        eps_pension_fund_total: memberRecord.epsPensionFundTotal ?? 0,
        interest_rate_annual: '8.25%',
        interest_accrued_fy26: memberRecord.interestAccruedFY26 ?? 0,
      }
    ], { onConflict: 'uan' })

    return { success: true, data }
  } catch (err) {
    console.error('Error upserting member to Supabase cloud:', err.message)
    return { success: false, error: err.message }
  }
}

export async function getCloudClaims(uan) {
  if (!isSupabaseConfigured() || !uan) return null
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

export async function getCloudGrievances(uan) {
  if (!isSupabaseConfigured() || !uan) return null
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

export async function getCloudNominees(uan) {
  if (!isSupabaseConfigured() || !uan) return null
  try {
    const { data, error } = await supabase.from('nominees').select('*').eq('uan', uan)
    if (error) throw error
    return data
  } catch (err) {
    console.warn('Cloud nominees fetch fallback:', err.message)
    return null
  }
}

export async function insertCloudNominee(nominee) {
  if (!isSupabaseConfigured()) return { success: true }
  try {
    const { data, error } = await supabase.from('nominees').insert([nominee]).select()
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    console.error('Cloud nominee insert error:', err.message)
    return { success: false, error: err.message }
  }
}

export async function getCloudTransfers(uan) {
  if (!isSupabaseConfigured() || !uan) return null
  try {
    const { data, error } = await supabase.from('transfers').select('*').eq('uan', uan)
    if (error) throw error
    return data
  } catch (err) {
    console.warn('Cloud transfers fetch fallback:', err.message)
    return null
  }
}

export async function insertCloudTransfer(transfer) {
  if (!isSupabaseConfigured()) return { success: true }
  try {
    const { data, error } = await supabase.from('transfers').insert([transfer]).select()
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    console.error('Cloud transfer insert error:', err.message)
    return { success: false, error: err.message }
  }
}

export async function getCloudPublicClaim(claimId) {
  if (!isSupabaseConfigured() || !claimId) return null
  try {
    const { data, error } = await supabase.from('claims').select('*').eq('claim_id', claimId.trim()).maybeSingle()
    if (error) throw error
    return data
  } catch (err) {
    console.warn('Cloud public claim search fallback:', err.message)
    return null
  }
}
