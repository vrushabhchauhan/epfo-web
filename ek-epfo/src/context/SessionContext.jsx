import React, { useState, useEffect } from 'react'
import { member as defaultMember } from '../data/mockData.js'
import { SessionContext } from './SessionContextObject.js'
import { findMemberByIdentifier, registerMemberAccount } from '../lib/memberRegistry.js'
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
        ...defaultMember,
        ...customProfile,
        uan: isEmail ? (customProfile.uan || '1004829371') : identifier,
        email: isEmail ? identifier : (customProfile.email || `${identifier}@member.epfo.gov.in`),
        name: customProfile.name || defaultMember.name,
      })
    }

    setSession({
      isAuthenticated: true,
      member: memberData,
      token: customProfile.accessToken || `cites_live_jwt_${Date.now()}`,
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
