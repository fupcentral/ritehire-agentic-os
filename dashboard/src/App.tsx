import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import CommandCentre from './pages/CommandCentre'
import Sales from './pages/Sales'
import Marketing from './pages/Marketing'
import Finance from './pages/Finance'
import Infra from './pages/Infra'
import HR from './pages/HR'
import TaskBoard from './pages/TaskBoard'
import ClaudeChatPage from './pages/ClaudeChat'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppShell />}>
                    <Route path="/" element={<CommandCentre />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/marketing" element={<Marketing />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="/infra" element={<Infra />} />
                    <Route path="/hr" element={<HR />} />
                    <Route path="/tasks" element={<TaskBoard />} />
                    <Route path="/claude" element={<ClaudeChatPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
