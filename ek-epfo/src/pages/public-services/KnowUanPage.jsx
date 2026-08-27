import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getRegisteredMembers } from '../../lib/memberRegistry.js'
import './KnowUanPage.css'

function KnowUanPage() {
  const [mobile, setMobile] = useState('')
  const [idType, setIdType] = useState('aadhaar')
  const [idValue, setIdValue] = useState('')
  const [dob, setDob] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [foundUan, setFoundUan] = useState(null)
  const [searchError, setSearchError] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    setIsSearching(true)
    setSearchError('')
    setTimeout(() => {
      setIsSearching(false)
      const cleanMobile = mobile.trim()
      const cleanId = idValue.trim().toLowerCase()

      const allMembers = getRegisteredMembers()
      const matched = allMembers.find((m) =>
        (m.mobile && m.mobile === cleanMobile) ||
        (m.phone && m.phone === cleanMobile) ||
        (m.phoneMasked && m.phoneMasked.includes(cleanMobile.slice(-4))) ||
        (m.pan && m.pan.toLowerCase() === cleanId) ||
        (m.aadhaar && m.aadhaar === cleanId)
      )

      if (matched) {
        setFoundUan({
          uan: matched.uan,
          name: matched.name,
          memberId: matched.employers?.[0]?.memberId || 'MH/BAN/0049281/000/0091823',
          office: matched.currentOffice || 'Regional Office Mumbai (Bandra)',
        })
      } else {
        setSearchError(`No active UAN found matching mobile "+91 ${cleanMobile}" and ${idType.toUpperCase()} "${idValue}". Please verify your inputs or apply for Direct Allotment.`)
      }
    }, 800)
  }

  return (
    <div className="uan-service-layout">
      <div className="uan-header">
        <Link to="/" className="uan-back-link">&larr; Back to Home</Link>
        <div className="uan-title-row">
          <span className="uan-service-badge">Citizen Public Service</span>
          <h1>Know Your Universal Account Number (UAN)</h1>
        </div>
        <p className="uan-desc">
          Search and retrieve your active 12-digit national UAN using your registered mobile number and government identity document.
        </p>
      </div>

      <div className="uan-card">
        {!foundUan ? (
          <form className="uan-form" onSubmit={handleSearch}>
            <div className="form-info-notice">
              <span className="notice-icon">🔍</span>
              <span>CITES 2.01 Centralized Registry will match your record against all establishment enrollments nationwide.</span>
            </div>

            <div className="uan-form-grid">
              <div className="form-group full-width">
                <label htmlFor="know-mobile">Registered Mobile Number *</label>
                <input
                  id="know-mobile"
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
                <label htmlFor="know-id-type">Identification Type *</label>
                <select
                  id="know-id-type"
                  className="uan-input"
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                >
                  <option value="aadhaar">Aadhaar Number (12 Digits)</option>
                  <option value="pan">PAN Card (10 Characters)</option>
                  <option value="member_id">Member ID (e.g. MH/BAN/...)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="know-id-val">Identity Number *</label>
                <input
                  id="know-id-val"
                  type="text"
                  className="uan-input number"
                  value={idValue}
                  onChange={(e) => setIdValue(e.target.value)}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="know-dob">Date of Birth (As per Official Records) *</label>
                <input
                  id="know-dob"
                  type="date"
                  className="uan-input number"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
            </div>

            {searchError && (
              <div className="auth-error-banner" role="alert" style={{ margin: '1rem 0', padding: '0.85rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.875rem' }}>
                <div>⚠️ {searchError}</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <Link to="/uan/allot" style={{ color: '#003366', fontWeight: 600, textDecoration: 'underline' }}>
                    Generate New UAN (Direct Allotment) &rarr;
                  </Link>
                </div>
              </div>
            )}

            <button type="submit" className="uan-submit-btn" disabled={isSearching}>
              {isSearching ? 'Querying National CITES 2.01 Database...' : 'Fetch My Universal Account Number (UAN) →'}
            </button>
          </form>
        ) : (
          <div className="uan-result-box">
            <div className="success-circle">✓</div>
            <h2>UAN Record Found</h2>
            <p>A national match was found in the centralized EPFO registry.</p>

            <div className="uan-display-badge">
              <span className="badge-title">Your 12-Digit UAN Number</span>
              <strong className="uan-number-hero number">{foundUan.uan}</strong>
              <span className="badge-subtitle">Member: {foundUan.name} &bull; {foundUan.office}</span>
            </div>

            <div className="uan-meta-list">
              <div className="meta-row">
                <span>Active Member ID</span>
                <strong className="number">{foundUan.memberId}</strong>
              </div>
              <div className="meta-row">
                <span>Account Status</span>
                <strong className="status-good">✓ Active &amp; Aadhaar Verified</strong>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/login/email" className="btn-primary">
                Proceed to Member Login &rarr;
              </Link>
              <button type="button" className="btn-secondary" onClick={() => setFoundUan(null)}>
                Search Another Record
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KnowUanPage
