import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerMemberAccount, generateUniqueUan } from '../../lib/memberRegistry.js'
import './DirectUanAllotmentPage.css'

function DirectUanAllotmentPage() {
  const [aadhaar, setAadhaar] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('Male')
  const [mobile, setMobile] = useState('')
  const [consent, setConsent] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [allottedUan, setAllottedUan] = useState(null)
  const [copiedUan, setCopiedUan] = useState(false)

  function handleAllot(e) {
    e.preventDefault()
    if (!consent) return
    setIsGenerating(true)
    setTimeout(async () => {
      const newUan = await generateUniqueUan()
      const cleanEmail = email.trim() || `${newUan}@member.epfo.gov.in`
      const memberRecord = registerMemberAccount({
        uan: newUan,
        name: name.trim(),
        dob,
        gender,
        mobile: mobile.trim(),
        email: cleanEmail,
        kycStatus: 'Verified (Aadhaar Direct Allotment)',
        totalServiceYears: '0 Years (New Workforce Entrant)',
        totalAccumulation: 0,
        employeeShareTotal: 0,
        employerShareTotal: 0,
        epsPensionFundTotal: 0,
        interestAccruedFY26: 0,
      })

      setIsGenerating(false)
      setAllottedUan({
        uan: memberRecord.uan,
        name: memberRecord.name,
        dob,
        gender,
        allotmentDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      })
    }, 900)
  }

  return (
    <div className="uan-service-layout">
      <div className="uan-header">
        <Link to="/" className="uan-back-link">&larr; Back to Home</Link>
        <div className="uan-title-row">
          <span className="uan-service-badge">Citizen Onboarding</span>
          <h1>Direct Citizen UAN Allotment (Shramik Registration)</h1>
        </div>
        <p className="uan-desc">
          First-time formal workforce entrants and gig workers can directly generate a national Universal Account Number (UAN) before joining an establishment.
        </p>
      </div>

      <div className="uan-card">
        {!allottedUan ? (
          <form className="uan-form" onSubmit={handleAllot}>
            <div className="form-info-notice">
              <span className="notice-icon">⚡</span>
              <span>Instant UIDAI Aadhaar e-KYC integration generates an official 12-digit UAN in under 10 seconds.</span>
            </div>

            <div className="uan-form-grid">
              <div className="form-group">
                <label htmlFor="allot-aadhaar">12-Digit Aadhaar Number *</label>
                <input
                  id="allot-aadhaar"
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
                <label htmlFor="allot-name">Full Legal Name *</label>
                <input
                  id="allot-name"
                  type="text"
                  className="uan-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="allot-dob">Date of Birth *</label>
                <input
                  id="allot-dob"
                  type="date"
                  className="uan-input number"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="allot-gender">Gender *</label>
                <select
                  id="allot-gender"
                  className="uan-input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="allot-mobile">Aadhaar Linked Mobile Number *</label>
                <input
                  id="allot-mobile"
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
                <label htmlFor="allot-email">Personal Email Address (For Cloud OTP &amp; Alerts)</label>
                <input
                  id="allot-email"
                  type="email"
                  className="uan-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                />
              </div>
            </div>

            <div className="consent-checkbox-row">
              <input
                id="consent-allot"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />
              <label htmlFor="consent-allot">
                I hereby declare that I do not possess an existing UAN and give consent to generate a new UAN linked to my Aadhaar under EPFO regulations.
              </label>
            </div>

            <button type="submit" className="uan-submit-btn" disabled={isGenerating || !consent}>
              {isGenerating ? 'Authenticating via UIDAI e-KYC...' : 'Generate New UAN via Aadhaar e-KYC →'}
            </button>
          </form>
        ) : (
          <div className="allot-success-box">
            <div className="success-circle">✓</div>
            <h2>New UAN Generated Successfully!</h2>
            <p>Your permanent Universal Account Number has been registered in the CITES 2.01 national database.</p>

            {/* Official Digital UAN Card Preview */}
            <div className="digital-uan-card">
              <div className="uan-card-top">
                <span>🏛️ Employees' Provident Fund Organisation</span>
                <span className="uan-card-tag">Citizen UAN Card</span>
              </div>
              <div className="uan-card-body">
                <div className="uan-card-left">
                  <span className="card-label">Universal Account Number</span>
                  <strong className="card-uan-num number" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{allottedUan.uan} <button type="button" onClick={() => { navigator.clipboard.writeText(allottedUan.uan); setCopiedUan(true); setTimeout(() => setCopiedUan(false), 2000); }} aria-label="Copy UAN" className="copy-btn" style={{ fontSize: '0.8rem', padding: '0.1rem 0.4rem', cursor: 'pointer' }}>Copy</button>{copiedUan && <span className="copy-tooltip" style={{ color: '#16a34a', fontSize: '0.8rem' }}>Copied!</span>}</strong>
                  <span className="card-member-name">{allottedUan.name}</span>
                  <span className="card-member-meta">DOB: {allottedUan.dob} &bull; Gender: {allottedUan.gender}</span>
                </div>
                <div className="uan-card-qr" aria-hidden="true">
                  <div className="dummy-qr">QR Code</div>
                </div>
              </div>
              <div className="uan-card-bottom">
                <span>Allotted on {allottedUan.allotmentDate} &bull; Verified via Aadhaar e-KYC</span>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/uan/activate" className="btn-primary">
                Activate UAN &amp; Set Password &rarr;
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

export default DirectUanAllotmentPage
