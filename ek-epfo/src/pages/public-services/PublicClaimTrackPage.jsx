import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { claims } from '../../data/mockData.js'
import './PublicClaimTrackPage.css'

function PublicClaimTrackPage() {
  const location = useLocation()
  const [uan, setUan] = useState('1004829371')
  const [claimId, setClaimId] = useState(location.state?.claimId || 'CLM1042')
  const [searchedClaim, setSearchedClaim] = useState(
    location.state?.claimId
      ? {
          id: location.state.claimId,
          formNumber: 'Form 20 & 5IF',
          type: 'Composite Nominee Death Claim',
          amountRequested: 1193600,
          filedDate: new Date().toISOString().slice(0, 10),
          status: 'in_progress',
          currentStage: 1,
          stages: [
            { label: 'Submitted Online', date: 'Today', description: 'Nominee claim received under CITES 2.01 Fast-Track.' },
            { label: 'Document & Nominee e-KYC', date: 'In Progress', description: 'Matching Death Certificate & Aadhaar records.' },
            { label: 'Field Office Approval', date: 'Pending', description: 'Target SLA: 3 business days.' },
            { label: 'Disbursed', date: 'Pending', description: 'Funds will be transferred to submitted nominee bank account.' },
          ],
        }
      : null
  )
  const [isSearching, setIsSearching] = useState(false)

  function handleTrack(e) {
    e.preventDefault()
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      const found = claims.find((c) => c.id.toLowerCase() === claimId.trim().toLowerCase()) || claims[0]
      setSearchedClaim(found)
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
