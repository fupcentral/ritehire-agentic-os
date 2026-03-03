import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MCPStatusBanner from '../ui/MCPStatusBanner'

export default function AppShell() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-y-auto bg-surface">
                    <MCPStatusBanner />
                    <div className="px-8 pb-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
