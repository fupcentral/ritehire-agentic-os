import Card, { CardHeader } from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import { useAgents } from '../hooks/useAgents'
import { useActivityLog } from '../hooks/useActivityLog'
import { getStatusColor } from '../lib/types'
import DepartmentTasks from '../components/ui/DepartmentTasks'
import {
    Users,
    Shield,
    FileText,
    CheckCircle,
    AlertCircle,
    Clock,
} from 'lucide-react'

const statusDotClass: Record<string, string> = {
    teal: 'bg-status-active',
    amber: 'bg-status-pending',
    red: 'bg-status-blocked',
    gray: 'bg-status-paused',
}

export default function HR() {
    const { agents, loading: agentsLoading } = useAgents()
    const { entries: legalActivity, loading: activityLoading } = useActivityLog({
        agentName: 'Legal',
        limit: 20,
    })

    const complianceChecklist = [
        { label: 'Agent Operating Agreements', status: 'done', detail: 'All 9 agents have defined YAML configs' },
        { label: 'Data Processing Policy', status: 'done', detail: 'Supabase RLS policies active' },
        { label: 'Approval Gate Enforcement', status: 'done', detail: 'All external actions require human approval' },
        { label: 'Activity Audit Trail', status: 'done', detail: 'activity_log captures all agent actions' },
        { label: 'Contract Review Process', status: 'in_progress', detail: 'Legal agent has contract-review skill active' },
        { label: 'Compliance Reporting', status: 'todo', detail: 'Quarterly compliance reports — upcoming' },
        { label: 'External API Security Audit', status: 'todo', detail: 'Review all external integrations' },
    ]

    const completedChecks = complianceChecklist.filter((c) => c.status === 'done').length

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-navy">HR & Compliance</h1>
                <p className="text-sm text-charcoal mt-1">Team roster, legal activity, and compliance tracking.</p>
            </div>

            {/* Team Roster */}
            <Card>
                <CardHeader
                    title="Team Roster"
                    subtitle={`${agents.length} agents in the organization`}
                />
                {agentsLoading ? (
                    <SkeletonLoader variant="row" count={5} />
                ) : agents.length === 0 ? (
                    <EmptyState icon={<Users size={24} />} title="No agents found" />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-light-gray">
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Agent</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Role</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Reports To</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Status</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Current Task</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Skills</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agents.map((agent) => {
                                    const reportingAgent = agents.find((a) => a.id === agent.reporting_to)
                                    return (
                                        <tr key={agent.id} className="border-b border-light-gray/50 hover:bg-surface transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center relative">
                                                        <span className="text-[10px] font-semibold text-navy">
                                                            {agent.name.slice(0, 2).toUpperCase()}
                                                        </span>
                                                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${statusDotClass[getStatusColor(agent.status)]}`} />
                                                    </div>
                                                    <span className="text-sm font-medium text-navy">{agent.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-charcoal">{agent.role}</td>
                                            <td className="px-4 py-3 text-sm text-charcoal">
                                                {reportingAgent?.name || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={agent.status} size="sm" />
                                            </td>
                                            <td className="px-4 py-3 text-xs text-charcoal max-w-[200px] truncate">
                                                {agent.current_task || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {agent.skills && agent.skills.length > 0 ? (
                                                        agent.skills.map((skill) => (
                                                            <span key={skill.id} className="text-[10px] bg-light-gray/60 text-charcoal px-1.5 py-0.5 rounded">
                                                                {skill.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-charcoal">—</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Legal & Compliance Activity */}
                <Card>
                    <CardHeader
                        title="Legal & Compliance Activity"
                        subtitle="Recent activity from the Legal & Compliance agent"
                    />
                    {activityLoading ? (
                        <SkeletonLoader variant="row" count={4} />
                    ) : legalActivity.length === 0 ? (
                        <EmptyState
                            icon={<Shield size={20} />}
                            title="No legal activity yet"
                            description="Activity from the Legal & Compliance agent will appear here."
                        />
                    ) : (
                        <div className="space-y-1 max-h-[360px] overflow-y-auto">
                            {legalActivity.map((entry) => (
                                <div key={entry.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-surface transition-colors">
                                    <div className="w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Shield size={12} className="text-navy" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-navy">
                                                {entry.agent?.name || 'Legal & Compliance'}
                                            </span>
                                            <span className="text-xs text-charcoal">
                                                {(entry.skill_used ?? 'action').replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <div className="text-xs text-charcoal mt-0.5 line-clamp-2">{entry.output_summary}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <StatusBadge status={entry.status} size="sm" />
                                        <span className="text-[10px] text-charcoal">
                                            {new Date(entry.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Contract Review Queue */}
                <Card>
                    <CardHeader title="Contract Review Queue" subtitle="Contracts awaiting review" />
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-14 h-14 rounded-xl bg-light-gray/60 flex items-center justify-center mb-4">
                            <FileText size={24} className="text-charcoal" />
                        </div>
                        <h3 className="text-sm font-semibold text-navy mb-1">Contract Review Coming Soon</h3>
                        <p className="text-xs text-charcoal max-w-[260px] mb-4">
                            The contract review queue will integrate with the Legal & Compliance agent's contract-review skill.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-charcoal bg-light-gray/40 px-3 py-1.5 rounded-lg">
                            <Clock size={14} />
                            <span>In development</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Compliance Status Checklist */}
            <Card>
                <CardHeader
                    title="Compliance Status"
                    subtitle={`${completedChecks} of ${complianceChecklist.length} checks passed`}
                />
                <div className="space-y-2">
                    {complianceChecklist.map((item, i) => {
                        const iconMap = {
                            done: <CheckCircle size={16} className="text-status-active" />,
                            in_progress: <Clock size={16} className="text-status-pending" />,
                            todo: <AlertCircle size={16} className="text-status-paused" />,
                        }

                        return (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                                <div className="flex-shrink-0 mt-0.5">
                                    {iconMap[item.status as keyof typeof iconMap]}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-navy">{item.label}</span>
                                        <StatusBadge status={item.status} size="sm" />
                                    </div>
                                    <p className="text-xs text-charcoal mt-0.5">{item.detail}</p>
                                </div>
                            </div>
                        )
                    })}

                    {/* Progress bar */}
                    <div className="mt-4 pt-3 border-t border-light-gray">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-charcoal">Compliance Score</span>
                            <span className="text-sm font-semibold text-navy">
                                {Math.round((completedChecks / complianceChecklist.length) * 100)}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-light-gray rounded-full overflow-hidden">
                            <div
                                className="h-full bg-teal rounded-full transition-all duration-700"
                                style={{ width: `${(completedChecks / complianceChecklist.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Department Tasks */}
            <DepartmentTasks agentNames={['Legal', 'Admin']} title="HR & Compliance Tasks" />
        </div>
    )
}
