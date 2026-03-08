import Card, { CardHeader } from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import { useAgents } from '../hooks/useAgents'
import { useActivityLog } from '../hooks/useActivityLog'
import { getStatusColor } from '../lib/types'
import {
    Users,
    ShieldCheck,
    FileCheck,
    CheckCircle2,
    AlertCircle,
    Activity,
} from 'lucide-react'

const statusDotClass: Record<string, string> = {
    teal: 'bg-status-active',
    amber: 'bg-status-pending',
    red: 'bg-status-blocked',
    gray: 'bg-status-paused',
}

const complianceItems = [
    { label: 'Pakistan Employment Law Compliance', status: 'active' },
    { label: 'GDPR / Data Protection', status: 'in_progress' },
    { label: 'LinkedIn ToS Compliance', status: 'active' },
    { label: 'Contract Templates Updated', status: 'active' },
    { label: 'Financial Reporting Standards', status: 'pending' },
]

export default function HR() {
    const { agents, loading: agentsLoading } = useAgents()
    const { entries, loading: activityLoading } = useActivityLog({
        agentName: ['Legal', 'Compliance'],
        limit: 20,
    })

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-navy">HR & Compliance</h1>
                <p className="text-sm text-charcoal mt-1">Team roster, legal activity, and compliance tracking.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Roster */}
                <Card>
                    <CardHeader title="Team Roster" icon={<Users size={16} />} subtitle={`${agents.length} agents`} />
                    {agentsLoading ? (
                        <SkeletonLoader variant="row" count={5} />
                    ) : agents.length === 0 ? (
                        <EmptyState
                            icon={<Users size={20} />}
                            title="No team members"
                            description="Team data will appear once agents are configured."
                        />
                    ) : (
                        <div className="space-y-2">
                            {agents.map((agent) => {
                                const color = getStatusColor(agent.status)
                                return (
                                    <div
                                        key={agent.id}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-light-gray/30 transition-colors"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-navy/8 flex items-center justify-center relative flex-shrink-0">
                                            <span className="text-xs font-bold text-navy">
                                                {agent.name.slice(0, 2).toUpperCase()}
                                            </span>
                                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface ${statusDotClass[color]}`} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-medium text-navy">{agent.name}</div>
                                            <div className="text-xs text-charcoal">{agent.role}</div>
                                        </div>
                                        <StatusBadge status={agent.status} size="sm" />
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </Card>

                {/* Compliance Status */}
                <Card>
                    <CardHeader title="Compliance Status" icon={<ShieldCheck size={16} />} subtitle="Key compliance items" />
                    <div className="space-y-2">
                        {complianceItems.map((item, i) => {
                            const color = getStatusColor(item.status)
                            return (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface">
                                    {color === 'teal' ? (
                                        <CheckCircle2 size={16} className="text-teal flex-shrink-0" />
                                    ) : color === 'amber' ? (
                                        <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                                    ) : (
                                        <AlertCircle size={16} className="text-charcoal/40 flex-shrink-0" />
                                    )}
                                    <span className="text-sm text-navy flex-1">{item.label}</span>
                                    <StatusBadge status={item.status} size="sm" />
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contract Review Queue */}
                <Card>
                    <CardHeader title="Contract Review Queue" icon={<FileCheck size={16} />} subtitle="Upcoming reviews" />
                    <EmptyState
                        icon={<FileCheck size={20} />}
                        title="No contracts pending"
                        description="Contract review items will appear here once uploaded."
                    />
                </Card>

                {/* Legal Activity */}
                <Card>
                    <CardHeader
                        title="Legal & Compliance Activity"
                        icon={<Activity size={16} />}
                        subtitle="Recent legal operations"
                    />
                    {activityLoading ? (
                        <SkeletonLoader variant="row" count={4} />
                    ) : entries.length === 0 ? (
                        <EmptyState
                            icon={<Activity size={20} />}
                            title="No legal activity"
                            description="Legal agent activity will appear here."
                        />
                    ) : (
                        <div className="space-y-1">
                            {entries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-surface transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-[10px] font-semibold text-pink-500">
                                            {(entry.agent?.name || 'LE').slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-sm font-medium text-navy">{entry.agent?.name || 'Unknown'}</span>
                                        <div className="text-xs text-charcoal mt-0.5 line-clamp-1">{entry.output_summary}</div>
                                    </div>
                                    <StatusBadge status={entry.status} size="sm" />
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
