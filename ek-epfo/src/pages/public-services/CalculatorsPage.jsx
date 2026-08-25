import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './CalculatorsPage.css'

function formatINR(val) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val)
}

function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState('pension') // 'pension' | 'edli' | 'corpus'

  // EPS Pension Calculator State
  const [pensionSalary, setPensionSalary] = useState(15000)
  const [serviceYears, setServiceYears] = useState(25)
  const [optHigherWage, setOptHigherWage] = useState(false)

  // EDLI Insurance Calculator State
  const [edliSalary, setEdliSalary] = useState(15000)
  const [avgPfBalance, setAvgPfBalance] = useState(200000)

  // EPF Corpus Growth Simulator State
  const [monthlyBasic, setMonthlyBasic] = useState(30000)
  const [currentAge, setCurrentAge] = useState(28)
  const retirementAge = 58
  const [annualHike, setAnnualHike] = useState(5)

  // EPS Pension Math: (Pensionable Salary * Effective Service) / 70
  // Statutory rule 1: If service >= 20 years, +2 bonus years added (EPS Para 10(2))
  const effectiveServiceYears = serviceYears >= 20 ? serviceYears + 2 : serviceYears
  const effectivePensionSalary = optHigherWage ? pensionSalary : Math.min(pensionSalary, 15000)
  // Statutory rule 2: Minimum pension floor is ₹1,000/month
  const computedPension = Math.round((effectivePensionSalary * effectiveServiceYears) / 70)
  const monthlyPension = Math.max(computedPension, 1000)

  // EDLI Insurance Math: (35 * Salary) + Min(50% of Balance, 175000), max cap 7,00,000
  const edliBase = 35 * Math.min(edliSalary, 15000)
  const edliBonus = Math.min(0.5 * avgPfBalance, 175000)
  const totalEdliBenefit = Math.min(Math.round(edliBase + edliBonus), 700000)

  // EPF Corpus Simulation Math (8.25% p.a. compounding)
  const yearsToRetire = Math.max(0, retirementAge - currentAge)
  let simulatedCorpus = 0
  let currentSalary = monthlyBasic
  const ratePerMonth = 0.0825 / 12

  for (let y = 0; y < yearsToRetire; y++) {
    const monthlyDeposit = currentSalary * 0.24 // 12% EE + 12% ER
    for (let m = 0; m < 12; m++) {
      simulatedCorpus = (simulatedCorpus + monthlyDeposit) * (1 + ratePerMonth)
    }
    currentSalary *= (1 + annualHike / 100)
  }
  const roundedCorpus = Math.round(simulatedCorpus)

  return (
    <div className="calc-page-layout">
      {/* Header */}
      <header className="calc-header">
        <Link to="/" className="calc-back-link">&larr; Back to Home</Link>
        <div className="calc-title-row">
          <span className="calc-badge">Statutory Decision Tools</span>
          <h1>Citizen Benefit Calculators &amp; Simulators</h1>
        </div>
        <p className="calc-subtitle">
          Interactive official simulators for EPS 1995 Monthly Pension, EDLI Life Insurance, and 8.25% EPF Retirement Compounding.
        </p>
      </header>

      {/* Tabs */}
      <div className="calc-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'pension'}
          className={`calc-tab ${activeTab === 'pension' ? 'active' : ''}`}
          onClick={() => setActiveTab('pension')}
        >
          🏛️ EPS Monthly Pension Estimator
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'edli'}
          className={`calc-tab ${activeTab === 'edli' ? 'active' : ''}`}
          onClick={() => setActiveTab('edli')}
        >
          🛡️ EDLI Insurance Benefit (₹7 Lakh)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'corpus'}
          className={`calc-tab ${activeTab === 'corpus' ? 'active' : ''}`}
          onClick={() => setActiveTab('corpus')}
        >
          📈 8.25% Retirement Corpus Growth
        </button>
      </div>

      {/* Tab 1: EPS Monthly Pension Calculator */}
      {activeTab === 'pension' && (
        <div className="calc-card-grid">
          <div className="calc-input-panel">
            <h2>EPS Pension Formula: (Salary &times; Service) &divide; 70</h2>
            <p className="panel-desc">Calculated under Employees' Pension Scheme (EPS 1995) statutory guidelines.</p>

            <div className="calc-field">
              <label htmlFor="pension-salary">
                Average Pensionable Salary (Last 60 Months)
                <strong>{formatINR(pensionSalary)}</strong>
              </label>
              <input
                id="pension-salary"
                type="range"
                min={5000}
                max={100000}
                step={1000}
                value={pensionSalary}
                onChange={(e) => setPensionSalary(Number(e.target.value))}
              />
              <span className="field-sub">Statutory statutory ceiling is ₹15,000 unless Pension on Higher Wages option is exercised.</span>
            </div>

            <div className="calc-field">
              <label htmlFor="pension-years">
                Total Pensionable Service Years
                <strong>{serviceYears} Years</strong>
              </label>
              <input
                id="pension-years"
                type="range"
                min={10}
                max={35}
                value={serviceYears}
                onChange={(e) => setServiceYears(Number(e.target.value))}
              />
              <span className="field-sub">Minimum 10 years eligible service required for regular monthly pension.</span>
            </div>

            <label className="checkbox-row higher-wage-row">
              <input
                type="checkbox"
                checked={optHigherWage}
                onChange={(e) => setOptHigherWage(e.target.checked)}
              />
              <span>Opted for Pension on Higher Wages (SC Judgment 04-11-2022)</span>
            </label>
          </div>

          <div className="calc-result-panel">
            <span className="result-label">Estimated Monthly Lifetime Pension</span>
            <strong className="result-hero number">{formatINR(monthlyPension)} / month</strong>
            <span className="result-sub">Disbursed directly via Centralized Pension Payment System (CPPS).</span>

            <div className="result-breakdown-box">
              <div className="res-row">
                <span>Statutory Scheme</span>
                <strong>EPS 1995 (Lifelong Monthly)</strong>
              </div>
              <div className="res-row">
                <span>Pensionable Salary Applied</span>
                <strong className="number">{formatINR(effectivePensionSalary)}</strong>
              </div>
              <div className="res-row">
                <span>Effective Service Considered</span>
                <strong className="number">
                  {effectiveServiceYears} Years {serviceYears >= 20 ? '(+2 Years Statutory Bonus)' : ''}
                </strong>
              </div>
              <div className="res-row">
                <span>Surviving Spouse Family Pension</span>
                <strong className="number">{formatINR(Math.max(Math.round(monthlyPension * 0.5), 1000))} / month</strong>
              </div>
            </div>

            <Link to="/claims/new" className="btn-apply-pension">
              Apply for Pension (Form 10D) &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Tab 2: EDLI Life Insurance Calculator */}
      {activeTab === 'edli' && (
        <div className="calc-card-grid">
          <div className="calc-input-panel">
            <h2>EDLI Assurance Formula: [35 &times; Wage] + 50% Balance</h2>
            <p className="panel-desc">Statutory free life insurance provided to every active EPF member under the EDLI Scheme, 1976.</p>

            <div className="calc-field">
              <label htmlFor="edli-wage">
                Average Basic Monthly Wage
                <strong>{formatINR(edliSalary)}</strong>
              </label>
              <input
                id="edli-wage"
                type="range"
                min={5000}
                max={30000}
                step={500}
                value={edliSalary}
                onChange={(e) => setEdliSalary(Number(e.target.value))}
              />
              <span className="field-sub">Statutory wage cap for calculation is ₹15,000/month.</span>
            </div>

            <div className="calc-field">
              <label htmlFor="edli-balance">
                Average PF Account Balance
                <strong>{formatINR(avgPfBalance)}</strong>
              </label>
              <input
                id="edli-balance"
                type="range"
                min={10000}
                max={1000000}
                step={25000}
                value={avgPfBalance}
                onChange={(e) => setAvgPfBalance(Number(e.target.value))}
              />
              <span className="field-sub">Bonus component equals 50% of average balance up to statutory ₹1,75,000 max.</span>
            </div>
          </div>

          <div className="calc-result-panel">
            <span className="result-label">Guaranteed Nominee EDLI Assurance Benefit</span>
            <strong className="result-hero number">{formatINR(totalEdliBenefit)}</strong>
            <span className="result-sub">Payable tax-free to designated nominee in event of death in service.</span>

            <div className="result-breakdown-box">
              <div className="res-row">
                <span>Base Component (35 &times; Wage)</span>
                <strong className="number">{formatINR(edliBase)}</strong>
              </div>
              <div className="res-row">
                <span>Bonus Component (50% Balance)</span>
                <strong className="number">{formatINR(edliBonus)}</strong>
              </div>
              <div className="res-row">
                <span>Maximum Statutory Benefit Cap</span>
                <strong className="number">₹7,00,000 (Maximum)</strong>
              </div>
            </div>

            <Link to="/claims/new/death/step-1" className="btn-apply-pension">
              File Family &amp; EDLI Claim (Form 5IF) &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Tab 3: EPF Compound Growth Simulator */}
      {activeTab === 'corpus' && (
        <div className="calc-card-grid">
          <div className="calc-input-panel">
            <h2>8.25% Annual Statutory Compounding Simulator</h2>
            <p className="panel-desc">Simulate total retirement accumulation from dual 12% EE and 12% ER contributions.</p>

            <div className="calc-field">
              <label htmlFor="sim-basic">
                Current Monthly Basic Salary
                <strong>{formatINR(monthlyBasic)}</strong>
              </label>
              <input
                id="sim-basic"
                type="range"
                min={15000}
                max={200000}
                step={5000}
                value={monthlyBasic}
                onChange={(e) => setMonthlyBasic(Number(e.target.value))}
              />
            </div>

            <div className="calc-field">
              <label htmlFor="sim-age">
                Current Age
                <strong>{currentAge} Years</strong>
              </label>
              <input
                id="sim-age"
                type="range"
                min={20}
                max={55}
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
              />
            </div>

            <div className="calc-field">
              <label htmlFor="sim-hike">
                Expected Annual Salary Hike
                <strong>{annualHike}% / Year</strong>
              </label>
              <input
                id="sim-hike"
                type="range"
                min={0}
                max={15}
                value={annualHike}
                onChange={(e) => setAnnualHike(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="calc-result-panel">
            <span className="result-label">Projected Corpus at Age 58 ({yearsToRetire} Years of Service)</span>
            <strong className="result-hero number">{formatINR(roundedCorpus)}</strong>
            <span className="result-sub">Statutory tax-free compounding backed by Sovereign Guarantee.</span>

            <div className="result-breakdown-box">
              <div className="res-row">
                <span>Annual EPFO Interest Rate</span>
                <strong className="status-good">8.25% p.a. Compounded</strong>
              </div>
              <div className="res-row">
                <span>Monthly Total Inflow (EE + ER)</span>
                <strong className="number">{formatINR(monthlyBasic * 0.24)}</strong>
              </div>
              <div className="res-row">
                <span>Tax Exemption Status</span>
                <strong className="status-good">✓ 100% Tax Exempt at Maturity</strong>
              </div>
            </div>

            <Link to="/login/email" className="btn-apply-pension">
              View Your Live Passbook &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalculatorsPage
