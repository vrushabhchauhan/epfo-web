// CITES 2.01 Centralized Relational Database Model for Ek-EPFO
// Represents the national schema linking Citizens, UANs, Establishments, MIDs, and ECR Ledgers.

export const db = {
  // 1. Master Citizen Identities & National UANs
  members: [
    {
      uan: '1004829371',
      name: 'Ananya Rao',
      email: 'ananya.demo@example.com',
      phone: '••••••4821',
      phoneMasked: '••••••4821',
      dob: '1990-04-12',
      gender: 'Female',
      fatherOrHusbandName: 'Mukesh K. Rao',
      panMasked: '•••••482K',
      aadhaarMasked: '•••• •••• 9281',
      bankAccountMasked: '•••• •••• 4821',
      bankIFSC: 'SBIN0001234',
      bankName: 'State Bank of India',
      bankBranch: 'Bandra West, Mumbai',
      kycStatus: 'Verified (Aadhaar + PAN + Bank)',
      totalServiceYears: '9 Years 2 Months',
      currentOffice: 'Regional Office Mumbai (Bandra)',
      activeUanStatus: 'Active',
    },
  ],

  // 2. Establishments (Employers)
  establishments: [
    {
      estId: 'EST-MH-BAN-0018293',
      name: 'Sundar Textiles Pvt Ltd',
      estCode: 'MH/BAN/0018293/000',
      address: 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai 400093',
      complianceScore: '96%',
      status: 'Active',
    },
    {
      estId: 'EST-MH-BAN-0049281',
      name: 'Coral Systems Ltd',
      estCode: 'MH/BAN/0049281/000',
      address: 'Tower 3, Nesco IT Park, Goregaon East, Mumbai 400063',
      complianceScore: '100%',
      status: 'Active',
    },
  ],

  // 3. Member Accounts (Member IDs / MIDs per establishment)
  memberAccounts: [
    {
      uan: '1004829371',
      memberId: 'MH/BAN/0018293/000/0048291',
      estName: 'Sundar Textiles Pvt Ltd',
      doj: '2015-06-01',
      doe: '2019-03-31',
      serviceStatus: 'Relieved',
      transferStatus: 'Transferred via Form 13',
    },
    {
      uan: '1004829371',
      memberId: 'MH/BAN/0049281/000/0091823',
      estName: 'Coral Systems Ltd',
      doj: '2019-04-01',
      doe: null,
      serviceStatus: 'Active',
      lastEcrMonth: '2026-07',
      lastDepositDate: '2026-08-14',
      challanTrrn: 'TRRN-8492019284',
    },
  ],

  // 4. ECR (Electronic Challan-cum-Return) Monthly Contribution Ledger
  ecrLedgers: [
    { wageMonth: '2025-08', grossWage: 45000, epfWage: 42500, employeeShare: 5100, employerShare: 1560, epsShare: 3540, trrn: '8492019201', depositDate: '2025-09-14' },
    { wageMonth: '2025-09', grossWage: 45000, epfWage: 42916, employeeShare: 5150, employerShare: 1575, epsShare: 3575, trrn: '8492019202', depositDate: '2025-10-15' },
    { wageMonth: '2025-10', grossWage: 46000, epfWage: 43333, employeeShare: 5200, employerShare: 1590, epsShare: 3610, trrn: '8492019203', depositDate: '2025-11-14' },
    { wageMonth: '2025-11', grossWage: 46000, epfWage: 43333, employeeShare: 5200, employerShare: 1590, epsShare: 3610, trrn: '8492019204', depositDate: '2025-12-15' },
    { wageMonth: '2025-12', grossWage: 47000, epfWage: 43750, employeeShare: 5250, employerShare: 1606, epsShare: 3644, trrn: '8492019205', depositDate: '2026-01-14' },
    { wageMonth: '2026-01', grossWage: 47500, epfWage: 44166, employeeShare: 5300, employerShare: 1621, epsShare: 3679, trrn: '8492019206', depositDate: '2026-02-15' },
    { wageMonth: '2026-02', grossWage: 47500, epfWage: 44166, employeeShare: 5300, employerShare: 1621, epsShare: 3679, trrn: '8492019207', depositDate: '2026-03-14' },
    { wageMonth: '2026-03', grossWage: 48000, epfWage: 44583, employeeShare: 5350, employerShare: 1636, epsShare: 3714, trrn: '8492019208', depositDate: '2026-04-15' },
    { wageMonth: '2026-04', grossWage: 48000, epfWage: 44583, employeeShare: 5350, employerShare: 1636, epsShare: 3714, trrn: '8492019209', depositDate: '2026-05-14' },
    { wageMonth: '2026-05', grossWage: 48500, epfWage: 45000, employeeShare: 5400, employerShare: 1651, epsShare: 3749, trrn: '8492019210', depositDate: '2026-06-15' },
    { wageMonth: '2026-06', grossWage: 48500, epfWage: 45000, employeeShare: 5400, employerShare: 1651, epsShare: 3749, trrn: '8492019211', depositDate: '2026-07-14' },
    { wageMonth: '2026-07', grossWage: 48500, epfWage: 45000, employeeShare: 5400, employerShare: 1651, epsShare: 3749, trrn: '8492019212', depositDate: '2026-08-14' },
  ],

  // 5. Consolidated Statutory Balances (Calculated across the 3 Scheme Funds)
  balances: {
    '1004829371': {
      totalAccumulation: 493600,
      employeeShareTotal: 214300, // 100% eligible for Form 31/19
      employerShareTotal: 186500,
      epsPensionFundTotal: 92800, // EPS 1995 pool
      interestRateAnnual: '8.25%',
      interestAccruedFY26: 18450,
      lastInterestCreditedDate: '2026-03-31',
    },
  },

  // 6. E-Nomination (EDLI & EPF Beneficiary)
  nominees: {
    '1004829371': [
      {
        nomineeId: 'NOM-01',
        name: 'Priya Rao',
        relationship: 'Spouse',
        dob: '1992-08-20',
        sharePercent: 100,
        bankAccountMasked: '•••• •••• 4821',
        bankIFSC: 'SBIN0001234',
        edliCoverageLimit: 700000,
      },
    ],
  },

  // 7. Statutory Claims (Form 31, Form 19, Form 10C, Form 20 & 5IF)
  claims: [
    {
      claimId: 'CLM1042',
      uan: '1004829371',
      formNumber: 'Form 31',
      claimType: 'Partial Advance (Medical)',
      amountRequested: 45000,
      amountDisbursed: 45000,
      tdsDeducted: 0,
      filedDate: '2026-06-02',
      settledDate: '2026-06-14',
      status: 'disbursed',
      currentStage: 4,
      disbursementMethod: 'NEFT / UPI Host-to-Host',
      bankRef: 'UTR-SBI-9281928491',
    },
    {
      claimId: 'CLM1078',
      uan: '1004829371',
      formNumber: 'Form 31',
      claimType: 'Education Advance',
      amountRequested: 30000,
      amountDisbursed: null,
      tdsDeducted: 0,
      filedDate: '2026-08-10',
      settledDate: null,
      status: 'in_progress',
      currentStage: 2,
      slaTargetDays: 3,
      slaExpectedDate: '2026-08-17',
    },
    {
      claimId: 'CLM1091',
      uan: '1004829371',
      formNumber: 'Form 31',
      claimType: 'Medical Advance (> ₹50,000)',
      amountRequested: 60000,
      amountDisbursed: null,
      tdsDeducted: 0,
      filedDate: '2026-08-15',
      settledDate: null,
      status: 'rejected',
      currentStage: 2,
      rejectionReasonCode: 'E-1023 (TDS_15G_MISSING)',
      rejectionSummary: 'Form 15G tax declaration missing for claim amount exceeding statutory ₹50,000 threshold.',
    },
  ],

  // 8. PF Account Transfers (Form 13)
  transfers: [
    {
      transferId: 'TRF-9021',
      uan: '1004829371',
      formNumber: 'Form 13',
      fromEstablishment: 'Sundar Textiles Pvt Ltd',
      fromMemberId: 'MH/BAN/0018293/000/0048291',
      toEstablishment: 'Coral Systems Ltd',
      toMemberId: 'MH/BAN/0049281/000/0091823',
      initiatedDate: '2026-08-04',
      estimatedAmount: 142800,
      status: 'pending_employer',
      currentStep: 2,
      daysWaiting: 12,
      autoEscalationDueDays: 2,
    },
  ],

  // 9. Grievances (EPFiGMS / CPGRAMS Redressal Engine)
  grievances: [
    {
      grievanceId: 'GRV-849201',
      uan: '1004829371',
      linkedClaimId: 'CLM1091',
      category: 'Claim Processing Delay & Form 15G Verification',
      filedDate: '2026-08-19',
      status: 'under_investigation',
      assignedOfficer: 'Rajesh Verma (Assistant PF Commissioner)',
      regionalOffice: 'Regional Office Mumbai (Bandra)',
      slaDaysTarget: 7,
      expectedResolutionDate: '2026-08-26',
      daysRemaining: 4,
      appealAllowed: true,
    },
  ],

  // 10. Live National Telemetry (CITES 2.01 & India Stack)
  telemetry: {
    totalMembers: '8.14 Crore',
    nationalCorpus: '₹30.8 Lakh Crore',
    citesCoreDatabase: 'Operational (CITES 2.01 Central DB)',
    uidaiOtpLatency: '4.2s (Optimal)',
    form31AutoSettlementRate: '84.2%',
    form19AutoSettlementRate: '50.1%',
    averageTurnaroundDays: 2.8,
  },
}
