import { useTasks } from '../../hooks/useTasks'
import Card, { CardHeader } from './Card'
import StatusBadge from './StatusBadge'
import SkeletonLoader from './SkeletonLoader'
import EmptyState from './EmptyState'
import Button from './Button'
import { CheckCircle2, XCircle, Edit3, Zap } from 'lucide-react'

interface ApprovalQueueProps {
    compact?: boolean
    title?: string
    limit?: number
}

export default function ApprovalQueue({ compact = false, title = 'Pending Approvals', limit = 5 }: ApprovalQueueProps) {
    const { tasks, loading } = useTasks()

    // Show high-priority pending tasks as approval items
    const pendingTasks = tasks
        .filter((t) => t.status === 'todo' && (t.priority === 'P0 - Critical' || t.priority === 'P1 - High'))
        .slice(0, limit)

    return (
        <Card compact={compact}>
            <CardHeader
                title={title}
                icon={<Zap size={16} />}
                subtitle={`${pendingTasks.length} item${pendingTasks.length !== 1 ? 's' : ''} awaiting review`}
            />

            {loading ? (
                <SkeletonLoader variant="row" count={3} />
            ) : pendingTasks.length === 0 ? (
                <EmptyState
                    icon={<CheckCircle2 size={20} />}
                    title="All clear"
                    description="No items awaiting your approval right now."
                />
            ) : (
                <div className="space-y-2">
                    {pendingTasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex items-start gap-3 p-3 rounded-xl bg-surface hover:bg-light-gray/30 transition-colors"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-navy truncate">{task.title}</div>
                                {task.description && (
                                    <div className="text-xs text-charcoal mt-0.5 line-clamp-1">{task.description}</div>
                                )}
                                <div className="flex items-center gap-2 mt-1.5">
                                    <StatusBadge status={task.priority} size="sm" />
                                    {task.agent && (
                                        <span className="text-[11px] text-charcoal">{task.agent.name}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <Button variant="primary" size="sm" icon={<CheckCircle2 size={12} />}>
                                    Approve
                                </Button>
                                <Button variant="ghost" size="sm" icon={<Edit3 size={12} />}>
                                    Edit
                                </Button>
                                <Button variant="ghost" size="sm" icon={<XCircle size={12} />}>
                                    Reject
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    )
}
