# EPFO 2.0 / CITES 2.01 — Post-Migration Forensic Audit & Rebuild Strategy
*Prepared as a Build What Moves India decision document. Evidence baseline: live EPFO systems and official government material available in August 2026.*

## Core Conclusion

This is not a report about an “old EPFO website.” EPFO has materially modernized its digital stack. EPFO
2.0 describes the Unified Portal plus Field Office Application; CITES 2.01 is the modernization program that
centralizes data and replaces the legacy Field Office application. In July 2026 EPFO announced completion
of a major database consolidation and software upgrade, with member and employer services live in
phases. Therefore the right Build What Moves India problem is the post-modernization citizen experience:
making the new centralized capability understandable, resilient, transparent and life-event driven for
workers and pensioners.

Most importantly, official evidence shows the remaining pain is not hypothetical. In
early 2025 EPFO reported that 35.88% of grievances were
withdrawal/final-settlement/advance related, 30.44% concerned KYC/profile/JD, and
16.03% concerned transfer/Form 13. Even after simplification, these remained the
top three categories. A later August 2026 CITES update shows strong
auto-settlement rates, but not zero friction: national auto-settlement was reported
at 84% for Form-31 and 50% for Form-19.

## 1. Executive Summary

- EPFO 2.0 is no longer the right baseline. The current baseline is EPFO’s July/August 2026 post-migration
   state after major database consolidation and software upgrade.

- CITES 2.01 is a structural upgrade, not simply a visual redesign. The program centralizes previously
   decentralized databases, streamlines claim settlement/payments and replaces the legacy Field Office
   Application.

- The central user problem has shifted from fragmented backend architecture to fragmented
   understanding. Citizens still need to know which service, portal, identity state or exception path applies
   to their life event.

- Claims are the strongest measurable wedge. CITES has raised automation substantially, but Form-19
   and other non-auto-settled cases remain large enough to justify a “why / what next / what is blocking
   me?” experience layer.

- KYC / profile correction and transfer are equally strong candidates. EPFO itself reported these among the
   top grievance categories and introduced simplification to reduce dependence on employer and
   field-office approvals.

- The best competition concept is not “EPFO 3.0.” It is an experience layer that turns EPFO’s new
   centralized capability into a single citizen journey: one identity, one case timeline, one explanation of
   blockers, one clear next action.

- Do not claim infrastructure has been solved. The July 2026 notices explicitly show post-migration
   stabilization, calibrated claim/service processing and warnings against repeated attempts during peak
   hours.

## 2. Business & Audience Snapshot

     EPFO administers the Employees’ Provident Fund, Employees’ Pension Scheme and Employees’ Deposit
     Linked Insurance Scheme. The digital ecosystem serves employees/members, employers, pensioners,
     international workers, principal employers and the organization’s field offices. The member-facing value
     proposition is financial-social security access: contributions, account identity, claims, transfers, KYC/profile
     maintenance and pension services.

     Primary audience: employees/members. The most consequential jobs-to-be-done are: “What is my PF
     balance?”, “Is my employment history correct?”, “Can I transfer my PF?”, “Can I withdraw?”, “Where is my
     claim?”, “Why was my request rejected or delayed?”, and “What do I need to do next?”

     Secondary audience: employers, who manage registrations, ECR, payments, establishment-level
     corrections and compliance. Pensioners form a separate high-trust audience with needs around pension
     disbursement and digital life certificates.

     ## 3. What Changed in EPFO 2.0 / CITES 2.01
     EPFO 2.0 historically referred to the Unified Portal and Field Office Application operating together. EPFO
     then introduced CITES / EPFO 2.01 as the next modernization initiative, developed within the Unified
     Portal. Its stated goals include centralized databases, a UAN-based accounting framework, optimized
     claim settlement and payments, and replacement of the legacy Field Office Application.

     The latest government progress report said CITES 2.0 infrastructure was fully deployed, with upgraded
     servers, SOC integration and live production modules; user-acceptance testing across 19 offices had
     identified and resolved more than 700 issues; performance testing, VAPT, data migration and phased
     rollout were underway.

     By July 2026, EPFO announced that a major database consolidation and software
     upgrade had been completed and member/employer services were live in phases.
     That same notice warned that claim and service processing would remain calibrated
     during stabilization. This is a crucial distinction: the centralization is live, but the
     operational experience is still stabilizing.

     ## 4. Current State: What Is Already Better
     The rebuild strategy should explicitly preserve these wins rather than redesign them away.

     
- Centralized pension payment system (CPPS) is operational nationwide from January 2025, allowing
        pension disbursement without inter-office PPO transfer when a pensioner moves.
     
- Member profile correction has been simplified: Aadhaar-validated UAN holders can self-update several
        personal fields without document upload in eligible cases.
     
- Joint Declaration / profile-correction pathways were simplified, reducing the need for employer and EPFO
        approval in many cases.
     
- UAN generation/activation and authentication can use face authentication through UMANG.
     
- Auto-settlement has become material: an August 2026 PIB update reported 84% auto-settlement for
        Form-31 and 50% for Form-19 nationally.
     
- The 2026 migration explicitly targets centralized data and a UAN-based accounting framework.

     ## 5. Post-Migration Forensic Findings
| ID | Finding | Evidence / implication | Priority |
|---|---|---|---|
| F1 | Citizen-facing information has not fully caught up with the new architecture | The underlying platform is moving toward centralization, but the public web experience still exposes multiple service names, separate portals, legacy terminology and procedural PDFs. The user must understand EPFO’s system vocabulary rather than simply state the outcome they want. | High |
| F2 | The “exception experience” is under-designed | The happy path is increasingly automated. The opportunity is what happens when automation cannot settle a claim, KYC does not match, a transfer is incomplete, or a service is temporarily unavailable. These are precisely the moments where citizens need explanation and next-step guidance. | Critical |
| F3 | Operational notices are technically correct but not task-oriented | The live portal says processing may take longer during stabilization and asks users to avoid repeated requests. A citizen still needs to know: “Did my request go through?”, “Should I wait?”, “Will retrying hurt me?”, and “When should I escalate?” | High |
| F4 | EPFO has already identified the highest-friction categories | Withdrawal/final settlement/advance, KYC/profile correction, and transfer/Form 13 were the top three grievance categories in the cited 2025 analysis. This gives us evidence-based problem selection rather than anecdotal UX criticism. | Critical |
| F5 | Cross-channel identity and service discovery remain cognitively expensive | EPFO services can involve the Unified Member Portal, UMANG, Passbook and EPFiGMS. The current model still exposes channel boundaries; citizens mostly care about completing the task. | High |
| F6 | Data transparency is still weaker than transaction automation | Automation can settle a claim faster, but users need a human-readable ledger: what data EPFO has, what is verified, what is pending, what rule blocked a request, and what action can resolve it. | Critical |
| F7 | Legacy content remains mixed with current instructions | The employee site still surfaces downloads dated 2015, 2018, 2020 and 2023 alongside newer service information. Without strong “current / legacy / reference” labeling, the content layer can remain confusing even after backend modernization. | Medium |
| F8 | The system is in a transition state, so resilience is part of UX | The July 2026 migration notice and late-June planned downtime show that service availability and processing states are active concerns. A rebuild should design explicit maintenance, queueing, retry and incident states instead of blank errors. | High |

## 6. Key Journey Audits
A. Claim / Withdrawal
Current: Current capability: online claim filing, claim tracking, auto-settlement, and multiple claim forms.
CITES significantly improves automation.

Rebuild: Rebuild target: “I need money” → eligibility check → required data/KYC checklist → transparent
processing state → explanation if not auto-settled → exact next action → unified timeline.

Evidence: Why it matters: claim categories were the largest grievance cluster cited by EPFO in early 2025,
and August 2026 automation data shows a large but incomplete auto-settlement envelope.

B. KYC / Profile Correction
Current: Current capability: self-service profile correction for eligible Aadhaar-validated UANs; simplified JD
process; Digilocker/document pathways in applicable cases.

Rebuild: Rebuild target: “Something in my account is wrong” → identify field → explain why correction is
required → show verification source → self-correct where eligible → route only exceptions.

Evidence: Why it matters: EPFO reported nearly 27% of grievances related to member profile/KYC issues
at the time of the 2025 simplification.

C. PF Transfer
Current: Current capability: simplified transfer process, UAN-centered architecture and online service.

Rebuild: Rebuild target: user sees old employer, new employer and status in one visual timeline; system
explains whether transfer is needed, automatic, pending or blocked.

Evidence: Why it matters: transfer/Form 13 was one of the top grievance categories in EPFO’s cited
analysis.

D. Passbook / Balance
Current: Current capability: Member Passbook plus other balance-access channels.

Rebuild: Rebuild target: treat balance as a financial statement with latest contribution, missing/late
posting flags, employer contributions, transfer events and reconciliation status.

Evidence: Why it matters: EPFO has published notices about temporary non-visibility of contributions
during ECR ledger changes and maintenance interruptions.

E. Grievance
Current: Current capability: EPFiGMS, nodal officers and grievance categories.

Rebuild: Rebuild target: avoid making the citizen re-explain the history. A grievance should inherit the
relevant claim/KYC/transfer timeline, evidence and system state automatically.

Evidence: Why it matters: grievance data is already telling EPFO where the largest process failures are.

F. Pensioner
Current: Current capability: CPPS, Jeevan Pramaan/digital life certificate, PPO access and pensioner
services.

Rebuild: Rebuild target: one retirement-to-pension dashboard with pension status, payment history, life
certificate state, bank change, PPO and service escalation.

Evidence: Why it matters: CPPS has already solved a major backend constraint; the next opportunity is
making the benefit experience intelligible.

## 7. Proposed Product Thesis

  EPFO One: a citizen experience layer over the modernized EPFO core.

  The proposed product should not replace CITES, CPPS, the Unified Portal or backend systems in the
  competition prototype. It should demonstrate a better way for a citizen to understand and complete a task
  using those capabilities.

  Home should start with “What do you need to do?” and offer life-event intents such as: “I changed jobs”, “I
  need to withdraw”, “Something is wrong with my PF”, “I want to check my balance”, “I am waiting for a
  claim”, “I am retiring”, “I want to update my details”, and “I need help”.

  The core design object should be a single case timeline: request → identity checks → data dependencies →
  processing → decision → payment/transfer → exception → next action. That is the layer the current
  modernization does not appear to make sufficiently visible to the citizen.

  ## 8. Rebuild IA
| Section | Purpose |
|---|---|
| Home | Intent-led service selector; system status; signed-in summary; help |
| My EPFO | PF balance; contributions; service history; KYC; nominee; employment records |
| My Requests | Claims; transfers; profile corrections; grievances; all status in one timeline |
| I Changed Jobs | New employment; transfer decision; previous account; employer linkage; status |
| I Need Money | Eligibility; claim; documents; verification; payment status |
| Something Is Wrong | Balance issue; KYC issue; employer issue; account access; raise issue |
| Pension | Pension status; CPPS payments; PPO; life certificate; bank details |
| Help & Rules | Plain-language explanations; policy source; eligibility; calculators; multilingual help |
| System Status | Live incidents; maintenance; degraded services; expected recovery; safe retry guidance |

## 9. Technical Strategy
  Recommended architecture: progressive experience layer, not big-bang replacement. Keep CITES/Unified
  Portal and other authoritative systems as systems of record; create an API/BFF layer for citizen-facing
  journeys; add a common identity/session layer where government architecture permits; build a
  normalized case/status model; instrument every service state; and surface system incidents explicitly.

  Frontend: modern React/Next.js or equivalent, accessible by default, server-side rendering for public
  informational content. Backend: domain-oriented services / API gateway / BFF, with strict separation
  between citizen UX and legacy integrations. Observability: OpenTelemetry, centralized logs, SLOs,
  synthetic journey tests. Security: government-approved hosting, WAF, VAPT, secret management, least
  privilege, strong audit trails.

  Do not recommend a wholesale technology replacement without EPFO architecture
  diagrams, source-code review, infrastructure constraints and government
  procurement/security requirements. The existing CITES modernization is already a
  major centralization program; our competition solution should be an experience
  proof-of-concept, not an ungrounded infrastructure plan.

  ## 10. SEO & Content Implications
  The public site still contains many legacy-style URLs and PDF resources, while the most valuable
  transactional journeys live on separate systems. The rebuild should create a clean public knowledge layer
  with task-oriented, canonical URLs and clear separation between “learn” and “do”.

  Every service page should answer: who can use it, what you need, how long it takes, what can go wrong,
  what happens next, the authoritative policy source, and the current system status. PDFs should remain as
  downloadable official references but should not be the primary interface for common tasks.

## 11. Risk & Compliance Notes
This report does not certify cybersecurity, WCAG compliance, legal compliance, uptime or backend
performance. Those require controlled testing and internal evidence. The public site does provide
privacy/terms material and uses HTTPS, but cross-domain services mean privacy/security responsibilities
must be mapped end-to-end.

For a production rebuild, require formal VAPT, threat modeling, data-classification review, accessibility
audit, privacy impact assessment where appropriate, disaster recovery tests, load/performance testing
and government hosting/procurement review.

## 12. What to Pull from EPFO to Finish the Vendor-Grade Audit

- GA4: users, sessions, landing pages, task completion, device, geography, assisted conversions, exit
   points and service-specific funnels.

- Search Console: indexed/excluded URLs, queries, CTR, device, page experience/Core Web Vitals and
   duplicate/canonical issues.

- Application telemetry: API latency, error rates, failed authentications, claim retries, abandoned forms,
   OTP failures, passbook errors, uptime and peak concurrency.

- Grievance analytics: latest category volumes, reopen/escalation rates, median resolution time and
   root-cause mapping.

- CITES operational data: auto-settlement vs manual settlement by claim type, exception codes, top
   failure reasons, regional variance and recovery time from incidents.

- Authenticated usability testing: non-destructive test account covering UAN activation, profile correction,
   transfer, claim, passbook and grievance.

- Accessibility testing: screen reader, keyboard, mobile zoom, contrast and form error announcement
   results on the actual authenticated portal.

## 13. Decision: What We Should Build for Build What Moves India
The strongest competition thesis is not “rebuild the EPFO website.” It is: “Make the
post-CITES EPFO experience understandable from a citizen’s point of view.”

The prototype should make one high-value journey extraordinary. My first choice is Claims + Exceptions: a
user sees eligibility, claim, real-time state, explanation of blockers, safe retry guidance, expected next
step and a unified grievance/escalation path. The second choice is PF Transfer + Employment Timeline.
The third is Profile/KYC correction.

This is a stronger problem statement than attacking “old UI” because EPFO has already invested in
centralization, automation and digital delivery. We would be demonstrating how to turn those backend
gains into a measurable improvement in citizen trust, comprehension and task completion.

## 14. Evidence & Source Register
Primary sources used for the new-version audit:
- [EPFO Unified Portal — 2026 migration/stabilization notice](https://unifiedportal-emp.epfindia.gov.in/epfo/)
- [EPFO Member Home — current 2026 portal](https://unifiedportal-mem.epfindia.gov.in/)
- [EPFO Item 9 — Progress in CITES 2.01](https://www.epfindia.gov.in/site_docs/PDFs/CBT_Files/EC_meeting_Agenda_112.pdf)

- [PIB — Progress in implementation of CITES 2.01](https://www.pib.gov.in/newsite/erelcontent.aspx?lang=2®=48&relid=285110)
- [PIB — CITES claim settlement performance, 4 Aug 2026](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294616)
- [EPFO — Simplification of Joint Declaration Process](https://www.epfindia.gov.in/site_docs/PDFs/Circulars/Y2025-2026/Circular_SimplificationOfJointDeclarationProcess.pdf)
PIB/EPFO - Simplifies Online Process for Member Profile Updation
https://www.epfindia.gov.in/site_docs/PDFs/EPFO_PRESS_RELEASES/EPFOSimplifiesOnlineProcessForMemberProfileUpdation_190
12025.pdf
- [EPFO — For Employees](https://www.epfindia.gov.in/site_en/For_Employees.php)
- [EPFO — Site Map](https://www.epfindia.gov.in/site_en/SiteMap.php)
- [EPFO — FAQ / current service notices](https://www.epfindia.gov.in/site_en/FAQ.php)
EPFO - Centralized Pension Payments System
https://www.epfindia.gov.in/site_docs/PDFs/EPFO_PRESS_RELEASES/03%20Jan%202024%20PIB%20Press%20Release%20CPPS.p
df

## Method Note
This report is a current-state research synthesis using public EPFO/PIB materials and live portal evidence available in August 2026. It
deliberately does not invent server, analytics or authenticated-user data. Where a fact requires internal telemetry or controlled access, the
report labels the gap and specifies what the vendor/EPFO team should provide.
