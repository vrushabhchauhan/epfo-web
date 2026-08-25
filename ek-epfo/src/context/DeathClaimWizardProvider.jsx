import React, { useCallback, useState } from 'react'
import { DeathClaimContext, initialWizardData } from './DeathClaimContext.js'

export function DeathClaimWizardProvider({ children }) {
  const [wizardData, setWizardData] = useState(initialWizardData)

  const updateWizardData = useCallback((fields) => {
    setWizardData((prev) => ({
      ...prev,
      ...fields,
    }))
  }, [])

  const resetWizardData = useCallback(() => {
    setWizardData(initialWizardData)
  }, [])

  return (
    <DeathClaimContext.Provider value={{ wizardData, updateWizardData, resetWizardData }}>
      {children}
    </DeathClaimContext.Provider>
  )
}

export default DeathClaimWizardProvider

