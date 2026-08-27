# Comprehensive QA Audit Report: Ek-EPFO (CITES 2.01)

**Target System:** Ek-EPFO Member & Citizen Services Portal (`ek-epfo`)  
**Audit Scope:** Full-stack Architecture, Routes, Database Schema, Authentication & Session Security, Data Integrity, Frontend/UX Quality, and Realism Benchmark against [unifiedportal-mem.epfindia.gov.in](https://unifiedportal-mem.epfindia.gov.in).  
**Auditor:** Senior QA Test Lead & Security Auditor  
**Date:** 2026-08-27  
**Build Status:** Vite 8 / React 19 SPA (`npm run build` passing, Oxlint 0 errors)

---

## 1. Executive Summary

The Ek-EPFO project is an ambitious, modern reimagining of India's Employees' Provident Fund Organisation portal, built around the real-world post-July 2026 **CITES 2.01** centralized architecture. It successfully consolidates fragmented government portals into a cohesive single-window experience with impressive high-value features, including a 4-step Family & Death Claim Wizard (Form 20/5IF/10D), direct DigiLocker Joint Declaration e-KYC self-correction, EPFiGMS grievance escalation tracking, and citizen benefit calculators.

However, the current codebase exhibits several **critical security and functional deficiencies** typical of fast-paced hackathon prototypes:
1. **Unprotected App Shell & Route Guards:** Unauthenticated visitors can navigate directly to `/dashboard`, `/passbook`, `/claims`, or `/profile` and immediately view sensitive financial and PII data belonging to the pre-seeded member.
2. **Static Mock Coupling & Session Decoupling:** Authenticated pages (`DashboardPage`, `PassbookPage`, `ClaimsPage`, `ProfilePage`, `TransfersPage`, `GrievancePage`) directly import static mock fixtures rather than pulling from `useSession()` or Supabase Cloud, causing newly registered users to see hardcoded records.
3. **Database RLS & PII Exposure:** Supabase Row-Level Security (RLS) policies permit unrestricted global public reads (`using (true)`) on all tables (`members`, `balances`, `claims`, `nominees`), while raw PII (Aadhaar, PAN, Bank account numbers) is stored unencrypted in frontend source files.
4. **Transient State / Non-Persisted Actions:** Filing a new claim (`/claims/new`), registering a grievance (`/grievance`), and fixing a rejected claim (`/claims/:id/fix`) operate purely on transient local state and do not persist to storage or the database.

With targeted fixes to route protection, state synchronization, and database constraints, this project can be elevated from a static prototype to a production-grade showcase.

---

## 2. PHASE 1 — Discovery & System Topology

### 2.1 Tech Stack Mapping

| Layer | Technology | Version | Location / Config |
|---|---|---|---|
| **Frontend Framework** | React / React DOM | `^19.2.8` | `ek-epfo/package.json` |
| **Routing** | React Router DOM | `^7.18.2` | `ek-epfo/src/App.jsx` |
| **Build & Bundler** | Vite | `^8.2.2` | `ek-epfo/vite.config.js` |
| **Linter** | Oxlint | `^1.79.0` | `ek-epfo/.oxlintrc.json` |
| **BaaS / Database** | Supabase JS SDK / PostgreSQL | `^2.112.4` / Postgres 15+ | `ek-epfo/src/lib/supabaseClient.js`, `supabase_schema.sql` |
| **Client Storage** | Browser `localStorage` | HTML5 Web Storage | `memberRegistry.js`, `SessionContext.jsx` |
| **Hosting Deployment** | Vercel (SPA Rewrite) | Static Single Page App | `ek-epfo/vercel.json`, `vercel.json` |

### 2.2 User Flows & Route Inventory

```
                                    ┌─────────────────────────────┐
                                    │    Landing Page ("/")       │
                                    └──────────────┬──────────────┘
                       ┌───────────────────────────┼───────────────────────────┐
                       ▼                           ▼                           ▼
        ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
        │ Citizen Public Services │ │  Authentication Flow    │ │ Death & Family Wizard   │
        │ • /uan/activate         │ │ • /login/email          │ │ • /claims/new/death/s1  │
        │ • /uan/know             │ │ • /login/verify         │ │ • /claims/new/death/s2  │
        │ • /uan/allot            │ └──────────────┬──────────┘ │ • /claims/new/death/s3  │
        │ • /claims/track-public  │                │            │ • /claims/new/death/s4  │
        │ • /calculators          │                ▼ (Session)  │ • /claims/new/death/conf│
        │ • /establishment/search │ ┌─────────────────────────┐ └─────────────────────────┘
        │ • /pensioner            │ │ Authenticated AppShell  │
        └─────────────────────────┘ │ • /dashboard            │
                                    │ • /passbook             │
                                    │ • /claims (/new, /:id)  │
                                    │ • /transfers            │
                                    │ • /grievance (/:id)     │
                                    │ • /profile (/nominee,/kyc)
                                    └─────────────────────────┘
```

### 2.3 Route & API/Database Touchpoints Matrix

| Route Path | Access Level | Component | Backend / Storage Touchpoint | Database Table(s) Touched |
|---|---|---|---|---|
| `/` | Public | [`LandingPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/LandingPage.jsx) | `searchableServices`, `systemStatus` | None |
| `/login/email` | Public | [`LoginEmailPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/LoginEmailPage.jsx) | `sendEmailOtp()`, `findMemberByIdentifier()` | Supabase Auth (`signInWithOtp`), `localStorage` |
| `/login/verify` | Public | [`LoginVerifyPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/LoginVerifyPage.jsx) | `verifyEmailOtp()`, `getCloudMember()` | Supabase Auth (`verifyOtp`), `public.members` |
| `/uan/activate` | Public | [`UanActivatePage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/public-services/UanActivatePage.jsx) | `registerMemberAccount()`, `upsertCloudMember()` | `public.members`, `public.balances`, `localStorage` |
| `/uan/know` | Public | [`KnowUanPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/public-services/KnowUanPage.jsx) | Mock lookup | `mockData.js` (`member`) |
| `/uan/allot` | Public | [`DirectUanAllotmentPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/public-services/DirectUanAllotmentPage.jsx) | `registerMemberAccount()`, `upsertCloudMember()` | `public.members`, `public.balances`, `localStorage` |
| `/claims/track-public` | Public | [`PublicClaimTrackPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/public-services/PublicClaimTrackPage.jsx) | Mock claim filter | `mockData.js` (`claims`) |
| `/calculators` | Public | [`CalculatorsPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/public-services/CalculatorsPage.jsx) | Pure client mathematical formulas | None |
| `/establishment/search` | Public | [`EstablishmentSearchPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/public-services/EstablishmentSearchPage.jsx) | In-memory filter | `db.js` (`establishments`) |
| `/pensioner` | Public | [`PensionerHubPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/public-services/PensionerHubPage.jsx) | In-memory lookup | `demoPensioner` |
| `/claims/new/death/*` | Public (Nominee) | Wizard Steps 1–4 & Confirmation | `DeathClaimContext`, `DeathClaimWizardProvider` | React Context Memory |
| `/dashboard` | Authenticated | [`DashboardPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/DashboardPage.jsx) | Static mock import | `mockData.js` (`balance`, `claims`, `member`) |
| `/passbook` | Authenticated | [`PassbookPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/PassbookPage.jsx) | Static mock import | `mockData.js` (`balance`, `contributionHistory`) |
| `/claims` | Authenticated | [`ClaimsPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/ClaimsPage.jsx) | Static mock import | `mockData.js` (`claims`) |
| `/claims/:claimId` | Authenticated | [`ClaimDetailPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/ClaimDetailPage.jsx) | `claims.find(id)` | `mockData.js` (`claims`) |
| `/claims/:claimId/fix` | Authenticated | [`ClaimFixPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/ClaimFixPage.jsx) | Transient form state | `mockData.js` (`claims`) |
| `/claims/new` | Authenticated | [`NewClaimPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/NewClaimPage.jsx) | Transient form state | `mockData.js` (`balance`, `member`) |
| `/transfers` | Authenticated | [`TransfersPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/TransfersPage.jsx) | Static mock import | `mockData.js` (`transfers`) |
| `/grievance` | Authenticated | [`GrievancePage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/GrievancePage.jsx) | Static mock import | `mockData.js` (`grievances`) |
| `/grievance/:grievanceId` | Authenticated | [`GrievanceDetailPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/GrievanceDetailPage.jsx) | Static mock import | `mockData.js` (`grievances`) |
| `/profile` | Authenticated | [`ProfilePage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/ProfilePage.jsx) | Static mock import | `mockData.js` (`member`) |
| `/profile/nominee` | Authenticated | [`NomineePage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/NomineePage.jsx) | Static mock import | `mockData.js` (`nominee`) |
| `/profile/kyc` | Authenticated | [`KycCorrectionPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/KycCorrectionPage.jsx) | Transient state toggle | Pure client simulation |

---

## 3. Critical Issues (Must-Fix Security & Data Bugs)

### CRIT-01: Missing Route Authentication Guard in AppShell
* **File:** [`ek-epfo/src/components/AppShell.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/components/AppShell.jsx#L78-L90)
* **Severity:** Critical (CWE-306: Missing Authentication for Critical Function)
* **Description:** `AppShell` does not check `isAuthenticated`. Any unauthenticated user can directly visit `/dashboard`, `/passbook`, `/claims`, or `/profile`. Furthermore, `SessionContext.jsx` falls back to `defaultMember`, displaying Ananya Rao's full financial balance, claims, and KYC data to unauthenticated visitors.

**Offending Code ([`AppShell.jsx:L78-90`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/components/AppShell.jsx#L78-L90)):**
```jsx
function AppShell() {
  const navigate = useNavigate()
  const { member, logout } = useSession()
  const [showDpiDetails, setShowDpiDetails] = useState(false)

  function handleSignOut() {
    logout()
    navigate('/')
  }
  // Missing: if (!isAuthenticated) navigate('/login/email')
```

**Fixed Code ([`AppShell.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/components/AppShell.jsx)):**
```jsx
import { Link, NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom'

function AppShell() {
  const navigate = useNavigate()
  const { member, isAuthenticated, logout } = useSession()
  const [showDpiDetails, setShowDpiDetails] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/login/email" replace />
  }

  function handleSignOut() {
    logout()
    navigate('/')
  }
```

---

### CRIT-02: Overly Permissive RLS Policies Exposing All Member Data Publicly
* **File:** [`ek-epfo/supabase_schema.sql`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/supabase_schema.sql#L208-L216)
* **Severity:** Critical (CWE-284: Improper Access Control)
* **Description:** Row Level Security (RLS) is enabled, but the `SELECT` policy is defined with `using (true)` on all citizen tables. Any user with the public anonymous Supabase key (`VITE_SUPABASE_ANON_KEY`) can query all rows from `members`, `balances`, `claims`, `nominees`, and `transfers`.

**Offending Code ([`supabase_schema.sql:L208-216`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/supabase_schema.sql#L208-L216)):**
```sql
create policy "Public Read All" on public.members for select using (true);
create policy "Public Read Establishments" on public.establishments for select using (true);
create policy "Public Read Accounts" on public.member_accounts for select using (true);
create policy "Public Read Ledgers" on public.ecr_ledgers for select using (true);
create policy "Public Read Balances" on public.balances for select using (true);
create policy "Public Read Nominees" on public.nominees for select using (true);
create policy "Public Read Claims" on public.claims for select using (true);
create policy "Public Read Transfers" on public.transfers for select using (true);
create policy "Public Read Grievances" on public.grievances for select using (true);
```

**Fixed Code ([`supabase_schema.sql`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/supabase_schema.sql)):**
```sql
-- Restrict reads to authenticated user's own UAN or email match
create policy "Members Self Read" on public.members 
  for select using (auth.jwt() ->> 'email' = email or auth.role() = 'service_role');

create policy "Balances Self Read" on public.balances 
  for select using (uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role');

create policy "Claims Self Read" on public.claims 
  for select using (uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role');

-- Allow public read on non-sensitive establishment directory
create policy "Public Read Establishments" on public.establishments for select using (true);
```

---

### CRIT-03: Static Mock Data Hard-Binding on Authenticated Dashboard Pages
* **Files:**
  - [`ek-epfo/src/pages/DashboardPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/DashboardPage.jsx#L1-L3)
  - [`ek-epfo/src/pages/PassbookPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/PassbookPage.jsx#L1-L2)
  - [`ek-epfo/src/pages/ClaimsPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/ClaimsPage.jsx#L1-L3)
  - [`ek-epfo/src/pages/ProfilePage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/ProfilePage.jsx#L1-L3)
* **Severity:** High / Functional Blocker (CWE-200: Exposure of Sensitive Information)
* **Description:** Authenticated pages import static objects `balance, claims, member` directly from `mockData.js`. When a citizen registers a new UAN (e.g. Rahul Verma via `/uan/allot`), logging in still presents Ananya Rao's static passbook balance (₹4,93,600), claims, and profile details.

**Offending Code ([`DashboardPage.jsx:L1-3`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/DashboardPage.jsx#L1-L3)):**
```jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { balance, claims, member } from '../data/mockData.js'
```

**Fixed Code ([`DashboardPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/DashboardPage.jsx)):**
```jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../context/useSession.js'
import { balance as defaultBalance, claims as defaultClaims } from '../data/mockData.js'

function DashboardPage() {
  const navigate = useNavigate()
  const { member } = useSession()
  const currentBalance = member.balances || defaultBalance
  const currentClaims = member.claims || defaultClaims
  const activeEmployer = member.employers?.find((e) => e.status === 'Active') || member.employers?.[0] || { name: 'Active Establishment', memberId: 'N/A' }
  // ...
```

---

### CRIT-04: Non-Persisted Form Submissions & Data Loss
* **Files:**
  - [`ek-epfo/src/pages/NewClaimPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/NewClaimPage.jsx#L26-L38)
  - [`ek-epfo/src/pages/GrievancePage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/GrievancePage.jsx#L12-L16)
  - [`ek-epfo/src/pages/ClaimFixPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/ClaimFixPage.jsx#L43-L52)
* **Severity:** High (Functional Data Loss)
* **Description:** Submitting a new claim generates an in-memory object in component state. When the user navigates back to `/claims`, the claim is gone because neither Supabase `insertCloudClaim` nor local state arrays are updated. Similarly, grievance creation redirects to a hardcoded grievance without saving the input.

**Offending Code ([`NewClaimPage.jsx:L26-38`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/NewClaimPage.jsx#L26-L38)):**
```jsx
function handleSubmit(e) {
  e.preventDefault()
  setIsSubmitting(true)
  setTimeout(() => {
    setIsSubmitting(false)
    setSubmittedClaim({
      id: `CLM${Math.floor(1100 + Math.random() * 900)}`,
      amount: numAmount,
      form: 'Form 31',
      disbursementDate: 'Estimated within 3 business days',
    })
  }, 800)
}
```

**Fixed Code ([`NewClaimPage.jsx`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/NewClaimPage.jsx)):**
```jsx
import { insertCloudClaim } from '../lib/supabaseClient.js'
import { useSession } from '../context/useSession.js'

function handleSubmit(e) {
  e.preventDefault()
  setIsSubmitting(true)
  const newClaimObj = {
    claim_id: `CLM${Math.floor(1100 + Math.random() * 900)}`,
    uan: member.uan,
    form_number: selectedForm === 'form_31' ? 'Form 31' : selectedForm === 'form_19' ? 'Form 19' : 'Form 10C',
    claim_type: selectedForm === 'form_31' ? `Advance (${advancePurpose})` : 'Final Settlement',
    amount_requested: numAmount,
    filed_date: new Date().toISOString().slice(0, 10),
    status: 'in_progress',
    current_stage: 1
  }

  insertCloudClaim(newClaimObj).then(() => {
    setIsSubmitting(false)
    setSubmittedClaim({
      id: newClaimObj.claim_id,
      amount: numAmount,
      form: newClaimObj.form_number,
      disbursementDate: 'Estimated within 3 business days',
    })
  })
}
```

---

## 4. Functional Bugs (Broken Flows & Repro Steps)

| Bug ID | Title & Location | Steps to Reproduce | Expected Result | Actual Result |
|---|---|---|---|---|
| **FUNC-01** | `member.serviceYears` is undefined on Dashboard & Profile ([`DashboardPage.jsx:232`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/DashboardPage.jsx#L232), [`ProfilePage.jsx:134`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/ProfilePage.jsx#L134)) | 1. Log in to dashboard.<br>2. Inspect "Jurisdiction & KYC" card or Profile page. | Shows "Total Service Tenure: 9 Years 2 Months". | Renders empty text: `Total` because the property in `db.js` is named `totalServiceYears`. |
| **FUNC-02** | `KnowUanPage` always returns hardcoded Ananya Rao ([`KnowUanPage.jsx:14-26`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/public-services/KnowUanPage.jsx#L14-L26)) | 1. Go to `/uan/know`.<br>2. Enter any random mobile number (e.g. `9123456789`) and PAN.<br>3. Click "Fetch UAN". | Returns error or searches registry for matching phone/PAN. | Always returns `1004829371` and `Ananya Rao`. |
| **FUNC-03** | `PublicClaimTrackPage` defaults to `claims[0]` on non-existent ID ([`PublicClaimTrackPage.jsx:36`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/public-services/PublicClaimTrackPage.jsx#L36)) | 1. Navigate to `/claims/track-public`.<br>2. Enter non-existent ID `CLM9999`.<br>3. Click Track. | Displays "No claim record found for ID CLM9999". | Displays claim `CLM1042` with 100% success. |
| **FUNC-04** | Dead Button: "+ Initiate New Form 13 Transfer" ([`TransfersPage.jsx:25-28`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/TransfersPage.jsx#L25-L28)) | 1. Navigate to `/transfers`.<br>2. Click on "+ Initiate New Form 13 Transfer". | Opens transfer modal or navigates to initiation form. | Button has no `onClick` handler; nothing happens. |
| **FUNC-05** | UAN Activation Password Ignored ([`UanActivatePage.jsx:17,35-43`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/public-services/UanActivatePage.jsx#L17)) | 1. Navigate to `/uan/activate`.<br>2. Complete Step 1 and Step 2.<br>3. Enter custom password `MySecurePass#2026`. | Password is saved/hashed into registry/cloud. | Password is discarded; member is registered without credentials. |
| **FUNC-06** | Native `alert()` calls in Production Code ([`EstablishmentSearchPage.jsx:122`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/public-services/EstablishmentSearchPage.jsx#L122), [`PensionerHubPage.jsx:116`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/public-services/PensionerHubPage.jsx#L116)) | 1. Search an establishment or pensioner.<br>2. Click "View ECR Receipt" or "Submit Annual Life Certificate". | Renders styled modal or inline notification drawer. | Triggers disruptive browser `window.alert()`. |
| **FUNC-07** | Spelling Error: "Setteled" in Claims Portfolio ([`ClaimsPage.jsx:84`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/ClaimsPage.jsx#L84)) | 1. Navigate to `/claims`.<br>2. Observe status badge for settled claim. | Renders "✓ Settled & Disbursed". | Renders "✓ Setteled & Disbursed". |

---

## 5. Security & Auth Findings (Table)

| Vulnerability / Issue | Severity | Location | OWASP Category | Recommendation |
|---|---|---|---|---|
| **Unauthenticated Shell Access** | **CRITICAL** | [`AppShell.jsx:78`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/components/AppShell.jsx#L78) | A01:2021-Broken Access Control | Guard `/dashboard`, `/passbook`, `/claims`, `/profile` with `<Navigate to="/login/email" />` if `!isAuthenticated`. |
| **Global Anonymous Read on Database** | **CRITICAL** | [`supabase_schema.sql:208`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/supabase_schema.sql#L208) | A01:2021-Broken Access Control | Replace `using (true)` RLS policies with user identity claims (`auth.jwt() ->> 'email' = email`). |
| **Plaintext Aadhaar & PAN in Code** | **HIGH** | [`db.js:16-20`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/data/db.js#L16-L20) | A02:2021-Cryptographic Failures | Remove full Aadhaar & PAN strings from client bundles; use synthetic masked tokens (`•••• •••• 9281`) only. |
| **Insecure Pseudo-JWT Stored in localStorage** | **MEDIUM** | [`SessionContext.jsx:49`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/context/SessionContext.jsx#L49) | A07:2021-Identification & Auth Failures | Use genuine signed Supabase Auth session tokens; migrate session cookies to `HttpOnly; Secure; SameSite=Strict`. |
| **Missing Foreign Key Indexes** | **MEDIUM** | [`supabase_schema.sql:46,60,86,99`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/supabase_schema.sql#L46) | Performance / Denial of Service | Add `CREATE INDEX idx_claims_uan ON public.claims(uan);`, `idx_ledgers_uan`, `idx_accounts_uan`. |
| **Missing Schema Check Constraints** | **LOW** | [`supabase_schema.sql:107`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/supabase_schema.sql#L107) | A04:2021-Insecure Design | Add `CHECK (status IN ('disbursed', 'in_progress', 'rejected'))` and `CHECK (current_stage BETWEEN 1 AND 4)`. |
| **Lack of Anti-Brute-Force Lockout** | **LOW** | [`LoginVerifyPage.jsx:30`](file:///c:/Users/Vrushabh/Downloads/EPFO%20Web/ek-epfo/src/pages/LoginVerifyPage.jsx#L30) | A07:2021-Identification & Auth Failures | Lock out OTP submission after 3 invalid attempts for 15 minutes (matching real EPFO portal security policy). |

---

## 6. Database & Data Integrity Analysis

### 6.1 Schema Deficiencies in `supabase_schema.sql`

1. **Foreign Key Index Absence:**
   PostgreSQL does not automatically index foreign keys. In a high-throughput system simulating 8.1 crore members, joins across `members`, `claims`, and `ecr_ledgers` will perform full-table scans.
   ```sql
   -- Required Index Migration
   CREATE INDEX IF NOT EXISTS idx_member_accounts_uan ON public.member_accounts(uan);
   CREATE INDEX IF NOT EXISTS idx_ecr_ledgers_uan ON public.ecr_ledgers(uan);
   CREATE INDEX IF NOT EXISTS idx_claims_uan ON public.claims(uan);
   CREATE INDEX IF NOT EXISTS idx_transfers_uan ON public.transfers(uan);
   CREATE INDEX IF NOT EXISTS idx_grievances_uan ON public.grievances(uan);
   CREATE INDEX IF NOT EXISTS idx_nominees_uan ON public.nominees(uan);
   ```

2. **Missing Transactional Integrity in Cloud Upserts:**
   In `supabaseClient.js` (lines 97–111), `upsertCloudMember` updates the `members` table and subsequently executes an unchained upsert on the `balances` table. If the second network call fails, the database enters an inconsistent state where a member exists without an associated balance record.

3. **Data Protection Compliance (DPDP Act 2023 & Aadhaar Act 2016):**
   Full Aadhaar numbers (`db.js:18`) must never be stored on the client or in cleartext SQL columns. The database schema should enforce storing only the **Virtual ID (VID)** or SHA-256 hashed demographic reference with the last 4 digits displayed.

---

## 7. Frontend & UX Quality Review

1. **Form Validation Completeness:**
   - Client-side validation exists on HTML inputs (`required`, `type="email"`), but lacked regex validation for standard Indian administrative formats (e.g. 12-digit UAN `^[1-9][0-9]{11}$`, 10-character PAN `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`, 11-character IFSC `^[A-Z]{4}0[A-Z0-9]{6}$`).
2. **Accessibility (a11y) Conformance:**
   - **Good:** `ClaimDetailPage.jsx` includes a well-engineered `HelpModal` with keyboard trap focus and `Escape` key listeners.
   - **Needs Improvement:** The DigiLocker modal in `LoginEmailPage.jsx` and the Grievance modal in `GrievancePage.jsx` lack keyboard focus traps and background scroll-lock.
3. **Mobile & Table Responsiveness:**
   - `PassbookPage.jsx` and `PensionerHubPage.jsx` feature tables with 5–7 columns. On mobile screens (<480px), `.table-responsive` allows scrolling, but adding sticky headers (`position: sticky; top: 0`) and sticky first columns (`Wage Month`) significantly improves usability.

---

## 8. Realism Check: Comparison with Live EPFO Portal (`unifiedportal-mem.epfindia.gov.in`)

| Feature / Element | Live EPFO Member Portal | Ek-EPFO Prototype Status | Gap / Recommendation |
|---|---|---|---|
| **Primary Identity** | 12-Digit Permanent UAN | 10–12 Digit UAN supported | Standardize UAN field strictly to 12 digits everywhere. |
| **Authentication Rail** | Password + Visual CAPTCHA + Aadhaar OTP 2FA | Email OTP + Simulated SMS OTP | Keep the modernized OTP-first UX (much better than CAPTCHA), but add an Aadhaar e-Sign modal on claim submission. |
| **Member ID (MID) Scoping** | A UAN contains multiple MIDs (one per employer). Passbook is chosen per MID. | Single unified passbook | Add a dropdown on `/passbook` to switch between `Sundar Textiles (Relieved)` and `Coral Systems (Active)`. |
| **Claim Submission Verification** | Requires Aadhaar OTP e-Sign + Bank passbook / cancelled cheque image upload | Instant 1-click submit | Add a step to upload a cancelled cheque / passbook copy (<500 KB) before final submission to match statutory KYC rules. |
| **Grievance Redressal** | Redirects to standalone EPFiGMS (`epfigms.gov.in`) | Integrated into main shell | **Major Win for Ek-EPFO.** Unifying EPFiGMS into the member shell solves a massive real-world pain point. |
| **Trust & Compliance Signals** | Extensive fraud notices, National Emblem, bilingual (EN/HI) header, toll-free `1800-118-005` | Present in header and footer | Add a Hindi language toggle (`English / हिन्दी`) in top bar for authentic Indian public sector feel. |

---

## 9. Suggested Priority Order for Hackathon Remediation

Given limited hackathon time, execute fixes in this exact order to maximize demo stability, data consistency, and judge credibility:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ 1. P0 (15 mins) — CRIT-01: Add Auth Guard in AppShell.jsx                  │
│    Prevent unauthenticated viewing of private member data.                 │
├────────────────────────────────────────────────────────────────────────────┤
│ 2. P0 (20 mins) — CRIT-03 & FUNC-01: Bind Pages to useSession()            │
│    Connect Dashboard, Passbook, and Profile to logged-in user context.     │
│    Fix member.serviceYears -> member.totalServiceYears.                    │
├────────────────────────────────────────────────────────────────────────────┤
│ 3. P1 (20 mins) — CRIT-04: Persist New Claims & Grievances to State/DB    │
│    Ensure claims filed in /claims/new immediately appear in /claims.       │
├────────────────────────────────────────────────────────────────────────────┤
│ 4. P1 (15 mins) — FUNC-02 & FUNC-03: Fix Public Tools Lookup Fallbacks     │
│    Add proper 'Not Found' states for Know UAN & Public Claim Track.        │
├────────────────────────────────────────────────────────────────────────────┤
│ 5. P2 (10 mins) — FUNC-06 & FUNC-07: Replace alert() & Fix Typos           │
│    Replace native alerts with toast messages; fix "Setteled" typo.         │
├────────────────────────────────────────────────────────────────────────────┤
│ 6. P2 (15 mins) — Database Indexes & Schema Constraints                   │
│    Run SQL migration for foreign key indexes and CHECK constraints.        │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Verification Script & Checkpoints

Run the following test steps to verify all fixes:
1. **Unauthenticated Check:** Open an Incognito window, browse directly to `http://localhost:5173/dashboard`. Verify instant redirect to `/login/email`.
2. **Registration & Dynamic Context Check:** Navigate to `/uan/allot`, register a new worker `Pooja Sharma`, log in with the new UAN, and verify that the Dashboard displays `Pooja Sharma` rather than `Ananya Rao`.
3. **Claim Persistence Check:** Navigate to `/claims/new`, file a Medical Advance claim for ₹35,000. Navigate to `/claims` and verify the new claim appears at the top of the list with status `Under Process`.
4. **Public Tracker Check:** Go to `/claims/track-public`, enter a non-existent claim ID `CLM-FAKE-99`. Verify an error banner appears rather than a dummy success claim.
