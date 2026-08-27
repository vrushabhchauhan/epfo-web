import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../context/useSession.js'
import { balance, claims as defaultClaims, member as defaultMember } from '../data/mockData.js'
import { getCloudClaims } from '../lib/supabaseClient.js'
import './DashboardPage.css'

function formatINR(val) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val)
}

function DashboardPage() {
  const navigate = useNavigate()
  const { member: sessionMember } = useSession()
  const member = sessionMember || defaultMember
  const isFresh = member.totalAccumulation === 0
  const [claimsList, setClaimsList] = useState(() => (isFresh ? [] : defaultClaims))

  useEffect(() => {
    async function loadClaims() {
      if (member?.uan) {
        const cloudData = await getCloudClaims(member.uan)
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
  const activeEmployer = member.employers?.[0] || member.employers?.[1] || { name: 'Active Establishment', memberId: 'MH/BAN/0000000', doj: '2026-08-01', status: 'Active' }
  const rejectedClaim = claims.find((c) => c.status === 'rejected')

  const totalBal = member.totalAccumulation !== undefined ? member.totalAccumulation : balance.total
  const withdrawableBal = member.employeeShareTotal !== undefined ? member.employeeShareTotal : balance.withdrawable
  const employerLockedBal = member.employerShareTotal !== undefined ? member.employerShareTotal : balance.employerLocked

  return (
    <div className="dashboard-grid-layout">
      {/* Top Banner — Total Corpus & Balance Breakdown */}
      <section className="corpus-banner" aria-labelledby="balance-heading">
        <div className="corpus-banner__main">
          <div className="corpus-banner__header">
            <span className="corpus-badge">CITES 2.01 Verified Ledger</span>
            <span className="corpus-interest-rate">Interest: <strong>{balance.interestRate}</strong> (FY 2025–26)</span>
          </div>

          <div className="corpus-hero-row">
            <div className="corpus-total-block">
              <div className="corpus-greeting" style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Welcome back, {member.name || "Member"}!</div>
              <span className="corpus-label">Total Provident Fund Balance</span>
              <h1 id="balance-heading" className="corpus-amount number">{formatINR(totalBal)}</h1>
            </div>

            <div className="corpus-actions">
              <Link to="/passbook" className="btn-secondary-white">
                View Full Passbook &rarr;
              </Link>
              <Link to="/claims/new" className="btn-primary-gold">
                + Initiate Withdrawal
              </Link>
            </div>
          </div>

          <div className="corpus-split-grid">
            <div className="split-card">
              <span className="split-card__label">Withdrawable Balance</span>
              <span className="split-card__amount number">{formatINR(withdrawableBal)}</span>
              <span className="split-card__hint">Available for Form 31 / 19 claim</span>
            </div>

            <div className="split-card">
              <span className="split-card__label">Employer Contribution</span>
              <span className="split-card__amount number">{formatINR(employerLockedBal)}</span>
              <span className="split-card__hint">Settled upon job transition</span>
            </div>

            <div className="split-card">
              <span className="split-card__label">Pension Fund (EPS 1995)</span>
              <span className="split-card__amount number">{formatINR(balance.pensionCredit)}</span>
              <span className="split-card__hint">Scheme certificate credit</span>
            </div>

            <div className="split-card split-card--interest">
              <span className="split-card__label">Interest Accrued (FY26)</span>
              <span className="split-card__amount number">+{formatINR(balance.interestAccruedFY26)}</span>
              <span className="split-card__hint">Credited annually by EPFO</span>
            </div>
          </div>
        </div>
      </section>

      {/* Critical Rejection Alert Banner (If Any Action Needed) */}
      {rejectedClaim && (
        <section className="action-alert-banner" aria-label="Urgent Claim Action Required">
          <div className="action-alert-banner__icon">⚠️</div>
          <div className="action-alert-banner__content">
            <div className="action-alert-banner__title">
              Action Required on Claim {rejectedClaim.id} ({rejectedClaim.type})
            </div>
            <p className="action-alert-banner__desc">
              Your claim was flagged because the mandatory Form 15G tax declaration is missing. Settle this in 1-click without refiling.
            </p>
          </div>
          <Link to={`/claims/${rejectedClaim.id}/fix`} className="action-alert-btn">
            Fix &amp; Resubmit in 1-Click &rarr;
          </Link>
        </section>
      )}

      {/* 2-Column Dashboard Main Section */}
      <div className="dashboard-columns">
        {/* Left Column: Statutory Intent Cards + Employer Compliance */}
        <div className="dashboard-col-left">
          {/* Statutory Services Gateway */}
          <section className="dashboard-card" aria-labelledby="statutory-services-title">
            <div className="card-header-row">
              <h2 id="statutory-services-title" className="card-heading">
                Statutory Claim Services (CITES 2.01)
              </h2>
              <span className="card-meta-tag">Fast Auto-Settlement</span>
            </div>

            <div className="statutory-grid">
              <div className="statutory-card" onClick={() => navigate('/claims/new')}>
                <div className="statutory-card__top">
                  <span className="statutory-form-pill">Form 31</span>
                  <span className="statutory-speed-tag">3 Days</span>
                </div>
                <h3 className="statutory-card__title">Advance / Partial Withdrawal</h3>
                <p className="statutory-card__desc">
                  Medical emergencies, house purchase, higher education, or marriage expenses while continuing service.
                </p>
                <span className="statutory-card__link">Check Eligibility &rarr;</span>
              </div>

              <div className="statutory-card" onClick={() => navigate('/claims/new')}>
                <div className="statutory-card__top">
                  <span className="statutory-form-pill">Form 19 &amp; 10C</span>
                  <span className="statutory-speed-tag">Final Settlement</span>
                </div>
                <h3 className="statutory-card__title">Full PF &amp; Pension Withdrawal</h3>
                <p className="statutory-card__desc">
                  Complete settlement of accumulated balance and pension scheme credit upon leaving employment.
                </p>
                <span className="statutory-card__link">Initiate Settlement &rarr;</span>
              </div>

              <div className="statutory-card" onClick={() => navigate('/transfers')}>
                <div className="statutory-card__top">
                  <span className="statutory-form-pill">Form 13</span>
                  <span className="statutory-speed-tag">4-Stage Pipeline</span>
                </div>
                <h3 className="statutory-card__title">PF Account Transfer</h3>
                <p className="statutory-card__desc">
                  Transfer accumulated funds from past employers to your active account under your single national UAN.
                </p>
                <span className="statutory-card__link">View Active Transfer (1) &rarr;</span>
              </div>

              <div className="statutory-card statutory-card--family" onClick={() => navigate('/claims/new/death/step-1')}>
                <div className="statutory-card__top">
                  <span className="statutory-form-pill statutory-form-pill--gold">Form 20 &amp; 5IF</span>
                  <span className="statutory-speed-tag">Beneficiary</span>
                </div>
                <h3 className="statutory-card__title">Death &amp; EDLI Insurance Claim</h3>
                <p className="statutory-card__desc">
                  Single guided flow for family members to claim deceased member's PF and insurance up to ₹7,00,000.
                </p>
                <span className="statutory-card__link">Guided Family Flow &rarr;</span>
              </div>
            </div>
          </section>

          {/* Active Employer Compliance Watchdog */}
          <section className="dashboard-card" aria-labelledby="employer-compliance-title">
            <div className="card-header-row">
              <h2 id="employer-compliance-title" className="card-heading">
                Active Employer Compliance Watchdog
              </h2>
              <span className="status-pill-green">🟢 100% Compliant</span>
            </div>

            <div className="employer-compliance-box">
              <div className="employer-info-col">
                <span className="employer-label">Current Establishment</span>
                <strong className="employer-name">{activeEmployer.name}</strong>
                <span className="employer-member-id number">Member ID: {activeEmployer.memberId}</span>
              </div>

              <div className="employer-status-col">
                <span className="deposit-tag">
                  <strong>Last ECR Deposit:</strong> July 2026 (Deposited on 15 Aug 2026)
                </span>
                <span className="deposit-sub">Monthly electronic challan successfully cleared with zero default.</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Claims Tracker & Member Profile Summary */}
        <div className="dashboard-col-right">
          {/* Active & Recent Claims Tracker */}
          <section className="dashboard-card" aria-labelledby="claims-summary-title">
            <div className="card-header-row">
              <h2 id="claims-summary-title" className="card-heading">Active Claims Tracker</h2>
              <Link to="/claims" className="card-header-link">View All ({claims.length}) &rarr;</Link>
            </div>

            <div className="claims-summary-list">
              {claims.map((claim) => (
                <div className="claim-summary-item" key={claim.id}>
                  <div className="claim-summary-item__header">
                    <span className="claim-item-form">{claim.formNumber}</span>
                    <span className={`claim-status-pill claim-status-pill--${claim.status}`}>
                      {claim.status === 'disbursed' && '✓ Settled'}
                      {claim.status === 'in_progress' && '● Under Process'}
                      {claim.status === 'rejected' && '⚠️ Action Required'}
                    </span>
                  </div>

                  <strong className="claim-item-type">{claim.type}</strong>
                  <div className="claim-item-meta">
                    <span className="claim-item-id number">{claim.id}</span>
                    <span className="claim-item-amount number">{formatINR(claim.amountRequested)}</span>
                  </div>

                  {claim.status === 'rejected' ? (
                    <Link to={`/claims/${claim.id}/fix`} className="claim-item-action-link attention">
                      Upload Form 15G to resume &rarr;
                    </Link>
                  ) : (
                    <Link to={`/claims/${claim.id}`} className="claim-item-action-link">
                      Track Live Stepper &rarr;
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Member KYC & Nodal Office Card */}
          <section className="dashboard-card" aria-labelledby="kyc-summary-title">
            <h2 id="kyc-summary-title" className="card-heading">Jurisdiction &amp; KYC</h2>
            <div className="member-details-stack">
              <div className="stack-row">
                <span className="stack-label">Assigned Field Office</span>
                <span className="stack-val">{member.currentOffice}</span>
              </div>
              <div className="stack-row">
                <span className="stack-label">Total Service Tenure</span>
                <span className="stack-val">{member.totalServiceYears || member.serviceYears}</span>
              </div>
              <div className="stack-row">
                <span className="stack-label">Direct Disbursement Bank</span>
                <span className="stack-val number">{member.bankName} ({member.bankAccountMasked})</span>
              </div>
              <div className="stack-row">
                <span className="stack-label">KYC Compliance</span>
                <span className="stack-val status-good">✓ Aadhaar, PAN &amp; Bank Verified</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
