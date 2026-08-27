import { member as defaultMember } from '../data/mockData.js'
import { upsertCloudMember } from './supabaseClient.js'

const REGISTRY_STORAGE_KEY = 'ek_epfo_registered_members'

// Default pre-seeded active members
const defaultRegistry = [
  {
    ...defaultMember,
    uan: '1004829371',
    email: 'ananya.demo@example.com',
    name: 'Ananya Rao',
    phoneMasked: '••••••4821',
    status: 'active',
  },
  {
    ...defaultMember,
    uan: '101492810392',
    email: 'vrushabhpchauhan53@gmail.com',
    name: 'Vrushabh Chauhan',
    phoneMasked: '••••••3210',
    kycStatus: 'Verified (Aadhaar Direct Allotment)',
    totalServiceYears: '0 Years (New Workforce Entrant)',
    currentOffice: 'Regional Office Mumbai (Bandra)',
    status: 'active',
  },
]

export function getRegisteredMembers() {
  try {
    const saved = localStorage.getItem(REGISTRY_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // Fallback on storage failure
  }
  return defaultRegistry
}

export function saveRegisteredMembers(membersList) {
  try {
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(membersList))
  } catch {
    // Fallback on storage failure
  }
}

export function findMemberByIdentifier(identifier) {
  if (!identifier) return null
  const clean = identifier.trim().toLowerCase()
  const registry = getRegisteredMembers()
  return (
    registry.find(
      (m) =>
        m.uan === clean ||
        (m.email && m.email.toLowerCase() === clean) ||
        (m.phoneMasked && m.phoneMasked.includes(clean))
    ) || null
  )
}

export function registerMemberAccount(newMemberData = {}) {
  const { password: _discardedPassword, ...safeMemberData } = newMemberData
  const registry = getRegisteredMembers()
  const cleanUan = safeMemberData.uan ? String(safeMemberData.uan).trim() : `100${Math.floor(1000000 + Math.random() * 9000000)}`
  
  const existingIdx = registry.findIndex((m) => m.uan === cleanUan || (m.email && m.email.toLowerCase() === (safeMemberData.email || '').toLowerCase()))
  
  const fullRecord = {
    ...defaultMember,
    ...safeMemberData,
    uan: cleanUan,
    name: safeMemberData.name || 'Member',
    email: safeMemberData.email || `${cleanUan}@member.epfo.gov.in`,
    phoneMasked: safeMemberData.mobile ? `••••••${String(safeMemberData.mobile).slice(-4)}` : (safeMemberData.phoneMasked || defaultMember.phoneMasked),
    kycStatus: safeMemberData.kycStatus || 'Verified (Aadhaar OTP)',
    status: 'active',
    registeredAt: new Date().toISOString(),
  }

  // Strictly ensure no password field can ever exist in local storage objects
  delete fullRecord.password

  let updatedRegistry
  if (existingIdx >= 0) {
    updatedRegistry = [...registry]
    updatedRegistry[existingIdx] = fullRecord
  } else {
    updatedRegistry = [fullRecord, ...registry]
  }

  saveRegisteredMembers(updatedRegistry)

  // Cloud sync to Supabase PostgreSQL database
  upsertCloudMember(fullRecord).catch(() => {})

  return fullRecord
}
