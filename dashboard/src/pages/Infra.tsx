import { useState } from 'react'
import TabNav from '../components/ui/TabNav'
import Card, { CardHeader } from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import StatCard from '../components/ui/StatCard'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import Drawer from '../components/ui/Drawer'
import { useAgents, useAgentSkills } from '../hooks/useAgents'
import { useActivityLog } from '../hooks/useActivityLog'
import { useSkills } from '../hooks/useSkills'
import { useTasks } from '../hooks/useTasks'
import { getStatusColor } from '../lib/types'
import type { Agent } from '../lib/types'
import {
    Server,
    Activity,
    Zap,
    Search,
    ChevronRight,
    GitBranch,
} from 'lucide-react'

const statusDotClass: Record<string, string> = {
    teal: 'bg-status-active',
    amber: 'bg-status-pending',
    red: 'bg-status-blocked',
    gray: 'bg-status-paused',
}

export default function Infra() {
    const [activeTab, setActiveTab] = useState('Agents')

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-navy">Infrastructure & Agents</h1>
                <p className="text-sm text-charcoal mt-1">Agent management, activity audit trail, and skills.</p>
            </div>

            <TabNav
                tabs={['Agents', 'Activity Log', 'Skills']}
                active={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === 'Agents' && <AgentsTab />}
            {activeTab === 'Activity Log' && <ActivityLogTab />}
            {activeTab === 'Skills' && <SkillsTab />}
        </div>
    )
}

/* ============================================================
   AGENTS TAB
   ============================================================ */
function AgentsTab() {
    const { agents, loading } = useAgents()
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

    // Build hierarchy
    const cLevel = agents.filter((a) => !a.reporting_to)
    const getReports = (id: string) => agents.filter((a) => a.reporting_to === id)

    if (loading) return <SkeletonLoader variant="card" count={4} />

    return (
        <div className="space-y-6">
            {/* Agent hierarchy tree */}
            <Card>
                <CardHeader title="Agent Hierarchy" icon={<GitBranch size={16} />} subtitle="Reporting structure" />
                <div className="space-y-3">
                    {cLevel.map((agent) => (
                        <div key={agent.id}>
                            <AgentTreeNode agent={agent} onClick={setSelectedAgent} />
                            <div className="ml-8 mt-1 space-y-1">
                                {getReports(agent.id).map((report) => (
                                    <div key={report.id}>
                                        <AgentTreeNode agent={report} onClick={setSelectedAgent} level={1} />
                                        <div className="ml-8 mt-1 space-y-1">
                                            {getReports(report.id).map((sub) => (
                                                <AgentTreeNode key={sub.id} agent={sub} onClick={setSelectedAgent} level={2} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Agent cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent) => {
                    const color = getStatusColor(agent.status)
                    return (
                        <Card key={agent.id} interactive onClick={() => setSelectedAgent(agent)}>
                            <div className="flex items-start gap-3">
                                <div className="w-11 h-11 rounded-xl bg-navy/8 flex items-center justify-center relative flex-shrink-0">
                                    <span className="text-sm font-bold text-navy">{agent.name.slice(0, 2).toUpperCase()}</span>
                                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusDotClass[color]}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-semibold text-navy">{agent.name}</div>
                                    <div className="text-xs text-charcoal mt-0.5">{agent.role}</div>
                                    {agent.current_task && (
                                        <div className="text-[11px] text-teal mt-1.5 truncate">{agent.current_task}</div>
                                    )}
                                    {agent.skills && agent.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {agent.skills.map((s) => (
                                                <span key={s.id} className="text-[10px] text-charcoal bg-light-gray/60 px-1.5 py-0.5 rounded">
                                                    {s.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <ChevronRight size={16} className="text-charcoal/30 flex-shrink-0" />
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Agent detail drawer */}
            <AgentDrawer agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
        </div>
    )
}

function AgentTreeNode({ agent, onClick, level = 0 }: { agent: Agent; onClick: (a: Agent) => void; level?: number }) {
    const color = getStatusColor(agent.status)
    return (
        <div
            onClick={() => onClick(agent)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface cursor-pointer transition-colors"
        >
            <div className={`w-2 h-2 rounded-full ${statusDotClass[color]}`} />
            <span className={`text-sm ${level === 0 ? 'font-semibold' : 'font-medium'} text-navy`}>{agent.name}</span>
            <span className="text-[11px] text-charcoal">{agent.role}</span>
        </div>
    )
}

function AgentDrawer({ agent, onClose }: { agent: Agent | null; onClose: () => void }) {
    const { skills: agentSkills, loading: skillsLoading } = useAgentSkills(agent?.id || null)
    const { tasks, loading: tasksLoading } = useTasks({ agentId: agent?.id || undefined })
    const { entries, loading: activityLoading } = useActivityLog({
        agentId: agent?.id || undefined,
        limit: 10,
    })

    return (
        <Drawer
            open={!!agent}
            onClose={onClose}
            title={agent?.name || 'Agent Details'}
            subtitle={agent?.role}
            width="w-[520px]"
        >
            {agent && (
                <div className="space-y-6">
                    {/* Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] text-charcoal font-medium uppercase tracking-wide">Status</label>
                            <div className="mt-1"><StatusBadge status={agent.status} /></div>
                        </div>
                        <div>
                            <label className="text-[11px] text-charcoal font-medium uppercase tracking-wide">Reports To</label>
                            <p className="text-sm text-navy mt-1">{agent.reporting_to || 'None (CEO)'}</p>
                        </div>
                    </div>

                    {agent.current_task && (
                        <div>
                            <label className="text-[11px] text-charcoal font-medium uppercase tracking-wide">Current Task</label>
                            <p className="text-sm text-navy mt-1">{agent.current_task}</p>
                        </div>
                    )}

                    {/* Skills */}
                    <div>
                        <label className="text-[11px] text-charcoal font-medium uppercase tracking-wide mb-2 block">Skills</label>
                        {skillsLoading ? (
                            <SkeletonLoader variant="row" count={2} />
                        ) : agentSkills.length === 0 ? (
                            <p className="text-xs text-charcoal">No skills assigned</p>
                        ) : (
                            <div className="space-y-1.5">
                                {agentSkills.map((s) => (
                                    <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg bg-surface">
                                        <Zap size={12} className="text-teal" />
                                        <span className="text-xs font-medium text-navy">{s.name}</span>
                                        <span className="text-[10px] text-charcoal ml-auto">
                                            {s.run_count} runs
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tasks */}
                    <div>
                        <label className="text-[11px] text-charcoal font-medium uppercase tracking-wide mb-2 block">
                            Tasks ({tasks.length})
                        </label>
                        {tasksLoading ? (
                            <SkeletonLoader variant="row" count={3} />
                        ) : tasks.length === 0 ? (
                            <p className="text-xs text-charcoal">No tasks assigned</p>
                        ) : (
                            <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                                {tasks.map((t) => (
                                    <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg bg-surface">
                                        <span className="text-xs font-medium text-navy flex-1 truncate">{t.title}</span>
                                        <StatusBadge status={t.status} size="sm" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <label className="text-[11px] text-charcoal font-medium uppercase tracking-wide mb-2 block">Recent Activity</label>
                        {activityLoading ? (
                            <SkeletonLoader variant="row" count={3} />
                        ) : entries.length === 0 ? (
                            <p className="text-xs text-charcoal">No recent activity</p>
                        ) : (
                            <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                                {entries.map((e) => (
                                    <div key={e.id} className="flex items-start gap-2 p-2 rounded-lg bg-surface">
                                        <div className="text-xs font-medium text-navy flex-1 line-clamp-1">{e.output_summary}</div>
                                        <StatusBadge status={e.status} size="sm" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Drawer>
    )
}

/* ============================================================
   ACTIVITY LOG TAB
   ============================================================ */
function ActivityLogTab() {
    const [agentFilter, setAgentFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const { entries, loading } = useActivityLog({
        agentId: agentFilter || undefined,
        status: statusFilter || undefined,
        limit: 50,
    })
    const { agents } = useAgents()

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/50" />
                    <input
                        type="text"
                        placeholder="Search activity..."
                        className="input pl-9"
                    />
                </div>
                <select
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value)}
                    className="input w-auto"
                >
                    <option value="">All Agents</option>
                    {agents.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input w-auto"
                >
                    <option value="">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            {/* Table */}
            <Card className="!p-0 overflow-hidden">
                {loading ? (
                    <div className="p-6"><SkeletonLoader variant="row" count={8} /></div>
                ) : entries.length === 0 ? (
                    <EmptyState
                        icon={<Activity size={24} />}
                        title="No activity"
                        description="Agent activity will appear here once actions begin."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Agent</th>
                                    <th>Skill Used</th>
                                    <th>Output</th>
                                    <th>Status</th>
                                    <th>Risk</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((entry) => (
                                    <tr key={entry.id}>
                                        <td className="text-xs text-charcoal whitespace-nowrap">
                                            {new Date(entry.created_at).toLocaleString([], {
                                                month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="font-medium text-navy">{entry.agent?.name || 'Unknown'}</td>
                                        <td className="text-charcoal">
                                            {(entry.skill_used ?? 'action').replace(/_/g, ' ')}
                                        </td>
                                        <td className="max-w-[300px]">
                                            <div className="line-clamp-1 text-charcoal">{entry.output_summary}</div>
                                        </td>
                                        <td><StatusBadge status={entry.status} size="sm" /></td>
                                        <td>
                                            {entry.risk_level ? (
                                                <StatusBadge status={entry.risk_level} size="sm" />
                                            ) : (
                                                <span className="text-xs text-charcoal/40">—</span>
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
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Total Skills" value={skills.length} icon={<Zap size={18} />} />
                <StatCard label="Active" value={skills.filter((s) => s.status === 'active').length} icon={<Zap size={18} />} />
                <StatCard
                    label="Total Runs"
                    value={skills.reduce((s, sk) => s + sk.run_count, 0)}
                    icon={<Activity size={18} />}
                />
            </div>

            <Card className="!p-0 overflow-hidden">
                {loading ? (
                    <div className="p-6"><SkeletonLoader variant="row" count={6} /></div>
                ) : skills.length === 0 ? (
                    <EmptyState
                        icon={<Zap size={24} />}
                        title="No skills found"
                        description="Skills will appear once agents are configured."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Agent</th>
                                    <th>Category</th>
                                    <th>Runs</th>
                                    <th>Last Run</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map((skill) => (
                                    <tr key={skill.id}>
                                        <td className="font-medium text-navy">{skill.name}</td>
                                        <td>{skill.agent?.name || 'Unknown'}</td>
                                        <td>
                                            <span className="text-[11px] text-charcoal bg-light-gray/60 px-2 py-0.5 rounded capitalize">
                                                {skill.category}
                                            </span>
                                        </td>
                                        <td className="font-medium">{skill.run_count}</td>
                                        <td className="text-xs text-charcoal">
                                            {skill.last_run
                                                ? new Date(skill.last_run).toLocaleDateString()
                                                : 'Never'}
                                        </td>
                                        <td><StatusBadge status={skill.status} size="sm" /></td>
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
