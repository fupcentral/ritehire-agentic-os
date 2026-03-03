import { useAgents } from '../../hooks/useAgents'
import { useActivityLog } from '../../hooks/useActivityLog'
import { Bell } from 'lucide-react'
import { getStatusColor } from '../../lib/types'

const statusColorMap: Record<string, string> = {
    teal: 'bg-status-active',
    amber: 'bg-status-pending',
    red: 'bg-status-blocked',
    gray: 'bg-status-paused',
}

export default function TopBar() {
    const { agents } = useAgents()
    const { entries } = useActivityLog({ status: 'pending', limit: 50 })

    const pendingCount = entries.length

    return (
        <header className="h-14 bg-white border-b border-light-gray flex items-center justify-between px-6 flex-shrink-0">
            {/* Agent heartbeat strip */}
            <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-charcoal mr-1">Agents</span>
                <div className="flex items-center gap-2">
                    {agents.map((agent) => {
                        const color = getStatusColor(agent.status)
                        return (
                            <div key={agent.id} className="group relative flex items-center">
                                <div
                                    className={`w-2.5 h-2.5 rounded-full ${statusColorMap[color]}`}
                                    title={`${agent.name}: ${agent.status}`}
                                />
                                {/* Tooltip */}
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-navy text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-sm">
                                    {agent.name}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {agents.length > 0 && (
                    <span className="text-[11px] text-charcoal">
                        {agents.filter((a) => a.status === 'active').length}/{agents.length} active
                    </span>
                )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Pending approvals badge */}
                <button className="relative p-2 rounded-lg hover:bg-light-gray/50 transition-colors cursor-pointer">
                    <Bell size={18} className="text-charcoal" />
                    {pendingCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-status-blocked text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {pendingCount > 9 ? '9+' : pendingCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    )
}
