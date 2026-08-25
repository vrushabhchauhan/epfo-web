import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '../context/useSession.js'
import { verifyEmailOtp, sendEmailOtp } from '../lib/supabaseClient.js'
import { member } from '../data/mockData.js'
import './LoginFlow.css'

function LoginVerifyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useSession()
  const targetEmail = location.state?.email || member.email
  const identifier = location.state?.identifier || targetEmail
  const isCloud = location.state?.isCloud || false
  const [otp, setOtp] = useState(['5', '8', '2', '9', '1', '4'])
  const [timer, setTimer] = useState(30)
  const [railMode, setRailMode] = useState(location.state?.mode === 'email' ? 'email' : 'sms')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  async function handleVerify(e) {
    e.preventDefault()
    setVerifyError('')
    const code = otp.join('').trim()
    if (code.length === 6) {
      setIsVerifying(true)
      const res = await verifyEmailOtp(targetEmail, code)
      setIsVerifying(false)

      if (res.success) {
        login(identifier)
        navigate('/dashboard')
      } else {
        setVerifyError(res.error || 'Invalid verification code')
      }
    }
  }

  async function handleResend(mode) {
    setRailMode(mode)
    setTimer(30)
    if (mode === 'email') {
      await sendEmailOtp(targetEmail)
    }
  }

  return (
    <div className="login-layout">
      <div className="login-card">
        <div className="login-card__header">
          <Link to="/" className="login-card__logo">
            <span>🏛️ Ek EPFO</span>
          </Link>
          <h1>Enter 6-digit verification code</h1>
          {isCloud ? (
            <div className="login-dpi-badge">
              <span className="dpi-dot" />
              <span>Real OTP dispatched to your Inbox via Supabase Cloud</span>
            </div>
          ) : null}
          <p>
            {railMode === 'sms' ? (
              <>Sent via SMS to registered Aadhaar mobile <strong className="number">{member.phoneMasked}</strong></>
            ) : (
              <>Sent to verified email address <strong className="number">{member.email}</strong></>
            )}
          </p>
        </div>

        <form className="login-form" onSubmit={handleVerify}>
          <div className="otp-boxes-container">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                className="otp-box number"
                value={digit}
                onChange={(e) => {
                  const val = e.target.value
                  const next = [...otp]
                  next[idx] = val
                  setOtp(next)
                }}
              />
            ))}
          </div>

          <div className="multi-rail-container">
            {railMode === 'sms' ? (
              <button
                type="button"
                className="switch-rail-btn"
                onClick={() => handleResend('email')}
              >
                ⚡ Didn't receive SMS? Send code to email ({member.email})
              </button>
            ) : (
              <button
                type="button"
                className="switch-rail-btn"
                onClick={() => handleResend('sms')}
              >
                ⚡ Switch back to SMS OTP ({member.phoneMasked})
              </button>
            )}
          </div>

          <div className="anti-lock-timer">
            {timer > 0 ? (
              <span className="timer-text">Resend available in <strong className="number">00:{timer < 10 ? `0${timer}` : timer}</strong> (Soft cooldown)</span>
            ) : (
              <button
                type="button"
                className="resend-active-btn"
                onClick={() => handleResend(railMode)}
              >
                Resend Verification Code Now
              </button>
            )}
          </div>

          {verifyError && (
            <div className="auth-error-banner" role="alert">
              ⚠️ {verifyError}
            </div>
          )}

          <button type="submit" className="login-submit-btn" disabled={isVerifying}>
            {isVerifying ? 'Verifying with CITES 2.01...' : 'Verify and Enter Dashboard →'}
          </button>
        </form>

        <div className="login-card__footer">
          <span>Never share your OTP with anyone. EPFO officials will never call for verification.</span>
        </div>
      </div>
    </div>
  )
}

export default LoginVerifyPage
