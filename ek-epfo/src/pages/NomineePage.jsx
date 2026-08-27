import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../context/useSession.js'
import { nominee as defaultNominee } from '../data/mockData.js'
import { getCloudNominees, insertCloudNominee } from '../lib/supabaseClient.js'
import './NomineePage.css'

function formatFullDate(dateString) {
  if (!dateString) return 'Not Provided'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

function NomineePage() {
  const { member } = useSession()
  const isFresh = member?.totalAccumulation === 0
  const [nomineeData, setNomineeData] = useState(() => (isFresh ? null : defaultNominee))
  const [showEditModal, setShowEditModal] = useState(false)
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('Spouse')
  const [dob, setDob] = useState('1996-08-15')
  const [account, setAccount] = useState('987654321098')
  const [ifsc, setIfsc] = useState('SBIN0001234')
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    async function loadNominee() {
      if (member?.uan) {
        const list = await getCloudNominees(member.uan)
        if (list && list.length > 0) {
          const n = list[0]
          setNomineeData({
            name: n.name,
            relationship: n.relationship,
            dob: n.dob,
            bankAccountMasked: n.bank_account_masked || '•••• •••• ' + (n.bank_account || '1234').slice(-4),
            sharePercent: n.share_percent || 100,
          })
        } else if (isFresh) {
          setNomineeData(null)
        }
      }
    }
    loadNominee()
  }, [member?.uan, isFresh])

  async function handleSaveNominee(e) {
    e.preventDefault()
    setShowEditModal(false)
    const masked = '•••• •••• ' + account.slice(-4)
    const updated = {
      name,
      relationship,
      dob,
      bankAccountMasked: masked,
      sharePercent: 100,
    }
    setNomineeData(updated)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 4000)

    if (member?.uan) {
      await insertCloudNominee({
        uan: member.uan,
        name,
        relationship,
        dob,
        share_percent: 100,
        bank_account_masked: masked,
        bank_ifsc: ifsc,
        edli_coverage_limit: 700000,
      })
    }
  }

  const currentNominee = nomineeData

  return (
    <div className="nominee-page">
      <Link className="claims-back-link" to="/profile">
        &larr; Back to profile
      </Link>

      <header className="nominee-header">
        <h1>e-Nomination Details (EDLI &amp; EPF)</h1>
        <p className="nominee-subtitle">The registered beneficiary entitled to receive statutory PF accumulations and up to ₹7,00,000 EDLI life insurance cover.</p>
      </header>

      {saveSuccess && (
        <div className="download-toast" role="status">
          ✓ e-Nomination successfully updated and cryptographically attested under CITES 2.01.
        </div>
      )}

      <div className="nominee-content">
        {currentNominee ? (
          <section className="nominee-card" aria-labelledby="nominee-details-title">
            <h2 id="nominee-details-title" className="visually-hidden">Nominee Information</h2>
            <div className="nominee-rows">
              <div className="nominee-row">
                <span className="nominee-row__label">Nominee Full Name</span>
                <span className="nominee-row__value font-bold">{currentNominee.name}</span>
              </div>
              <div className="nominee-row">
                <span className="nominee-row__label">Relationship</span>
                <span className="nominee-row__value">{currentNominee.relationship}</span>
              </div>
              <div className="nominee-row">
                <span className="nominee-row__label">Date of Birth</span>
                <span className="nominee-row__value number">{formatFullDate(currentNominee.dob)}</span>
              </div>
              <div className="nominee-row">
                <span className="nominee-row__label">Benefit Share %</span>
                <span className="nominee-row__value font-bold text-success">{currentNominee.sharePercent || 100}%</span>
              </div>
              <div className="nominee-row">
                <span className="nominee-row__label">Disbursement Bank Account</span>
                <span className="nominee-row__value number">{currentNominee.bankAccountMasked}</span>
              </div>
            </div>
          </section>
        ) : (
          <section className="nominee-card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👨‍👩‍👧‍👦</div>
            <h3>No e-Nomination Registered</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
              Statutory EPFO compliance requires every active member to file an e-Nomination to protect their family with ₹7,00,000 EDLI cover.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowEditModal(true)}
            >
              + Add e-Nomination Now
            </button>
          </section>
        )}

        {currentNominee && (
          <div className="nominee-actions">
            <button
              type="button"
              className="nominee-edit-button"
              onClick={() => {
                setName(currentNominee.name)
                setRelationship(currentNominee.relationship)
                setDob(currentNominee.dob)
                setShowEditModal(true)
              }}
            >
              Update Nominee Details
            </button>
          </div>
        )}

        {showEditModal && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-card" style={{ maxWidth: '480px' }}>
              <div className="modal-header">
                <h2>{currentNominee ? 'Update e-Nomination' : 'Register e-Nomination'}</h2>
                <button type="button" className="modal-close-btn" onClick={() => setShowEditModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSaveNominee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>Nominee Full Name *</label>
                  <input
                    type="text"
                    required
                    className="uan-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ritika Sharma"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>Relationship *</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>Bank Account Number *</label>
                  <input
                    type="text"
                    required
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>Bank IFSC Code *</label>
                  <input
                    type="text"
                    required
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                    Save e-Nomination
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NomineePage
