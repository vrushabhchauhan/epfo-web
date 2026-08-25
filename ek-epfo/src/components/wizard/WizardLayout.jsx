import React from 'react'
import { Link } from 'react-router-dom'
import WizardStepIndicator from './WizardStepIndicator.jsx'
import './WizardLayout.css'

function WizardLayout({
  children,
  currentStep,
  totalSteps = 4,
  intro,
  onBack,
  backTo,
  backLabel = 'Back',
  onContinue,
  continueDisabled = false,
  continueLabel = 'Continue',
}) {
  return (
    <div className="wizard-container">
      {intro ? <p className="wizard-intro">{intro}</p> : null}

      <div className="wizard-indicator-wrapper">
        <WizardStepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <div className="wizard-card">
        {children}

        <div className="wizard-actions">
          {onBack ? (
            <button type="button" className="wizard-back-btn" onClick={onBack}>
              {backLabel}
            </button>
          ) : backTo ? (
            <Link className="wizard-back-link" to={backTo}>
              {backLabel}
            </Link>
          ) : (
            <div />
          )}

          <button
            type="button"
            className="wizard-continue-btn"
            disabled={continueDisabled}
            onClick={onContinue}
          >
            {continueLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WizardLayout
