import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../data/db.js'
import './EstablishmentSearchPage.css'

const demoEstablishments = [
  ...db.establishments,
  {
    estId: 'EST-DL-CPM-0091823',
    name: 'Apex Infotech Solutions India Ltd',
    estCode: 'DL/CPM/0091823/000',
    address: 'Building 14, Cyber City Phase 2, Gurugram 122002',
    complianceScore: '100%',
    status: 'Active',
    employees: 4820,
    lastEcr: 'Jul 2026',
    ecrDate: '14 Aug 2026',
  },
  {
    estId: 'EST-KA-BGN-0041289',
    name: 'Bharat Logistics & Transport Corp',
    estCode: 'KA/BGN/0041289/000',
    address: 'Plot 10, Peenya Industrial Area, Bengaluru 560058',
    complianceScore: '92%',
    status: 'Active',
    employees: 1240,
    lastEcr: 'Jul 2026',
    ecrDate: '15 Aug 2026',
  },
]

function EstablishmentSearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(demoEstablishments)

  function handleSearch(e) {
    e.preventDefault()
    const q = query.toLowerCase().trim()
    if (!q) {
      setResults(demoEstablishments)
      return
    }
    const filtered = demoEstablishments.filter(
      (est) =>
        est.name.toLowerCase().includes(q) ||
        est.estCode.toLowerCase().includes(q) ||
        est.address.toLowerCase().includes(q)
    )
    setResults(filtered)
  }

  return (
    <div className="est-search-layout">
      <header className="est-header">
        <Link to="/" className="calc-back-link">&larr; Back to Home</Link>
        <div className="calc-title-row">
          <span className="calc-badge">Public Transparency Tool</span>
          <h1>Establishment Search &amp; ECR Compliance Checker</h1>
        </div>
        <p className="est-subtitle">
          Search registered companies nationwide to verify PF compliance score, active workforce count, and latest monthly ECR challan deposits.
        </p>
      </header>

      {/* Search Input Bar */}
      <form className="est-search-bar" onSubmit={handleSearch}>
        <span className="search-icon" aria-hidden="true">🏢</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search by Establishment Name (e.g. 'Sundar Textiles', 'Coral Systems'), Code (MH/BAN/...), or City"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-search-est">
          Search Database &rarr;
        </button>
      </form>

      {/* Results Header */}
      <div className="results-header-row">
        <h2>Registered Establishments ({results.length})</h2>
        <span className="cites-tag">CITES 2.01 Live Directory</span>
      </div>

      {/* Establishments Grid */}
      <div className="est-grid">
        {results.map((est) => (
          <article className="est-card" key={est.estId}>
            <div className="est-card__top">
              <div>
                <span className="est-code-badge number">{est.estCode}</span>
                <h3 className="est-name">{est.name}</h3>
              </div>
              <span className="compliance-pill">
                🟢 {est.complianceScore || '100%'} Compliant
              </span>
            </div>

            <p className="est-address">📍 {est.address}</p>

            <div className="est-metrics-row">
              <div className="est-metric">
                <span className="m-label">Active Contributing Employees</span>
                <strong className="m-val number">{est.employees || 2840}</strong>
              </div>
              <div className="est-metric">
                <span className="m-label">Latest ECR Wage Month</span>
                <strong className="m-val number">{est.lastEcr || 'Jul 2026'}</strong>
              </div>
              <div className="est-metric">
                <span className="m-label">Deposit Date</span>
                <strong className="m-val status-good number">{est.ecrDate || '15 Aug 2026'}</strong>
              </div>
            </div>

            <div className="est-card__footer">
              <span>ECR Challan Status: <strong>Zero Default</strong></span>
              <button
                type="button"
                className="btn-view-ecr"
                onClick={() => alert(`Showing latest ECR Filing for ${est.name}: Challan Cleared via SBI Gateway.`)}
              >
                View ECR Receipt &rarr;
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default EstablishmentSearchPage
