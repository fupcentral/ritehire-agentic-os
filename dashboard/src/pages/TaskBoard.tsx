import { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import Card from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import {
    ListTodo,
    Filter,
    ChevronDown,
    ChevronRight,
    AlertTriangle,
    ArrowRight,
    CalendarDays,
} from 'lucide-react'
import type { Task } from '../lib/types'

/* ============================================================
   DEPARTMENT MAPPING — Agent role → Department
   ============================================================ */
function getDepartment(agent?: { role: string; name: string } | null): string {
    if (!agent) return 'Unassigned'
    const role = agent.role.toLowerCase()
    const name = agent.name.toLowerCase()

    if (name.includes('ceo') || role.includes('executive')) return 'Executive'
    if (name.includes('cro') || role.includes('revenue')) return 'Sales'
    if (name.includes('linkedin') || name.includes('email') || name.includes('brand') || role.includes('gtm') || role.includes('brand') || role.includes('content'))
        return 'Marketing'
    if (name.includes('cfo') || role.includes('financial') || role.includes('finance'))
        return 'Finance'
    if (name.includes('cdo') || role.includes('design')) return 'Infrastructure'
    if (name.includes('legal') || role.includes('legal') || role.includes('compliance'))
        return 'HR & Compliance'
    if (name.includes('admin') || role.includes('operations') || role.includes('ops'))
        return 'Infrastructure'
    return 'Other'
}

const DEPARTMENT_ORDER = [
    'Executive',
    'Sales',
    'Marketing',
    'Finance',
    'Infrastructure',
    'HR & Compliance',
    'Other',
    'Unassigned',
]

const DEPARTMENT_COLORS: Record<string, string> = {
    Executive: 'from-violet-500/10 to-violet-500/5 border-violet-500/20',
    Sales: 'from-blue-500/10 to-blue-500/5 border-blue-500/20',
    Marketing: 'from-pink-500/10 to-pink-500/5 border-pink-500/20',
    Finance: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
    Infrastructure: 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
    'HR & Compliance': 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20',
    Other: 'from-gray-500/10 to-gray-500/5 border-gray-500/20',
    Unassigned: 'from-gray-400/10 to-gray-400/5 border-gray-400/20',
}

const STATUS_FILTERS: Task['status'][] = ['todo', 'in_progress', 'blocked', 'done', 'cancelled']

/* ============================================================
   NEXT STEP — derive from status / blocker / description
   ============================================================ */
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

/* ============================================================
   COMPONENT
   ============================================================ */
export default function TaskBoard() {
    const { tasks, loading } = useTasks()
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [collapsedDepts, setCollapsedDepts] = useState<Set<string>>(new Set())

    // Apply filter
    const filtered = statusFilter === 'all'
        ? tasks
        : tasks.filter((t) => t.status === statusFilter)

    // Group by department
    const grouped = DEPARTMENT_ORDER.reduce<Record<string, Task[]>>((acc, dept) => {
        const deptTasks = filtered.filter((t) => getDepartment(t.agent) === dept)
        if (deptTasks.length > 0) acc[dept] = deptTasks
        return acc
    }, {})

    const toggleDept = (dept: string) => {
        setCollapsedDepts((prev) => {
            const next = new Set(prev)
            next.has(dept) ? next.delete(dept) : next.add(dept)
            return next
        })
    }

    // Stats
    const totalTasks = tasks.length
    const blockedCount = tasks.filter((t) => t.status === 'blocked').length
    const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length
    const doneCount = tasks.filter((t) => t.status === 'done').length

    return (
        <div className="space-y-6 fade-in">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Task Board</h1>
                    <p className="text-sm text-charcoal/60 mt-1">
                        All tasks organized by department, with status and ownership.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-charcoal/50">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-status-pending" /> {inProgressCount} In Progress
                        </span>
                        <span className="mx-1">·</span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-status-blocked" /> {blockedCount} Blocked
                        </span>
                        <span className="mx-1">·</span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-status-active" /> {doneCount} Done
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
                <Filter size={14} className="text-charcoal/40" />
                <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${statusFilter === 'all'
                        ? 'bg-navy text-white'
                        : 'bg-surface text-charcoal hover:bg-light-gray'
                        }`}
                >
                    All ({totalTasks})
                </button>
                {STATUS_FILTERS.map((s) => {
                    const count = tasks.filter((t) => t.status === s).length
                    if (count === 0) return null
                    return (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer capitalize ${statusFilter === s
                                ? 'bg-navy text-white'
                                : 'bg-surface text-charcoal hover:bg-light-gray'
                                }`}
                        >
                            {s.replace(/_/g, ' ')} ({count})
                        </button>
                    )
                })}
            </div>

            {/* Task list by department */}
            {loading ? (
                <Card>
                    <SkeletonLoader variant="row" count={8} />
                </Card>
            ) : filtered.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={<ListTodo size={24} />}
                        title="No tasks found"
                        description={statusFilter === 'all' ? 'No tasks in the system yet.' : `No tasks with status "${statusFilter.replace(/_/g, ' ')}".`}
                    />
                </Card>
            ) : (
                <div className="space-y-4">
                    {Object.entries(grouped).map(([dept, deptTasks]) => {
                        const isCollapsed = collapsedDepts.has(dept)
                        const colorClass = DEPARTMENT_COLORS[dept] || DEPARTMENT_COLORS['Other']

                        return (
                            <div key={dept} className="rounded-xl overflow-hidden border border-light-gray/60 bg-white shadow-sm">
                                {/* Department header */}
                                <button
                                    onClick={() => toggleDept(dept)}
                                    className={`
                                        w-full flex items-center justify-between px-5 py-3.5
                                        bg-gradient-to-r ${colorClass} border-b
                                        cursor-pointer transition-colors hover:brightness-95
                                    `}
                                >
                                    <div className="flex items-center gap-2.5">
                                        {isCollapsed ? (
                                            <ChevronRight size={16} className="text-charcoal/60" />
                                        ) : (
                                            <ChevronDown size={16} className="text-charcoal/60" />
                                        )}
                                        <span className="text-[13px] font-bold text-navy tracking-tight">
                                            {dept}
                                        </span>
                                        <span className="text-[11px] text-charcoal/50 font-medium bg-white/60 px-2 py-0.5 rounded-full">
                                            {deptTasks.length} task{deptTasks.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {deptTasks.filter((t) => t.status === 'blocked').length > 0 && (
                                            <span className="flex items-center gap-1 text-[10px] text-status-blocked font-semibold">
                                                <AlertTriangle size={12} />
                                                {deptTasks.filter((t) => t.status === 'blocked').length} blocked
                                            </span>
                                        )}
                                    </div>
                                </button>

                                {/* Task rows */}
                                {!isCollapsed && (
                                    <div>
                                        {/* Table header */}
                                        <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-surface/50 border-b border-light-gray/30 text-[10px] font-semibold text-charcoal/50 uppercase tracking-wider">
                                            <div className="col-span-3">Task</div>
                                            <div className="col-span-2">Responsible</div>
                                            <div className="col-span-1">Priority</div>
                                            <div className="col-span-1">Status</div>
                                            <div className="col-span-3">Next Step</div>
                                            <div className="col-span-2">Blocker</div>
                                        </div>

                                        {/* Rows */}
                                        {deptTasks
                                            .sort((a, b) => {
                                                // Sort: blocked first, then in_progress, then todo, then done
                                                const order: Record<string, number> = {
                                                    blocked: 0,
                                                    in_progress: 1,
                                                    todo: 2,
                                                    done: 3,
                                                    cancelled: 4,
                                                }
                                                return (order[a.status] ?? 5) - (order[b.status] ?? 5)
                                            })
                                            .map((task) => (
                                                <div
                                                    key={task.id}
                                                    className={`
                                                        grid grid-cols-12 gap-2 px-5 py-3 items-center
                                                        border-b border-light-gray/20 last:border-b-0
                                                        hover:bg-surface/40 transition-colors
                                                        ${task.status === 'blocked' ? 'bg-red-50/30' : ''}
                                                        ${task.status === 'done' ? 'opacity-60' : ''}
                                                    `}
                                                >
                                                    {/* Task name */}
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
                                                                    year: 'numeric',
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Responsible */}
                                                    <div className="col-span-2 flex items-center gap-2 min-w-0">
                                                        <div className="w-6 h-6 rounded-full bg-navy/8 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-[9px] font-bold text-navy">
                                                                {(task.agent?.name || '?').slice(0, 2).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-navy font-medium truncate">
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
                                                        <div className="flex items-start gap-1.5">
                                                            {task.status !== 'done' && task.status !== 'cancelled' && (
                                                                <ArrowRight size={12} className="text-teal flex-shrink-0 mt-0.5" />
                                                            )}
                                                            <span className="text-xs text-charcoal line-clamp-2">
                                                                {getNextStep(task)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Blocker */}
                                                    <div className="col-span-2 min-w-0">
                                                        {task.status === 'blocked' && task.blocker_path ? (
                                                            <div className="flex items-start gap-1.5">
                                                                <AlertTriangle size={12} className="text-status-blocked flex-shrink-0 mt-0.5" />
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
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
