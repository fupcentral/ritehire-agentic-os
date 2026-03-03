import { useState } from 'react'
import { useServiceStatus } from '../../hooks/useServiceStatus'
import type { ServiceStatus } from '../../hooks/useServiceStatus'
import {
    Database,
    Github,
    Server,
    Wifi,
    WifiOff,
    ChevronDown,
    ChevronUp,
    RefreshCw,
} from 'lucide-react'

const serviceIcons: Record<string, typeof Database> = {
    Supabase: Database,
    GitHub: Github,
    'Vite Dev Server': Server,
}

function StatusDot({ status }: { status: ServiceStatus['status'] }) {
    const colors = {
        connected: 'bg-status-active',
        error: 'bg-status-blocked',
        checking: 'bg-status-pending animate-pulse',
    }
    return <span className={`w-2 h-2 rounded-full ${colors[status]} flex-shrink-0`} />
}

export default function MCPStatusBanner() {
    const { services, lastChecked, refetch } = useServiceStatus()
    const [expanded, setExpanded] = useState(false)

    const allConnected = services.every((s) => s.status === 'connected')
    const anyError = services.some((s) => s.status === 'error')
    const anyChecking = services.some((s) => s.status === 'checking')

    const overallStatus = anyChecking
        ? 'checking'
        : anyError
            ? 'error'
            : 'connected'

    const overallLabel = anyChecking
        ? 'Checking services...'
        : allConnected
            ? `${services.length} services connected`
            : `${services.filter((s) => s.status === 'error').length} service(s) down`

    return (
        <div className="mx-6 mt-4 mb-2">
            {/* Compact bar */}
            <button
                onClick={() => setExpanded(!expanded)}
                className={`
                    w-full flex items-center justify-between px-4 py-2.5 rounded-xl
                    transition-all duration-300 cursor-pointer group
                    ${anyError
                        ? 'bg-red-50 border border-red-100 hover:border-red-200'
                        : 'bg-teal/5 border border-teal/10 hover:border-teal/20'
                    }
                `}
            >
                <div className="flex items-center gap-3">
                    {anyError ? (
                        <WifiOff size={14} className="text-status-blocked" />
                    ) : (
                        <Wifi size={14} className="text-teal" />
                    )}
                    <div className="flex items-center gap-2">
                        {services.map((s) => (
                            <StatusDot key={s.name} status={s.status} />
                        ))}
                    </div>
                    <span className={`text-xs font-medium ${anyError ? 'text-status-blocked' : 'text-teal-dark'}`}>
                        {overallLabel}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {lastChecked && (
                        <span className="text-[10px] text-charcoal opacity-0 group-hover:opacity-100 transition-opacity">
                            Last checked {lastChecked.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                    {expanded ? (
                        <ChevronUp size={14} className="text-charcoal" />
                    ) : (
                        <ChevronDown size={14} className="text-charcoal" />
                    )}
                </div>
            </button>

            {/* Expanded panel */}
            {expanded && (
                <div className="mt-2 rounded-xl border border-light-gray bg-white overflow-hidden shadow-sm fade-in">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-light-gray/50">
                        <span className="text-[11px] font-semibold text-charcoal uppercase tracking-wider">
                            Service Connections
                        </span>
                        <button
                            onClick={(e) => { e.stopPropagation(); refetch() }}
                            className="text-charcoal hover:text-teal transition-colors p-1 rounded-md hover:bg-surface cursor-pointer"
                            title="Refresh status"
                        >
                            <RefreshCw size={12} />
                        </button>
                    </div>
                    <div className="divide-y divide-light-gray/30">
                        {services.map((service) => {
                            const Icon = serviceIcons[service.name] || Server
                            return (
                                <div key={service.name} className="flex items-center justify-between px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                            w-8 h-8 rounded-lg flex items-center justify-center
                                            ${service.status === 'connected'
                                                ? 'bg-teal/10 text-teal'
                                                : service.status === 'error'
                                                    ? 'bg-red-50 text-status-blocked'
                                                    : 'bg-amber-50 text-status-pending'
                                            }
                                        `}>
                                            <Icon size={16} />
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-navy block">
                                                {service.name}
                                            </span>
                                            {service.detail && (
                                                <span className="text-[10px] text-charcoal">
                                                    {service.detail}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <StatusDot status={service.status} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
