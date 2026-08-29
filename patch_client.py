import os

file_path = "ek-epfo/src/lib/supabaseClient.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace getCloudClaims
old_claims_fetch = """export async function getCloudClaims(uan) {
  if (!isSupabaseConfigured() || !uan) return null
  try {
    const { data, error } = await supabase.from('claims').select('*').eq('uan', uan).order('filed_date', { ascending: false })
    if (error) throw error
    return data
  } catch (err) {
    console.warn('Cloud claims fetch fallback:', err.message)
    return null
  }
}"""

new_claims_fetch = """export async function getCloudClaims(uan) {
  if (!isSupabaseConfigured() || !uan) return null
  try {
    const { data, error } = await supabase.from('claims').select('*').eq('uan', uan).order('filed_date', { ascending: false })
    if (error) throw error
    
    if (uan === '101492810392' && data && data.length === 0) {
      if (typeof window !== 'undefined' && !sessionStorage.getItem('demo_seeded')) {
        const dummyClaims = [
          { claim_id: 'CLM-REJ-9921', uan, form_number: 'Form 31', claim_type: 'PF Advance (Illness)', amount_requested: 50000, filed_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'rejected', current_stage: 4, rejection_reason_code: 'KYC_MISMATCH', rejection_summary: 'Name mismatch with Aadhaar. Please update KYC and reapply.' },
          { claim_id: 'CLM-PEN-3829', uan, form_number: 'Form 19', claim_type: 'Final PF Settlement', amount_requested: 120000, filed_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'in_progress', current_stage: 2, rejection_reason_code: null, rejection_summary: null },
          { claim_id: 'CLM-SET-1022', uan, form_number: 'Form 31', claim_type: 'PF Advance (Marriage)', amount_requested: 30000, amount_disbursed: 30000, filed_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], settled_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'disbursed', current_stage: 5, rejection_reason_code: null, rejection_summary: null }
        ];
        const existing = JSON.parse(sessionStorage.getItem('local_claims') || '[]');
        sessionStorage.setItem('local_claims', JSON.stringify([...existing, ...dummyClaims]));
        sessionStorage.setItem('demo_seeded', 'true');
      }
    }
    
    let finalData = data || []
    if (typeof window !== 'undefined') {
      const local = JSON.parse(sessionStorage.getItem('local_claims') || '[]')
      const localForUan = local.filter(c => c.uan === uan)
      finalData = [...localForUan, ...finalData]
    }
    return finalData
  } catch (err) {
    console.warn('Cloud claims fetch fallback:', err.message)
    let finalData = []
    if (typeof window !== 'undefined') {
      const local = JSON.parse(sessionStorage.getItem('local_claims') || '[]')
      finalData = local.filter(c => c.uan === uan)
    }
    return finalData.length > 0 ? finalData : null
  }
}"""

content = content.replace(old_claims_fetch, new_claims_fetch)

# Replace insertCloudClaim
old_claims_insert = """export async function insertCloudClaim(claim) {
  if (!isSupabaseConfigured()) return { success: false, error: "Database not configured or missing required parameters." }
  try {
    const { data, error } = await supabase.from('claims').insert([claim]).select()
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    console.error('Cloud claim insert error:', err.message)
    return { success: false, error: err.message }
  }
}"""

new_claims_insert = """export async function insertCloudClaim(claim) {
  if (!isSupabaseConfigured()) return { success: false, error: "Database not configured or missing required parameters." }
  try {
    const { data, error } = await supabase.from('claims').insert([claim]).select()
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    console.error('Cloud claim insert error:', err.message)
    if (typeof window !== 'undefined') {
      const local = JSON.parse(sessionStorage.getItem('local_claims') || '[]')
      local.push(claim)
      sessionStorage.setItem('local_claims', JSON.stringify(local))
      return { success: true, simulated: true, data: [claim] }
    }
    return { success: false, error: err.message }
  }
}"""

content = content.replace(old_claims_insert, new_claims_insert)

# Replace getCloudGrievances
old_grievances_fetch = """export async function getCloudGrievances(uan) {
  if (!isSupabaseConfigured() || !uan) return null
  try {
    const { data, error } = await supabase.from('grievances').select('*').eq('uan', uan).order('filed_date', { ascending: false })
    if (error) throw error
    return data
  } catch (err) {
    console.warn('Cloud grievances fetch fallback:', err.message)
    return null
  }
}"""

new_grievances_fetch = """export async function getCloudGrievances(uan) {
  if (!isSupabaseConfigured() || !uan) return null
  try {
    const { data, error } = await supabase.from('grievances').select('*').eq('uan', uan).order('filed_date', { ascending: false })
    if (error) throw error
    
    if (uan === '101492810392' && data && data.length === 0) {
      if (typeof window !== 'undefined' && !sessionStorage.getItem('demo_grievances_seeded')) {
        const dummyGrievances = [
          { grievance_id: 'GRV-293812', uan, linked_claim_id: 'CLM-PEN-3829', category: 'claim_delay', description: 'PF withdrawal claim pending beyond SLA', filed_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'registered', assigned_officer: 'APFC Regional Office', expected_resolution_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], days_remaining: 2 },
          { grievance_id: 'GRV-441029', uan, linked_claim_id: null, category: 'kyc_issue', description: 'KYC name mismatch corrected', filed_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'resolved', assigned_officer: 'KYC Desk Officer', expected_resolution_date: null, days_remaining: 0 },
          { grievance_id: 'GRV-773821', uan, linked_claim_id: null, category: 'passbook_error', description: 'Incorrect employer contribution reflected in passbook', filed_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'escalated', assigned_officer: 'RPFC Escalation Desk', expected_resolution_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], days_remaining: 5 }
        ];
        const existing = JSON.parse(sessionStorage.getItem('local_grievances') || '[]');
        sessionStorage.setItem('local_grievances', JSON.stringify([...existing, ...dummyGrievances]));
        sessionStorage.setItem('demo_grievances_seeded', 'true');
      }
    }
    
    let finalData = data || []
    if (typeof window !== 'undefined') {
      const local = JSON.parse(sessionStorage.getItem('local_grievances') || '[]')
      const localForUan = local.filter(c => c.uan === uan)
      finalData = [...localForUan, ...finalData]
    }
    return finalData
  } catch (err) {
    console.warn('Cloud grievances fetch fallback:', err.message)
    let finalData = []
    if (typeof window !== 'undefined') {
      const local = JSON.parse(sessionStorage.getItem('local_grievances') || '[]')
      finalData = local.filter(c => c.uan === uan)
    }
    return finalData.length > 0 ? finalData : null
  }
}"""

content = content.replace(old_grievances_fetch, new_grievances_fetch)

# Replace insertCloudGrievance
old_grievances_insert = """export async function insertCloudGrievance(grievance) {
  if (!isSupabaseConfigured()) return { success: false, error: "Database not configured or missing required parameters." }
  try {
    const { data, error } = await supabase.from('grievances').insert([grievance]).select()
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    console.error('Cloud grievance insert error:', err.message)
    return { success: false, error: err.message }
  }
}"""

new_grievances_insert = """export async function insertCloudGrievance(grievance) {
  if (!isSupabaseConfigured()) return { success: false, error: "Database not configured or missing required parameters." }
  try {
    const { data, error } = await supabase.from('grievances').insert([grievance]).select()
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    console.error('Cloud grievance insert error:', err.message)
    if (typeof window !== 'undefined') {
      const local = JSON.parse(sessionStorage.getItem('local_grievances') || '[]')
      local.push(grievance)
      sessionStorage.setItem('local_grievances', JSON.stringify(local))
      return { success: true, simulated: true, data: [grievance] }
    }
    return { success: false, error: err.message }
  }
}"""

content = content.replace(old_grievances_insert, new_grievances_insert)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patched supabaseClient.js")
