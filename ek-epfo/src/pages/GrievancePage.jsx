import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../context/useSession.js'
import { grievances as defaultGrievances } from '../data/mockData.js'
import { insertCloudGrievance, getCloudGrievances } from '../lib/supabaseClient.js'
import './GrievancePage.css'

function GrievancePage() {
  const navigate = useNavigate()
  const { member } = useSession()
  const isFresh = member?.totalAccumulation === 0
  const [grievanceList, setGrievanceList] = useState(() => (isFresh ? [] : defaultGrievances))
  const [showNewModal, setShowNewModal] = useState(false)
  const [category, setCategory] = useState('claim_delay')
  const [desc, setDesc] = useState('')

  useEffect(() => {
    async function loadGrievances() {
      if (member?.uan) {
        const cloudData = await getCloudGrievances(member.uan)
        if (cloudData) {
          const formatted = cloudData.map((g) => ({
            id: g.grievance_id,
            category: g.category,
            status: g.status,
            assignedOfficer: g.assigned_officer || 'APFC Regional Office',
            filedDate: g.filed_date,
            expectedResolutionDate: g.expected_resolution_date || '2026-09-01',
            daysRemaining: g.days_remaining || 5,
            linkedClaimId: g.linked_claim_id || 'N/A',
          }))
          setGrievanceList(formatted)
        } else if (isFresh) {
          setGrievanceList([])
        }
      }
    }
    loadGrievances()
  }, [member?.uan, isFresh])

  function handleCreateGrievance(e) {
    e.preventDefault()
    setShowNewModal(false)
    const grvId = `GRV-${Math.floor(100000 + Math.random() * 900000)}`
    const newGrv = {
      grievance_id: grvId,
      uan: member?.uan,
      linked_claim_id: null,
      category: category,
      description: desc,
      filed_date: new Date().toISOString().split('T')[0],
      status: 'registered',
      assigned_officer: 'APFC Regional Office',
      expected_resolution_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      days_remaining: 7,
    }
    insertCloudGrievance(newGrv).catch(() => {})
    navigate(`/grievance/${grvId}`)
  }

  const grievances = grievanceList

  return (
    <div className="grievance-layout">
      {/* Header Row */}
      <header className="grievance-header-row">
        <div>
          <h1>Grievances &amp; Escalation Hub</h1>
          <p className="grievance-subtitle">
            Official redressal tracking with assigned Nodal Officers under CPGRAMS / EPFiGMS guidelines.
          </p>
        </div>

        <button
          type="button"
          className="btn-register-grievance"
          onClick={() => setShowNewModal(true)}
        >
          + Register New Grievance
        </button>
      </header>

      {/* Grievance Metrics */}
      <div className="grievance-metrics-grid">
        <div className="grv-metric-card">
          <span className="grv-metric-label">Active Grievances</span>
          <strong className="grv-metric-val number">1</strong>
          <span className="grv-metric-sub status-attention">Under Investigation</span>
        </div>

        <div className="grv-metric-card">
          <span className="grv-metric-label">Assigned Nodal Office</span>
          <strong className="grv-metric-val">RO Bandra</strong>
          <span className="grv-metric-sub">APFC Rajesh Verma</span>
        </div>

        <div className="grv-metric-card">
          <span className="grv-metric-label">SLA Target</span>
          <strong className="grv-metric-val number">7 Days Max</strong>
          <span className="grv-metric-sub">4 Days Remaining</span>
        </div>

        <div className="grv-metric-card">
          <span className="grv-metric-label">Historical Grievances</span>
          <strong className="grv-metric-val number">0</strong>
          <span className="grv-metric-sub">100% Redressal</span>
        </div>
      </div>

      {/* Grievances List */}
      <section className="grievances-list-section" aria-labelledby="grv-list-title">
        <h2 id="grv-list-title">Active Complaints &amp; Escalations</h2>

        <div className="grievance-card-stack">
          {grievances.map((grv) => (
            <article className="grievance-card" key={grv.id}>
              <div className="grv-card__top">
                <div className="grv-card__left">
                  <div className="grv-badge-row">
                    <span className="grv-id number">Ref: {grv.id}</span>
                    <span className="grv-status-pill">● Under Investigation</span>
                    <span className="grv-linked-tag">Inherited from Claim {grv.linkedClaimId}</span>
                  </div>
                  <h3 className="grv-category">{grv.category}</h3>
                  <span className="grv-filed-meta">
                    Registered on 19 Aug 2026 &bull; Assigned to <strong>{grv.assignedOfficer}</strong>
                  </span>
                </div>

                <div className="grv-card__right">
                  <span className="grv-sla-label">Resolution Due Date</span>
                  <strong className="grv-sla-date number">26 Aug 2026</strong>
                  <span className="grv-sla-countdown number">4 Days Remaining</span>
                </div>
              </div>

              <div className="grv-card__bottom">
                <div className="grv-investigation-note">
                  <span>Officer note: <em>Reviewing uploaded Form 15G tax declaration to unfreeze claim CLM1091 disbursement.</em></span>
                </div>
                <Link to={`/grievance/${grv.id}`} className="btn-view-grievance">
                  View Timeline &amp; Escalation Ladder &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* New Grievance Modal */}
      {showNewModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Register Official Grievance</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowNewModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateGrievance} className="grv-form">
              <div className="config-field">
                <label htmlFor="grv-cat">Grievance Category</label>
                <select
                  id="grv-cat"
                  className="config-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="claim_delay">Claim Processing Delay (Form 19 / 31 / 10C)</option>
                  <option value="kyc_mismatch">KYC / Joint Declaration Mismatch</option>
                  <option value="transfer_stuck">Transfer Form 13 Stuck with Employer</option>
                  <option value="employer_non_deposit">Employer Deducted but Not Depositing PF</option>
                </select>
              </div>

              <div className="config-field">
                <label htmlFor="grv-claim-link">Link Existing Claim (Auto-Inherit Context)</label>
                <select id="grv-claim-link" className="config-select">
                  <option value="CLM1091">Claim CLM1091 (Medical Advance ₹60,000)</option>
                  <option value="CLM1078">Claim CLM1078 (Education Advance ₹30,000)</option>
                  <option value="none">None / General Establishment Issue</option>
                </select>
              </div>

              <div className="config-field">
                <label htmlFor="grv-desc">Description &amp; Specific Request</label>
                <textarea
                  id="grv-desc"
                  rows={4}
                  className="config-input"
                  placeholder="Explain your issue clearly. Relevant claim documents and audit logs will be auto-attached."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <button type="submit" className="claim-submit-btn">
                Submit Grievance to Regional Nodal Officer &rarr;
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GrievancePage
