import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeathClaimWizard } from '../../context/DeathClaimContext.js'
import WizardLayout from '../../components/wizard/WizardLayout.jsx'
import './DeathClaimStep3Page.css'

function UploadRow({ id, label, helperText, fileName, onFileSelect }) {
  const fileInputRef = useRef(null)

  function handleChange(event) {
    const selected = event.target.files?.[0]
    if (selected) {
      onFileSelect(selected.name)
    }
  }

  return (
    <div className="death-upload-row">
      <div className="death-upload-label-container">
        <label className="death-upload-label" htmlFor={id}>
          {label}
        </label>
        <p className="death-upload-helper">{helperText}</p>
      </div>

      <div className="death-upload-control">
        <input
          id={id}
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept=".pdf,image/*"
          className="death-upload-file-input"
          tabIndex={-1}
          aria-hidden="true"
        />
        <button
          type="button"
          className={`death-upload-dropzone ${fileName ? 'death-upload-dropzone--selected' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          aria-label={fileName ? `${label}: ${fileName}. Click to replace file.` : `Click to upload ${label}`}
        >
          {fileName ? (
            <div className="death-upload-dropzone__selected">
              <div className="death-upload-dropzone__check-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="death-upload-dropzone__filename">{fileName}</span>
              <span className="death-upload-dropzone__hint">Click to replace</span>
            </div>
          ) : (
            <div className="death-upload-dropzone__placeholder">
              <div className="death-upload-dropzone__upload-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 12 15 15" />
                </svg>
              </div>
              <span className="death-upload-dropzone__title">Click to upload</span>
              <span className="death-upload-dropzone__sub">PDF or image, up to 5MB</span>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

function DeathClaimStep3Page() {
  const navigate = useNavigate()
  const { wizardData, updateWizardData } = useDeathClaimWizard()

  const initialDocs = wizardData.uploadedDocuments || {}
  const [deathCertificate, setDeathCertificate] = useState(initialDocs.deathCertificate || '')
  const [nomineeId, setNomineeId] = useState(initialDocs.nomineeId || '')
  const [notes, setNotes] = useState(wizardData.additionalNotes || '')

  const isComplete = Boolean(deathCertificate && nomineeId)

  function syncContextData(customDocs = { deathCertificate, nomineeId }, customNotes = notes) {
    updateWizardData({
      uploadedDocuments: customDocs,
      additionalNotes: customNotes,
    })
  }

  function handleDeathCertSelect(name) {
    setDeathCertificate(name)
    syncContextData({ deathCertificate: name, nomineeId }, notes)
  }

  function handleNomineeIdSelect(name) {
    setNomineeId(name)
    syncContextData({ deathCertificate, nomineeId: name }, notes)
  }

  function handleNotesChange(e) {
    const val = e.target.value
    setNotes(val)
    syncContextData({ deathCertificate, nomineeId }, val)
  }

  function handleBack() {
    syncContextData()
    navigate('/claims/new/death/step-2')
  }

  function handleContinue() {
    if (!isComplete) return
    syncContextData()
    navigate('/claims/new/death/step-4')
  }

  return (
    <WizardLayout
      currentStep={3}
      onBack={handleBack}
      onContinue={handleContinue}
      continueDisabled={!isComplete}
    >
      <div className="death-step3-content">
        <header className="death-step3-header">
          <h1>Upload documents</h1>
          <p className="death-step3-subtitle">We need these two documents to process the claim.</p>
        </header>

        <div className="death-upload-group">
          <UploadRow
            id="death-certificate"
            label="Death certificate"
            helperText="A copy of the official death certificate."
            fileName={deathCertificate}
            onFileSelect={handleDeathCertSelect}
          />

          <UploadRow
            id="nominee-id"
            label="Nominee ID proof"
            helperText="Aadhaar, PAN, or passport of the nominee."
            fileName={nomineeId}
            onFileSelect={handleNomineeIdSelect}
          />
        </div>

        <div className="death-step3-notes-field">
          <label htmlFor="death-claim-notes" className="death-step3-notes-label">
            Anything else you'd like to add? (optional)
          </label>
          <textarea
            id="death-claim-notes"
            className="death-step3-textarea"
            rows={3}
            value={notes}
            onChange={handleNotesChange}
            placeholder="e.g. Additional details or clarifications about the submitted documents"
          />
        </div>
      </div>
    </WizardLayout>
  )
}

export default DeathClaimStep3Page
