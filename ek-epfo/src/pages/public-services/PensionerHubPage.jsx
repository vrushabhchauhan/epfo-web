import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './PensionerHubPage.css'

const demoPensioner = {
  ppoNumber: 'MH/BAN/0019284/PPO',
  name: 'Mukesh K. Rao',
  pensionType: 'Superannuation Pension (EPS 1995)',
  monthlyAmount: 4820,
  disbursementBank: 'State Bank of India (Bandra West Branch)',
  bankAccountMasked: '•••• •••• 9182',
  cppsStatus: 'Active (Pan-India Centralized Pension Payment System)',
  dlcStatus: 'Valid & Accepted',
  dlcExpiryDate: '30 Nov 2026',
  dlcSubmissionMode: 'Aadhaar Face Authentication (FaceRD)',
  pensionHistory: [
    { month: 'Jul 2026', creditDate: '01 Aug 2026', amount: 4820, ref: 'CPPS-SBI-918201', status: 'Disbursed' },
    { month: 'Jun 2026', creditDate: '01 Jul 2026', amount: 4820, ref: 'CPPS-SBI-918202', status: 'Disbursed' },
    { month: 'May 2026', creditDate: '01 Jun 2026', amount: 4820, ref: 'CPPS-SBI-918203', status: 'Disbursed' },
    { month: 'Apr 2026', creditDate: '01 May 2026', amount: 4820, ref: 'CPPS-SBI-918204', status: 'Disbursed' },
  ],
}

function PensionerHubPage() {
  const [ppoInput, setPpoInput] = useState('MH/BAN/0019284/PPO')
  const [pensioner, setPensioner] = useState(demoPensioner)
  const [isSearching, setIsSearching] = useState(false)

  function handlePpoSearch(e) {
    e.preventDefault()
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      setPensioner(demoPensioner)
    }, 600)
  }

  return (
    <div className="pensioner-layout">
      <header className="pensioner-header">
        <Link to="/" className="calc-back-link">&larr; Back to Home</Link>
        <div className="calc-title-row">
          <span className="calc-badge">EPS 1995 &bull; CPPS Rail</span>
          <h1>Pensioner Service Hub &amp; PPO Tracker</h1>
        </div>
        <p className="pensioner-subtitle">
          Centralized Pension Payment System (CPPS): Track monthly pension disbursements across any bank branch in India and verify Digital Life Certificate (DLC) validity.
        </p>
      </header>

      {/* PPO Search Form */}
      <form className="ppo-search-card" onSubmit={handlePpoSearch}>
        <div className="ppo-input-group">
          <label htmlFor="ppo-in">Enter 12-Digit PPO Number or Linked Bank Account</label>
          <div className="ppo-input-row">
            <input
              id="ppo-in"
              type="text"
              className="ppo-input number"
              value={ppoInput}
              onChange={(e) => setPpoInput(e.target.value)}
              placeholder="e.g. MH/BAN/0019284/PPO"
              required
            />
            <button type="submit" className="btn-fetch-ppo" disabled={isSearching}>
              {isSearching ? 'Querying CPPS...' : 'Fetch Pensioner Passbook →'}
            </button>
          </div>
        </div>
      </form>

      {/* Pensioner Hero Card */}
      <div className="pensioner-hero-grid">
        <div className="pensioner-info-card">
          <div className="info-card-top">
            <span className="ppo-badge number">{pensioner.ppoNumber}</span>
            <span className="cpps-live-tag">● CPPS Active</span>
          </div>

          <strong className="pensioner-name">{pensioner.name}</strong>
          <span className="pension-type">{pensioner.pensionType}</span>

          <div className="pension-rate-box">
            <span className="rate-label">Monthly Gross Pension</span>
            <strong className="rate-val number">₹{pensioner.monthlyAmount.toLocaleString('en-IN')} / month</strong>
            <span className="rate-sub">Disbursed on 1st of every month via NEFT</span>
          </div>

          <div className="pensioner-bank-row">
            <span>Disbursement Bank: <strong>{pensioner.disbursementBank}</strong> (A/C: {pensioner.bankAccountMasked})</span>
          </div>
        </div>

        {/* Jeevan Pramaan (DLC) Status Card */}
        <div className="dlc-status-card">
          <div className="dlc-header">
            <span className="dlc-icon">🪪</span>
            <div>
              <h3>Jeevan Pramaan (DLC) Status</h3>
              <span className="dlc-status-tag status-good">✓ {pensioner.dlcStatus}</span>
            </div>
          </div>

          <p className="dlc-desc">
            Your Digital Life Certificate was verified via <strong>{pensioner.dlcSubmissionMode}</strong> and is officially accepted by the Central Pension Accounting Office.
          </p>

          <div className="dlc-validity-box">
            <span>Next DLC Submission Due:</span>
            <strong className="number">{pensioner.dlcExpiryDate}</strong>
          </div>

          <button
            type="button"
            className="btn-submit-dlc"
            onClick={() => alert('Jeevan Pramaan FaceRD App integration launched. Submit DLC via Android / iOS FaceRD.')}
          >
            📱 Submit Annual Life Certificate via Face Authentication &rarr;
          </button>
        </div>
      </div>

      {/* Monthly Pension Passbook Ledger */}
      <section className="pension-ledger-card" aria-labelledby="pension-ledger-title">
        <div className="ledger-header">
          <h2 id="pension-ledger-title">Monthly Pension Disbursement Ledger</h2>
          <span className="cites-tag">CITES 2.01 Bank Reconciliation</span>
        </div>

        <table className="pension-table">
          <thead>
            <tr>
              <th>Pension Month</th>
              <th>Credit Date</th>
              <th>Monthly Amount</th>
              <th>Bank Transaction Ref (CPPS)</th>
              <th>Disbursement Status</th>
            </tr>
          </thead>
          <tbody>
            {pensioner.pensionHistory.map((row) => (
              <tr key={row.month}>
                <td className="font-semibold">{row.month}</td>
                <td className="number text-muted">{row.creditDate}</td>
                <td className="number font-bold">₹{row.amount.toLocaleString('en-IN')}</td>
                <td className="number text-muted">{row.ref}</td>
                <td><span className="badge-cleared">✓ {row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default PensionerHubPage
