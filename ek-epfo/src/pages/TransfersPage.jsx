import React, { useState } from 'react'
import { transfers } from '../data/mockData.js'
import './TransfersPage.css'

function TransfersPage() {
  const [nudgeSent, setNudgeSent] = useState(false)
  const currentTransfer = transfers[0]

  function handleNudge() {
    setNudgeSent(true)
    setTimeout(() => setNudgeSent(false), 4000)
  }

  return (
    <div className="transfers-layout">
      {/* Header */}
      <header className="transfers-header-row">
        <div>
          <h1>PF Account Transfers (Form 13)</h1>
          <p className="transfers-subtitle">
            Consolidate your previous employer accounts under your active single national UAN (CITES 2.01).
          </p>
        </div>

        <button type="button" className="btn-initiate-transfer">
          + Initiate New Form 13 Transfer
        </button>
      </header>

      {nudgeSent && (
        <div className="nudge-toast" role="status">
          ✓ Official EPFO SMS &amp; Portal Notification dispatched to <strong>Sundar Textiles Pvt Ltd</strong>. Auto-escalation active in 2 days.
        </div>
      )}

      {/* 14-Day Inactivity Auto-Bypass Explainer */}
      <div className="transfer-rule-card">
        <div className="transfer-rule-card__icon">⏱️</div>
        <div className="transfer-rule-card__content">
          <strong>14-Day Employer Inactivity Auto-Escalation Rule</strong>
          <p>
            If your previous establishment does not attest Form 13 within 14 calendar days, your transfer request automatically bypasses employer sign-off and routes to the central CITES auto-settlement engine using historical ECR ledger logs.
          </p>
        </div>
      </div>

      {/* Active Transfer Card with 4-Stage Stepper */}
      <section className="transfer-pipeline-card" aria-labelledby="active-transfer-title">
        <div className="pipeline-card-header">
          <div className="pipeline-header-left">
            <span className="pipeline-form-badge">Form 13</span>
            <span className="pipeline-ref number">Tracking ID: {currentTransfer.id}</span>
          </div>
          <span className="pipeline-status-badge">
            ● Pending with Previous Employer (Day 12 of 14)
          </span>
        </div>

        <div className="pipeline-parties-grid">
          <div className="party-box">
            <span className="party-label">From (Previous Account)</span>
            <strong className="party-name">{currentTransfer.fromEmployer}</strong>
            <span className="party-id number">Member ID: {currentTransfer.fromMemberId}</span>
          </div>

          <div className="transfer-arrow-col" aria-hidden="true">
            <span>➔</span>
            <span className="transfer-amount-tag number">Est. ₹1,42,800</span>
          </div>

          <div className="party-box">
            <span className="party-label">To (Active Account)</span>
            <strong className="party-name">{currentTransfer.toEmployer}</strong>
            <span className="party-id number">Member ID: {currentTransfer.toMemberId}</span>
          </div>
        </div>

        {/* 4-Stage Stepper Visualizer */}
        <div className="pipeline-stepper-track">
          <div className="stepper-step stepper-step--done">
            <div className="step-circle">✓</div>
            <span className="step-label">1. Initiated Online</span>
            <span className="step-date number">04 Aug 2026</span>
          </div>

          <div className="stepper-step stepper-step--active">
            <div className="step-circle">2</div>
            <span className="step-label">2. Prev Employer Attestation</span>
            <span className="step-date status-attention">Waiting 12 Days</span>
          </div>

          <div className="stepper-step">
            <div className="step-circle">3</div>
            <span className="step-label">3. Origin Field Office</span>
            <span className="step-date">Pending</span>
          </div>

          <div className="stepper-step">
            <div className="step-circle">4</div>
            <span className="step-label">4. Destination Credited</span>
            <span className="step-date">Pending</span>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="pipeline-bottom-actions">
          <div className="action-hint-text">
            <span>Stuck with employer? Auto-escalation to Central Office triggers in <strong>2 days</strong>.</span>
          </div>
          <button type="button" className="btn-nudge" onClick={handleNudge}>
            📲 Nudge Employer via Official SMS
          </button>
        </div>
      </section>

      {/* Historical Transfer Records */}
      <section className="transfer-history-card" aria-labelledby="history-title">
        <h2 id="history-title">Historical Transfer Ledger</h2>
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Transfer ID</th>
                <th>From Establishment</th>
                <th>To Establishment</th>
                <th>Transferred Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="number font-semibold">TRF-4821</td>
                <td>Apex Manufacturing Pvt Ltd</td>
                <td>Sundar Textiles Pvt Ltd</td>
                <td className="number">₹82,400</td>
                <td><span className="badge-cleared">✓ Completed (2019)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default TransfersPage
