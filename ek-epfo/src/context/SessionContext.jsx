import React, { useState, useEffect } from 'react'
import { member as defaultMember } from '../data/mockData.js'
import { SessionContext } from './SessionContextObject.js'

export function SessionProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem('ek_epfo_session')
      if (saved) return JSON.parse(saved)
    } catch {
      // Fallback on storage failure
    }
    return {
      isAuthenticated: false,
      member: defaultMember,
      token: null,
      loginTimestamp: null,
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('ek_epfo_session', JSON.stringify(session))
    } catch {
      // Fallback on storage failure
    }
  }, [session])

  function login(identifier, customProfile = {}) {
    const isEmail = identifier.includes('@')
    const newMember = {
      ...defaultMember,
      ...customProfile,
      uan: isEmail ? (customProfile.uan || '1004829371') : identifier,
      email: isEmail ? identifier : (customProfile.email || defaultMember.email),
      name: customProfile.name || defaultMember.name,
      loginTime: new Date().toLocaleTimeString(),
    }

    setSession({
      isAuthenticated: true,
      member: newMember,
      token: `cites_live_jwt_${Date.now()}`,
      loginTimestamp: new Date().toISOString(),
    })
  }

  function logout() {
    setSession({
      isAuthenticated: false,
      member: null,
      token: null,
      loginTimestamp: null,
    })
    try {
      localStorage.removeItem('ek_epfo_session')
    } catch {
      // Ignore removal error
    }
  }

  function updateMember(updates) {
    setSession((prev) => ({
      ...prev,
      member: {
        ...prev.member,
        ...updates,
      },
    }))
  }

  return (
    <SessionContext.Provider value={{ session, member: session.member || defaultMember, isAuthenticated: session.isAuthenticated, login, logout, updateMember }}>
      {children}
    </SessionContext.Provider>
  )
}
