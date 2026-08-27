import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '../context/useSession.js'
import { verifyEmailOtp, sendEmailOtp, getCloudMemberByEmail, getCloudMember } from '../lib/supabaseClient.js'
import { findMemberByIdentifier, registerMemberAccount } from '../lib/memberRegistry.js'
import { member } from '../data/mockData.js'
import './LoginFlow.css'

function LoginVerifyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useSession()
  const targetEmail = location.state?.email || ''
  const identifier = location.state?.identifier || targetEmail
  const isCloud = location.state?.isCloud || false
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(30)
  const [railMode, setRailMode] = useState(location.state?.mode === 'email' ? 'email' : 'sms')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')

  useEffect(() => {
    if (!targetEmail) {
      navigate('/login/email', { replace: true })
    }
  }, [targetEmail, navigate])

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
    if (code.length < 6) {
      setVerifyError('Please enter the full 6-digit verification code')
      return
    }

    setIsVerifying(true)
    const res = await verifyEmailOtp(targetEmail, code)
    setIsVerifying(false)

    if (res.success) {
      // Fetch or create user record in Supabase cloud
      let cloudUser = await getCloudMemberByEmail(targetEmail)
      if (!cloudUser && identifier && !identifier.includes('@')) {
        cloudUser = await getCloudMember(identifier)
      }

      const localUser = findMemberByIdentifier(identifier) || findMemberByIdentifier(targetEmail)

      const finalProfile = cloudUser || localUser || registerMemberAccount({
        email: targetEmail,
        name: location.state?.memberName || targetEmail.split('@')[0],
        kycStatus: 'Verified (Cloud Email OTP)',
      })

      // Extract real Supabase JWT token if available
      let realAccessToken = res.session?.access_token || null
      if (!realAccessToken && supabase) {
        try {
          const { data } = await supabase.auth.getSession()
          realAccessToken = data.session?.access_token || null
        } catch {
          // Offline fallback
        }
      }

      login(finalProfile.uan || identifier, {
        ...finalProfile,
        accessToken: realAccessToken,
      })
      navigate('/dashboard')
    } else {
      setVerifyError(res.error || 'Invalid verification code. Please check and re-enter.')
    }
  }

  async function handleResend(mode) {
    setRailMode(mode)
    setTimer(30)
    if (mode === 'email') {
      const res = await sendEmailOtp(targetEmail)
      if (res.otp) {
        navigate('.', {
          replace: true,
          state: {
            ...location.state,
            fallbackOtp: res.otp,
            rateLimited: res.rateLimited || false,
          },
        })
      }
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
          {location.state?.memberName && (
            <div className="login-member-welcome">
              <span>Signing in as <strong>{location.state.memberName}</strong></span>
            </div>
          )}
          {location.state?.rateLimited ? (
            <div className="login-dpi-badge" style={{ background: '#fffbeb', borderColor: '#fde68a', color: '#92400e', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8125rem' }}>
              <span>⚠️ Cloud Email Quota Reached. DEMO OTP is <strong className="number" style={{ letterSpacing: '2px', fontWeight: 700 }}>{location.state.fallbackOtp}</strong></span>
            </div>
          ) : isCloud ? (
            <div className="login-dpi-badge">
              <span className="dpi-dot" />
              <span>Real OTP dispatched to your Inbox via Supabase Cloud</span>
            </div>
          ) : location.state?.fallbackOtp ? (
            <div className="login-dpi-badge">
              <span>DEMO MODE: Your verification code is <strong className="number" style={{ letterSpacing: '2px' }}>{location.state.fallbackOtp}</strong></span>
            </div>
          ) : null}
          <p>
            {railMode === 'sms' ? (
              <>Sent via SMS to registered Aadhaar mobile <strong className="number">{location.state?.phoneMasked || '••••••0000'}</strong></>
            ) : (
              <>Sent to verified email address <strong className="number">{targetEmail}</strong></>
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
