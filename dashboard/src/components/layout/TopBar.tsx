import { Bell, CheckCircle, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Integration {
    name: string
    connected: boolean
    icon: string
}

const integrations: Integration[] = [
    { name: 'GitHub', connected: true, icon: '⚙' },
    { name: 'Drive', connected: true, icon: '📁' },
    { name: 'Notion', connected: true, icon: '📝' },
    { name: 'LinkedIn', connected: false, icon: '💼' },
    { name: 'Stripe', connected: false, icon: '💳' },
]

export default function TopBar() {
    const [approvalCount, setApprovalCount] = useState(0)
    const [agentAlerts, setAgentAlerts] = useState(0)

    useEffect(() => {
        async function fetchCounts() {
            const { count: approvals } = await supabase
                .from('activity_log')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'awaiting_approval')

            const { count: blocked } = await supabase
                .from('tasks')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'blocked')

            setApprovalCount(approvals || 0)
            setAgentAlerts(blocked || 0)
        }
        fetchCounts()
    }, [])

    return (
        <header className="h-14 bg-white border-b border-light-gray flex items-center justify-between px-6 flex-shrink-0">
            {/* Left: Agent Status */}
            <div className="flex items-center gap-2 text-sm">
                {agentAlerts > 0 ? (
                    <>
                        <AlertCircle size={16} className="text-status-blocked" />
                        <span className="text-charcoal">
                            <span className="font-semibold text-red-500">{agentAlerts}</span> blocked task{agentAlerts !== 1 ? 's' : ''}
                        </span>
                    </>
                ) : (
                    <>
                        <CheckCircle size={16} className="text-teal" />
                        <span className="text-charcoal font-medium">All agents operational</span>
                    </>
                )}
            </div>

            {/* Center: Integration Pills */}
            <div className="flex items-center gap-2">
                {integrations.map((int) => (
                    <div
                        key={int.name}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
              ${int.connected
                                ? 'border-teal/20 bg-teal/5 text-teal'
                                : 'border-light-gray bg-light-gray/30 text-charcoal'
                            }`}
                    >
                        <span>{int.icon}</span>
                        <span>{int.name}</span>
                        {!int.connected && (
                            <span className="text-[10px] text-charcoal/60">Setup</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Right: Approvals + Bell */}
            <div className="flex items-center gap-4">
                {approvalCount > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-pending/10 text-amber-600">
                        <span className="text-xs font-semibold">{approvalCount}</span>
                        <span className="text-xs">pending</span>
                    </div>
                )}
                <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-light-gray/50 transition-colors cursor-pointer">
                    <Bell size={18} className="text-charcoal" />
                    {approvalCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-status-blocked" />
                    )}
                </button>
            </div>
        </header>
    )
}
