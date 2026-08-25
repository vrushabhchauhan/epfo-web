import { db } from './db.js'

// Export primary entities directly from the CITES 2.01 relational database
export const member = {
  ...db.members[0],
  employers: db.memberAccounts.map((acc, idx) => ({
    id: `EMP-0${idx + 1}`,
    name: acc.estName,
    memberId: acc.memberId,
    from: acc.doj.slice(0, 7),
    to: acc.doe ? acc.doe.slice(0, 7) : 'present',
    status: acc.serviceStatus,
    transferStatus: acc.transferStatus,
    lastContribution: acc.lastDepositDate,
    complianceStatus: acc.lastDepositDate ? `Compliant (${acc.lastEcrMonth} Deposited on ${acc.lastDepositDate})` : undefined,
  })),
}

export const nominee = db.nominees['1004829371'][0]

export const balance = {
  total: db.balances['1004829371'].totalAccumulation,
  withdrawable: db.balances['1004829371'].employeeShareTotal,
  employerLocked: db.balances['1004829371'].employerShareTotal,
  pensionCredit: db.balances['1004829371'].epsPensionFundTotal,
  interestRate: db.balances['1004829371'].interestRateAnnual,
  interestAccruedFY26: db.balances['1004829371'].interestAccruedFY26,
  lastContributionDate: '2026-07-31',
}

export const contributionHistory = db.ecrLedgers.map((row) => ({
  month: row.wageMonth,
  employeeContribution: row.employeeShare,
  employerContribution: row.employerShare,
  pensionShare: row.epsShare,
  date: row.depositDate,
}))

export const claims = [
  {
    id: db.claims[0].claimId,
    formNumber: db.claims[0].formNumber,
    type: db.claims[0].claimType,
    amountRequested: db.claims[0].amountRequested,
    filedDate: db.claims[0].filedDate,
    settledDate: db.claims[0].settledDate,
    status: db.claims[0].status,
    currentStage: db.claims[0].currentStage,
    stages: [
      { label: 'Submitted', date: '2026-06-02', description: 'Your online claim was received.' },
      { label: 'Verified', date: '2026-06-05', description: 'Aadhaar KYC & bank records confirmed.' },
      { label: 'Field Office Review', date: '2026-06-10', description: 'Auto-settlement processed under CITES 2.01.' },
      { label: 'Disbursed', date: '2026-06-14', description: 'Rs 45,000 sent via NEFT/UPI rail.' },
    ],
  },
  {
    id: db.claims[1].claimId,
    formNumber: db.claims[1].formNumber,
    type: db.claims[1].claimType,
    amountRequested: db.claims[1].amountRequested,
    filedDate: db.claims[1].filedDate,
    settledDate: db.claims[1].settledDate,
    status: db.claims[1].status,
    currentStage: db.claims[1].currentStage,
    stages: [
      { label: 'Submitted', date: '2026-08-10', description: 'Your online claim was received.' },
      { label: 'Verified', date: '2026-08-13', description: 'Documents checked and confirmed.' },
      {
        label: 'Field Office Review',
        date: null,
        description: 'Auto-settlement pipeline in progress. Estimated completion in 2 business days.',
      },
      { label: 'Disbursed', date: null, description: 'Funds will be transferred directly to your bank account.' },
    ],
  },
  {
    id: db.claims[2].claimId,
    formNumber: db.claims[2].formNumber,
    type: db.claims[2].claimType,
    amountRequested: db.claims[2].amountRequested,
    filedDate: db.claims[2].filedDate,
    settledDate: db.claims[2].settledDate,
    status: db.claims[2].status,
    currentStage: db.claims[2].currentStage,
    rejectionReason: 'form_15g_missing',
    stages: [
      { label: 'Submitted', date: '2026-08-15', description: 'Your online claim was received.' },
      { label: 'Verified', date: '2026-08-17', description: 'Identity and balance validated.' },
      { label: 'Action needed', date: '2026-08-18', description: 'Form 15G tax declaration missing for claims over ₹50,000.' },
    ],
  },
]

export const rejectionReasons = {
  form_15g_missing: {
    title: 'Tax Declaration (Form 15G) Missing',
    explanation:
      'For advance or withdrawal amounts exceeding ₹50,000, statutory regulations require Form 15G/15H to prevent mandatory TDS deduction. Upload it in 1-click to resume processing.',
    fixLabel: 'Upload Form 15G in 1-Click',
  },
}

export const transfers = db.transfers.map((t) => ({
  id: t.transferId,
  formNumber: t.formNumber,
  fromEmployer: t.fromEstablishment,
  toEmployer: t.toEstablishment,
  fromMemberId: t.fromMemberId,
  toMemberId: t.toMemberId,
  initiatedDate: t.initiatedDate,
  amountEstimated: t.estimatedAmount,
  status: t.status,
  currentStep: t.currentStep,
  daysWaiting: t.daysWaiting,
  steps: [
    { label: 'Initiated Online', date: '2026-08-04', done: true },
    { label: 'Previous Employer Attestation', date: `Waiting (${t.daysWaiting} days)`, done: false, active: true },
    { label: 'Origin Field Office Dispatch', date: 'Pending', done: false },
    { label: 'Destination Account Credited', date: 'Pending', done: false },
  ],
}))

export const grievances = db.grievances.map((g) => ({
  id: g.grievanceId,
  linkedClaimId: g.linkedClaimId,
  category: g.category,
  filedDate: g.filedDate,
  status: g.status,
  assignedOfficer: g.assignedOfficer,
  regionalOffice: g.regionalOffice,
  expectedResolutionDate: g.expectedResolutionDate,
  daysRemaining: g.daysRemaining,
  timeline: [
    { label: 'Grievance Registered', date: '2026-08-19', description: `Auto-linked with Claim ${g.linkedClaimId} audit trail.` },
    { label: 'Assigned to Nodal Officer', date: '2026-08-20', description: `Transferred to ${g.assignedOfficer}.` },
    { label: 'Investigation in Progress', date: '2026-08-22', description: 'Reviewing uploaded Form 15G attestation.' },
    { label: 'Resolution & Clearance', date: `Due ${g.expectedResolutionDate}`, description: 'Final decision and claim unfreeze.' },
  ],
}))

export const systemStatus = {
  overall: 'operational',
  citesDatabase: db.telemetry.citesCoreDatabase,
  uidaiOtpRail: `Operational (Avg delivery: ${db.telemetry.uidaiOtpLatency})`,
  autoSettlementRail: db.telemetry.form31AutoSettlementRate,
  lastUpdated: 'Just now',
}
