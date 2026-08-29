import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../context/useSession.js'
import { balance, member as defaultMember } from '../data/mockData.js'
import { insertCloudClaim } from '../lib/supabaseClient.js'
import './NewClaimPage.css'

function formatINR(val) {
  if (val === undefined || val === null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val).replace(/\u20B9\s*/, '\u20B9\u00A0');
}
function NewClaimPage() {
  const navigate = useNavigate()
  const { member: sessionMember } = useSession()
  const member = sessionMember || defaultMember
  const [selectedForm, setSelectedForm] = useState('form_31')
  const [advancePurpose, setAdvancePurpose] = useState('medical')
  const [amount, setAmount] = useState('45000')
  const [form15GAttached, setForm15GAttached] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedClaim, setSubmittedClaim] = useState(null)

  const numAmount = parseInt(amount, 10) || 0
  const isOver50k = numAmount > 50000

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    
    const newClaimId = `CLM${Math.floor(1100 + Math.random() * 900)}`
    const claimRecord = {
      claim_id: newClaimId,
      uan: member.uan,
      form_number: 'Form 31',
      claim_type: advancePurpose === 'medical' ? 'Medical Advance' : advancePurpose === 'housing' ? 'Housing Advance' : advancePurpose === 'education' ? 'Education Advance' : 'Marriage Advance',
      amount_requested: numAmount,
      filed_date: new Date().toISOString().split('T')[0],
      status: 'in_progress',
      current_stage: 1,
    }
    
    await insertCloudClaim(claimRecord)
    
    setIsSubmitting(false)
    setSubmittedClaim({
      id: newClaimId,
      amount: numAmount,
      form: 'Form 31',
      disbursementDate: 'Estimated within 3 business days',
    })
  }

  if (submittedClaim) {
    return (
      <div className="new-claim-success-card">
        <div className="success-icon">✓</div>
        <h1>Claim Successfully Submitted</h1>
        <p className="success-sub">
          Your <strong>{submittedClaim.form}</strong> advance request of <strong>{formatINR(submittedClaim.amount)}</strong> is queued on the CITES 2.01 auto-settlement rail.
        </p>

        <div className="success-meta-box">
          <div className="success-meta-row">
            <span>Tracking Claim ID</span>
            <strong className="number">{submittedClaim.id}</strong>
          </div>
          <div className="success-meta-row">
            <span>Destination Bank Account</span>
            <strong className="number">{member.bankAccountMasked} ({member.bankIFSC})</strong>
          </div>
          <div className="success-meta-row">
            <span>Estimated Disbursement</span>
            <strong className="status-good">{submittedClaim.disbursementDate}</strong>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/claims" className="btn-primary">
            View All Claims &rarr;
          </Link>
          <Link to="/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="new-claim-layout">
      <div className="new-claim-header">
        <Link to="/claims" className="claims-back-link">&larr; Back to Claims</Link>
        <h1>Initiate Statutory Claim (CITES 2.01)</h1>
        <p className="subtitle">Select your situation to route directly to the correct national form.</p>
      </div>

      <div className="new-claim-grid">
        {/* Left: Form Selector */}
        <div className="form-selector-col">
          <div
            className={`form-option-card ${selectedForm === 'form_31' ? 'selected' : ''}`}
            onClick={() => setSelectedForm('form_31')}
          >
            <div className="form-option-header">
              <span className="form-num-badge">Form 31</span>
              <span className="form-speed-tag">Auto-Settlement: 84%</span>
            </div>
            <h3>Advance / Partial Withdrawal (In-Service)</h3>
            <p>For medical emergency, house purchase, higher education, or marriage expenses while employed.</p>
          </div>

          <div
            className={`form-option-card ${selectedForm === 'form_19' ? 'selected' : ''}`}
            onClick={() => setSelectedForm('form_19')}
          >
            <div className="form-option-header">
              <span className="form-num-badge">Form 19</span>
              <span className="form-speed-tag">Final Settlement</span>
            </div>
            <h3>Full PF Settlement (Left Employment)</h3>
            <p>Complete settlement of entire accumulated PF balance after leaving service for &gt; 2 months.</p>
          </div>

          <div
            className={`form-option-card ${selectedForm === 'form_10c' ? 'selected' : ''}`}
            onClick={() => setSelectedForm('form_10c')}
          >
            <div className="form-option-header">
              <span className="form-num-badge">Form 10C</span>
              <span className="form-speed-tag">Pension Fund</span>
            </div>
            <h3>Pension Withdrawal / Scheme Certificate</h3>
            <p>Withdraw accumulated EPS pension amount or receive a continuous scheme certificate.</p>
          </div>

          <div
            className="form-option-card form-option-card--death"
            onClick={() => navigate('/claims/new/death/step-1')}
          >
            <div className="form-option-header">
              <span className="form-num-badge form-num-badge--gold">Form 20 &amp; 5IF</span>
              <span className="form-speed-tag">Beneficiary</span>
            </div>
            <h3>Death &amp; EDLI Insurance Claim</h3>
            <p>Dedicated guided wizard for family members to claim deceased member's PF and insurance up to ₹7 Lakh.</p>
            <span className="death-flow-trigger">Launch 4-Step Family Wizard &rarr;</span>
          </div>
        </div>

        {/* Right: Pre-Flight Configuration Engine */}
        <div className="form-config-col">
          <form className="claim-config-card" onSubmit={handleSubmit}>
            <div className="config-header">
              <h2>Pre-Flight Validation Engine</h2>
              <span className="config-badge">CITES Pre-Check Active</span>
            </div>

            {selectedForm === 'form_31' && (
              <div className="config-body">
                <div className="config-field">
                  <label htmlFor="advance-reason">Advance Purpose</label>
                  <select
                    id="advance-reason"
                    className="config-select"
                    value={advancePurpose}
                    onChange={(e) => setAdvancePurpose(e.target.value)}
                  >
                    <option value="medical">Medical Emergency (Self / Family)</option>
                    <option value="housing">House Construction / Flat Purchase</option>
                    <option value="education">Higher Education of Children</option>
                    <option value="marriage">Marriage of Self / Sibling / Child</option>
                  </select>
                </div>

                <div className="config-field">
                  <label htmlFor="claim-amount">Requested Amount (₹)</label>
                  <div className="amount-input-wrapper">
                    <span className="currency-prefix">₹</span>
                    <input
                      id="claim-amount"
                      type="number"
                      className="config-input number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      max={balance.withdrawable}
                      required
                    />
                  </div>
                  <span className="field-hint">
                    Maximum eligible withdrawable limit: <strong>{formatINR(balance.withdrawable)}</strong>
                  </span>
                </div>

                {/* Statutory Pre-Flight Warning for >₹50k */}
                {isOver50k && (
                  <div className="preflight-rule-box">
                    <span className="rule-icon">⚠️</span>
                    <div className="rule-content">
                      <strong>Statutory Form 15G Rule Triggered</strong>
                      <p>
                        For withdrawals above ₹50,000 with under 5 years service, Form 15G is mandatory to prevent a 10% TDS deduction.
                      </p>
                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={form15GAttached}
                          onChange={(e) => setForm15GAttached(e.target.checked)}
                        />
                        <span>Auto-attach verified Form 15G from DigiLocker (Demo)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Pre-Verified Direct Deposit Bank */}
                <div className="bank-verification-box">
                  <span className="bank-check-icon">✓</span>
                  <div className="bank-info">
                    <span className="bank-label">Direct Deposit Bank Account (Verified)</span>
                    <strong className="bank-val number">{member.bankName} — {member.bankAccountMasked}</strong>
                    <span className="bank-ifsc number">IFSC: {member.bankIFSC} (Validated against RBI rails)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="claim-submit-btn"
                  disabled={isSubmitting || numAmount <= 0 || numAmount > balance.withdrawable}
                >
                  {isSubmitting ? 'Validating against CITES Rails...' : `Submit Form 31 Claim for ${formatINR(numAmount)} →`}
                </button>
              </div>
            )}

            {selectedForm !== 'form_31' && (
              <div className="config-body">
                <p className="unemployed-notice">
                  Form 19 and Form 10C require confirmation that your relieving date has been authenticated by your establishment on the central ECR portal.
                </p>
                <div className="bank-verification-box">
                  <span className="bank-check-icon">✓</span>
                  <div className="bank-info">
                    <span className="bank-label">Direct Deposit Bank Account</span>
                    <strong className="bank-val number">{member.bankName} — {member.bankAccountMasked}</strong>
                  </div>
                </div>
                <button type="submit" className="claim-submit-btn">
                  Submit Statutory Claim &rarr;
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewClaimPage

