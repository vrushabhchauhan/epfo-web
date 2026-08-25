import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './UanActivatePage.css'

function UanActivatePage() {
  const [uan, setUan] = useState('1004829371')
  const [aadhaar, setAadhaar] = useState('928192819281')
  const [name, setName] = useState('Ananya Rao')
  const [dob, setDob] = useState('1990-04-12')
  const [mobile, setMobile] = useState('9876544821')
  const [consent, setConsent] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1) // 1: form, 2: otp, 3: success
  const [otp, setOtp] = useState('582914')
  const [password, setPassword] = useState('Epfo@2026')

  function handleFormSubmit(e) {
    e.preventDefault()
    if (!consent) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setStep(2)
    }, 700)
  }

  function handleOtpSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setStep(3)
    }, 800)
  }

  return (
    <div className="uan-service-layout">
      {/* Gov Header */}
      <div className="uan-header">
        <Link to="/" className="uan-back-link">&larr; Back to Home</Link>
        <div className="uan-title-row">
          <span className="uan-service-badge">Citizen Public Service</span>
          <h1>Universal Account Number (UAN) Activation</h1>
        </div>
        <p className="uan-desc">
          First-time workers and active members can activate their UAN using Aadhaar-based OTP authentication to access the member portal.
        </p>
      </div>

      <div className="uan-card">
        {step === 1 && (
          <form className="uan-form" onSubmit={handleFormSubmit}>
            <div className="form-info-notice">
              <span className="notice-icon">ℹ️</span>
              <span>Ensure your Name, DOB, and Mobile number match your <strong>Aadhaar record</strong> exactly to pass UIDAI verification.</span>
            </div>

            <div className="uan-form-grid">
              <div className="form-group">
                <label htmlFor="act-uan">12-Digit UAN Number *</label>
                <input
                  id="act-uan"
                  type="text"
                  className="uan-input number"
                  maxLength={12}
                  value={uan}
                  onChange={(e) => setUan(e.target.value)}
                  placeholder="e.g. 1004829371"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="act-aadhaar">12-Digit Aadhaar Number *</label>
                <input
                  id="act-aadhaar"
                  type="text"
                  className="uan-input number"
                  maxLength={12}
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  placeholder="e.g. 123456789012"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="act-name">Full Name (As on Aadhaar) *</label>
                <input
                  id="act-name"
                  type="text"
                  className="uan-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="act-dob">Date of Birth *</label>
                <input
                  id="act-dob"
                  type="date"
                  className="uan-input number"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="act-mobile">Aadhaar Linked Mobile Number *</label>
                <input
                  id="act-mobile"
                  type="tel"
                  className="uan-input number"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>
            </div>

            <div className="consent-checkbox-row">
              <input
                id="consent-check"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />
              <label htmlFor="consent-check">
                I hereby give my voluntary consent to EPFO to use my Aadhaar details for demographic authentication and UAN activation under the EPF &amp; MP Act, 1952.
              </label>
            </div>

            <button type="submit" className="uan-submit-btn" disabled={isSubmitting || !consent}>
              {isSubmitting ? 'Validating with UIDAI...' : 'Get Authorization PIN / Aadhaar OTP →'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="uan-form" onSubmit={handleOtpSubmit}>
            <div className="form-info-notice success">
              <span className="notice-icon">✓</span>
              <span>Aadhaar OTP has been dispatched to <strong>••••••{mobile.slice(-4)}</strong>. Set your portal password below.</span>
            </div>

            <div className="form-group">
              <label htmlFor="act-otp">6-Digit Aadhaar OTP *</label>
              <input
                id="act-otp"
                type="text"
                className="uan-input number otp-input"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="act-pwd">Create Portal Password *</label>
              <input
                id="act-pwd"
                type="password"
                className="uan-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Must include uppercase, number, and special character"
                required
              />
            </div>

            <button type="submit" className="uan-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Activating UAN in CITES 2.01...' : 'Validate OTP & Activate UAN →'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="uan-success-box">
            <div className="success-circle">✓</div>
            <h2>UAN Successfully Activated!</h2>
            <p>
              Your Universal Account Number <strong className="number">{uan}</strong> is now active in the CITES 2.01 national database. You can now sign in to view your passbook and manage claims.
            </p>

            <div className="success-actions">
              <Link to="/login/email" className="btn-primary">
                Sign In to Member Portal &rarr;
              </Link>
              <Link to="/" className="btn-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UanActivatePage
