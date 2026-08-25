# Graph Report - ek-epfo  (2026-08-25)

## Corpus Check
- 48 files · ~15,668 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 182 nodes · 315 edges · 21 communities (13 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
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
- react
- React + Vite
- AGENTS.md
- rules/graphify.md
- workflows/graphify.md
- CLAUDE.md
- GEMINI.md
- ClaimDetailPage.jsx
- TransfersPage.jsx
- DeathClaimStep3Page
- ProfilePage.jsx
- ClaimFixPage
- LoginVerifyPage

## God Nodes (most connected - your core abstractions)
1. `react` - 33 edges
2. `useDeathClaimWizard()` - 11 edges
3. `member` - 9 edges
4. `DeathClaimStep3Page()` - 9 edges
5. `DeathClaimStep2Page()` - 8 edges
6. `claims` - 6 edges
7. `syncContextData()` - 6 edges
8. `scripts` - 5 edges
9. `WizardLayout()` - 5 edges
10. `DeathClaimStep1Page()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `DeathClaimStep3Page()` --calls--> `useDeathClaimWizard()`  [EXTRACTED]
  src/pages/death-claim/DeathClaimStep3Page.jsx → src/context/DeathClaimContext.js
- `DeathClaimConfirmationPage()` --calls--> `useDeathClaimWizard()`  [EXTRACTED]
  src/pages/death-claim/DeathClaimConfirmationPage.jsx → src/context/DeathClaimContext.js
- `DeathClaimStep1Page()` --calls--> `useDeathClaimWizard()`  [EXTRACTED]
  src/pages/death-claim/DeathClaimStep1Page.jsx → src/context/DeathClaimContext.js
- `DeathClaimStep2Page()` --calls--> `useDeathClaimWizard()`  [EXTRACTED]
  src/pages/death-claim/DeathClaimStep2Page.jsx → src/context/DeathClaimContext.js
- `DeathClaimStep4Page()` --calls--> `useDeathClaimWizard()`  [EXTRACTED]
  src/pages/death-claim/DeathClaimStep4Page.jsx → src/context/DeathClaimContext.js

## Import Cycles
- None detected.

## Communities (21 total, 8 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.08
Nodes (16): App(), AppShell(), grievances, nominee, ClaimsPage(), formatINR(), GrievanceDetailPage(), GrievancePage() (+8 more)

### Community 1 - "mockData.js"
Cohesion: 0.13
Nodes (14): navItems, db, balance, claims, contributionHistory, member, rejectionReasons, systemStatus (+6 more)

### Community 2 - "LandingPage.jsx"
Cohesion: 0.40
Nodes (3): LandingPage(), liveTelemetry, personaCards

### Community 3 - "package.json"
Cohesion: 0.07
Nodes (27): oxlint, dependencies, react, react-dom, react-router-dom, devDependencies, oxlint, @types/react (+19 more)

### Community 4 - ".oxlintrc.json"
Cohesion: 0.25
Nodes (7): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, warn

### Community 5 - "react"
Cohesion: 0.12
Nodes (18): react, WizardLayout(), WizardStepIndicator(), DeathClaimContext, initialWizardData, useDeathClaimWizard(), DeathClaimWizardProvider(), DeathClaimConfirmationPage() (+10 more)

### Community 8 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

### Community 14 - "ClaimDetailPage.jsx"
Cohesion: 0.38
Nodes (5): ClaimDetailPage(), formatDisplayDate(), formatIndianCurrency(), HelpModal(), helpText

### Community 16 - "DeathClaimStep3Page"
Cohesion: 0.52
Nodes (7): DeathClaimStep3Page(), handleBack(), handleContinue(), handleDeathCertSelect(), handleNomineeIdSelect(), handleNotesChange(), syncContextData()

### Community 17 - "ProfilePage.jsx"
Cohesion: 0.83
Nodes (3): formatFullDate(), formatYearMonth(), ProfilePage()

## Knowledge Gaps
- **32 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `name` (+27 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `App.jsx`, `mockData.js`, `LandingPage.jsx`, `.oxlintrc.json`, `ClaimDetailPage.jsx`, `TransfersPage.jsx`, `ProfilePage.jsx`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `plugins` connect `.oxlintrc.json` to `react`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `DeathClaimStep3Page()` connect `DeathClaimStep3Page` to `App.jsx`, `react`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _32 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08143939393939394 - nodes in this community are weakly interconnected._
- **Should `mockData.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13105413105413105 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._