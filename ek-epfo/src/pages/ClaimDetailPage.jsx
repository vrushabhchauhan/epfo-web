import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { claims, rejectionReasons } from '../data/mockData.js'
import './ClaimDetailPage.css'

const helpText = {
  Submitted: 'Your claim has been filed and is now in the EPFO workflow.',
  Verified: 'Your submitted documents and member details have been checked.',
  'Field Office Review': 'Your local EPFO office checks your claim details before approving it.',
  Disbursed: 'The approved amount has been sent to your linked bank account.',
  'Action needed': 'Something is missing or needs correction before the claim can continue.',
}

function formatIndianCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDisplayDate(dateValue) {
  if (!dateValue) return ''
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateValue))
}

function HelpModal({ body, onClose, title }) {
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    previousFocusRef.current = document.activeElement
    const dialog = dialogRef.current
    if (!dialog) return

    const focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    const firstElement = focusable[0]
    const lastElement = focusable[focusable.length - 1]

    firstElement?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }

      if (event.key === 'Tab' && focusable.length > 0) {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus()
      }
    }
  }, [onClose])

  return (
    <div className="help-modal-backdrop" onMouseDown={onClose}>
      <style>{`@media print { .app-sidebar, header, .no-print, button, a.action-link, .passbook-export-btn { display: none !important; } .app-main { margin: 0 !important; padding: 0 !important; width: 100% !important; } .page-passbook, .page-claim-detail { background: white !important; } }`}</style>

      <section
        aria-labelledby="help-modal-title"
        aria-modal="true"
        className="help-modal"
        onMouseDown={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
      >
        <div className="help-modal__top">
          <h2 id="help-modal-title">{title}</h2>
          <button aria-label="Close help" className="help-modal__close" type="button" onClick={onClose}>
            &times;
          </button>
        </div>
        <p className="help-modal__body">{body}</p>
      </section>
    </div>
  )
}

function ClaimDetailPage() {
  const { claimId } = useParams()
  const [activeHelp, setActiveHelp] = useState(null)
  const claim = claims.find((item) => item.id === claimId)

  if (!claim) {
    return (
      <div className="claim-detail-page">
        <Link className="claims-back-link" to="/claims">
          &larr; Back to claims
        </Link>
        <div className="claim-not-found">
          <h1>Claim not found</h1>
          <p>No claim matches this ID. Return to claims to view all filed claims.</p>
        </div>
      </div>
    )
  }

  const currentIndex = Math.min(claim.currentStage, claim.stages.length - 1)
  const nextStage = claim.stages[claim.currentStage + 1] || claim.stages[claim.currentStage]
  const rejection = claim.rejectionReason ? rejectionReasons[claim.rejectionReason] : null
  const disbursedStage = claim.stages.find((stage) => stage.label === 'Disbursed')

  return (
    <div className="claim-detail-page">
      <Link className="claims-back-link" to="/claims">
        &larr; Back to claims
      </Link>

      <header className="claim-detail-header">
        <h1>{claim.type}</h1>
        <p className="claim-detail-meta">
          {claim.id} · Filed {formatDisplayDate(claim.filedDate)}
        </p>
      </header>

      <div className="claim-detail-grid">
        <section className="claim-timeline-card" aria-labelledby="claim-timeline-title">
          <h2 id="claim-timeline-title">Timeline</h2>
          <ol className="claim-timeline">
            {claim.stages.map((stage, index) => {
              const isRejected = claim.status === 'rejected'
              const isRejectedCurrent = isRejected && index === currentIndex
              const isComplete = isRejected ? index < currentIndex : index <= currentIndex
              const lineComplete = isRejected
                ? index < currentIndex - 1
                : claim.status === 'disbursed'
                  ? true
                  : index < currentIndex

              return (
                <li className="claim-timeline__item" key={`${stage.label}-${stage.date || 'pending'}`}>
                  <div className="claim-timeline__track">
                    <span
                      className={[
                        'claim-timeline__marker',
                        isComplete ? 'claim-timeline__marker--complete' : '',
                        isRejectedCurrent ? 'claim-timeline__marker--attention' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    />
                    {index < claim.stages.length - 1 ? (
                      <span
                        className={[
                          'claim-timeline__line',
                          lineComplete ? 'claim-timeline__line--complete' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      />
                    ) : null}
                  </div>
                  <div className="claim-timeline__content">
                    <div className="claim-timeline__label-row">
                      <h3 className={isRejectedCurrent ? 'claim-timeline__label--attention' : undefined}>
                        {stage.label}
                      </h3>
                      <button
                        aria-label={`What does ${stage.label} mean?`}
                        className="stage-help-button"
                        type="button"
                        onClick={() =>
                          setActiveHelp({
                            title: stage.label,
                            body: helpText[stage.label] || 'This step shows where your claim is in the process.',
                          })
                        }
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4" />
                          <path d="M12 17h.01" />
                        </svg>
                      </button>
                    </div>
                    <p className="claim-timeline__date">{stage.date ? formatDisplayDate(stage.date) : 'Pending'}</p>
                    <p className="claim-timeline__description">{stage.description}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <aside className="claim-status-card" aria-labelledby="claim-status-title">
          {claim.status === 'disbursed' ? (
            <>
              <p className="claim-status-label" id="claim-status-title">
                Claim complete
              </p>
              <h2>Disbursed on {formatDisplayDate(disbursedStage?.date || claim.filedDate)}</h2>
              <p className="claim-status-amount number">{formatIndianCurrency(claim.amountRequested)}</p>
            </>
          ) : null}

          {claim.status === 'in_progress' && nextStage ? (
            <>
              <p className="claim-status-label" id="claim-status-title">
                What happens next
              </p>
              <h2>Next: {nextStage.label}</h2>
              <p className="claim-status-description">
                Next: {nextStage.label} &mdash; {nextStage.description}
              </p>
            </>
          ) : null}

          {claim.status === 'rejected' && rejection ? (
            <>
              <p className="claim-status-label" id="claim-status-title">
                Action needed
              </p>
              <h2 className="claim-status-card__attention">{rejection.title}</h2>
              <p className="claim-status-description">{rejection.explanation}</p>
              <Link className="claim-fix-link" to={`/claims/${claim.id}/fix`}>
                {rejection.fixLabel}
              </Link>
            </>
          ) : null}
        </aside>
      </div>

      {activeHelp ? <HelpModal body={activeHelp.body} title={activeHelp.title} onClose={() => setActiveHelp(null)} /> : null}
    </div>
  )
}

export default ClaimDetailPage

