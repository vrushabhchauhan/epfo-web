import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { claims } from '../../data/mockData.js'
import './PublicClaimTrackPage.css'

function PublicClaimTrackPage() {
  const location = useLocation()
  const [uan, setUan] = useState('')
  const [claimId, setClaimId] = useState(location.state?.claimId || '')
  const [searchedClaim, setSearchedClaim] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [notFoundError, setNotFoundError] = useState('')

  function handleTrack(e) {
    e.preventDefault()
    setIsSearching(true)
    setNotFoundError('')
    setTimeout(() => {
      setIsSearching(false)
      const cleanId = claimId.trim().toLowerCase()
      const found = claims.find((c) => c.id.toLowerCase() === cleanId)
      if (found) {
        setSearchedClaim(found)
      } else {
        setNotFoundError(`No statutory claim found matching Reference ID "${claimId}" for UAN "${uan}". Please verify your Claim Reference ID.`)
      }
    }, 600)
  }

  return (
    <div className="uan-service-layout">
      <div className="uan-header">
        <Link to="/" className="uan-back-link">&larr; Back to Home</Link>
        <div className="uan-title-row">
          <span className="uan-service-badge">Public Tracking</span>
          <h1>Track Statutory Claim Status</h1>
        </div>
        <p className="uan-desc">
          Check the real-time processing status of your advance, settlement, or pension claim without logging into your account.
        </p>
      </div>

      <div className="uan-card">
        {!searchedClaim ? (
          <form className="uan-form" onSubmit={handleTrack}>
            <div className="uan-form-grid">
              <div className="form-group">
                <label htmlFor="pub-uan">Universal Account Number (UAN) *</label>
                <input
                  id="pub-uan"
                  type="text"
                  className="uan-input number"
                  maxLength={12}
                  value={uan}
                  onChange={(e) => setUan(e.target.value)}
                  placeholder="e.g. 1004829371"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pub-claim-id">Claim ID / Reference Number *</label>
                <input
                  id="pub-claim-id"
                  type="text"
                  className="uan-input number"
                  value={claimId}
                  onChange={(e) => setClaimId(e.target.value)}
                  placeholder="e.g. CLM1042, CLM1091"
                  required
                />
              </div>
            </div>

            {notFoundError && (
              <div className="auth-error-banner" role="alert" style={{ margin: '1rem 0', padding: '0.85rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.875rem' }}>
                <div>⚠️ {notFoundError}</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <Link to="/login/email" style={{ color: '#003366', fontWeight: 600, textDecoration: 'underline' }}>
                    Sign In to Member Portal to View All Claims &rarr;
                  </Link>
                </div>
              </div>
            )}

            <button type="submit" className="uan-submit-btn" disabled={isSearching}>
              {isSearching ? 'Querying CITES 2.01 Settlement Engine...' : 'Track Claim Status →'}
            </button>
          </form>
        ) : (
          <div className="track-result-box">
            <div className="track-header-row">
              <div>
                <span className="track-claim-id number">Claim ID: {searchedClaim.id}</span>
                <h2>{searchedClaim.type} ({searchedClaim.formNumber})</h2>
                <span className="track-filed-date">
                  Filed on {searchedClaim.filedDate} &bull; Requested: <strong className="number">₹{searchedClaim.amountRequested.toLocaleString('en-IN')}</strong>
                </span>
              </div>

              <span className={`claim-status-pill claim-status-pill--${searchedClaim.status}`}>
                {searchedClaim.status === 'disbursed' && '✓ Settled & Disbursed'}
                {searchedClaim.status === 'in_progress' && '● Under Process (SLA: 2 Days)'}
                {searchedClaim.status === 'rejected' && '⚠️ Action Required'}
              </span>
            </div>

            {/* Stepper */}
            <div className="track-stepper-container">
              {searchedClaim.stages.map((stage, idx) => (
                <div
                  className={`track-step-row ${
                    idx < searchedClaim.currentStage ? 'done' : idx === searchedClaim.currentStage - 1 ? 'active' : 'pending'
                  }`}
                  key={stage.label}
                >
                  <div className="track-step-node">
                    <span className="track-step-dot">{idx < searchedClaim.currentStage ? '✓' : idx + 1}</span>
                    {idx < searchedClaim.stages.length - 1 && <span className="track-step-line" />}
                  </div>
                  <div className="track-step-content">
                    <div className="track-step-head">
                      <strong>{stage.label}</strong>
                      {stage.date && <span className="number text-muted">{stage.date}</span>}
                    </div>
                    <p>{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="success-actions">
              <Link to="/login/email" className="btn-primary">
                Sign In for Full Settlement Ledger &rarr;
              </Link>
              <button type="button" className="btn-secondary" onClick={() => setSearchedClaim(null)}>
                Track Another Claim
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicClaimTrackPage
