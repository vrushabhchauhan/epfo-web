import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LandingPage.css'

const personaCards = [
  {
    role: 'Employee / Member',
    badge: '8.1 Cr Active',
    title: 'Check balance, withdraw, or file claims',
    desc: 'Access your unified passbook, initiate Form 19/31 claims, and transfer PF accounts seamlessly.',
    actionLabel: 'Log in with UAN',
    route: '/login/email',
    popularIntents: ['Download Passbook', 'Medical Advance (Form 31)', 'Transfer PF (Form 13)'],
  },
  {
    role: 'Pensioner (EPS)',
    badge: 'Centralized CPPS',
    title: 'Monthly pension and digital life certificates',
    desc: 'Track CPPS monthly disbursements, view your PPO number, and update Jeevan Pramaan status.',
    actionLabel: 'Pensioner Portal',
    route: '/pensioner',
    popularIntents: ['PPO Status', 'Jeevan Pramaan (DLC)', 'CPPS Payment History'],
  },
  {
    role: 'Family & Nominee',
    badge: 'EDLI Insurance',
    title: 'File death and beneficiary claims',
    desc: 'Single guided entry point for PF settlement (Form 20) and EDLI insurance benefit up to ₹7 Lakh.',
    actionLabel: 'File Family Claim',
    route: '/claims/new/death/step-1',
    popularIntents: ['Death Claim Wizard', 'EDLI Insurance Claim', 'Track Beneficiary Status'],
  },
  {
    role: 'Establishment / Employer',
    badge: 'ECR 2.0',
    title: 'Electronic Challan and compliance filings',
    desc: 'Monthly ECR uploads, payment receipts, joint declaration approvals, and establishment KYC.',
    actionLabel: 'Check Compliance',
    route: '/establishment/search',
    popularIntents: ['Establishment Search', 'ECR Challan Status', 'Vendor Compliance'],
  },
]

const liveTelemetry = [
  { label: 'National Member Records', value: '8.1 Crore+', sub: 'Unified under CITES 2.01' },
  { label: 'Total Corpus Administered', value: '₹30+ Lakh Cr', sub: 'Triple statutory schemes' },
  { label: 'Form-31 Auto-Settlement', value: '84.2%', sub: 'Pre-validated KYC claims' },
  { label: 'Average Resolution Time', value: '2.8 Days', sub: 'Direct to bank account' },
]

const searchableServices = [
  {
    id: 'med',
    title: 'Medical Advance (Form 31)',
    category: 'Advance Claim',
    form: 'Form 31',
    route: '/claims/new',
    keywords: ['medical', 'illness', 'hospital', 'surgery', 'disease', 'advance', 'treatment', 'emergency', 'doctor', 'form 31', '31'],
    desc: 'Withdraw for illness, surgery, or hospitalization with zero employer signature.',
  },
  {
    id: 'death',
    title: 'Family & Death Claim Wizard (Form 20 & 5IF)',
    category: 'Death Claim',
    form: 'Form 20 / 5IF',
    route: '/claims/new/death/step-1',
    keywords: ['death', 'died', 'deceased', 'family', 'nominee', 'insurance', 'edli', 'widow', 'orphan', 'form 20', 'form 5if', '5if', '20'],
    desc: 'Single-window guided claim for EPF balance + ₹7 Lakh EDLI life insurance.',
  },
  {
    id: 'passbook',
    title: 'Passbook & ECR Monthly Contribution Ledger',
    category: 'Passbook',
    form: 'CITES 2.01',
    route: '/login/email',
    keywords: ['passbook', 'balance', 'ledger', 'statement', 'contribution', 'ecr', 'challan', 'interest', 'monthly', 'download pdf'],
    desc: 'Month-on-month deposit breakdown, 8.25% interest credits, and PDF export.',
  },
  {
    id: 'transfer',
    title: 'PF Account Transfer (Form 13)',
    category: 'Transfer',
    form: 'Form 13',
    route: '/login/email',
    keywords: ['transfer', 'switch', 'job change', 'previous employer', 'merge', 'form 13', '13', 'nudge', 'attestation'],
    desc: 'Transfer previous member ID balance with 1-click employer nudge.',
  },
  {
    id: 'pension',
    title: 'EPS Monthly Pension Calculator',
    category: 'Calculator',
    form: 'EPS 1995',
    route: '/calculators',
    keywords: ['pension', 'calculator', 'eps', 'retirement', 'monthly pension', '10d', 'superannuation', 'formula'],
    desc: 'Calculate monthly retirement pension using statutory (Salary × Service) / 70.',
  },
  {
    id: 'edli',
    title: 'EDLI Life Insurance Calculator (₹7 Lakh)',
    category: 'Calculator',
    form: 'EDLI 1976',
    route: '/calculators',
    keywords: ['edli', 'insurance', 'calculator', 'life cover', '7 lakh', '700000', 'nominee benefit'],
    desc: 'Calculate exact assurance benefit up to ₹7,00,000 for designated family nominee.',
  },
  {
    id: 'est',
    title: 'Establishment Search & ECR Compliance Checker',
    category: 'Transparency',
    form: 'ECR 2.0',
    route: '/establishment/search',
    keywords: ['establishment', 'employer', 'company', 'search', 'compliance', 'ecr deposit', 'coral', 'sundar', 'tcs', 'infosys'],
    desc: 'Lookup company compliance score, active workforce size, and ECR challan receipts.',
  },
  {
    id: 'ppo',
    title: 'Pensioner Hub & CPPS PPO Tracker',
    category: 'Pensioner',
    form: 'CPPS Rail',
    route: '/pensioner',
    keywords: ['ppo', 'pensioner', 'cpps', 'jeevan pramaan', 'dlc', 'life certificate', 'face authentication', 'facerd'],
    desc: 'Track monthly pension credits, PPO status, and Jeevan Pramaan (DLC) validity.',
  },
  {
    id: 'act',
    title: 'Activate Universal Account Number (UAN)',
    category: 'Onboarding',
    form: 'Para 36A',
    route: '/uan/activate',
    keywords: ['activate', 'uan activation', 'first time', 'password', 'pin', 'aadhaar otp'],
    desc: 'First-time worker activation via Aadhaar OTP validation & password creation.',
  },
  {
    id: 'know',
    title: 'Know Your UAN',
    category: 'Lookup',
    form: 'Public Tool',
    route: '/uan/know',
    keywords: ['know uan', 'find uan', 'forgot uan', 'search uan', 'mobile search', 'pan search'],
    desc: 'Find your 12-digit UAN using Mobile + Aadhaar/PAN.',
  },
  {
    id: 'allot',
    title: 'Direct UAN Allotment for Gig Workers',
    category: 'Onboarding',
    form: 'e-KYC',
    route: '/uan/allot',
    keywords: ['allotment', 'generate uan', 'new uan', 'gig worker', 'direct uan', 'self registration'],
    desc: 'Direct citizen self-registration via Aadhaar e-KYC with instant digital UAN card.',
  },
  {
    id: 'track',
    title: 'Track Claim Status (Pre-Login)',
    category: 'Tracking',
    form: 'Public Tracker',
    route: '/claims/track-public',
    keywords: ['track', 'claim status', 'public track', 'tracking', 'clm', 'progress', 'stepper'],
    desc: 'Check 4-stage processing progress of any claim using UAN or Claim ID.',
  },
  {
    id: 'kyc',
    title: 'DigiLocker Joint Declaration e-KYC Overwrite',
    category: 'Profile',
    form: 'Joint Decl.',
    route: '/login/email',
    keywords: ['kyc', 'joint declaration', 'correction', 'name change', 'dob change', 'digilocker', 'aadhaar xml'],
    desc: '1-click direct demographic overwrite matching Aadhaar XML records.',
  },
  {
    id: 'grv',
    title: 'Lodge & Escalate Grievance (EPFiGMS)',
    category: 'Grievance',
    form: 'EPFiGMS',
    route: '/login/email',
    keywords: ['grievance', 'complaint', 'epfigms', 'escalate', 'officer', 'delay', 'helpdesk', 'cpgrams', 'sla'],
    desc: '7-day SLA tracking with assigned APFC Nodal Officer and Ministry CPGRAMS escalation.',
  },
]

function LandingPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const cleanQuery = searchQuery.trim().toLowerCase()
  const filteredServices = cleanQuery
    ? searchableServices.filter((s) => {
        const inTitle = s.title.toLowerCase().includes(cleanQuery)
        const inForm = s.form.toLowerCase().includes(cleanQuery)
        const inKeywords = s.keywords?.some((k) => k.toLowerCase().includes(cleanQuery) || cleanQuery.includes(k.toLowerCase()))
        return inTitle || inForm || inKeywords
      })
    : []

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (filteredServices.length > 0) {
      navigate(filteredServices[0].route)
    } else {
      navigate('/login/email')
    }
  }

  return (
    <div className="landing-layout">
      {/* Gov Top Banner */}
      <div className="gov-topstrip">
        <div className="gov-topstrip__inner">
          <span className="gov-topstrip__flag">🇮🇳</span>
          <span className="gov-topstrip__text">
            Government of India &bull; Ministry of Labour &amp; Employment &bull; <strong>Employees' Provident Fund Organisation</strong>
          </span>
          <span className="gov-topstrip__contact">
            Toll-free Helpdesk: <strong className="number">1800-118-005</strong>
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="landing-nav">
        <div className="landing-nav__inner">
          <Link to="/" className="landing-logo">
            <span className="landing-logo__emblem">🏛️</span>
            <div className="landing-logo__titles">
              <span className="landing-logo__name">Ek EPFO</span>
              <span className="landing-logo__tag">National Unified Citizen Portal (CITES 2.01)</span>
            </div>
          </Link>

          <div className="landing-nav__actions">
            <Link to="/claims/new/death/step-1" className="landing-nav__link">
              Death Claim Wizard
            </Link>
            <Link to="/login/email" className="landing-nav__btn">
              Member Sign In &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="landing-hero__inner">
          <div className="landing-hero__badge">
            <span className="badge-pulse" />
            <span>CITES 2.01 Centralized Database Live &bull; Single Window Portal</span>
          </div>

          <h1 id="hero-title" className="landing-hero__headline">
            One unified portal for your provident fund. Not five websites.
          </h1>
          <p className="landing-hero__sub">
            Check your live passbook, settle claims in 3 days, correct profile errors via DigiLocker, and file family claims without paperwork.
          </p>

          {/* Quick Life Intent Search Bar */}
          <div className="hero-search-wrapper">
            <form className="hero-search-box" onSubmit={handleSearchSubmit}>
              <span className="hero-search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                className="hero-search-input"
                placeholder="What do you need? e.g. 'Withdraw PF for medical emergency', 'Death claim', 'Pension calculator', 'Passbook'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
              <button type="submit" className="hero-search-btn">
                Search Services &rarr;
              </button>
            </form>

            {/* Live Search Results Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="search-results-dropdown" role="listbox">
                <div className="search-dropdown-header">
                  <span>Matching EPFO Services ({filteredServices.length})</span>
                  <button
                    type="button"
                    className="dropdown-close-btn"
                    onClick={() => setIsSearchFocused(false)}
                  >
                    ✕ Close
                  </button>
                </div>

                {filteredServices.length > 0 ? (
                  <div className="search-results-list">
                    {filteredServices.map((item) => (
                      <Link
                        key={item.id}
                        to={item.route}
                        className="search-result-item"
                        onClick={() => setIsSearchFocused(false)}
                      >
                        <div className="res-item-top">
                          <span className="res-category-tag">{item.category}</span>
                          <span className="res-form-badge">{item.form}</span>
                        </div>
                        <strong className="res-item-title">{item.title}</strong>
                        <p className="res-item-desc">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="search-no-results">
                    <span>No exact matching service found for "{searchQuery}". Try "Medical", "Pension", "Passbook", or "Death Claim".</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Intent Pills */}
          <div className="hero-intent-pills">
            <span className="intent-label">Frequent Tasks:</span>
            <button type="button" onClick={() => navigate('/login/email')} className="intent-pill">
              Check Balance &amp; Passbook
            </button>
            <button type="button" onClick={() => navigate('/login/email')} className="intent-pill">
              Medical Advance (Form 31)
            </button>
            <button type="button" onClick={() => navigate('/claims/new/death/step-1')} className="intent-pill intent-pill--accent">
              Family &amp; Death Claim (Form 20 &amp; 5IF)
            </button>
            <button type="button" onClick={() => navigate('/login/email')} className="intent-pill">
              PF Transfer (Form 13)
            </button>
          </div>
        </div>
      </section>

      {/* National Telemetry Numbers Bar */}
      <section className="telemetry-bar" aria-label="National EPFO Live Statistics">
        <div className="telemetry-bar__inner">
          {liveTelemetry.map((item) => (
            <div className="telemetry-card" key={item.label}>
              <span className="telemetry-value number">{item.value}</span>
              <span className="telemetry-label">{item.label}</span>
              <span className="telemetry-sub">{item.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Persona Portals Grid */}
      <section className="persona-section" aria-labelledby="personas-title">
        <div className="persona-section__inner">
          <div className="section-header">
            <h2 id="personas-title">Choose your pathway</h2>
            <p>Every member, pensioner, and beneficiary service consolidated under a single secure gateway.</p>
          </div>

          <div className="persona-grid">
            {personaCards.map((card) => (
              <div className="persona-card" key={card.role}>
                <div className="persona-card__top">
                  <span className="persona-card__role">{card.role}</span>
                  <span className="persona-card__badge">{card.badge}</span>
                </div>
                <h3 className="persona-card__title">{card.title}</h3>
                <p className="persona-card__desc">{card.desc}</p>

                <div className="persona-card__intents">
                  {card.popularIntents.map((intent) => (
                    <span className="persona-intent-tag" key={intent}>
                      &bull; {intent}
                    </span>
                  ))}
                </div>

                <div className="persona-card__action">
                  <Link to={card.route} className="persona-btn">
                    {card.actionLabel} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citizen Public Services & Tools Grid */}
      <section className="public-services-section" aria-labelledby="services-title">
        <div className="public-services-section__inner">
          <div className="section-header">
            <h2 id="services-title">Citizen Public Services &amp; Tools</h2>
            <p>Essential EPFO onboarding, identification, and tracking utilities accessible without login.</p>
          </div>

          <div className="services-tool-grid">
            <Link to="/uan/activate" className="tool-card">
              <div className="tool-card__icon">⚡</div>
              <h3>Activate UAN</h3>
              <p>First-time activation using Aadhaar OTP authentication and secure password generation.</p>
              <span className="tool-card__action">Activate Online &rarr;</span>
            </Link>

            <Link to="/uan/know" className="tool-card">
              <div className="tool-card__icon">🔍</div>
              <h3>Know Your UAN</h3>
              <p>Find your 12-digit permanent account number using your registered mobile and Aadhaar / PAN.</p>
              <span className="tool-card__action">Search UAN &rarr;</span>
            </Link>

            <Link to="/uan/allot" className="tool-card">
              <div className="tool-card__icon">🆔</div>
              <h3>Direct UAN Allotment</h3>
              <p>Direct citizen onboarding for gig and new formal workforce entrants via Aadhaar e-KYC.</p>
              <span className="tool-card__action">Generate New UAN &rarr;</span>
            </Link>

            <Link to="/claims/track-public" className="tool-card">
              <div className="tool-card__icon">📍</div>
              <h3>Track Claim Status</h3>
              <p>Check the live processing status of your advance or settlement claim without signing in.</p>
              <span className="tool-card__action">Track Public Claim &rarr;</span>
            </Link>

            <Link to="/calculators" className="tool-card">
              <div className="tool-card__icon">🧮</div>
              <h3>Benefit Calculators</h3>
              <p>Simulate EPS monthly pension, ₹7 Lakh EDLI life cover, and 8.25% retirement compounding.</p>
              <span className="tool-card__action">Calculate Benefits &rarr;</span>
            </Link>

            <Link to="/establishment/search" className="tool-card">
              <div className="tool-card__icon">🏢</div>
              <h3>Establishment Search</h3>
              <p>Verify any employer's live PF compliance score, workforce size, and monthly ECR deposit.</p>
              <span className="tool-card__action">Search Employers &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Security & Official Trust Banner */}
      <footer className="landing-trust-footer">
        <div className="landing-trust-footer__inner">
          <div className="trust-col">
            <strong>🔒 Verified National Public Digital Good</strong>
            <p>Protected by 256-bit encryption, Aadhaar 2FA, and DigiLocker instant verification rails.</p>
          </div>
          <div className="trust-col">
            <strong>⚠️ Anti-Fraud Advisory</strong>
            <p>EPFO never asks for OTP, passwords, or fee deposits via phone calls or private links.</p>
          </div>
          <div className="trust-col text-right">
            <span>Independent Hackathon Prototype &bull; Build What Moves India</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
