import { useAgents } from '../../hooks/useAgents'
import { useActivityLog } from '../../hooks/useActivityLog'
import { Bell, Search } from 'lucide-react'
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
        <header className="h-[56px] bg-white/80 backdrop-blur-xl border-b border-light-gray/60 flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-40">
            {/* Agent heartbeat strip */}
            <div className="flex items-center gap-4">
                <span className="text-[11px] font-semibold text-charcoal/60 uppercase tracking-wider mr-1">
                    Agents
                </span>
                <div className="flex items-center gap-1.5">
                    {agents.map((agent) => {
                        const color = getStatusColor(agent.status)
                        return (
                            <div key={agent.id} className="group relative flex items-center">
                                <div
                                    className={`w-2 h-2 rounded-full ${statusColorMap[color]} transition-transform group-hover:scale-150`}
                                    title={`${agent.name}: ${agent.status}`}
                                />
                                {/* Tooltip */}
                                <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-navy text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-lg">
                                    <div>{agent.name}</div>
                                    <div className="text-white/50 text-[9px] mt-0.5 capitalize">{agent.status}</div>
                                    {/* Arrow */}
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-navy rotate-45" />
                                </div>
                            </div>
                        )
                    })}
                </div>
                {agents.length > 0 && (
                    <span className="text-[11px] text-charcoal/50 font-medium">
                        {agents.filter((a) => a.status === 'active').length}/{agents.length} active
                    </span>
                )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
                {/* Search */}
                <button className="p-2 rounded-xl hover:bg-surface transition-colors cursor-pointer">
                    <Search size={16} className="text-charcoal/50" />
                </button>

                {/* Pending approvals badge */}
                <button className="relative p-2 rounded-xl hover:bg-surface transition-colors cursor-pointer">
                    <Bell size={16} className="text-charcoal/50" />
                    {pendingCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-red-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm shadow-red-500/30">
                            {pendingCount > 9 ? '9+' : pendingCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    )
}
