import React, { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { claims, rejectionReasons } from '../data/mockData.js'
import { updateCloudClaimStatus } from '../lib/supabaseClient.js'
import './ClaimFixPage.css'

function ClaimFixPage() {
  const { claimId } = useParams()
  const claim = claims.find((item) => item.id === claimId)
  const fileInputRef = useRef(null)

  const [fileName, setFileName] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!claim || claim.status !== 'rejected') {
    return (
      <div className="claim-fix-page">
        <Link className="claims-back-link" to="/claims">
          &larr; Back to claims
        </Link>
        <div className="claim-fix-card claim-fix-not-found">
          <h1>{!claim ? 'Claim not found' : 'Nothing to fix here'}</h1>
          <p>
            {!claim
              ? 'No claim matches this ID. Return to claims to view all filed claims.'
              : 'This claim is not in a rejected state and does not require a fix.'}
          </p>
        </div>
      </div>
    )
  }

  const rejection = claim.rejectionReason ? rejectionReasons[claim.rejectionReason] : null

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFileName(selectedFile.name)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!fileName || isSubmitting) return

    setIsSubmitting(true)
    setTimeout(() => {
      updateCloudClaimStatus(claim.id, {
        status: 'in_progress',
        current_stage: 3,
      }).catch(() => {})

      setIsSubmitting(false)
      setIsSuccess(true)
    }, 700)
  }

  return (
    <div className="claim-fix-page">
      <Link className="claims-back-link" to={`/claims/${claim.id}`}>
        &larr; Back to claim
      </Link>

      <header className="claim-fix-header">
        <h1>Fix and resubmit</h1>
        <p className="claim-fix-subtitle">Issue: {rejection ? rejection.title : 'Action needed on claim'}</p>
      </header>

      <div className="claim-fix-card">
        {isSuccess ? (
          <div className="claim-fix-success" role="status" aria-live="polite">
            <div className="claim-fix-success__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>Resubmitted</h2>
            <p>Your claim is back in review. We'll update you here as it progresses.</p>
            <Link className="claim-fix-submit-button claim-fix-success-link" to={`/claims/${claim.id}`}>
              Back to claim details
            </Link>
          </div>
        ) : (
          <>
            <p className="claim-fix-explanation">{rejection?.explanation}</p>

            <form className="claim-fix-form" onSubmit={handleSubmit}>
              <div className="claim-fix-upload-section">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,image/*"
                  className="claim-fix-file-input"
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <button
                  type="button"
                  className={`claim-fix-dropzone ${fileName ? 'claim-fix-dropzone--selected' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={fileName ? `Selected file: ${fileName}. Click to change file.` : 'Click to upload Form 15G'}
                >
                  {fileName ? (
                    <div className="claim-fix-dropzone__selected">
                      <div className="claim-fix-dropzone__check-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="claim-fix-dropzone__filename">{fileName}</span>
                      <span className="claim-fix-dropzone__hint">Click to replace file</span>
                    </div>
                  ) : (
                    <div className="claim-fix-dropzone__placeholder">
                      <div className="claim-fix-dropzone__upload-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="12" y1="18" x2="12" y2="12" />
                          <polyline points="9 15 12 12 15 15" />
                        </svg>
                      </div>
                      <span className="claim-fix-dropzone__title">Click to upload Form 15G</span>
                      <span className="claim-fix-dropzone__sub">PDF or image, up to 5MB (demo only — no real file is stored)</span>
                    </div>
                  )}
                </button>
              </div>

              <div className="claim-fix-field">
                <label htmlFor="claim-notes">Anything else you'd like to add? (optional)</label>
                <textarea
                  id="claim-notes"
                  className="claim-fix-textarea"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Added additional clarification or updated documents"
                />
              </div>

              <button
                type="submit"
                className="claim-fix-submit-button"
                disabled={!fileName || isSubmitting}
              >
                {isSubmitting ? 'Resubmitting...' : 'Resubmit claim'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ClaimFixPage
