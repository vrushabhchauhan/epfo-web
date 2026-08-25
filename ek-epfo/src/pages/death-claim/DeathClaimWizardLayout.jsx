import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { DeathClaimWizardProvider } from '../../context/DeathClaimWizardProvider.jsx'
import './DeathClaimWizardLayout.css'

function DeathClaimWizardLayout() {
  return (
    <DeathClaimWizardProvider>
      <div className="death-wizard-shell">
        <header className="death-wizard-topbar">
          <div className="death-wizard-topbar__inner">
            <Link to="/" className="death-wizard-brand">
              <span className="emblem">🏛️</span>
              <div>
                <strong>Ek EPFO</strong>
                <span>Beneficiary &amp; Nominee Fast-Track Rail (CITES 2.01)</span>
              </div>
            </Link>
            <Link to="/" className="death-wizard-exit-btn">
              Exit to Home &times;
            </Link>
          </div>
        </header>
        <main className="death-wizard-main">
          <Outlet />
        </main>
      </div>
    </DeathClaimWizardProvider>
  )
}

export default DeathClaimWizardLayout
