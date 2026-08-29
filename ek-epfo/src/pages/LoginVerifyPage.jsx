import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '../context/useSession.js'
import { verifyOtpCode, generateAndSendOtp, getCloudMemberByEmail, getCloudMember, supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'
import { findMemberByIdentifier, registerMemberAccount } from '../lib/memberRegistry.js'
import './LoginFlow.css'

function LoginVerifyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useSession()
  const targetEmail = location.state?.email || ''
  const identifier = location.state?.identifier || targetEmail
  const isCloud = location.state?.isCloud || false
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(600)
  const [railMode, setRailMode] = useState(location.state?.mode === 'email' ? 'email' : 'sms')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')

  // TEMPORARY DEMO SAFEGUARD:
  // When Resend returns HTTP 403 sandbox restriction, sandboxData holds the demo OTP code.
  // NOTE: Remove once a custom verified sending domain is configured in Resend.
  const [sandboxData, setSandboxData] = useState({
    sandboxMode: Boolean(location.state?.sandboxMode),
    otp: location.state?.sandboxOtp || null,
    message: location.state?.sandboxMessage || null,
  })
  const inputRefs = useRef([])

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

  function handleOtpChange(index, value) {
    const cleanVal = value.replace(/\D/g, '')
    if (!cleanVal) {
      const next = [...otp]
      next[index] = ''
      setOtp(next)
      return
    }

    if (cleanVal.length > 1) {
      const digits = cleanVal.slice(0, 6).split('')
      const next = [...otp]
      digits.forEach((d, i) => {
        if (index + i < 6) next[index + i] = d
      })
      setOtp(next)
      const nextFocus = Math.min(index + digits.length, 5)
      inputRefs.current[nextFocus]?.focus()
      return
    }

    const next = [...otp]
    next[index] = cleanVal
    setOtp(next)

    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const next = [...otp]
        next[index - 1] = ''
        setOtp(next)
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpPaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const digits = pasted.split('')
    const next = ['', '', '', '', '', '']
    digits.forEach((d, i) => {
      if (i < 6) next[i] = d
    })
    setOtp(next)
    const nextFocus = Math.min(digits.length, 5)
    inputRefs.current[nextFocus]?.focus()
  }

  async function handleVerify(e) {
    e.preventDefault()
    setVerifyError('')
    const code = otp.join('').trim()
    if (code.length < 6) {
      setVerifyError('Please enter the full 6-digit verification code')
      return
    }

    setIsVerifying(true)
    const res = await verifyOtpCode(targetEmail, code)
    
    if (res.success) {
      if (supabase) {
        // Establish real session
        const authRes = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password: 'Password123!' // Placeholder secure fallback password for real session
        })
        if (authRes.error && authRes.error.message.includes('Invalid login credentials')) {
          await supabase.auth.signUp({
            email: targetEmail,
            password: 'Password123!'
          })
        }
      }
      setIsVerifying(false)
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

      let realAccessToken = res.session?.access_token || null
      if (!realAccessToken && supabase) {
        try {
          const { data } = await supabase.auth.getSession()
          realAccessToken = data.session?.access_token || null
        } catch {
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
    setTimer(600)
    setVerifyError('')
    if (mode === 'email') {
      const res = await generateAndSendOtp(targetEmail)
      if (res.success) {
        if (res.sandboxMode) {
          setSandboxData({
            sandboxMode: true,
            otp: res.otp,
            message: res.message,
          })
        } else {
          setSandboxData({ sandboxMode: false, otp: null, message: null })
        }
        navigate('.', {
          replace: true,
          state: {
            ...location.state,
            rateLimited: false,
            isCloud: isSupabaseConfigured(),
            sandboxMode: Boolean(res.sandboxMode),
            sandboxOtp: res.otp || null,
            sandboxMessage: res.message || null,
          },
        })
      } else {
        setSandboxData({ sandboxMode: false, otp: null, message: null })
        setVerifyError(res.error || 'Failed to resend verification code.')
      }
    } else {
      const dynamicOtp = String(Math.floor(100000 + Math.random() * 900000))
      try {
        if (typeof window !== 'undefined') {
          if (targetEmail) sessionStorage.setItem(`pending_otp_${targetEmail.toLowerCase()}`, dynamicOtp)
          sessionStorage.setItem('pending_otp_last', dynamicOtp)
        }
      } catch {}
      setSandboxData({ sandboxMode: false, otp: null, message: null })
      navigate('.', {
        replace: true,
        state: {
          ...location.state,
          rateLimited: false,
          isCloud: false,
          sandboxMode: false,
          sandboxOtp: null,
          sandboxMessage: null,
        },
      })
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
          {isCloud && !sandboxData.sandboxMode ? (
            <div className="login-dpi-badge">
              <span className="dpi-dot" />
              <span>Real OTP dispatched to your Inbox</span>
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

        {/* TEMPORARY DEMO SAFEGUARD BANNER: Displayed ONLY for Resend unverified domain 403 sandbox restriction */}
        {sandboxData.sandboxMode && sandboxData.otp && (
          <div className="sandbox-demo-banner" role="alert">
            <div className="sandbox-demo-banner__header">
              <span className="sandbox-demo-banner__badge">⚠️ DEMO SAFEGUARD</span>
              <span className="sandbox-demo-banner__title">Email Delivery Sandboxed</span>
            </div>
            <div className="sandbox-demo-banner__text">
              DEMO MODE: Email delivery is sandboxed for this hackathon build. Your verification code is:
              <div className="sandbox-demo-banner__code-box">
                <strong className="sandbox-demo-banner__code">{sandboxData.otp}</strong>
              </div>
              <span className="sandbox-demo-banner__subtext">
                In production this would be delivered via email to {targetEmail}.
              </span>
            </div>
          </div>
        )}

        <form className="login-form" onSubmit={handleVerify}>
          <div className="otp-boxes-container" onPaste={handleOtpPaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="otp-box number"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                autoFocus={idx === 0}
                aria-label={`Digit ${idx + 1} of 6`}
                onPaste={handleOtpPaste}
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
                ⚡ Didn't receive SMS? Send code to email ({targetEmail || 'Registered Email'})
              </button>
            ) : (
              <button
                type="button"
                className="switch-rail-btn"
                onClick={() => handleResend('sms')}
              >
                ⚡ Switch back to SMS OTP ({location.state?.phoneMasked || '••••••0000'})
              </button>
            )}
          </div>

          <div className="anti-lock-timer">
            {timer > 0 ? (
              <span className="timer-text" aria-live="polite">Resend available in <strong className="number">00:{timer < 10 ? `0${timer}` : timer}</strong> (Soft cooldown)</span>
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
