import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { grievances } from '../data/mockData.js'
import './GrievanceDetailPage.css'

function GrievanceDetailPage() {
  const { grievanceId } = useParams()
  const grv = grievances.find((g) => g.id === grievanceId) || grievances[0]
  const [resolvedStatus, setResolvedStatus] = useState(null)

  return (
    <div className="grv-detail-layout">
      {/* Header */}
      <header className="grv-detail-header">
        <Link to="/grievance" className="claims-back-link">&larr; Back to Grievance Hub</Link>
        <div className="header-meta-row">
          <h1>Grievance {grv.id}</h1>
          <span className="grv-status-badge">● Under Investigation</span>
        </div>
        <p className="subtitle">
          Official Redressal Pipeline &bull; Inherited from Claim <strong>{grv.linkedClaimId}</strong>
        </p>
      </header>

      {resolvedStatus === 'resolved' && (
        <div className="status-toast status-toast--success" role="status">
          ✓ Citizen resolution confirmed. Grievance successfully closed with official acknowledgment token.
        </div>
      )}

      {resolvedStatus === 'escalated' && (
        <div className="status-toast status-toast--alert" role="status">
          ⚠️ Escalation dispatched to Central Ministry (CPGRAMS Tier-2 Nodal Director). Tracking token #CPG-2026-94812.
        </div>
      )}

      <div className="grv-detail-grid">
        {/* Left Column: Timeline & Officer Details */}
        <div className="grv-col-left">
          {/* Nodal Officer Card */}
          <section className="grv-card" aria-labelledby="officer-title">
            <h2 id="officer-title" className="card-heading">Assigned Accountability</h2>
            <div className="officer-box">
              <div className="officer-avatar">👨‍💼</div>
              <div className="officer-info">
                <strong className="officer-name">{grv.assignedOfficer}</strong>
                <span className="officer-ro">{grv.regionalOffice}</span>
                <span className="officer-sla">SLA Target: 7 Days &bull; Resolution Due: <strong>{grv.expectedResolutionDate}</strong></span>
              </div>
            </div>
          </section>

          {/* 7-Day SLA Step Timeline */}
          <section className="grv-card" aria-labelledby="timeline-title">
            <h2 id="timeline-title" className="card-heading">Redressal Investigation Timeline</h2>
            <div className="grv-stepper">
              {grv.timeline.map((step, idx) => (
                <div className={`grv-step ${idx <= 2 ? 'grv-step--done' : 'grv-step--pending'}`} key={step.label}>
                  <div className="grv-step__node">
                    <span className="grv-step__dot">{idx <= 2 ? '✓' : idx + 1}</span>
                    {idx < grv.timeline.length - 1 && <span className="grv-step__line" />}
                  </div>
                  <div className="grv-step__content">
                    <div className="grv-step__title-row">
                      <strong>{step.label}</strong>
                      <span className="grv-step__date number">{step.date}</span>
                    </div>
                    <p className="grv-step__desc">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Citizen Verification & Appeal Protocol */}
        <div className="grv-col-right">
          <section className="grv-card grv-card--action" aria-labelledby="resolution-action-title">
            <h2 id="resolution-action-title" className="card-heading">Anti-Auto-Close Verification</h2>
            <p className="action-card-desc">
              EPFO officers cannot unilaterally close your grievance with boilerplate messages. You retain full authority to confirm resolution or escalate.
            </p>

            <div className="resolution-buttons-stack">
              <button
                type="button"
                className="btn-confirm-resolve"
                onClick={() => setResolvedStatus('resolved')}
              >
                ✓ Confirm Issue Solved &amp; Close Grievance
              </button>

              <button
                type="button"
                className="btn-escalate-ministry"
                onClick={() => setResolvedStatus('escalated')}
              >
                ⚠️ Issue Unresolved? Escalate to Ministry (CPGRAMS) &rarr;
              </button>
            </div>
          </section>

          {/* Regional Office Benchmarking */}
          <section className="grv-card" aria-labelledby="ro-stats-title">
            <h2 id="ro-stats-title" className="card-heading">Regional Office Performance</h2>
            <div className="ro-stats-stack">
              <div className="ro-stat-row">
                <span>Office</span>
                <strong>RO Mumbai (Bandra)</strong>
              </div>
              <div className="ro-stat-row">
                <span>Average Resolution Time</span>
                <strong className="number">4.8 Calendar Days</strong>
              </div>
              <div className="ro-stat-row">
                <span>Auto-Settlement Rate</span>
                <strong className="status-good number">84.2%</strong>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default GrievanceDetailPage
