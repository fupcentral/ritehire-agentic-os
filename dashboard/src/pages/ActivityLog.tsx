import { useState } from 'react'
import { useActivityLog } from '../hooks/useActivityLog'
import { useAgents } from '../hooks/useAgents'
import StatusBadge from '../components/ui/StatusBadge'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react'

const ACTION_TYPES = ['all', 'skill_execution', 'decision', 'alert', 'review']
const STATUSES = ['all', 'success', 'failed', 'in_progress', 'pending']
const RISKS = ['all', 'low', 'medium', 'high', 'critical']

export default function ActivityLog() {
    const [agentFilter, setAgentFilter] = useState('all')
    const [actionTypeFilter, setActionTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [riskFilter, setRiskFilter] = useState('all')
    const [page, setPage] = useState(0)

    const { agents } = useAgents()
    const { entries, loading, totalCount } = useActivityLog({
        agentFilter,
        actionTypeFilter,
        statusFilter,
        riskFilter,
        limit: 50,
        page,
    })

    const totalPages = Math.ceil(totalCount / 50)

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-navy">Activity Log</h1>
                <p className="text-sm text-charcoal mt-0.5">Complete audit trail of everything the OS has done</p>
            </div>

            {/* Filters */}
            <div className="card-sm flex flex-wrap items-center gap-4">
                <div>
                    <label className="text-[10px] font-semibold text-charcoal uppercase tracking-wide block mb-1">Agent</label>
                    <select
                        value={agentFilter}
                        onChange={(e) => { setAgentFilter(e.target.value); setPage(0) }}
                        className="text-sm text-navy bg-white border border-light-gray rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                    >
                        <option value="all">All Agents</option>
                        {agents.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-semibold text-charcoal uppercase tracking-wide block mb-1">Action</label>
                    <select
                        value={actionTypeFilter}
                        onChange={(e) => { setActionTypeFilter(e.target.value); setPage(0) }}
                        className="text-sm text-navy bg-white border border-light-gray rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                    >
                        {ACTION_TYPES.map((t) => (
                            <option key={t} value={t}>{t === 'all' ? 'All Actions' : t.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-semibold text-charcoal uppercase tracking-wide block mb-1">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
                        className="text-sm text-navy bg-white border border-light-gray rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                    >
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-semibold text-charcoal uppercase tracking-wide block mb-1">Risk</label>
                    <select
                        value={riskFilter}
                        onChange={(e) => { setRiskFilter(e.target.value); setPage(0) }}
                        className="text-sm text-navy bg-white border border-light-gray rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                    >
                        {RISKS.map((r) => (
                            <option key={r} value={r}>{r === 'all' ? 'All Risks' : r}</option>
                        ))}
                    </select>
                </div>

                <div className="ml-auto text-xs text-charcoal">
                    {totalCount} total entries
                </div>
            </div>

            {/* Log Table */}
            <div className="card p-0">
                {loading ? (
                    <div className="p-6">
                        <SkeletonLoader variant="row" count={8} />
                    </div>
                ) : entries.length === 0 ? (
                    <EmptyState
                        icon={Activity}
                        title="No activity logged"
                        description="Agent actions will appear here as they execute tasks and skills."
                    />
                ) : (
                    <div className="divide-y divide-light-gray">
                        {/* Table Header */}
                        <div className="grid grid-cols-[140px_100px_120px_1fr_120px_80px] gap-4 px-6 py-3 bg-surface/50 text-xs font-semibold text-charcoal uppercase tracking-wide">
                            <span>Timestamp</span>
                            <span>Agent</span>
                            <span>Action</span>
                            <span>Output</span>
                            <span>Status</span>
                            <span>Risk</span>
                        </div>
                        {entries.map((entry) => (
                            <div
                                key={entry.id}
                                className="grid grid-cols-[140px_100px_120px_1fr_120px_80px] gap-4 px-6 py-3 items-center hover:bg-surface/30 transition-colors"
                            >
                                <span className="text-xs text-charcoal">
                                    {new Date(entry.created_at).toLocaleString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-navy/5 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[9px] font-bold text-navy uppercase">
                                            {(entry.agent?.name ?? entry.agent_id ?? '?').slice(0, 2)}
                                        </span>
                                    </div>
                                    <span className="text-xs text-navy font-medium truncate">
                                        {entry.agent?.name ?? entry.agent_id ?? '—'}
                                    </span>
                                </div>
                                <span className="text-xs text-charcoal capitalize">
                                    {(entry.skill_used ?? entry.action_type ?? 'action').replace(/_/g, ' ')}
                                </span>
                                <p className="text-sm text-navy truncate">{entry.output_summary}</p>
                                <StatusBadge status={entry.status} size="sm" />
                                {entry.risk_level ? (
                                    <StatusBadge status={entry.risk_level} size="sm" />
                                ) : (
                                    <span className="text-xs text-charcoal">—</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-charcoal rounded-lg border border-light-gray
              hover:bg-surface transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <span className="text-sm text-charcoal">
                        Page {page + 1} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page >= totalPages - 1}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-charcoal rounded-lg border border-light-gray
              hover:bg-surface transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    )
}
