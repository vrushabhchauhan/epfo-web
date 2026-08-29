import { seedMembers } from '../data/seedData.js'
import { member as fallbackTemplate } from '../data/mockData.js'
import { upsertCloudMember, checkUanExists } from './supabaseClient.js'

const REGISTRY_STORAGE_KEY = 'ek_epfo_registered_members'

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
  return seedMembers
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

export async function generateUniqueUan() {
  const registry = getRegisteredMembers()
  let uanCandidate
  let isUnique = false
  while (!isUnique) {
    uanCandidate = `101${Math.floor(100000000 + Math.random() * 900000000)}`
    const existsLocally = registry.some((m) => m.uan === uanCandidate)
    if (!existsLocally) {
      const existsInCloud = await checkUanExists(uanCandidate)
      if (!existsInCloud) {
        isUnique = true
      }
    }
  }
  return uanCandidate
}

export function registerMemberAccount(newMemberData = {}) {
  const { password: _discardedPassword, ...safeMemberData } = newMemberData
  const registry = getRegisteredMembers()
  const cleanEmail = (safeMemberData.email || '').trim().toLowerCase()
  const existingIdx = registry.findIndex(
    (m) =>
      (safeMemberData.uan && m.uan === String(safeMemberData.uan).trim()) ||
      (cleanEmail && m.email && m.email.toLowerCase() === cleanEmail)
  )

  const cleanUan = safeMemberData.uan
    ? String(safeMemberData.uan).trim()
    : existingIdx >= 0
    ? registry[existingIdx].uan
    : `101${Math.floor(100000000 + Math.random() * 900000000)}`
  
  const fullRecord = {
    ...fallbackTemplate,
    ...safeMemberData,
    uan: cleanUan,
    name: safeMemberData.name || 'Member',
    email: safeMemberData.email || `${cleanUan}@member.epfo.gov.in`,
    phoneMasked: safeMemberData.mobile ? `••••••${String(safeMemberData.mobile).slice(-4)}` : (safeMemberData.phoneMasked || '••••••0000'),
    kycStatus: safeMemberData.kycStatus || 'Verified (Aadhaar OTP)',
    totalServiceYears: safeMemberData.totalServiceYears || '0 Years (New Workforce Entrant)',
    currentOffice: safeMemberData.currentOffice || 'Regional Office Mumbai (Bandra)',
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
