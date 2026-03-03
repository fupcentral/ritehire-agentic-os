import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import ExecutiveDashboard from './pages/ExecutiveDashboard'
import LinkedInEngine from './pages/LinkedInEngine'
import EmailOutreach from './pages/EmailOutreach'
import Contacts from './pages/Contacts'
import Pipeline from './pages/Pipeline'
import Agents from './pages/Agents'
import ActivityLog from './pages/ActivityLog'
import Finance from './pages/Finance'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<ExecutiveDashboard />} />
          <Route path="/gtm/linkedin" element={<LinkedInEngine />} />
          <Route path="/gtm/email" element={<EmailOutreach />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/activity" element={<ActivityLog />} />
          <Route path="/finance" element={<Finance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
