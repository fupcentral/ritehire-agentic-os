import { useAgents } from '../hooks/useAgents'
import { useDeals } from '../hooks/useDeals'
import { useActivityLog } from '../hooks/useActivityLog'
import { useTasks } from '../hooks/useTasks'
import StatusBadge from '../components/ui/StatusBadge'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import {
    AlertTriangle,
    TrendingUp,
    Activity,
    Clock,
    Bot,
} from 'lucide-react'

const STAGE_LABELS: Record<string, string> = {
    prospecting: 'Prospecting',
    contacted: 'Contacted',
    discovery: 'Discovery',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    closed_won: 'Won',
    closed_lost: 'Lost',
}

export default function ExecutiveDashboard() {
    const { agents, loading: agentsLoading } = useAgents()
    const { deals, loading: dealsLoading } = useDeals()
    const { entries: recentActivity, loading: activityLoading } = useActivityLog({ limit: 10 })
    const { tasks, loading: tasksLoading } = useTasks()

    // Agent name lookup map — defined first so allAlerts can reference it
    const agentNameMap = agents.reduce<Record<string, string>>((acc, a) => {
        acc[a.id] = a.name
        return acc
    }, {})

    const criticalAlerts = tasks.filter(
        (t) => t.priority === 'P0 - Critical' || t.status === 'blocked'
    )
    const escalated = recentActivity.filter((a) => a.status === 'failed')
    const allAlerts = [
        ...criticalAlerts.map((t) => ({
            id: t.id,
            text: t.title,
            type: t.status === 'blocked' ? 'blocked' : 'critical',
            agent: t.agent?.name ?? agentNameMap[t.agent_id ?? ''] ?? t.agent_id ?? '—',
        })),
        ...escalated.map((a) => ({
            id: a.id,
            text: a.output_summary,
            type: 'failed',
            agent: a.agent?.name ?? agentNameMap[a.agent_id ?? ''] ?? a.agent_id ?? '—',
        })),
    ]

    const pendingApprovals = recentActivity.filter(
        (a) => a.status === 'awaiting_approval'
    ).length

    // Pipeline by stage
    const stageGroups = deals.reduce<Record<string, { count: number; mrr: number }>>(
        (acc, deal) => {
            if (!acc[deal.stage]) acc[deal.stage] = { count: 0, mrr: 0 }
            acc[deal.stage].count++
            acc[deal.stage].mrr += Number(deal.mrr || 0)
            return acc
        },
        {}
    )

    const totalPipelineMrr = deals
        .filter((d) => d.stage !== 'closed_lost')
        .reduce((sum, d) => sum + Number(d.mrr || 0), 0)

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Executive Dashboard</h1>
                    <p className="text-sm text-charcoal mt-0.5">Your morning pulse — everything at a glance</p>
                </div>
                {pendingApprovals > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-status-pending/10 border border-amber-200">
                        <Clock size={16} className="text-amber-500" />
                        <span className="text-sm font-semibold text-amber-700">
                            {pendingApprovals} pending approval{pendingApprovals !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* Agent Status Bar */}
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <Bot size={16} className="text-teal" />
                    <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">Agent Status</h2>
                </div>
                {agentsLoading ? (
                    <SkeletonLoader variant="row" count={3} />
                ) : agents.length === 0 ? (
                    <EmptyState icon={Bot} title="No agents found" description="Connect your Supabase project to see agent status." />
                ) : (
                    <div className="grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
                        {agents.map((agent) => (
                            <div
                                key={agent.id}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-surface hover:bg-light-gray/50 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                                    <span className="text-sm font-bold text-navy">
                                        {agent.name.slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-xs font-medium text-navy text-center leading-tight">
                                    {agent.name}
                                </span>
                                <StatusBadge status={agent.status} size="sm" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Two-column: Alerts + Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Critical Alerts */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle size={16} className="text-status-blocked" />
                        <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">Critical Alerts</h2>
                        {allAlerts.length > 0 && (
                            <span className="ml-auto text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                                {allAlerts.length}
                            </span>
                        )}
                    </div>
                    {tasksLoading ? (
                        <SkeletonLoader variant="row" count={3} />
                    ) : allAlerts.length === 0 ? (
                        <div className="flex items-center gap-3 py-6 justify-center text-sm text-charcoal">
                            <span className="w-2 h-2 rounded-full bg-teal" />
                            All clear — no critical alerts
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {allAlerts.slice(0, 5).map((alert) => (
                                <div
                                    key={alert.id}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-red-50/50 border border-red-100"
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alert.type === 'blocked'
                                                ? 'bg-status-blocked'
                                                : 'bg-status-pending'
                                            }`}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-navy font-medium truncate">{alert.text}</p>
                                        <p className="text-xs text-charcoal mt-0.5">
                                            {alert.agent} · {alert.type}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pipeline Snapshot */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={16} className="text-teal" />
                        <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">Pipeline Snapshot</h2>
                        <span className="ml-auto text-sm font-bold text-teal">
                            ${totalPipelineMrr.toLocaleString()} MRR
                        </span>
                    </div>
                    {dealsLoading ? (
                        <SkeletonLoader variant="row" count={4} />
                    ) : deals.length === 0 ? (
                        <EmptyState
                            icon={TrendingUp}
                            title="No deals yet"
                            description="Add your first deal to track pipeline."
                        />
                    ) : (
                        <div className="space-y-2">
                            {Object.entries(STAGE_LABELS)
                                .filter(([stage]) => stage !== 'closed_lost')
                                .map(([stage, label]) => {
                                    const group = stageGroups[stage]
                                    if (!group) return null
                                    return (
                                        <div key={stage} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-navy">{label}</span>
                                                <span className="text-xs font-semibold text-charcoal bg-light-gray px-1.5 py-0.5 rounded">
                                                    {group.count}
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold text-teal">
                                                ${group.mrr.toLocaleString()}
                                            </span>
                                        </div>
                                    )
                                })}
                        </div>
                    )}
                </div>
            </div>

            {/* Activity Feed */}
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <Activity size={16} className="text-teal" />
                    <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">Recent Activity</h2>
                </div>
                {activityLoading ? (
                    <SkeletonLoader variant="row" count={5} />
                ) : recentActivity.length === 0 ? (
                    <EmptyState
                        icon={Activity}
                        title="No activity yet"
                        description="Agent actions will appear here as they execute."
                    />
                ) : (
                    <div className="divide-y divide-light-gray">
                        {recentActivity.map((entry) => (
                            <div key={entry.id} className="flex items-center gap-4 py-3">
                                <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[10px] font-bold text-navy uppercase">
                                        {(agentNameMap[entry.agent_id ?? ''] ?? entry.agent_id ?? '??').slice(0, 2)}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-navy truncate">{entry.output_summary}</p>
                                    <p className="text-xs text-charcoal mt-0.5">
                                        {agentNameMap[entry.agent_id ?? ''] ?? entry.agent_id ?? '—'} · {(entry.skill_used ?? entry.action_type ?? 'action').replace(/_/g, ' ')}
                                    </p>
                                </div>
                                <StatusBadge status={entry.status} size="sm" />
                                <span className="text-xs text-charcoal whitespace-nowrap">
                                    {new Date(entry.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
