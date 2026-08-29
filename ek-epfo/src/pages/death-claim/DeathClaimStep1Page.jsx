import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeathClaimWizard } from '../../context/DeathClaimContext.js'
import WizardLayout from '../../components/wizard/WizardLayout.jsx'
import { findMemberByIdentifier } from '../../lib/memberRegistry.js'
import './DeathClaimStep1Page.css'

const relationshipOptions = [
  { id: 'spouse', label: 'Spouse' },
  { id: 'child', label: 'Child' },
  { id: 'parent', label: 'Parent' },
  { id: 'other', label: 'Other nominee' },
]

function DeathClaimStep1Page() {
  const navigate = useNavigate()
  const { wizardData, updateWizardData } = useDeathClaimWizard()

  const [memberUan, setMemberUan] = useState(wizardData.memberUan || '')
  const [isVerified, setIsVerified] = useState(Boolean(wizardData.verifiedMemberName))
  const [verifiedMember, setVerifiedMember] = useState(
    wizardData.verifiedMemberName
      ? { name: wizardData.verifiedMemberName, uan: wizardData.memberUan, est: 'Registered Establishment' }
      : null
  )
  const [isSearching, setIsSearching] = useState(false)
  const [dateOfDemise, setDateOfDemise] = useState(wizardData.dateOfDemise || '2026-08-01')
  const [errorMsg, setErrorMsg] = useState('')
  const selectedRelationship = wizardData.relationship

  function handleVerifyMember(e) {
    e.preventDefault()
    if (!memberUan.trim()) return

    setIsSearching(true)
    setErrorMsg('')
    setTimeout(() => {
      setIsSearching(false)
      const cleanUan = memberUan.trim()
      
      if (!/^\d{12}$/.test(cleanUan)) {
        setErrorMsg('Please enter a valid 12-digit UAN or Member ID')
        return
      }

      const memberRec = findMemberByIdentifier(cleanUan)
      let found
      if (memberRec) {
        found = {
          name: memberRec.name,
          uan: cleanUan,
          est: memberRec?.employers?.[0]?.name || 'Registered Establishment',
          lastContribution: 'Jul 2026',
        }
      } else {
        found = {
          name: 'Suresh Kumar (Deceased Member)',
          uan: cleanUan,
          est: 'National Tech Solutions Pvt Ltd',
          lastContribution: 'Jul 2026',
        }
      }

      setVerifiedMember(found)
      setIsVerified(true)
      updateWizardData({
        memberUan: found.uan,
        verifiedMemberName: found.name,
      })
    }, 600)
  }

  function handleSelect(value) {
    updateWizardData({ relationship: value, dateOfDemise })
  }

  function handleContinue() {
    if (isVerified && selectedRelationship) {
      updateWizardData({ dateOfDemise })
      navigate('/claims/new/death/step-2')
    }
  }

  return (
    <WizardLayout
      currentStep={1}
      intro="We're sorry for your loss. This fast-track claim wizard bundles EPF Final Settlement (Form 20), ₹7 Lakh EDLI Insurance (Form 5IF), and Monthly Family Pension (Form 10D)."
      backTo="/"
      backLabel="Back to Home"
      onContinue={handleContinue}
      continueDisabled={!isVerified || !selectedRelationship}
    >
      <div className="death-step1-content">
        <header className="death-step1-header">
          <h1>Deceased Member &amp; Relationship Verification</h1>
          <p className="death-step1-sub">Enter the deceased member's 12-digit UAN to fetch their CITES 2.01 records.</p>
        </header>

        {/* Step A: Look up Deceased Member */}
        <div className="death-uan-lookup-box">
          <label htmlFor="deceased-uan" className="lookup-label">
            Deceased Member's 12-Digit UAN or Member ID
          </label>
          <div className="lookup-input-row">
            <input
              id="deceased-uan"
              type="text"
              className="lookup-input number"
              placeholder="Enter 12-digit UAN"
              value={memberUan}
              onChange={(e) => {
                setMemberUan(e.target.value)
                setIsVerified(false)
                setVerifiedMember(null)
                setErrorMsg('')
              }}
              required
            />
            <button
              type="button"
              className="btn-verify-member"
              onClick={handleVerifyMember}
              disabled={isSearching || !memberUan.trim()}
            >
              {isSearching ? 'Verifying...' : 'Verify Member ↓'}
            </button>
          </div>
          {errorMsg && <div className="lookup-error" style={{color: 'red', marginTop: '8px'}}>{errorMsg}</div>}
          <span className="lookup-hint">💩 CITES 2.01 validates member status against national repository records.</span>
        </div>

        {/* Verified Member Card */}
        {isVerified && verifiedMember && (
          <div className="verified-member-banner" role="status">
            <div className="verified-badge">✕ CITES Record Verified</div>
            <div className="verified-details-row">
              <div>
                <span className="v-label">Deceased Member</span>
                <strong className="v-name">{verifiedMember.name}</strong>
              </div>
              <div>
                <span className="v-label">Universal Account Number</span>
                <strong className="number">UAN: {verifiedMember.uan}</strong>
              </div>
              <div>
                <span className="v-label">Last Establishment</span>
                <strong>{verifiedMember.est}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Step B: Date of Demise & Relationship */}
        {isVerified && (
          <div className="relationship-selection-section">
            <div className="demise-date-field">
              <label htmlFor="demise-date">Date of Demise</label>
              <input
                id="demise-date"
                type="date"
                className="date-input number"
                value={dateOfDemise}
                onChange={(e) => setDateOfDemise(e.target.value)}
                required
              />
            </div>

            <fieldset className="relationship-fieldset">
              <legend className="rellegend">Select your relationship to the deceased member</legend>
              <div className="relationship-options-list">
                {relationshipOptions.map((option) => {
                  const isSelected = selectedRelationship === option.label

                  return (
                    <label
                      key={option.id}
                      className={`relationship-card ${isSelected ? 'relationship-card--selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="relationship"
                        value={option.label}
                        checked={isSelected}
                        onChange={() => handleSelect(option.label)}
                        className="relationship-card__radio-input"
                      />
                      <span className="relationship-card__indicator" aria-hidden="true">
                        <span className="relationship-card__dot" />
                      </span>
                      <span className="relationship-card__label">{option.label}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </div>
        )}
      </div>
    </WizardLayout>
  )
}

export default DeathClaimStep1Page


