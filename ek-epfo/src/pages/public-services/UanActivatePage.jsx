import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerMemberAccount } from '../../lib/memberRegistry.js'
import { supabase, verifyOtpCode, generateAndSendOtp } from '../../lib/supabaseClient.js'
import './UanActivatePage.css'

function UanActivatePage() {
  const [uan, setUan] = useState('')
  const [aadhaar, setAadhaar] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [mobile, setMobile] = useState('')
  const [consent, setConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1) // 1: form, 2: otp, 3: success
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [stepError, setStepError] = useState('')
  const [copiedUan, setCopiedUan] = useState(false)

  async function handleFormSubmit(e) {
    e.preventDefault()
    if (!consent) return
    setStepError('')
    setIsSubmitting(true)
    
    const cleanEmail = email.trim() || `${uan.trim()}@member.epfo.gov.in`
    const otpRes = await generateAndSendOtp(cleanEmail)
    
    setIsSubmitting(false)
    if (!otpRes.success) {
      setStepError(otpRes.error || 'Failed to dispatch verification code.')
      return
    }
    setStep(2)
  }

  async function handleOtpSubmit(e) {
    e.preventDefault()
    setStepError('')

    if (password.trim().length < 8) {
      setStepError('Password must be at least 8 characters long.')
      return
    }

    setIsSubmitting(true)
    const cleanEmail = email.trim() || `${uan.trim()}@member.epfo.gov.in`
    
    const res = await verifyOtpCode(cleanEmail, otp)
    if (!res.success) {
      setStepError(res.error || 'Invalid verification code. Please check and re-enter.')
      setIsSubmitting(false)
      return
    }

    const cleanPwd = password.trim()

    // Register in persistent member registry and Supabase cloud (never storing password in local objects)
    registerMemberAccount({
      uan: uan.trim(),
      name: name.trim(),
      dob,
      mobile: mobile.trim(),
      email: cleanEmail,
      kycStatus: 'Verified (Aadhaar OTP)',
    })

    if (supabase) {
      try {
        await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPwd,
          options: {
            data: {
              uan: uan.trim(),
              name: name.trim(),
            },
          },
        })
      } catch (err) {
        console.warn('Supabase auth signup notice:', err.message)
      }
    }

    setIsSubmitting(false)
    setStep(3)
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

            {stepError && (
              <div className="auth-error-banner" role="alert" style={{ margin: '0 0 1rem', padding: '0.85rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.875rem' }}>
                ⚠️ {stepError}
              </div>
            )}

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

              <div className="form-group">
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

              <div className="form-group">
                <label htmlFor="act-email">Personal Email Address (For Cloud OTP &amp; Alerts)</label>
                <input
                  id="act-email"
                  type="email"
                  className="uan-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@gmail.com"
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
              <span>
                Aadhaar OTP dispatched to <strong>••••••{mobile.slice(-4)}</strong>.
                <br />
                <strong style={{ color: '#065f46' }}>OTP is valid for 10 minutes.</strong>
              </span>
            </div>

            {stepError && (
              <div className="auth-error-banner" role="alert" style={{ margin: '0 0 1rem', padding: '0.85rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.875rem' }}>
                ⚠️ {stepError}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="act-otp">6-Digit Aadhaar OTP *</label>
              <input
                id="act-otp"
                type="text"
                className="uan-input number otp-input"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="act-pwd">Create Portal Password (Min 8 Characters) *</label>
              <input
                id="act-pwd"
                type="password"
                className="uan-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Must be at least 8 characters"
                minLength={8}
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
              Your Universal Account Number <strong className="number" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>{uan} <button type="button" onClick={() => { navigator.clipboard.writeText(uan); setCopiedUan(true); setTimeout(() => setCopiedUan(false), 2000); }} aria-label="Copy UAN" className="copy-btn" style={{ fontSize: '0.8rem', padding: '0.1rem 0.4rem', cursor: 'pointer' }}>Copy</button>{copiedUan && <span className="copy-tooltip" style={{ color: '#16a34a', fontSize: '0.8rem' }}>Copied!</span>}</strong> is now active in the CITES 2.01 national database. You can now sign in to view your passbook and manage claims.
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
