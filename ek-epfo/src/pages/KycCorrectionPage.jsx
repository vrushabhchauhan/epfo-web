import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './KycCorrectionPage.css'

function KycCorrectionPage() {
  const [synced, setSynced] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  function handleDirectSync() {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setSynced(true)
    }, 1000)
  }

  return (
    <div className="kyc-layout">
      <header className="kyc-header">
        <Link to="/profile" className="claims-back-link">&larr; Back to Profile</Link>
        <h1>Direct e-KYC Self-Correction Engine</h1>
        <p className="subtitle">
          Statutory Joint Declaration simplification: Direct DigiLocker / Aadhaar XML overwrite without requiring employer sign-off.
        </p>
      </header>

      {synced && (
        <div className="kyc-success-card" role="status">
          <div className="success-icon">✓</div>
          <strong>e-KYC Direct Overwrite Successfully Completed!</strong>
          <p>
            Your member profile has been updated directly in CITES 2.01 national core database backed by Aadhaar cryptographic token.
          </p>
        </div>
      )}

      {/* Comparison Grid: Current EPFO Record vs. Aadhaar Official Record */}
      <section className="kyc-comparison-card">
        <div className="comparison-header">
          <h2>Identity Discrepancy &amp; Auto-Resolution</h2>
          <span className="badge-eligible">✓ Eligible for Instant Self-Correction</span>
        </div>

        <div className="comparison-grid">
          <div className="record-box">
            <span className="record-tag">EPFO Member Record</span>
            <div className="record-field">
              <span className="field-name">Full Name</span>
              <strong className="field-val">Ananya Rao</strong>
            </div>
            <div className="record-field">
              <span className="field-name">Date of Birth</span>
              <strong className="field-val number">12 Apr 1990</strong>
            </div>
            <div className="record-field">
              <span className="field-name">Father's / Husband's Name</span>
              <strong className="field-val">M. K. Rao</strong>
            </div>
            <div className="record-field">
              <span className="field-name">Gender</span>
              <strong className="field-val">Female</strong>
            </div>
          </div>

          <div className="comparison-divider" aria-hidden="true">
            <span>⇄</span>
          </div>

          <div className="record-box record-box--aadhaar">
            <span className="record-tag record-tag--aadhaar">DigiLocker / Aadhaar Official Record</span>
            <div className="record-field">
              <span className="field-name">Full Name</span>
              <strong className="field-val match">Ananya Rao (100% Match)</strong>
            </div>
            <div className="record-field">
              <span className="field-name">Date of Birth</span>
              <strong className="field-val match number">12 Apr 1990 (Verified)</strong>
            </div>
            <div className="record-field">
              <span className="field-name">Father's / Husband's Name</span>
              <strong className="field-val match">Mukesh K. Rao (Expanded Name)</strong>
            </div>
            <div className="record-field">
              <span className="field-name">Gender</span>
              <strong className="field-val match">Female (Verified)</strong>
            </div>
          </div>
        </div>

        <div className="kyc-action-bar">
          <div className="action-note">
            <span>Name match score is <strong>98.4%</strong>. Under simplified Joint Declaration guidelines, no employer signature or field office visit is required.</span>
          </div>
          <button
            type="button"
            className="btn-sync-digilocker"
            onClick={handleDirectSync}
            disabled={isProcessing || synced}
          >
            {isProcessing ? 'Syncing with CITES 2.01...' : synced ? '✓ Records Synchronized' : 'Verify & Overwrite via DigiLocker OTP →'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default KycCorrectionPage
