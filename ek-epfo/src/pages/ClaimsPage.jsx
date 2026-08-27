import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../context/useSession.js'
import { claims as defaultClaims } from '../data/mockData.js'
import { getCloudClaims } from '../lib/supabaseClient.js'
import './ClaimsPage.css'

function formatINR(val) {
  if (val === undefined || val === null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val).replace(/\u20B9\s*/, '\u20B9\u00A0');
}
function ClaimsPage() {
  const { member } = useSession()
  const isFresh = member?.totalAccumulation === 0
  const [claimsList, setClaimsList] = useState(() => (isFresh ? [] : defaultClaims))

  useEffect(() => {
    async function loadClaims() {
      setIsLoading(true)
      if (member?.uan) {
        const cloudData = await getCloudClaims(member.uan)

        setIsLoading(false)
        if (cloudData) {
          const formatted = cloudData.map((c) => ({
            id: c.claim_id,
            formNumber: c.form_number,
            type: c.claim_type,
            amountRequested: Number(c.amount_requested),
            amountDisbursed: c.amount_disbursed ? Number(c.amount_disbursed) : null,
            filedDate: c.filed_date,
            status: c.status,
            currentStage: c.current_stage || 1,
            stages: defaultClaims[0]?.stages || [],
          }))
          setClaimsList(formatted)
        } else if (isFresh) {
          setClaimsList([])
        }
      }
    }
    loadClaims()
  }, [member?.uan, isFresh])

  const claims = claimsList
  const disbursedAmount = claims.filter(c => c.status === 'disbursed').reduce((sum, c) => sum + (c.amountDisbursed || c.amountRequested || 0), 0)
  const inProgressCount = claims.filter(c => c.status === 'in_progress').length
  const rejectedCount = claims.filter(c => c.status === 'rejected').length

  return (
    <div className="claims-layout">
      {/* Header Row */}
      <header className="claims-header-row">
        <div>
          <h1>Claims &amp; Advance Portfolio</h1>
          <p className="claims-subtitle">
            Track statutory settlements, resolve flagged exceptions, or initiate a new claim under CITES 2.01.
          </p>
        </div>

        <Link to="/claims/new" className="btn-file-claim">
          + File a New Claim &rarr;
        </Link>
      </header>

      {/* Claims Summary Metric Bar */}
      <div className="claims-metrics-grid">
        <div className="claim-metric-card">
          <span className="claim-metric-label">Total Claims Filed</span>
          <strong className="claim-metric-val number">{claims.length}</strong>
          <span className="claim-metric-hint">In FY 2025–26</span>
        </div>

        <div className="claim-metric-card">
          <span className="claim-metric-label">Total Amount Disbursed</span>
          <strong className="claim-metric-val number">{formatINR(disbursedAmount)}</strong>
          <span className="claim-metric-hint">Settled via NEFT / UPI</span>
        </div>

        <div className="claim-metric-card">
          <span className="claim-metric-label">Active / Under Process</span>
          <strong className="claim-metric-val number">{inProgressCount}</strong>
          <span className="claim-metric-hint">SLA: Due in 2 Days</span>
        </div>

        <div className="claim-metric-card claim-metric-card--alert">
          <span className="claim-metric-label">Action Required</span>
          <strong className="claim-metric-val number">{rejectedCount}</strong>
          <span className="claim-metric-hint">{rejectedCount > 0 ? 'Exception Flagged' : 'No Action Needed'}</span>
        </div>
      </div>

      {/* Claims List Section */}
      <section className="claims-list-section" aria-label="Claims History">
        <div className="claims-list-header">
          <h2>All Statutory Claims</h2>
          <span className="claims-count-badge">{claims.length} Records</span>
        </div>

        <div className="claims-card-stack">
          {claims.map((claim) => (
            <article className={`claim-card claim-card--${claim.status}`} key={claim.id}>
              <div className="claim-card__top">
                <div className="claim-card__title-group">
                  <div className="claim-badge-row">
                    <span className="claim-form-badge">{claim.formNumber}</span>
                    <span className="claim-id-tag number">ID: {claim.id}</span>
                  </div>
                  <h3 className="claim-title">{claim.type}</h3>
                  <span className="claim-filed-date">
                    Filed on {new Date(claim.filedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="claim-card__amount-group">
                  <span className="claim-amount-label">Requested Amount</span>
                  <strong className="claim-amount-val number">{formatINR(claim.amountRequested)}</strong>
                  <span className={`claim-status-pill claim-status-pill--${claim.status}`}>
                    {claim.status === 'disbursed' && '✓ Settled & Disbursed'}
                    {claim.status === 'in_progress' && '● Under Process (SLA: 2 Days)'}
                    {claim.status === 'rejected' && '⚠️ Action Required'}
                  </span>
                </div>
              </div>

              {/* Status Specific Action Strip */}
              <div className="claim-card__bottom">
                {claim.status === 'rejected' ? (
                  <div className="claim-alert-strip">
                    <span className="alert-icon">⚠️</span>
                    <span className="alert-msg">
                      <strong>Tax Declaration (Form 15G) Missing:</strong> Upload in 1-click to resume settlement without refiling.
                    </span>
                    <Link to={`/claims/${claim.id}/fix`} className="btn-fix-action">
                      Fix in 1-Click &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="claim-stage-strip">
                    <div className="stage-info">
                      <span className="stage-num">Stage {claim.currentStage} of 4:</span>
                      <span className="stage-desc">{claim.stages[claim.currentStage - 1]?.label} — {claim.stages[claim.currentStage - 1]?.description}</span>
                    </div>
                    <Link to={`/claims/${claim.id}`} className="btn-view-stepper">
                      Track Live Stepper &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ClaimsPage
