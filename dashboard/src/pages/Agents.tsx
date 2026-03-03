import { useState } from 'react'
import { useAgents } from '../hooks/useAgents'
import { useTasks } from '../hooks/useTasks'
import { useActivityLog } from '../hooks/useActivityLog'
import StatusBadge from '../components/ui/StatusBadge'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import Drawer from '../components/ui/Drawer'
import { Bot, GitBranch, Zap, ListTodo } from 'lucide-react'
import type { Agent } from '../lib/types'

export default function Agents() {
    const { agents, loading } = useAgents()
    const { tasks } = useTasks()
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

    const { entries: agentActivity } = useActivityLog(
        selectedAgent ? { agentFilter: selectedAgent.id, limit: 20 } : { limit: 0 }
    )

    // Build hierarchy
    const topLevel = agents.filter((a) => !a.reporting_to)
    const getChildren = (parentId: string) => agents.filter((a) => a.reporting_to === parentId)
    const getTaskCount = (agentId: string) => tasks.filter((t) => t.agent_id === agentId).length

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-navy">Agents</h1>
                <p className="text-sm text-charcoal mt-0.5">All 9 agents — status, skills, and tasks</p>
            </div>

            {/* Agent Hierarchy */}
            {loading ? (
                <SkeletonLoader variant="card" count={3} />
            ) : agents.length === 0 ? (
                <div className="card">
                    <EmptyState icon={Bot} title="No agents found" description="Connect your Supabase project to see agents." />
                </div>
            ) : (
                <>
                    {/* Hierarchy Tree */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-4">
                            <GitBranch size={16} className="text-teal" />
                            <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">Agent Hierarchy</h2>
                        </div>
                        <div className="space-y-1">
                            {topLevel.map((agent) => (
                                <HierarchyNode
                                    key={agent.id}
                                    agent={agent}
                                    getChildren={getChildren}
                                    getTaskCount={getTaskCount}
                                    onSelect={setSelectedAgent}
                                    depth={0}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Agent Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agents.map((agent) => (
                            <div
                                key={agent.id}
                                onClick={() => setSelectedAgent(agent)}
                                className="card hover:shadow-lg transition-shadow cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center">
                                            <span className="text-sm font-bold text-navy">
                                                {agent.name.slice(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-navy">{agent.name}</h3>
                                            <p className="text-xs text-charcoal">{agent.role}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={agent.status} size="sm" />
                                </div>

                                {agent.current_task && (
                                    <div className="flex items-start gap-2 mb-3 p-2 bg-surface rounded-lg">
                                        <ListTodo size={14} className="text-charcoal mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-navy">{agent.current_task}</p>
                                    </div>
                                )}

                                {/* Skills */}
                                {agent.skills && agent.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {agent.skills.map((skill) => (
                                            <span
                                                key={skill.skill_id}
                                                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-teal/10 text-teal border border-teal/20"
                                            >
                                                <Zap size={10} /> {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-charcoal pt-2 border-t border-light-gray">
                                    <span>{getTaskCount(agent.id)} tasks</span>
                                    {agent.reporting_to && (
                                        <span>Reports to: {agents.find((a) => a.id === agent.reporting_to)?.name || agent.reporting_to}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Agent Detail Drawer */}
            <Drawer
                open={!!selectedAgent}
                onClose={() => setSelectedAgent(null)}
                title={selectedAgent?.name || ''}
                width="max-w-2xl"
            >
                {selectedAgent && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-navy/5 flex items-center justify-center">
                                <span className="text-xl font-bold text-navy">{selectedAgent.name.slice(0, 2).toUpperCase()}</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-navy">{selectedAgent.name}</h3>
                                <p className="text-sm text-charcoal">{selectedAgent.role}</p>
                                <StatusBadge status={selectedAgent.status} />
                            </div>
                        </div>

                        {selectedAgent.current_task && (
                            <div className="p-3 bg-surface rounded-lg border border-light-gray">
                                <span className="text-xs font-semibold text-charcoal">Current Task</span>
                                <p className="text-sm text-navy mt-1">{selectedAgent.current_task}</p>
                            </div>
                        )}

                        {/* Skills */}
                        {selectedAgent.skills && selectedAgent.skills.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-navy mb-2">Skills</h4>
                                <div className="space-y-2">
                                    {selectedAgent.skills.map((skill) => (
                                        <div key={skill.skill_id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Zap size={14} className="text-teal" />
                                                <span className="text-sm font-medium text-navy">{skill.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-charcoal">{skill.run_count} runs</span>
                                                <StatusBadge status={skill.status} size="sm" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tasks */}
                        <div>
                            <h4 className="text-sm font-semibold text-navy mb-2">Tasks</h4>
                            {tasks.filter((t) => t.agent_id === selectedAgent.id).length === 0 ? (
                                <p className="text-sm text-charcoal py-4 text-center">No tasks assigned</p>
                            ) : (
                                <div className="space-y-2">
                                    {tasks
                                        .filter((t) => t.agent_id === selectedAgent.id)
                                        .slice(0, 10)
                                        .map((task) => (
                                            <div key={task.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-navy truncate">{task.title}</p>
                                                    <p className="text-xs text-charcoal mt-0.5 capitalize">{task.priority} priority</p>
                                                </div>
                                                <StatusBadge status={task.status} size="sm" />
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <h4 className="text-sm font-semibold text-navy mb-2">Recent Activity</h4>
                            {agentActivity.length === 0 ? (
                                <p className="text-sm text-charcoal py-4 text-center">No recent activity</p>
                            ) : (
                                <div className="space-y-2">
                                    {agentActivity.slice(0, 10).map((entry) => (
                                        <div key={entry.id} className="flex items-start gap-3 p-3 bg-surface rounded-lg">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-navy truncate">{entry.output_summary}</p>
                                                <p className="text-xs text-charcoal mt-0.5">
                                                    {entry.action_type.replace(/_/g, ' ')} · {new Date(entry.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <StatusBadge status={entry.status} size="sm" />
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

// Hierarchy tree node component
function HierarchyNode({
    agent,
    getChildren,
    getTaskCount,
    onSelect,
    depth,
}: {
    agent: Agent
    getChildren: (id: string) => Agent[]
    getTaskCount: (id: string) => number
    onSelect: (agent: Agent) => void
    depth: number
}) {
    const children = getChildren(agent.id)

    return (
        <div style={{ marginLeft: depth * 24 }}>
            <div
                onClick={() => onSelect(agent)}
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-surface cursor-pointer transition-colors"
            >
                <div className="w-7 h-7 rounded-md bg-navy/5 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-navy">{agent.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-navy">{agent.name}</span>
                <StatusBadge status={agent.status} size="sm" />
                <span className="text-xs text-charcoal ml-auto">{getTaskCount(agent.id)} tasks</span>
            </div>
            {children.map((child) => (
                <HierarchyNode
                    key={child.id}
                    agent={child}
                    getChildren={getChildren}
                    getTaskCount={getTaskCount}
                    onSelect={onSelect}
                    depth={depth + 1}
                />
            ))}
        </div>
    )
}
