import React, { useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSession } from '../context/useSession.js'
import { systemStatus } from '../data/mockData.js'
import './AppShell.css'

const navItems = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Passbook & Ledger',
    to: '/passbook',
    badge: 'Updated',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    label: 'Claims & Advances',
    to: '/claims',
    badge: '1 Action',
    badgeType: 'attention',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    label: 'PF Transfers (Form 13)',
    to: '/transfers',
    badge: 'Active',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    label: 'Grievance Redressal',
    to: '/grievance',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: 'Profile & Nominee',
    to: '/profile',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

function AppShell() {
  const navigate = useNavigate()
  const { member, logout, isAuthenticated } = useSession()
  const [showDpiDetails, setShowDpiDetails] = useState(false)
  if (!isAuthenticated) {
    return <Navigate to="/login/email" replace />
  }

  function handleSignOut() {
    logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      {/* Top Universal Gov Header */}
      <header className="app-topbar">
        <div className="app-topbar__left">
          <Link to="/dashboard" className="app-brand">
            <span className="app-brand__emblem" aria-hidden="true">🏛️</span>
            <div className="app-brand__text">
              <span className="app-brand__title">Ek EPFO</span>
              <span className="app-brand__tag">CITES 2.01 Unified Portal</span>
            </div>
          </Link>
        </div>

        <div className="app-topbar__center">
          {/* DPI Telemetry Status Pill */}
          <div className="dpi-status-container">
            <button
              type="button"
              className="dpi-status-pill"
              onClick={() => setShowDpiDetails(!showDpiDetails)}
              aria-expanded={showDpiDetails}
              aria-label="EPFO System Status: All Systems Operational"
            >
              <span className="dpi-status-dot" aria-hidden="true" />
              <span className="dpi-status-text">All Systems Live</span>
              <span className="dpi-status-sep">|</span>
              <span className="dpi-status-meta">Auto-Settlement: {systemStatus.autoSettlementRail}</span>
              <span className="dpi-status-arrow" aria-hidden="true">▾</span>
            </button>

            {showDpiDetails && (
              <div className="dpi-status-dropdown" role="region" aria-label="System Health Details">
                <div className="dpi-dropdown-header">
                  <strong>National DPI Health</strong>
                  <span>Updated: {systemStatus.lastUpdated}</span>
                </div>
                <div className="dpi-dropdown-rows">
                  <div className="dpi-dropdown-row">
                    <span>CITES 2.01 Core Database</span>
                    <strong className="status-good">Operational (100%)</strong>
                  </div>
                  <div className="dpi-dropdown-row">
                    <span>Aadhaar UIDAI OTP Rail</span>
                    <strong className="status-good">{systemStatus.uidaiOtpRail}</strong>
                  </div>
                  <div className="dpi-dropdown-row">
                    <span>Form-31 Auto-Settlement</span>
                    <strong className="status-good">{systemStatus.autoSettlementRail}</strong>
                  </div>
                  <div className="dpi-dropdown-row">
                    <span>ECR Monthly Ledger Sync</span>
                    <strong className="status-good">Normal</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="app-topbar__right">
          <div className="member-quickchip">
            <div className="member-quickchip__avatar" aria-hidden="true">
              {member.name ? member.name.charAt(0) : 'U'}
            </div>
            <div className="member-quickchip__info">
              <span className="member-quickchip__name">{member.name || 'Member'}</span>
              <span className="member-quickchip__uan number">UAN: {member.uan}</span>
            </div>
          </div>

          <button aria-label="Sign out to landing page"
            type="button"
            className="topbar-action-link"
            onClick={handleSignOut}
            title="Sign out to landing page"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="app-body">
        {/* Navigation Sidebar */}
        <aside className="app-sidebar" aria-label="Primary navigation">
          <nav className="app-nav">
            <div className="app-nav__group-label">Core Services</div>
            <ul className="app-nav__list">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `app-nav__link ${isActive ? 'app-nav__link--active' : ''}`
                    }
                  >
                    <span className="app-nav__icon">{item.icon}</span>
                    <span className="app-nav__label">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`app-nav__badge ${
                          item.badgeType === 'attention' ? 'app-nav__badge--attention' : ''
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="app-sidebar__footer">
            <Link to="/claims/new" className="sidebar-action-btn">
              <span>+ File a New Claim</span>
            </Link>
            <div className="sidebar-help-card">
              <span className="sidebar-help-card__title">EPFO National Helpline</span>
              <span className="sidebar-help-card__phone number">1800-118-005</span>
              <span className="sidebar-help-card__timing">Mon–Sat: 9:00 AM – 6:00 PM</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="app-main" id="main-content">
          <div className="app-content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppShell
