import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeathClaimWizard } from '../../context/DeathClaimContext.js'
import WizardLayout from '../../components/wizard/WizardLayout.jsx'
import './DeathClaimStep2Page.css'

function validateName(name) {
  return name.trim().length > 0
}

function validateBankAccount(account) {
  return /^\d{9,18}$/.test(account.trim())
}

function validateIFSC(ifsc) {
  return /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(ifsc.trim())
}

function DeathClaimStep2Page() {
  const navigate = useNavigate()
  const { wizardData, updateWizardData } = useDeathClaimWizard()

  const [nomineeName, setNomineeName] = useState(wizardData.nomineeName || '')
  const [bankAccount, setBankAccount] = useState(wizardData.nomineeBankAccount || '')
  const [confirmAccount, setConfirmAccount] = useState(wizardData.nomineeBankAccount || '')
  const [ifsc, setIfsc] = useState(wizardData.nomineeBankIFSC || '')

  const [touched, setTouched] = useState({
    nomineeName: false,
    bankAccount: false,
    confirmAccount: false,
    ifsc: false,
  })

  const isNameValid = validateName(nomineeName)
  const isBankAccountValid = validateBankAccount(bankAccount)
  const isIfscValid = validateIFSC(ifsc)
  const isConfirmValid = confirmAccount.trim() === bankAccount.trim() && isBankAccountValid

  const isFormValid = isNameValid && isBankAccountValid && isIfscValid && isConfirmValid

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  function handleContinue() {
    if (!isFormValid) {
      setTouched({
        nomineeName: true,
        bankAccount: true,
        confirmAccount: true,
        ifsc: true,
      })
      return
    }

    updateWizardData({
      nomineeName: nomineeName.trim(),
      nomineeBankAccount: bankAccount.trim(),
      nomineeBankIFSC: ifsc.trim().toUpperCase(),
    })

    navigate('/claims/new/death/step-3')
  }

  return (
    <WizardLayout
      currentStep={2}
      backTo="/claims/new/death/step-1"
      onContinue={handleContinue}
      continueDisabled={!isFormValid}
    >
      <div className="death-step2-content">
        <header className="death-step2-header">
          <h1>Nominee and bank details</h1>
          <p className="death-step2-subtitle">We'll use these details to send the claim amount.</p>
        </header>

        <form className="death-step2-form" onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
          <div className="form-field">
            <label htmlFor="nominee-name">Nominee name</label>
            <input
              id="nominee-name"
              type="text"
              className={`death-step2-input ${touched.nomineeName && !isNameValid ? 'death-step2-input--error' : ''}`}
              value={nomineeName}
              onChange={(e) => setNomineeName(e.target.value)}
              onBlur={() => handleBlur('nomineeName')}
              required
            />
            {touched.nomineeName && !isNameValid ? (
              <span className="field-error">Please enter the nominee's full name.</span>
            ) : null}
          </div>

          <div className="death-step2-readonly-row">
            <span className="death-step2-readonly-label">Relationship to member</span>
            <span className="death-step2-readonly-value">
              {wizardData.relationship || 'Not specified'}
            </span>
          </div>

          <div className="form-field">
            <label htmlFor="bank-account">Bank account number</label>
            <input
              id="bank-account"
              type="text"
              inputMode="numeric"
              placeholder="Enter account number"
              className={`death-step2-input ${touched.bankAccount && !isBankAccountValid ? 'death-step2-input--error' : ''}`}
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              onBlur={() => handleBlur('bankAccount')}
              required
            />
            {touched.bankAccount && !isBankAccountValid ? (
              <span className="field-error">Enter a valid 9-18 digit account number.</span>
            ) : null}
          </div>

          <div className="form-field">
            <label htmlFor="confirm-account">Confirm bank account number</label>
            <input
              id="confirm-account"
              type="text"
              inputMode="numeric"
              placeholder="Re-enter account number"
              className={`death-step2-input ${touched.confirmAccount && !isConfirmValid ? 'death-step2-input--error' : ''}`}
              value={confirmAccount}
              onChange={(e) => setConfirmAccount(e.target.value)}
              onBlur={() => handleBlur('confirmAccount')}
              required
            />
            {touched.confirmAccount && !isConfirmValid ? (
              <span className="field-error">Account numbers don't match.</span>
            ) : null}
          </div>

          <div className="form-field">
            <label htmlFor="ifsc-code">IFSC code</label>
            <input
              id="ifsc-code"
              type="text"
              placeholder="e.g. SBIN0001234"
              className={`death-step2-input ${touched.ifsc && !isIfscValid ? 'death-step2-input--error' : ''}`}
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              onBlur={() => handleBlur('ifsc')}
              required
            />
            {touched.ifsc && !isIfscValid ? (
              <span className="field-error">Enter a valid 11-character IFSC code (e.g. SBIN0001234).</span>
            ) : null}
          </div>
        </form>
      </div>
    </WizardLayout>
  )
}

export default DeathClaimStep2Page
