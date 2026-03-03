import { useTasks } from '../../hooks/useTasks'
import Card, { CardHeader } from './Card'
import StatusBadge from './StatusBadge'
import SkeletonLoader from './SkeletonLoader'
import EmptyState from './EmptyState'
import {
    ListTodo,
    AlertTriangle,
    ArrowRight,
    CalendarDays,
} from 'lucide-react'
import type { Task } from '../../lib/types'

interface DepartmentTasksProps {
    /** Agent names that belong to this department (partial match) */
    agentNames: string[]
    /** Title override */
    title?: string
}

function getNextStep(task: Task): string {
    switch (task.status) {
        case 'blocked':
            return task.blocker_path || 'Resolve blocker'
        case 'todo':
            return 'Start task'
        case 'in_progress':
            return task.description
                ? task.description.split('.')[0].slice(0, 80) + (task.description.length > 80 ? '…' : '')
                : 'Continue work'
        case 'done':
            return 'Completed'
        case 'cancelled':
            return 'Cancelled'
        default:
            return '—'
    }
}

export default function DepartmentTasks({ agentNames, title }: DepartmentTasksProps) {
    const { tasks, loading } = useTasks()

    // Filter tasks by agent name match
    const deptTasks = tasks.filter((t) => {
        if (!t.agent) return false
        const name = t.agent.name.toLowerCase()
        return agentNames.some((n) => name.includes(n.toLowerCase()))
    })

    // Sort: blocked → in_progress → todo → done → cancelled
    const sortedTasks = [...deptTasks].sort((a, b) => {
        const order: Record<string, number> = {
            blocked: 0,
            in_progress: 1,
            todo: 2,
            done: 3,
            cancelled: 4,
        }
        return (order[a.status] ?? 5) - (order[b.status] ?? 5)
    })

    const blockedCount = deptTasks.filter((t) => t.status === 'blocked').length
    const inProgressCount = deptTasks.filter((t) => t.status === 'in_progress').length
    const todoCount = deptTasks.filter((t) => t.status === 'todo').length

    if (loading) {
        return (
            <Card>
                <SkeletonLoader variant="row" count={4} />
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader
                title={title || 'Department Tasks'}
                subtitle={`${deptTasks.length} task${deptTasks.length !== 1 ? 's' : ''}`}
                action={
                    deptTasks.length > 0 ? (
                        <div className="flex items-center gap-3 text-[11px] font-medium text-charcoal/50">
                            {inProgressCount > 0 && (
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-status-pending" /> {inProgressCount} active
                                </span>
                            )}
                            {blockedCount > 0 && (
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-status-blocked" /> {blockedCount} blocked
                                </span>
                            )}
                            {todoCount > 0 && (
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-status-pending opacity-50" /> {todoCount} todo
                                </span>
                            )}
                        </div>
                    ) : undefined
                }
            />

            {deptTasks.length === 0 ? (
                <EmptyState
                    icon={<ListTodo size={20} />}
                    title="No tasks for this department"
                    description="Tasks assigned to this department's agents will appear here."
                />
            ) : (
                <div>
                    {/* Table header */}
                    <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-surface/50 rounded-lg mb-1 text-[10px] font-semibold text-charcoal/50 uppercase tracking-wider">
                        <div className="col-span-3">Task</div>
                        <div className="col-span-2">Owner</div>
                        <div className="col-span-1">Priority</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-3">Next Step</div>
                        <div className="col-span-2">Blocker</div>
                    </div>

                    {/* Task rows */}
                    <div className="space-y-0.5">
                        {sortedTasks.map((task) => (
                            <div
                                key={task.id}
                                className={`
                                    grid grid-cols-12 gap-2 px-4 py-2.5 rounded-lg items-center
                                    hover:bg-surface/40 transition-colors
                                    ${task.status === 'blocked' ? 'bg-red-50/30' : ''}
                                    ${task.status === 'done' || task.status === 'cancelled' ? 'opacity-50' : ''}
                                `}
                            >
                                {/* Task */}
                                <div className="col-span-3 min-w-0">
                                    <div className="text-[13px] font-medium text-navy truncate">
                                        {task.title}
                                    </div>
                                    {task.due_date && (
                                        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-charcoal/50">
                                            <CalendarDays size={10} />
                                            {new Date(task.due_date).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Owner */}
                                <div className="col-span-2 flex items-center gap-1.5 min-w-0">
                                    <div className="w-5 h-5 rounded-full bg-navy/8 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[8px] font-bold text-navy">
                                            {(task.agent?.name || '?').slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-xs text-navy truncate">
                                        {task.agent?.name || 'Unassigned'}
                                    </span>
                                </div>

                                {/* Priority */}
                                <div className="col-span-1">
                                    <StatusBadge status={task.priority} size="sm" />
                                </div>

                                {/* Status */}
                                <div className="col-span-1">
                                    <StatusBadge status={task.status} size="sm" />
                                </div>

                                {/* Next Step */}
                                <div className="col-span-3 min-w-0">
                                    <div className="flex items-start gap-1">
                                        {task.status !== 'done' && task.status !== 'cancelled' && (
                                            <ArrowRight size={11} className="text-teal flex-shrink-0 mt-0.5" />
                                        )}
                                        <span className="text-xs text-charcoal line-clamp-2">
                                            {getNextStep(task)}
                                        </span>
                                    </div>
                                </div>

                                {/* Blocker */}
                                <div className="col-span-2 min-w-0">
                                    {task.status === 'blocked' && task.blocker_path ? (
                                        <div className="flex items-start gap-1">
                                            <AlertTriangle size={11} className="text-status-blocked flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-status-blocked font-medium line-clamp-2">
                                                {task.blocker_path}
                                            </span>
                                        </div>
                                    ) : task.status === 'blocked' ? (
                                        <span className="text-xs text-status-blocked font-medium">Blocked</span>
                                    ) : (
                                        <span className="text-xs text-charcoal/30">—</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    )
}
