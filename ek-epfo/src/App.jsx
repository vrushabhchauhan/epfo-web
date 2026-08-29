import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import ClaimDetailPage from './pages/ClaimDetailPage.jsx'
import ClaimFixPage from './pages/ClaimFixPage.jsx'
import ClaimsPage from './pages/ClaimsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import GrievanceDetailPage from './pages/GrievanceDetailPage.jsx'
import GrievancePage from './pages/GrievancePage.jsx'
import KycCorrectionPage from './pages/KycCorrectionPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginEmailPage from './pages/LoginEmailPage.jsx'
import LoginVerifyPage from './pages/LoginVerifyPage.jsx'
import NewClaimPage from './pages/NewClaimPage.jsx'
import NomineePage from './pages/NomineePage.jsx'
import PassbookPage from './pages/PassbookPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import TransfersPage from './pages/TransfersPage.jsx'
import DeathClaimConfirmationPage from './pages/death-claim/DeathClaimConfirmationPage.jsx'
import DeathClaimStep1Page from './pages/death-claim/DeathClaimStep1Page.jsx'
import DeathClaimStep2Page from './pages/death-claim/DeathClaimStep2Page.jsx'
import DeathClaimStep3Page from './pages/death-claim/DeathClaimStep3Page.jsx'
import DeathClaimStep4Page from './pages/death-claim/DeathClaimStep4Page.jsx'
import DeathClaimWizardLayout from './pages/death-claim/DeathClaimWizardLayout.jsx'
import CalculatorsPage from './pages/public-services/CalculatorsPage.jsx'
import DirectUanAllotmentPage from './pages/public-services/DirectUanAllotmentPage.jsx'
import EstablishmentSearchPage from './pages/public-services/EstablishmentSearchPage.jsx'
import KnowUanPage from './pages/public-services/KnowUanPage.jsx'
import PensionerHubPage from './pages/public-services/PensionerHubPage.jsx'
import PublicClaimTrackPage from './pages/public-services/PublicClaimTrackPage.jsx'
import UanActivatePage from './pages/public-services/UanActivatePage.jsx'

import { SessionProvider } from './context/SessionContext.jsx'

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
        {/* Public Landing & Authentication */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/email" element={<LoginEmailPage />} />
        <Route path="/login/verify" element={<LoginVerifyPage />} />

        {/* Public Citizen Services (No Login Required) */}
        <Route path="/uan/activate" element={<UanActivatePage />} />
        <Route path="/uan/know" element={<KnowUanPage />} />
        <Route path="/uan/allot" element={<DirectUanAllotmentPage />} />
        <Route path="/claims/track-public" element={<PublicClaimTrackPage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/establishment/search" element={<EstablishmentSearchPage />} />
        <Route path="/pensioner" element={<PensionerHubPage />} />

        {/* Dedicated 4-Step Family & Death Claim Wizard (No Login Required) */}
        <Route element={<DeathClaimWizardLayout />}>
          <Route path="/claims/new/death/step-1" element={<DeathClaimStep1Page />} />
          <Route path="/claims/new/death/step-2" element={<DeathClaimStep2Page />} />
          <Route path="/claims/new/death/step-3" element={<DeathClaimStep3Page />} />
          <Route path="/claims/new/death/step-4" element={<DeathClaimStep4Page />} />
          <Route path="/claims/new/death/confirmation" element={<DeathClaimConfirmationPage />} />
        </Route>

        {/* Authenticated App Shell */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/passbook" element={<PassbookPage />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/claims/:claimId" element={<ClaimDetailPage />} />
          <Route path="/claims/:claimId/fix" element={<ClaimFixPage />} />
          <Route path="/claims/new" element={<NewClaimPage />} />
          <Route path="/transfers" element={<TransfersPage />} />
          <Route path="/grievance" element={<GrievancePage />} />
          <Route path="/grievance/:grievanceId" element={<GrievanceDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/nominee" element={<NomineePage />} />
          <Route path="/profile/kyc" element={<KycCorrectionPage />} />
        </Route>
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </SessionProvider>
  )
}

export default App
