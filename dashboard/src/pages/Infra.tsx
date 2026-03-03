import { useState } from 'react'
import TabNav from '../components/ui/TabNav'
import Card, { CardHeader } from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import StatCard from '../components/ui/StatCard'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import Drawer from '../components/ui/Drawer'
import { useAgents } from '../hooks/useAgents'
import { useActivityLog } from '../hooks/useActivityLog'
import { useSkills } from '../hooks/useSkills'
import { useTasks } from '../hooks/useTasks'
import { getStatusColor } from '../lib/types'
import DepartmentTasks from '../components/ui/DepartmentTasks'
import DepartmentTools from '../components/ui/DepartmentTools'
import type { Agent, ActivityLogEntry } from '../lib/types'
import {
    Bot,
    Activity,
    Zap,
    Server,
    GitBranch,
    Clock,
    Search,
} from 'lucide-react'

const statusDotClass: Record<string, string> = {
    teal: 'bg-status-active',
    amber: 'bg-status-pending',
    red: 'bg-status-blocked',
    gray: 'bg-status-paused',
}

export default function Infra() {
    const [activeTab, setActiveTab] = useState('agents')

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-navy">Infrastructure & Agents</h1>
                <p className="text-sm text-charcoal mt-1">Agent management, activity audit trail, and skill registry.</p>
            </div>

            <TabNav
                tabs={[
                    { key: 'agents', label: 'Agents' },
                    { key: 'activity', label: 'Activity Log' },
                    { key: 'skills', label: 'Skills' },
                    { key: 'tools', label: 'Tools' },
                    { key: 'tasks', label: 'Tasks' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <div className="mt-4">
                {activeTab === 'agents' && <AgentsTab />}
                {activeTab === 'activity' && <ActivityLogTab />}
                {activeTab === 'skills' && <SkillsTab />}
                {activeTab === 'tools' && <DepartmentTools department="infra" />}
                {activeTab === 'tasks' && <DepartmentTasks agentNames={['CEO', 'CDO', 'CRO', 'CFO', 'LinkedIn', 'Email', 'Brand', 'Legal', 'Admin']} title="All Agent Tasks" />}
            </div>
        </div>
    )
}

/* ============================================================
   AGENTS TAB
   ============================================================ */
const HIERARCHY = [
    {
        id: 'ceo',
        children: [
            { id: 'cdo', children: [] },
            {
                id: 'cro',
                children: [
                    { id: 'linkedin-outbound', children: [] },
                    { id: 'email-outbound', children: [] },
                    { id: 'brand', children: [] },
                ],
            },
            {
                id: 'cfo',
                children: [
                    { id: 'legal-compliance', children: [] },
                    { id: 'admin-ops', children: [] },
                ],
            },
        ],
    },
]

function AgentsTab() {
    const { agents, loading } = useAgents()
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
    const { tasks } = useTasks({ agentId: selectedAgent?.id || undefined })
    const { entries: agentActivity } = useActivityLog({
        agentId: selectedAgent?.id || undefined,
        limit: 10,
    })

    const agentMap = new Map(agents.map((a) => [a.id, a]))

    function renderTreeNode(node: { id: string; children: any[] }, depth: number = 0) {
        const agent = agentMap.get(node.id)
        if (!agent) return null
        const color = getStatusColor(agent.status)

        return (
            <div key={node.id} style={{ paddingLeft: depth * 24 }}>
                <div
                    onClick={() => setSelectedAgent(agent)}
                    className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-colors
            ${selectedAgent?.id === agent.id ? 'bg-teal/10' : 'hover:bg-surface'}`}
                >
                    {depth > 0 && (
                        <GitBranch size={12} className="text-light-gray flex-shrink-0" />
                    )}
                    <div className={`w-2 h-2 rounded-full ${statusDotClass[color]} flex-shrink-0`} />
                    <span className="text-sm font-medium text-navy">{agent.name}</span>
                    <span className="text-xs text-charcoal">{agent.role}</span>
                </div>
                {node.children.map((child: any) => renderTreeNode(child, depth + 1))}
            </div>
        )
    }

    if (loading) return <SkeletonLoader variant="card" count={4} />

    return (
        <div className="space-y-6">
            {/* Agent cards grid */}
            {agents.length === 0 ? (
                <EmptyState icon={<Bot size={24} />} title="No agents found" description="Agent data will appear once connected." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent) => {
                        const color = getStatusColor(agent.status)
                        return (
                            <div
                                key={agent.id}
                                onClick={() => setSelectedAgent(agent)}
                                className={`card-sm cursor-pointer hover:shadow-card transition-shadow
                  ${selectedAgent?.id === agent.id ? 'ring-2 ring-teal' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center relative flex-shrink-0">
                                        <span className="text-xs font-semibold text-navy">
                                            {agent.name.slice(0, 2).toUpperCase()}
                                        </span>
                                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusDotClass[color]}`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-semibold text-navy">{agent.name}</div>
                                        <div className="text-xs text-charcoal">{agent.role}</div>
                                        {agent.current_task && (
                                            <div className="text-[11px] text-charcoal mt-1 truncate">
                                                📋 {agent.current_task}
                                            </div>
                                        )}
                                        {agent.skills && agent.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {agent.skills.map((skill) => (
                                                    <span
                                                        key={skill.id}
                                                        className="text-[10px] bg-light-gray/60 text-charcoal px-1.5 py-0.5 rounded"
                                                    >
                                                        {skill.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Hierarchy Tree */}
            <Card>
                <CardHeader title="Agent Hierarchy" subtitle="Reporting structure" />
                <div className="py-2">
                    {HIERARCHY.map((node) => renderTreeNode(node))}
                </div>
            </Card>

            {/* Agent detail drawer */}
            <Drawer
                open={!!selectedAgent}
                onClose={() => setSelectedAgent(null)}
                title={selectedAgent?.name || 'Agent Details'}
                subtitle={selectedAgent?.role || undefined}
            >
                {selectedAgent && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Status</label>
                                <div className="mt-0.5"><StatusBadge status={selectedAgent.status} /></div>
                            </div>
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Reports To</label>
                                <p className="text-sm text-navy mt-0.5">
                                    {selectedAgent.reporting_to ? agentMap.get(selectedAgent.reporting_to)?.name || selectedAgent.reporting_to : 'None'}
                                </p>
                            </div>
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Current Task</label>
                                <p className="text-sm text-navy mt-0.5">{selectedAgent.current_task || '—'}</p>
                            </div>
                        </div>

                        {/* Skills */}
                        {selectedAgent.skills && selectedAgent.skills.length > 0 && (
                            <div>
                                <label className="text-[11px] text-charcoal font-medium mb-2 block">Skills</label>
                                <div className="space-y-1.5">
                                    {selectedAgent.skills.map((skill) => (
                                        <div key={skill.id} className="flex items-center justify-between p-2 rounded-lg bg-surface">
                                            <div>
                                                <span className="text-sm text-navy">{skill.name}</span>
                                                <span className="text-xs text-charcoal ml-2">{skill.category}</span>
                                            </div>
                                            <StatusBadge status={skill.status} size="sm" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tasks */}
                        <div>
                            <label className="text-[11px] text-charcoal font-medium mb-2 block">
                                Tasks ({tasks.length})
                            </label>
                            {tasks.length === 0 ? (
                                <p className="text-xs text-charcoal">No tasks assigned.</p>
                            ) : (
                                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                    {tasks.map((task) => (
                                        <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-surface">
                                            <span className="text-sm text-navy truncate flex-1 mr-2">{task.title}</span>
                                            <StatusBadge status={task.status} size="sm" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <label className="text-[11px] text-charcoal font-medium mb-2 block">
                                Recent Activity ({agentActivity.length})
                            </label>
                            {agentActivity.length === 0 ? (
                                <p className="text-xs text-charcoal">No activity recorded.</p>
                            ) : (
                                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                    {agentActivity.map((entry) => (
                                        <div key={entry.id} className="p-2 rounded-lg bg-surface">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-charcoal">
                                                    {(entry.skill_used ?? 'action').replace(/_/g, ' ')}
                                                </span>
                                                <StatusBadge status={entry.status} size="sm" />
                                            </div>
                                            <p className="text-xs text-charcoal mt-0.5 line-clamp-1">{entry.output_summary}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    )
}

/* ============================================================
   ACTIVITY LOG TAB
   ============================================================ */
function ActivityLogTab() {
    const [agentFilter, setAgentFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const { agents } = useAgents()
    const { entries, loading } = useActivityLog({
        agentId: agentFilter || undefined,
        status: statusFilter || undefined,
        limit: 100,
    })

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-3">
                <select
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-light-gray rounded-lg bg-white focus:outline-none focus:border-teal cursor-pointer"
                >
                    <option value="">All Agents</option>
                    {agents.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-light-gray rounded-lg bg-white focus:outline-none focus:border-teal cursor-pointer"
                >
                    <option value="">All Statuses</option>
                    {['success', 'failed', 'in_progress', 'pending'].map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                </select>
                <span className="text-xs text-charcoal ml-auto">
                    {entries.length} entries
                </span>
            </div>

            {/* Log table */}
            <Card padding={false}>
                {loading ? (
                    <div className="p-4"><SkeletonLoader variant="row" count={8} /></div>
                ) : entries.length === 0 ? (
                    <EmptyState
                        icon={<Activity size={24} />}
                        title="No activity log entries"
                        description="Agent activity will appear here once actions begin."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-light-gray">
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Time</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Agent</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Skill Used</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Output</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Status</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Risk</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((entry) => (
                                    <tr key={entry.id} className="border-b border-light-gray/50 hover:bg-surface transition-colors">
                                        <td className="px-4 py-3 text-xs text-charcoal whitespace-nowrap">
                                            {new Date(entry.created_at).toLocaleString([], {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-navy font-medium">
                                            {entry.agent?.name || 'Unknown'}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-charcoal">
                                            {(entry.skill_used ?? 'action').replace(/_/g, ' ')}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-charcoal max-w-[300px] truncate">
                                            {entry.output_summary}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={entry.status} size="sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            {entry.risk_level ? (
                                                <StatusBadge status={entry.risk_level === 'critical' ? 'blocked' : entry.risk_level === 'high' ? 'blocked' : 'active'} size="sm" />
                                            ) : (
                                                <span className="text-xs text-charcoal">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    )
}

/* ============================================================
   SKILLS TAB
   ============================================================ */
function SkillsTab() {
    const { skills, loading } = useSkills()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-charcoal">
                    <Zap size={16} />
                    <span className="text-sm font-medium">{skills.length} skills registered</span>
                </div>
            </div>

            <Card padding={false}>
                {loading ? (
                    <div className="p-4"><SkeletonLoader variant="row" count={6} /></div>
                ) : skills.length === 0 ? (
                    <EmptyState
                        icon={<Zap size={24} />}
                        title="No skills registered"
                        description="Skills will appear once agents are configured with execution playbooks."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-light-gray">
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Name</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Agent</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Category</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Run Count</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Last Run</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map((skill) => (
                                    <tr key={skill.id} className="border-b border-light-gray/50 hover:bg-surface transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-navy">{skill.name}</td>
                                        <td className="px-4 py-3 text-sm text-charcoal">
                                            {skill.agent?.name || skill.agent_id}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[11px] bg-light-gray/60 text-charcoal px-2 py-0.5 rounded capitalize">
                                                {skill.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-navy font-medium">{skill.run_count}</td>
                                        <td className="px-4 py-3 text-xs text-charcoal">
                                            {skill.last_run
                                                ? new Date(skill.last_run).toLocaleDateString()
                                                : 'Never'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={skill.status} size="sm" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    )
}
