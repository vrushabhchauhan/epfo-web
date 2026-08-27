import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendEmailOtp, isSupabaseConfigured, getCloudMember, getCloudMemberByEmail } from '../lib/supabaseClient.js'
import { findMemberByIdentifier } from '../lib/memberRegistry.js'
import { systemStatus } from '../data/mockData.js'
import './LoginFlow.css'

function LoginEmailPage() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [useEmail, setUseEmail] = useState(false)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [unregisteredUan, setUnregisteredUan] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setAuthError('')
    setUnregisteredUan(false)
    const cleanId = identifier.trim()
    if (!cleanId) return

    // 1. Verify if registered in database or registry
    let matchedMember = findMemberByIdentifier(cleanId)
    if (!matchedMember && isSupabaseConfigured()) {
      matchedMember = useEmail ? await getCloudMemberByEmail(cleanId) : await getCloudMember(cleanId)
    }

    if (!useEmail && !matchedMember) {
      setUnregisteredUan(true)
      setAuthError(`No activated account found for UAN "${cleanId}". Under EPFO statutory rules, you must activate your UAN first or apply for Direct Allotment.`)
      return
    }

    setIsLoading(true)
    const targetEmail = useEmail
      ? cleanId
      : (matchedMember?.email || `${cleanId}@member.epfo.gov.in`)

    const res = await sendEmailOtp(targetEmail)
    setIsLoading(false)

    if (res.success) {
      navigate('/login/verify', {
        state: {
          identifier: cleanId,
          email: targetEmail,
          memberName: matchedMember?.name || (useEmail ? cleanId.split('@')[0] : 'Member'),
          mode: useEmail ? 'email' : 'uan',
          isCloud: isSupabaseConfigured() && !res.simulated,
          rateLimited: res.rateLimited || false,
          fallbackOtp: res.otp || null,
        },
      })
    } else {
      setAuthError(res.error || 'Failed to send OTP')
    }
  }

  return (
    <div className="login-layout">
      <div className="login-card">
        <div className="login-card__header">
          <Link to="/" className="login-card__logo">
            <span>🏛️ Ek EPFO</span>
          </Link>
          <h1>Sign in to your account</h1>
          <p>Access your passbook, active claims, and transfer requests.</p>
        </div>

        {/* Live DPI Status Indicator */}
        <div className="login-dpi-badge">
          <span className="dpi-dot" />
          <span>{systemStatus.uidaiOtpRail}</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-toggle-row">
            <label htmlFor="login-id" className="form-label">
              {useEmail ? 'Registered Email Address' : 'Universal Account Number (UAN)'}
            </label>
            <button
              type="button"
              className="toggle-mode-btn"
              onClick={() => {
                setUseEmail(!useEmail)
                setIdentifier('')
                setAuthError('')
              }}
            >
              {useEmail ? 'Use 10-digit UAN instead' : 'Use Email instead'}
            </button>
          </div>

          <input
            id="login-id"
            type="text"
            className="login-input number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={useEmail ? 'e.g. name@example.com' : 'e.g. 1004829371'}
            required
            autoFocus
          />

          <div className="login-helper-row">
            <button
              type="button"
              className="login-recovery-link"
              onClick={() => setShowRecoveryModal(true)}
            >
              Lost access to registered mobile?
            </button>
          </div>

          {authError && (
            <div className="auth-error-banner" role="alert">
              <div>⚠️ {authError}</div>
              {unregisteredUan && (
                <div className="unreg-uan-cta-group">
                  <Link to="/uan/activate" className="btn-unreg-cta">
                    ⚡ Activate UAN Now &rarr;
                  </Link>
                  <Link to="/uan/allot" className="btn-unreg-cta btn-unreg-cta--secondary">
                    🆔 Direct UAN Allotment (Gig Worker) &rarr;
                  </Link>
                </div>
              )}
            </div>
          )}

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? 'Connecting to Cloud Gateway...' : 'Send Verification Code →'}
          </button>
        </form>

        <div className="login-quick-links">
          <Link to="/uan/activate" className="quick-service-link">⚡ Activate UAN</Link>
          <Link to="/uan/know" className="quick-service-link">🔍 Know your UAN</Link>
          <Link to="/uan/allot" className="quick-service-link">🆔 Direct UAN Allotment</Link>
          <Link to="/claims/track-public" className="quick-service-link">📍 Track Claim Status</Link>
        </div>

        <div className="login-card__footer">
          <span>Protected by India Stack &bull; 256-Bit Encrypted e-KYC</span>
        </div>
      </div>

      {/* DigiLocker Zero-Old-SIM Recovery Modal */}
      {showRecoveryModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Aadhaar / DigiLocker Identity Recovery</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowRecoveryModal(false)}
              >
                ✕
              </button>
            </div>
            <p className="modal-desc">
              If your phone number has changed, you do not need the old SIM. You can authenticate directly using your DigiLocker Aadhaar XML profile to reset your registered phone number.
            </p>
            <div className="recovery-steps">
              <div className="recovery-step">
                <span className="step-num">1</span>
                <span>Authenticate with your 12-digit Aadhaar / DigiLocker PIN</span>
              </div>
              <div className="recovery-step">
                <span className="step-num">2</span>
                <span>Enter your new active mobile number</span>
              </div>
              <div className="recovery-step">
                <span className="step-num">3</span>
                <span>Instant profile synchronization with CITES 2.01 core</span>
              </div>
            </div>
            <button
              type="button"
              className="digilocker-auth-btn"
              onClick={() => {
                setShowRecoveryModal(false)
                navigate('/login/verify')
              }}
            >
              Authenticate via DigiLocker (Demo) &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginEmailPage
