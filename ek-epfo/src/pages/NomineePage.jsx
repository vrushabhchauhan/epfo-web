import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { nominee } from '../data/mockData.js'
import './NomineePage.css'

function formatFullDate(dateString) {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

function NomineePage() {
  const [showDisclosure, setShowDisclosure] = useState(false)

  return (
    <div className="nominee-page">
      <Link className="claims-back-link" to="/profile">
        &larr; Back to profile
      </Link>

      <header className="nominee-header">
        <h1>Nominee details</h1>
        <p className="nominee-subtitle">The person you've named to receive your PF benefits.</p>
      </header>

      <div className="nominee-content">
        <section className="nominee-card" aria-labelledby="nominee-details-title">
          <h2 id="nominee-details-title" className="visually-hidden">Nominee Information</h2>
          <div className="nominee-rows">
            <div className="nominee-row">
              <span className="nominee-row__label">Name</span>
              <span className="nominee-row__value">{nominee.name}</span>
            </div>
            <div className="nominee-row">
              <span className="nominee-row__label">Relationship</span>
              <span className="nominee-row__value">{nominee.relationship}</span>
            </div>
            <div className="nominee-row">
              <span className="nominee-row__label">Date of birth</span>
              <span className="nominee-row__value">{formatFullDate(nominee.dob)}</span>
            </div>
            <div className="nominee-row">
              <span className="nominee-row__label">Bank account</span>
              <span className="nominee-row__value number">{nominee.bankAccountMasked}</span>
            </div>
          </div>
        </section>

        <div className="nominee-actions">
          <button
            type="button"
            className="nominee-edit-button"
            onClick={() => setShowDisclosure(true)}
          >
            Edit nominee details
          </button>

          {showDisclosure ? (
            <p className="nominee-disclosure" role="status">
              Editing nominee details isn't available in this demo. In the full product, this would let you update your nominee's information.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default NomineePage
