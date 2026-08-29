import re

with open(r'c:\Users\Vrushabh\Downloads\EPFO Web\ek-epfo\src\lib\supabaseClient.js', 'r', encoding='utf-8') as f:
    content = f.read()

insert_grievance_new = """export async function insertCloudGrievance(grievance) {
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

get_grievance_new = """export async function getCloudGrievances(uan) {
  if (!isSupabaseConfigured() || !uan) return null
  try {
    const { data, error } = await supabase.from('grievances').select('*').eq('uan', uan).order('filed_date', { ascending: false })
    if (error) throw error
    
    if (uan === '101492810392' && (!data || data.length === 0)) {
      if (typeof window !== 'undefined' && !sessionStorage.getItem('demo_grievances_seeded')) {
        const dummyGrievances = [
          { grievance_id: 'GRV-PEN-4810', uan, subject: 'PF withdrawal claim pending beyond SLA', description: 'My PF claim is pending.', related_claim_id: 'CLM-PEN-3829', status: 'open', filed_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
          { grievance_id: 'GRV-RES-3392', uan, subject: 'KYC name mismatch corrected', description: 'Name mismatch was fixed.', resolution_notes: 'Updated Aadhaar-linked name in system.', status: 'resolved', filed_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], resolved_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
          { grievance_id: 'GRV-ESC-1102', uan, subject: 'Officer escalation regarding passbook', description: 'Missing entries from 2021.', status: 'escalated', filed_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
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
      
      // Merge ignoring duplicates by grievance_id
      const existingIds = new Set(finalData.map(c => c.grievance_id))
      const uniqueLocal = localForUan.filter(c => !existingIds.has(c.grievance_id))
      finalData = [...uniqueLocal, ...finalData]
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

content = re.sub(r'export async function insertCloudGrievance\(grievance\).*?^}', insert_grievance_new, content, flags=re.DOTALL | re.MULTILINE)
content = re.sub(r'export async function getCloudGrievances\(uan\).*?^}', get_grievance_new, content, flags=re.DOTALL | re.MULTILINE)

with open(r'c:\Users\Vrushabh\Downloads\EPFO Web\ek-epfo\src\lib\supabaseClient.js', 'w', encoding='utf-8') as f:
    f.write(content)
