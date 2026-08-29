import React, { useCallback, useState, useEffect } from 'react'
import { DeathClaimContext, initialWizardData } from './DeathClaimContext.js'

const LOCAL_STORAGE_KEY = 'death_claim_wizard_data'

export function DeathClaimWizardProvider({ children }) {
  const [wizardData, setWizardData] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to parse wizard data from local storage', e)
    }
    return initialWizardData
  })

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wizardData))
  }, [wizardData])

  const updateWizardData = useCallback((fields) => {
    setWizardData((prev) => ({
      ...prev,
      ...fields,
    }))
  }, [])

  const resetWizardData = useCallback(() => {
    setWizardData(initialWizardData)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }, [])

  return (
    <DeathClaimContext.Provider value={{ wizardData, updateWizardData, resetWizardData }}>
      {children}
    </DeathClaimContext.Provider>
  )
}

export default DeathClaimWizardProvider
