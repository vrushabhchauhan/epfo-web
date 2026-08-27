import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDeathClaimWizard } from '../../context/DeathClaimContext.js'
import WizardLayout from '../../components/wizard/WizardLayout.jsx'
import './DeathClaimStep4Page.css'

function maskAccountNumber(account) {
  if (!account) return '•••• •••• ••••'
  const clean = account.trim()
  if (clean.length <= 4) return `•••• ${clean}`
  const last4 = clean.slice(-4)
  return `•••• •••• ${last4}`
}

function DeathClaimStep4Page() {
  const navigate = useNavigate()
  const { wizardData } = useDeathClaimWizard()
  const [confirmed, setConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const docs = wizardData.uploadedDocuments || {}

  function handleSubmit() {
    if (!confirmed || isSubmitting) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/claims/new/death/confirmation')
    }, 900)
  }

  return (
    <WizardLayout
      currentStep={4}
      onBack={() => navigate('/claims/new/death/step-3')}
      onContinue={handleSubmit}
      continueDisabled={!confirmed || isSubmitting}
      continueLabel={isSubmitting ? 'Submitting...' : 'Submit claim'}
    >
      <div className="death-step4-content">
        <header className="death-step4-header">
          <h1>Review your claim</h1>
          <p className="death-step4-subtitle">Please check these details before submitting.</p>
        </header>

        <div className="death-review-sections">
          {/* Statutory 3-in-1 Combined Benefit Banner */}
          <div className="statutory-benefits-summary-box">
            <div className="statutory-summary-header">
              <span className="statutory-badge">Triple Statutory Entitlement</span>
              <h3>Fast-Track Settlement Package</h3>
            </div>
            <div className="statutory-benefits-grid">
              <div className="stat-benefit-card">
                <span className="s-form">Form 20</span>
                <strong className="s-val number">₹4,93,600</strong>
                <span className="s-desc">100% EPF Accumulation + Accrued Interest</span>
              </div>
              <div className="stat-benefit-card stat-benefit-card--highlight">
                <span className="s-form">Form 5IF</span>
                <strong className="s-val number">₹7,00,000</strong>
                <span className="s-desc">EDLI Life Insurance Assurance Benefit</span>
              </div>
              <div className="stat-benefit-card">
                <span className="s-form">Form 10D</span>
                <strong className="s-val number">₹2,410 / mo</strong>
                <span className="s-desc">Monthly Lifetime Widow/Family Pension</span>
              </div>
            </div>
          </div>

          {/* Section 1: Relationship */}
          <section className="death-review-section" aria-labelledby="section-relationship">
            <div className="death-review-section__header">
              <h2 id="section-relationship">Deceased Member &amp; Relationship</h2>
              <Link className="death-review-edit-link" to="/claims/new/death/step-1">
                Edit
              </Link>
            </div>
            <div className="death-review-row">
              <span className="death-review-row__label">Deceased Member</span>
              <span className="death-review-row__value">{wizardData.verifiedMemberName || 'Deceased Member'} (UAN: {wizardData.memberUan || 'N/A'})</span>
            </div>
            <div className="death-review-row">
              <span className="death-review-row__label">Relationship</span>
              <span className="death-review-row__value">{wizardData.relationship || 'Spouse'}</span>
            </div>
            <div className="death-review-row">
              <span className="death-review-row__label">Date of Demise</span>
              <span className="death-review-row__value number">{wizardData.dateOfDemise || '2026-08-01'}</span>
            </div>
          </section>

          {/* Section 2: Nominee & bank details */}
          <section className="death-review-section" aria-labelledby="section-nominee">
            <div className="death-review-section__header">
              <h2 id="section-nominee">Nominee &amp; bank details</h2>
              <Link className="death-review-edit-link" to="/claims/new/death/step-2">
                Edit
              </Link>
            </div>
            <div className="death-review-row">
              <span className="death-review-row__label">Nominee name</span>
              <span className="death-review-row__value">{wizardData.nomineeName || '—'}</span>
            </div>
            <div className="death-review-row">
              <span className="death-review-row__label">Bank account number</span>
              <span className="death-review-row__value number">{maskAccountNumber(wizardData.nomineeBankAccount)}</span>
            </div>
            <div className="death-review-row">
              <span className="death-review-row__label">IFSC code</span>
              <span className="death-review-row__value number">{wizardData.nomineeBankIFSC || '—'}</span>
            </div>
          </section>

          {/* Section 3: Documents */}
          <section className="death-review-section" aria-labelledby="section-documents">
            <div className="death-review-section__header">
              <h2 id="section-documents">Documents</h2>
              <Link className="death-review-edit-link" to="/claims/new/death/step-3">
                Edit
              </Link>
            </div>
            <div className="death-review-doc-item">
              <span className="death-review-check-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="death-review-doc-text">
                <strong>Death certificate</strong> — {docs.deathCertificate || 'Uploaded'}
              </span>
            </div>
            <div className="death-review-doc-item">
              <span className="death-review-check-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="death-review-doc-text">
                <strong>Nominee ID proof</strong> — {docs.nomineeId || 'Uploaded'}
              </span>
            </div>
            {wizardData.additionalNotes ? (
              <div className="death-review-row death-review-row--notes">
                <span className="death-review-row__label">Notes</span>
                <span className="death-review-row__value">{wizardData.additionalNotes}</span>
              </div>
            ) : null}
          </section>
        </div>

        <div className="death-confirmation-box">
          <label className="death-checkbox-label" htmlFor="confirm-details">
            <input
              type="checkbox"
              id="confirm-details"
              className="death-checkbox-input"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <span className="death-checkbox-text">
              I confirm the details above are accurate to the best of my knowledge.
            </span>
          </label>
        </div>
      </div>
    </WizardLayout>
  )
}

export default DeathClaimStep4Page
