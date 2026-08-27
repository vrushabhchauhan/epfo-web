import React, { useState } from 'react'
import { useSession } from '../context/useSession.js'
import { transfers, member as defaultMember } from '../data/mockData.js'
import './TransfersPage.css'

function TransfersPage() {
  const { member: sessionMember } = useSession()
  const member = sessionMember || defaultMember
  const [nudgeSent, setNudgeSent] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [transferSubmitted, setTransferSubmitted] = useState(false)
  const [selectedFromEst, setSelectedFromEst] = useState('MH/BAN/0018293/000/0048291')
  const currentTransfer = transfers[0]

  function handleNudge() {
    setNudgeSent(true)
    setTimeout(() => setNudgeSent(false), 4000)
  }

  function handleTransferSubmit(e) {
    e.preventDefault()
    setShowTransferModal(false)
    setTransferSubmitted(true)
    setTimeout(() => setTransferSubmitted(false), 5000)
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

        <button
          type="button"
          className="btn-initiate-transfer"
          onClick={() => setShowTransferModal(true)}
        >
          + Initiate New Form 13 Transfer
        </button>
      </header>

      {transferSubmitted && (
        <div className="nudge-toast" role="status" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}>
          ✓ Form 13 Online Transfer request submitted successfully under UAN <strong className="number">{member.uan}</strong>. 14-day auto-attestation window initiated.
        </div>
      )}

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

      {/* Initiate Transfer Modal */}
      {showTransferModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Initiate Online Form 13 Transfer</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowTransferModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleTransferSubmit} className="grv-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="config-field">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Previous Establishment / Member ID *</label>
                <select
                  className="config-select"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  value={selectedFromEst}
                  onChange={(e) => setSelectedFromEst(e.target.value)}
                >
                  <option value="MH/BAN/0018293/000/0048291">Sundar Textiles Pvt Ltd (MH/BAN/0018293/000/0048291)</option>
                  <option value="DL/CPM/0029182/000/0019283">Apex Manufacturing Pvt Ltd (DL/CPM/0029182/000/0019283)</option>
                </select>
              </div>

              <div className="config-field">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Current Present Establishment (Target Account) *</label>
                <input
                  type="text"
                  className="config-input"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                  value="Coral Systems Ltd (MH/BAN/0049281/000/0091823)"
                  readOnly
                />
              </div>

              <div className="config-field">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Attestation Mode *</label>
                <select className="config-select" style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <option value="present">Through Present Employer (Fast-Track CITES 2.01)</option>
                  <option value="previous">Through Previous Employer</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-initiate-transfer"
                style={{ marginTop: '0.75rem', width: '100%', padding: '0.85rem', background: '#003366', color: '#ffffff', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', border: 'none' }}
              >
                Submit Form 13 Transfer Request &rarr;
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransfersPage
