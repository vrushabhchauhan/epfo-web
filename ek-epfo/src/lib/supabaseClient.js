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
