import React from 'react'
import './WizardStepIndicator.css'

function WizardStepIndicator({ currentStep, totalSteps = 4 }) {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100))

  return (
    <div className="wizard-step-indicator">
      <div className="wizard-step-header">
        <span className="wizard-step-text">
          <strong className="wizard-step-current">Step {currentStep}</strong> of {totalSteps}
        </span>
      </div>
      <div
        className="wizard-progress-track"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}`} tabIndex={0}
      >
        <div className="wizard-progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

export default WizardStepIndicator

