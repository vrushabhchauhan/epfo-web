import { createContext, useContext } from 'react'

export const initialWizardData = {
  relationship: '',
  nomineeName: '',
  nomineeBankAccount: '',
  nomineeBankIFSC: '',
  uploadedDocuments: [],
  additionalNotes: '',
}

export const DeathClaimContext = createContext({
  wizardData: initialWizardData,
  updateWizardData: () => {},
  resetWizardData: () => {},
})

export function useDeathClaimWizard() {
  const context = useContext(DeathClaimContext)
  if (!context) {
    throw new Error('useDeathClaimWizard must be used within a DeathClaimWizardProvider')
  }
  return context
}
