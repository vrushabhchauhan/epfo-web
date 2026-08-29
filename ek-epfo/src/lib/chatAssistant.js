const faqRules = [
  {
    pattern: /(uan|universal account number).*(activate|activation|first[- ]time)/i,
    response:
      'To activate your UAN, start from the secure UAN activation flow, complete Aadhaar OTP verification, and create a strong password. If you are unsure which step to take, use the UAN activation page from the public services section.',
  },
  {
    pattern: /(passbook|ledger|balance|statement|contribution)/i,
    response:
      'The passbook and ledger show your monthly contribution history, employer share, employee share, and year-wise interest. You can view it after sign-in from the member dashboard or through the official passbook section of the portal.',
  },
  {
    pattern: /(claim|settlement|withdrawal|form 19|form 31|advance)/i,
    response:
      'EPFO claim journeys depend on the claim type. Common journeys include Form 19 for final settlement, Form 31 for advances, and death or family claims through the guided claim wizard. Use the claims page to choose the correct route and review eligibility requirements.',
  },
  {
    pattern: /(grievance|complaint|escalate|epfigms|helpdesk)/i,
    response:
      'For grievances, first raise the complaint through the grievance redressal route and keep the claim or service reference details ready. For unresolved issues, the portal provides escalation and helpline guidance for official follow-up.',
  },
  {
    pattern: /(pension|eps|retirement|calculator)/i,
    response:
      'EPS pension eligibility is based on service period and the statutory formula. The calculator on the portal can help you estimate the monthly pension, but final entitlement is determined by the official EPFO rules and your service record.',
  },
  {
    pattern: /(transfer|form 13|switch.*job|previous employer)/i,
    response:
      'PF transfer is normally done through the Form 13 route when you change jobs. The process requires your previous and current employment details, and the portal guides you through the transfer and attestation steps.',
  },
  {
    pattern: /(death|family.*claim|edli|nominee)/i,
    response:
      'Family and death claims are handled through the dedicated death claim wizard. It collects beneficiary information and walks you through the required forms and evidence steps for PF and EDLI claim processing.',
  },
  {
    pattern: /(how do i|what is|where do i|can you explain)/i,
    response:
      'I can explain the general EPFO process and route you to the right service. I can help with UAN activation, claim entry, grievance steps, pension guidance, and public service navigation.',
  },
]

const refusalPatterns = [
  /(my|current|actual|live).*(balance|pf balance|account|claim status|claim details|grievance status|withdrawal amount|settlement amount)/i,
  /(what is my|show me my|tell me my|check my).*(balance|claim|status|amount|pf)/i,
  /(pending claim|current claim|my grievance|my account)/i,
]

export function getAssistantReply(rawInput, context = {}) {
  const input = String(rawInput ?? '').trim()
  const isAuthenticated = Boolean(context.isAuthenticated)

  if (!input) {
    return 'I can explain EPFO services and guide you to the correct path. Ask about UAN activation, claims, grievances, transfers, or pension basics.'
  }

  const isPersonalRequest = refusalPatterns.some((rule) => rule.test(input))
  if (isPersonalRequest) {
    return 'I can explain the process, but I cannot view or disclose personal PF account details, live balances, or claim status in this chat. Please use the secure portal or official helpline for account-specific information.'
  }

  const match = faqRules.find((rule) => rule.pattern.test(input))
  if (match) {
    return match.response
  }

  const fallback = isAuthenticated
    ? 'I can help with general EPFO guidance, claim pathways, public services, and navigation. For account-specific or personal PF details, please use the secure member portal or official helpline.'
    : 'I can explain the common EPFO service flow and direct you to the correct public page. For a specific service like UAN activation, claims, transfers, grievance tracking, or pension calculation, I can guide you to the right procedure.'

  return fallback
}
