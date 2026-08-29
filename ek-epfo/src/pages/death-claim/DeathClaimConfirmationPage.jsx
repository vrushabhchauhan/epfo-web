import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDeathClaimWizard } from '../../context/DeathClaimContext.js'
import './DeathClaimConfirmationPage.css'

function DeathClaimConfirmationPage() {
  const { wizardData } = useDeathClaimWizard()

  const [refNumber] = useState(() => {
    return Math.floor(100000 + Math.random() * 900000)
  })

  const memberName = wizardData.verifiedMemberName || 'Deceased Member'
  const memberUan = wizardData.memberUan || 'N/A'
  const nomineeName = wizardData.nomineeName || 'Applicant Nominee'
  const relationship = wizardData.relationship || 'Legal Beneficiary'
  const bankAccount = wizardData.nomineeBankAccount ? `•••• •••• ${wizardData.nomineeBankAccount.slice(-4)}` : '•••• •••• 0000'
  const bankIFSC = wizardData.nomineeBankIFSC || 'BANK0000000'
  const filedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  function handlePrintOrDownload() {
    window.print()
  }

  return (
    <div className="death-confirmation-container">
      <div className="death-confirmation-card">
        <div className="death-confirmation-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="death-confirmation-title">Fast-Track Claim Submitted</h1>
        <p className="death-confirmation-subtitle">
          Your statutory composite death claim has been received and queued on the CITES 2.01 priority rail.
        </p>

        {/* Official Statutory Acknowledgment Receipt Card */}
        <div className="official-receipt-card" id="printable-receipt">
          <div className="receipt-gov-header">
            <div className="emblem-box">🏛️</div>
            <div className="header-titles">
              <strong>EMPLOYEES' PROVIDENT FUND ORGANISATION</strong>
              <span>MINISTRY OF LABOUR &amp; EMPLOYMENT, GOVT. OF INDIA</span>
              <span className="receipt-type-pill">CITES 2.01 STATUTORY COMPOSITE CLAIM RECEIPT</span>
            </div>
            <div className="qr-box">
              <span className="qr-sim">▣ QR VERIFIED</span>
            </div>
          </div>

          <div className="receipt-meta-grid">
            <div className="r-item">
              <span className="r-label">Claim Tracking ID</span>
              <strong className="r-val number font-bold text-emerald">DC-{refNumber}</strong>
            </div>
            <div className="r-item">
              <span className="r-label">Filing Timestamp</span>
              <strong className="r-val number">{filedDate}, 18:42 IST</strong>
            </div>
            <div className="r-item">
              <span className="r-label">Deceased Member</span>
              <strong className="r-val">{memberName} (UAN: {memberUan})</strong>
            </div>
            <div className="r-item">
              <span className="r-label">Claimant / Nominee</span>
              <strong className="r-val">{nomineeName} ({relationship})</strong>
            </div>
            <div className="r-item">
              <span className="r-label">Disbursement Bank</span>
              <strong className="r-val number">A/C {bankAccount} &bull; IFSC {bankIFSC}</strong>
            </div>
            <div className="r-item">
              <span className="r-label">Statutory Fast-Track SLA</span>
              <strong className="r-val status-good">3 Working Days Direct NEFT/UPI</strong>
            </div>
          </div>

          {/* Combined Statutory 3-in-1 Breakdown */}
          <div className="receipt-entitlement-table">
            <div className="t-head">
              <span>Statutory Scheme</span>
              <span>Claim Form</span>
              <span className="text-right">Entitlement Amount</span>
            </div>
            <div className="t-row">
              <span>EPF Scheme, 1952 (Final Accumulation)</span>
              <span className="number">Form 20</span>
              <span className="number text-right font-bold">₹4,93,600</span>
            </div>
            <div className="t-row highlight-row">
              <span>EDLI Assurance Scheme, 1976 (Life Insurance)</span>
              <span className="number">Form 5IF</span>
              <span className="number text-right font-bold text-saffron">₹7,00,000</span>
            </div>
            <div className="t-row">
              <span>EPS Scheme, 1995 (Monthly Family Pension)</span>
              <span className="number">Form 10D</span>
              <span className="number text-right font-bold">₹2,410 / month</span>
            </div>
          </div>

          <div className="receipt-security-footer">
            <span>🔒 Digitally Signed • CITES 2.01 National Core Gateway • Reference SHA256: 8f92a1...48b</span>
          </div>
        </div>

        <div className="death-confirmation-actions no-print">
          <button
            type="button"
            className="death-confirm-btn death-confirm-btn--primary"
            onClick={handlePrintOrDownload}
          >
            🖨️ Download / Print Acknowledgment Receipt (PDF) →
          </button>

          <Link
            className="death-confirm-btn death-confirm-btn--secondary"
            to="/claims/track-public"
            state={{ claimId: `DC-${refNumber}` }}
          >
            📍 Track Live Processing Status →
          </Link>

          <Link className="death-confirm-home-link" to="/">
            Return to Home &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DeathClaimConfirmationPage

