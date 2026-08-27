import React, { useState, useEffect } from 'react'
import { SessionContext } from './SessionContextObject.js'
import { findMemberByIdentifier, registerMemberAccount, generateUniqueUan } from '../lib/memberRegistry.js'
import { supabase } from '../lib/supabaseClient.js'

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
      member: null,
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

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session: sbSession } }) => {
        if (sbSession?.access_token && !session.isAuthenticated) {
          const userEmail = sbSession.user.email
          const localUser = findMemberByIdentifier(userEmail)
          if (localUser) {
            setSession({
              isAuthenticated: true,
              member: localUser,
              token: sbSession.access_token,
              loginTimestamp: new Date().toISOString(),
            })
          }
        }
      }).catch(() => {})
    }
  }, [session.isAuthenticated])

  function login(identifier, customProfile = {}) {
    const existing = findMemberByIdentifier(identifier)
    let memberData
    if (existing) {
      memberData = { ...existing, ...customProfile, loginTime: new Date().toLocaleTimeString() }
    } else {
      const isEmail = identifier && identifier.includes('@')
      memberData = registerMemberAccount({
        ...customProfile,
        uan: isEmail ? (customProfile.uan || generateUniqueUan()) : identifier,
        email: isEmail ? identifier : (customProfile.email || `${identifier}@member.epfo.gov.in`),
        name: customProfile.name || (isEmail ? identifier.split('@')[0] : 'Member'),
      })
    }

    setSession({
      isAuthenticated: true,
      member: memberData,
      token: customProfile.accessToken || null, // Real Supabase JWT access token (or null if offline/demo simulation)
      loginTimestamp: new Date().toISOString(),
    })
  }

  function logout() {
    if (supabase) {
      supabase.auth.signOut().catch(() => {})
    }
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
      member: prev.member ? { ...prev.member, ...updates } : null,
    }))
  }

  return (
    <SessionContext.Provider value={{ session, member: session.member, isAuthenticated: session.isAuthenticated, login, logout, updateMember }}>
      {children}
    </SessionContext.Provider>
  )
}
