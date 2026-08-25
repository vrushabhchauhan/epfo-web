import React from 'react'
import { Link } from 'react-router-dom'
import { member } from '../data/mockData.js'
import './ProfilePage.css'

function formatFullDate(dateString) {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

function formatYearMonth(ymString) {
  if (!ymString) return ''
  if (ymString.toLowerCase() === 'present') return 'Present'
  const [year, month] = ymString.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function ProfilePage() {
  return (
    <div className="profile-layout">
      {/* Header Row */}
      <header className="profile-header-row">
        <div>
          <h1>Member Identity &amp; Profile</h1>
          <p className="profile-subtitle">
            Authenticated citizen records under national UAN <strong className="number">{member.uan}</strong> &bull; CITES 2.01
          </p>
        </div>

        <div className="profile-header-actions">
          <Link to="/profile/kyc" className="btn-kyc-correct">
            ⚡ Direct e-KYC Self-Correction &rarr;
          </Link>
        </div>
      </header>

      {/* 2-Column Grid */}
      <div className="profile-grid">
        {/* Left: Identity & KYC Details */}
        <div className="profile-col-left">
          <section className="profile-card" aria-labelledby="member-details-title">
            <div className="profile-card-header">
              <h2 id="member-details-title">Primary Member Record</h2>
              <span className="badge-verified">✓ Aadhaar Verified</span>
            </div>

            <div className="profile-data-stack">
              <div className="data-row">
                <span className="data-label">Full Legal Name</span>
                <strong className="data-val">{member.name}</strong>
              </div>
              <div className="data-row">
                <span className="data-label">Universal Account Number (UAN)</span>
                <strong className="data-val number">{member.uan}</strong>
              </div>
              <div className="data-row">
                <span className="data-label">Date of Birth</span>
                <strong className="data-val number">{formatFullDate(member.dob)}</strong>
              </div>
              <div className="data-row">
                <span className="data-label">Gender</span>
                <strong className="data-val">{member.gender}</strong>
              </div>
              <div className="data-row">
                <span className="data-label">Masked Aadhaar Number</span>
                <strong className="data-val number">{member.aadhaarMasked}</strong>
              </div>
              <div className="data-row">
                <span className="data-label">Permanent Account Number (PAN)</span>
                <strong className="data-val number">{member.panMasked}</strong>
              </div>
              <div className="data-row">
                <span className="data-label">Verified Email</span>
                <strong className="data-val">{member.email}</strong>
              </div>
              <div className="data-row">
                <span className="data-label">Registered Mobile (Aadhaar Linked)</span>
                <strong className="data-val number">{member.phoneMasked}</strong>
              </div>
            </div>
          </section>

          {/* Disbursement Bank Card */}
          <section className="profile-card" aria-labelledby="bank-details-title">
            <div className="profile-card-header">
              <h2 id="bank-details-title">Direct Settlement Bank Account</h2>
              <span className="badge-verified">✓ RBI Rails Confirmed</span>
            </div>
            <div className="bank-card-content">
              <div className="bank-hero-row">
                <div className="bank-icon">🏦</div>
                <div>
                  <strong className="bank-title">{member.bankName}</strong>
                  <span className="bank-acc number">Account: {member.bankAccountMasked}</span>
                </div>
              </div>
              <div className="bank-ifsc-row">
                <span>IFSC Code: <strong className="number">{member.bankIFSC}</strong></span>
                <span className="bank-status-pill">Active for Instant Disbursals</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Employment History & Nominee */}
        <div className="profile-col-right">
          {/* Nominee Quick Card */}
          <section className="profile-card profile-card--nominee" aria-labelledby="nominee-card-title">
            <div className="profile-card-header">
              <h2 id="nominee-card-title">E-Nomination (EDLI &amp; EPF)</h2>
              <Link to="/profile/nominee" className="nominee-link">Manage &rarr;</Link>
            </div>
            <div className="nominee-summary-box">
              <div className="nominee-name-row">
                <strong>Priya Rao</strong>
                <span className="nominee-rel-tag">Spouse (100% Share)</span>
              </div>
              <span className="nominee-sub">Bank account linked &bull; Date of Birth: 20 Aug 1992</span>
            </div>
          </section>

          {/* Employment History */}
          <section className="profile-card" aria-labelledby="employment-history-title">
            <div className="profile-card-header">
              <h2 id="employment-history-title">Service History</h2>
              <span className="service-tenure number">{member.serviceYears} Total</span>
            </div>

            <div className="employment-timeline">
              {member.employers.map((emp, index) => (
                <div className="employment-timeline-item" key={`${emp.name}-${index}`}>
                  <div className="timeline-node" />
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong>{emp.name}</strong>
                      <span className={`emp-status-badge emp-status-badge--${emp.status.toLowerCase()}`}>
                        {emp.status}
                      </span>
                    </div>
                    <span className="timeline-dates number">
                      {formatYearMonth(emp.from)} &ndash; {formatYearMonth(emp.to)}
                    </span>
                    <span className="timeline-member-id number">
                      ID: {emp.memberId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
