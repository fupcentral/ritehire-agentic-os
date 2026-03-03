import { useAgents } from '../hooks/useAgents'
import { useTasks } from '../hooks/useTasks'
import { useDeals } from '../hooks/useDeals'
import { useActivityLog } from '../hooks/useActivityLog'
import Card, { CardHeader } from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import StatCard from '../components/ui/StatCard'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import { getStatusColor } from '../lib/types'
import ApprovalQueue from '../components/ui/ApprovalQueue'
import {
    AlertTriangle,
    Activity,
    TrendingUp,
    Users,
    Clock,
    Zap,
} from 'lucide-react'
import type { Deal } from '../lib/types'

const DEAL_STAGE_LABELS: Record<string, string> = {
    prospecting: 'Prospecting',
    contacted: 'Contacted',
    discovery: 'Discovery',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    closed_won: 'Closed Won',
    closed_lost: 'Closed Lost',
}

const statusDotClass: Record<string, string> = {
    teal: 'bg-status-active',
    amber: 'bg-status-pending',
    red: 'bg-status-blocked',
    gray: 'bg-status-paused',
}

export default function CommandCentre() {
    const { agents, loading: agentsLoading } = useAgents()
    const { tasks, loading: tasksLoading } = useTasks()
    const { deals, loading: dealsLoading } = useDeals()
    const { entries, loading: activityLoading } = useActivityLog({ limit: 10 })

    const blockedTasks = tasks.filter((t) => t.status === 'blocked')
    const pendingApprovals = entries.filter((e) => e.status === 'pending').length

    // Pipeline grouping
    const pipelineStages = Object.keys(DEAL_STAGE_LABELS).filter(
        (s) => s !== 'closed_lost'
    )
    const dealsByStage = pipelineStages.reduce<Record<string, Deal[]>>((acc, stage) => {
        acc[stage] = deals.filter((d) => d.stage === stage)
        return acc
    }, {})

    const totalMRR = deals
        .filter((d) => d.stage === 'closed_won')
        .reduce((sum, d) => sum + (d.mrr || 0), 0)

    const pipelineMRR = deals
        .filter((d) => !['closed_won', 'closed_lost'].includes(d.stage))
        .reduce((sum, d) => sum + (d.mrr || 0), 0)

    return (
        <div className="space-y-6 fade-in">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-navy">Command Centre</h1>
                <p className="text-sm text-charcoal mt-1">Your morning view — everything at a glance.</p>
            </div>

            {/* Agent heartbeat strip */}
            <Card>
                <CardHeader title="Agent Status" subtitle={`${agents.filter(a => a.status === 'active').length} of ${agents.length} agents active`} />
                {agentsLoading ? (
                    <SkeletonLoader variant="row" count={2} />
                ) : agents.length === 0 ? (
                    <EmptyState title="No agents found" description="Agent data will appear once connected." />
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                        {agents.map((agent) => {
                            const color = getStatusColor(agent.status)
                            return (
                                <div
                                    key={agent.id}
                                    className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-surface hover:bg-light-gray/40 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center relative">
                                        <span className="text-xs font-semibold text-navy">
                                            {agent.name.slice(0, 2).toUpperCase()}
                                        </span>
                                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusDotClass[color]}`} />
                                    </div>
                                    <span className="text-[11px] font-medium text-navy text-center leading-tight truncate max-w-full">
                                        {agent.name}
                                    </span>
                                    <span className="text-[10px] text-charcoal truncate max-w-full">
                                        {agent.current_task || agent.role}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </Card>

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Active MRR"
                    value={`$${totalMRR.toLocaleString()}`}
                    icon={<TrendingUp size={20} />}
                />
                <StatCard
                    label="Pipeline MRR"
                    value={`$${pipelineMRR.toLocaleString()}`}
                    icon={<Zap size={20} />}
                />
                <StatCard
                    label="Blockers"
                    value={blockedTasks.length}
                    icon={<AlertTriangle size={20} />}
                />
                <StatCard
                    label="Pending Approvals"
                    value={pendingApprovals}
                    icon={<Clock size={20} />}
                />
            </div>

            {/* Action Center — Pending Approvals */}
            <ApprovalQueue compact title="⚡ Action Center — Pending Approvals" />

            {/* Two-column: Blockers + Pipeline Snapshot */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Blockers Panel */}
                <Card>
                    <CardHeader
                        title="Blockers"
                        subtitle={`${blockedTasks.length} task${blockedTasks.length !== 1 ? 's' : ''} blocked`}
                    />
                    {tasksLoading ? (
                        <SkeletonLoader variant="row" count={3} />
                    ) : blockedTasks.length === 0 ? (
                        <EmptyState
                            icon={<AlertTriangle size={20} />}
                            title="No blockers"
                            description="All clear — no tasks are currently blocked."
                        />
                    ) : (
                        <div className="space-y-2 max-h-[320px] overflow-y-auto">
                            {blockedTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-surface hover:bg-light-gray/30 transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-status-blocked mt-1.5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium text-navy truncate">
                                            {task.title}
                                        </div>
                                        {task.blocker_path && (
                                            <div className="text-xs text-charcoal mt-0.5 line-clamp-2">
                                                {task.blocker_path}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <StatusBadge status={task.priority} size="sm" />
                                            {task.agent && (
                                                <span className="text-[11px] text-charcoal">
                                                    {task.agent.name}
                                                </span>
                                            )}
                                            {task.due_date && (
                                                <span className="text-[11px] text-charcoal">
                                                    Due {new Date(task.due_date).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Pipeline Snapshot */}
                <Card>
                    <CardHeader
                        title="Pipeline Snapshot"
                        subtitle={`${deals.length} total deals`}
                    />
                    {dealsLoading ? (
                        <SkeletonLoader variant="row" count={4} />
                    ) : deals.length === 0 ? (
                        <EmptyState
                            icon={<TrendingUp size={20} />}
                            title="No deals yet"
                            description="Deals will appear once your pipeline is active."
                        />
                    ) : (
                        <div className="space-y-2">
                            {pipelineStages.map((stage) => {
                                const stageDealsList = dealsByStage[stage] || []
                                const stageMRR = stageDealsList.reduce((s, d) => s + (d.mrr || 0), 0)
                                const barWidth =
                                    deals.length > 0
                                        ? Math.max(4, (stageDealsList.length / deals.length) * 100)
                                        : 0

                                return (
                                    <div key={stage} className="flex items-center gap-3">
                                        <div className="w-24 text-xs text-charcoal font-medium truncate">
                                            {DEAL_STAGE_LABELS[stage]}
                                        </div>
                                        <div className="flex-1 h-6 bg-surface rounded-md overflow-hidden relative">
                                            <div
                                                className="h-full bg-teal/20 rounded-md transition-all duration-500"
                                                style={{ width: `${barWidth}%` }}
                                            />
                                            <span className="absolute inset-0 flex items-center px-2 text-[11px] font-medium text-navy">
                                                {stageDealsList.length} deal{stageDealsList.length !== 1 ? 's' : ''}
                                                {stageMRR > 0 && ` · $${stageMRR.toLocaleString()}`}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </Card>
            </div>

            {/* Activity Feed */}
            <Card>
                <CardHeader
                    title="Activity Feed"
                    subtitle="Last 10 actions across all agents"
                    action={
                        <div className="flex items-center gap-1 text-charcoal">
                            <Activity size={14} />
                            <span className="text-xs font-medium">{entries.length} entries</span>
                        </div>
                    }
                />
                {activityLoading ? (
                    <SkeletonLoader variant="row" count={5} />
                ) : entries.length === 0 ? (
                    <EmptyState
                        icon={<Activity size={20} />}
                        title="No activity yet"
                        description="Agent activity will show here once actions begin."
                    />
                ) : (
                    <div className="space-y-1">
                        {entries.map((entry) => (
                            <div
                                key={entry.id}
                                className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-surface transition-colors"
                            >
                                <div className="w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-[10px] font-semibold text-navy">
                                        {(entry.agent?.name || 'AG').slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-navy">
                                            {entry.agent?.name || 'Unknown Agent'}
                                        </span>
                                        <span className="text-xs text-charcoal">
                                            {(entry.skill_used ?? 'action').replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <div className="text-xs text-charcoal mt-0.5 line-clamp-1">
                                        {entry.output_summary}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <StatusBadge status={entry.status} size="sm" />
                                    <span className="text-[10px] text-charcoal">
                                        {new Date(entry.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}
