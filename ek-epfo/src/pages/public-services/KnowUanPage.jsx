import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { member } from '../../data/mockData.js'
import './KnowUanPage.css'

function KnowUanPage() {
  const [mobile, setMobile] = useState('9876544821')
  const [idType, setIdType] = useState('aadhaar')
  const [idValue, setIdValue] = useState('928192819281')
  const [dob, setDob] = useState('1990-04-12')
  const [isSearching, setIsSearching] = useState(false)
  const [foundUan, setFoundUan] = useState(null)

  function handleSearch(e) {
    e.preventDefault()
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      setFoundUan({
        uan: member.uan,
        name: member.name,
        memberId: member.employers[1].memberId,
        office: member.currentOffice,
      })
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
