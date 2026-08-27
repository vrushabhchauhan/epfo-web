import { member as defaultMember } from './mockData.js'

/**
 * Pre-seeded sample accounts for Evaluators & Demo testing.
 * These represent pre-existing accounts with rich historical ledgers,
 * claims, and passbooks for judge reviews.
 */
export const seedMembers = [
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
