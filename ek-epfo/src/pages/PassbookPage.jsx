import React, { useState } from 'react'
import { useSession } from '../context/useSession.js'
import { balance, contributionHistory, member as defaultMember } from '../data/mockData.js'
import './PassbookPage.css'

function formatINR(val) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val)
}

function PassbookPage() {
  const { member: sessionMember } = useSession()
  const member = sessionMember || defaultMember
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  function handleDownload() {
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3000)
  }

  return (
    <div className="passbook-layout">
      {/* Page Header */}
      <header className="passbook-header-row">
        <div>
          <h1>Unified Member Passbook &amp; Ledger</h1>
          <p className="passbook-subtitle">
            Authoritative financial statement under CITES 2.01 &bull; Member: <strong>{member.name}</strong> (UAN: <span className="number">{member.uan}</span>)
          </p>
        </div>

        <div className="passbook-header-actions">
          <button type="button" className="passbook-export-btn" onClick={handleDownload}>
            📥 Download Statement (PDF)
          </button>
        </div>
      </header>

      {downloadSuccess && (
        <div className="download-toast" role="status">
          ✓ Passbook Statement (FY 2025–26) generated and downloaded successfully.
        </div>
      )}

      {/* CITES 2.01 Migration Guarantee Notice */}
      <div className="cites-reassurance-card">
        <div className="cites-reassurance-card__icon">🏛️</div>
        <div className="cites-reassurance-card__content">
          <strong>CITES 2.01 Centralized Database Status: 100% Reconciled</strong>
          <p>
            All historical service records from <em>Sundar Textiles Pvt Ltd (2015–2019)</em> and active records from <em>Coral Systems Ltd (2019–Present)</em> are unified under your central UAN. Statutory annual interest of {balance.interestRate} is protected.
          </p>
        </div>
      </div>

      {/* 3-Column Summary Cards */}
      <div className="passbook-summary-grid">
        <div className="summary-card">
          <span className="summary-card__label">Total Cumulative Balance</span>
          <strong className="summary-card__val number">{formatINR(balance.total)}</strong>
          <span className="summary-card__sub">As of 31 July 2026</span>
        </div>

        <div className="summary-card">
          <span className="summary-card__label">Employee Share (100% Withdrawable)</span>
          <strong className="summary-card__val number">{formatINR(balance.withdrawable)}</strong>
          <span className="summary-card__sub">Eligible for Form 31 / 19</span>
        </div>

        <div className="summary-card">
          <span className="summary-card__label">Employer Share + Pension Fund</span>
          <strong className="summary-card__val number">{formatINR(balance.employerLocked + balance.pensionCredit)}</strong>
          <span className="summary-card__sub">₹{balance.pensionCredit.toLocaleString()} in EPS Scheme</span>
        </div>
      </div>

      {/* Monthly Contribution Ledger Table */}
      <section className="passbook-table-card" aria-labelledby="ledger-title">
        <div className="table-header-row">
          <div>
            <h2 id="ledger-title">Monthly ECR Contribution Ledger (FY 2025–26)</h2>
            <p className="table-sub">Direct electronic challan deposits confirmed by establishment</p>
          </div>
          <span className="table-tag">12 Months Reconciled</span>
        </div>

        <div className="table-responsive">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Wage Month</th>
                <th>Deposit Date</th>
                <th>Employee Share (EPF)</th>
                <th>Employer Share (EPF)</th>
                <th>Pension Share (EPS)</th>
                <th>Total Credited</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contributionHistory.map((row) => (
                <tr key={row.month}>
                  <td className="font-semibold">{row.month}</td>
                  <td className="number text-muted">{row.date}</td>
                  <td className="number">{formatINR(row.employeeContribution)}</td>
                  <td className="number">{formatINR(row.employerContribution)}</td>
                  <td className="number text-muted">{formatINR(row.pensionShare)}</td>
                  <td className="number font-bold">{formatINR(row.employeeContribution + row.employerContribution)}</td>
                  <td>
                    <span className="badge-cleared">✓ Cleared</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default PassbookPage
