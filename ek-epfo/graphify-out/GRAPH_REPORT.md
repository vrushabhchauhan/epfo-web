# Graph Report - ek-epfo  (2026-08-25)

## Corpus Check
- 56 files · ~20,544 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 218 nodes · 390 edges · 22 communities (17 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7461c1f6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- mockData.js
- LandingPage.jsx
- package.json
- .oxlintrc.json
- useDeathClaimWizard
- React + Vite
- AGENTS.md
- rules/graphify.md
- workflows/graphify.md
- CLAUDE.md
- GEMINI.md
- ClaimDetailPage.jsx
- react
- DeathClaimStep3Page
- ProfilePage.jsx
- devDependencies
- supabaseClient.js
- EstablishmentSearchPage.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 39 edges
2. `useDeathClaimWizard()` - 11 edges
3. `isSupabaseConfigured()` - 10 edges
4. `DeathClaimStep3Page()` - 9 edges
5. `member` - 8 edges
6. `sendEmailOtp()` - 8 edges
7. `DeathClaimStep2Page()` - 8 edges
8. `LoginVerifyPage()` - 7 edges
9. `claims` - 6 edges
10. `DeathClaimStep1Page()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `DeathClaimStep3Page()` --calls--> `useDeathClaimWizard()`  [EXTRACTED]
  src/pages/death-claim/DeathClaimStep3Page.jsx → src/context/DeathClaimContext.js
- `LoginVerifyPage()` --calls--> `useSession()`  [EXTRACTED]
  src/pages/LoginVerifyPage.jsx → src/context/useSession.js
- `handleResend()` --calls--> `sendEmailOtp()`  [EXTRACTED]
  src/pages/LoginVerifyPage.jsx → src/lib/supabaseClient.js
- `handleVerify()` --calls--> `verifyEmailOtp()`  [EXTRACTED]
  src/pages/LoginVerifyPage.jsx → src/lib/supabaseClient.js
- `AppShell()` --calls--> `useSession()`  [EXTRACTED]
  src/components/AppShell.jsx → src/context/useSession.js

## Import Cycles
- None detected.

## Communities (22 total, 5 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.07
Nodes (16): App(), nominee, ClaimFixPage(), GrievancePage(), KycCorrectionPage(), formatFullDate(), NomineePage(), CalculatorsPage() (+8 more)

### Community 1 - "mockData.js"
Cohesion: 0.12
Nodes (16): balance, claims, contributionHistory, grievances, member, rejectionReasons, transfers, ClaimsPage() (+8 more)

### Community 2 - "LandingPage.jsx"
Cohesion: 0.33
Nodes (4): LandingPage(), liveTelemetry, personaCards, searchableServices

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (20): dependencies, pg, react, react-dom, react-router-dom, @supabase/supabase-js, name, private (+12 more)

### Community 4 - ".oxlintrc.json"
Cohesion: 0.25
Nodes (7): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, warn

### Community 5 - "useDeathClaimWizard"
Cohesion: 0.10
Nodes (17): WizardLayout(), WizardStepIndicator(), DeathClaimContext, initialWizardData, useDeathClaimWizard(), DeathClaimWizardProvider(), DeathClaimConfirmationPage(), DeathClaimStep1Page() (+9 more)

### Community 8 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

### Community 14 - "ClaimDetailPage.jsx"
Cohesion: 0.38
Nodes (5): ClaimDetailPage(), formatDisplayDate(), formatIndianCurrency(), HelpModal(), helpText

### Community 15 - "react"
Cohesion: 0.20
Nodes (7): react, AppShell(), navItems, SessionProvider(), SessionContext, useSession(), systemStatus

### Community 16 - "DeathClaimStep3Page"
Cohesion: 0.52
Nodes (7): DeathClaimStep3Page(), handleBack(), handleContinue(), handleDeathCertSelect(), handleNomineeIdSelect(), handleNotesChange(), syncContextData()

### Community 17 - "ProfilePage.jsx"
Cohesion: 0.83
Nodes (3): formatFullDate(), formatYearMonth(), ProfilePage()

### Community 18 - "devDependencies"
Cohesion: 0.18
Nodes (11): oxlint, devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, @types/react (+3 more)

### Community 19 - "supabaseClient.js"
Cohesion: 0.28
Nodes (13): getCloudClaims(), getCloudMember(), insertCloudClaim(), insertCloudGrievance(), isSupabaseConfigured(), sendEmailOtp(), supabase, verifyEmailOtp() (+5 more)

### Community 21 - "EstablishmentSearchPage.jsx"
Cohesion: 0.40
Nodes (3): db, demoEstablishments, EstablishmentSearchPage()

## Knowledge Gaps
- **38 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `name` (+33 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `App.jsx`, `mockData.js`, `LandingPage.jsx`, `.oxlintrc.json`, `useDeathClaimWizard`, `ClaimDetailPage.jsx`, `ProfilePage.jsx`, `supabaseClient.js`, `EstablishmentSearchPage.jsx`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `plugins` connect `.oxlintrc.json` to `react`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `DeathClaimStep3Page()` connect `DeathClaimStep3Page` to `App.jsx`, `useDeathClaimWizard`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _38 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07226890756302522 - nodes in this community are weakly interconnected._
- **Should `mockData.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11822660098522167 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._