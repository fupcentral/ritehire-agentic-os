import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Card, { CardHeader } from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import StatCard from '../components/ui/StatCard'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import { useTasks } from '../hooks/useTasks'
import { useEpics } from '../hooks/useEpics'
import { useAgents } from '../hooks/useAgents'
import type { Task, Epic } from '../lib/types'
import {
    ListTodo,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Search,
    Target,
    ChevronDown,
    ChevronRight,
    User,
    ExternalLink,
    TrendingUp,
    Megaphone,
    DollarSign,
    Server,
    Users,
    LayoutDashboard,
} from 'lucide-react'

/* ============================================================
   DEPARTMENT MAPPING
   ============================================================ */
interface Department {
    key: string
    label: string
    route: string
    icon: typeof LayoutDashboard
    color: string
    agentNames: string[]
}

const DEPARTMENTS: Department[] = [
    {
        key: 'sales',
        label: 'Sales',
        route: '/sales',
        icon: TrendingUp,
        color: 'text-blue-500 bg-blue-50',
        agentNames: ['cro', 'chief revenue', 'linkedin outbound', 'email outbound'],
    },
    {
        key: 'marketing',
        label: 'Marketing',
        route: '/marketing',
        icon: Megaphone,
        color: 'text-purple-500 bg-purple-50',
        agentNames: ['cdo', 'chief design', 'brand'],
    },
    {
        key: 'finance',
        label: 'Finance',
        route: '/finance',
        icon: DollarSign,
        color: 'text-amber-500 bg-amber-50',
        agentNames: ['cfo', 'chief financial'],
    },
    {
        key: 'infra',
        label: 'Infrastructure',
        route: '/infra',
        icon: Server,
        color: 'text-teal bg-teal/8',
        agentNames: ['admin', 'ops', 'admin & ops'],
    },
    {
        key: 'hr',
        label: 'HR & Compliance',
        route: '/hr',
        icon: Users,
        color: 'text-pink-500 bg-pink-50',
        agentNames: ['legal', 'compliance'],
    },
]

function getDepartment(task: Task): Department | null {
    if (!task.agent) return null
    const name = task.agent.name.toLowerCase()
    const role = (task.agent.role || '').toLowerCase()
    for (const dept of DEPARTMENTS) {
        if (dept.agentNames.some((n) => name.includes(n) || role.includes(n))) {
            return dept
        }
    }
    return null
}

/* ============================================================
   PRIORITY ORDER
   ============================================================ */
const PRIORITY_ORDER: Record<string, number> = {
    'P0 - Critical': 0,
    'P1 - High': 1,
    'P2 - Medium': 2,
    'P3 - Low': 3,
}
const STATUS_ORDER: Record<string, number> = {
    blocked: 0,
    in_progress: 1,
    todo: 2,
    done: 3,
    cancelled: 4,
}

function sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
        // Status first (blocked > in_progress > todo > done)
        const statusDiff = (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
        if (statusDiff !== 0) return statusDiff
        // Then priority (P0 > P1 > P2 > P3)
        const prioDiff = (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9)
        if (prioDiff !== 0) return prioDiff
        // Then by due date (earliest first)
        if (a.due_date && b.due_date) return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        if (a.due_date) return -1
        if (b.due_date) return 1
        return 0
    })
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function TaskBoard() {
    const [viewMode, setViewMode] = useState<'department' | 'epic'>('department')
    const [statusFilter, setStatusFilter] = useState('')
    const [agentFilter, setAgentFilter] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const { tasks, loading } = useTasks({
        status: statusFilter || undefined,
        agentId: agentFilter || undefined,
    })
    const { epics, loading: epicsLoading } = useEpics()
    const { agents } = useAgents()

    const filteredTasks = useMemo(() => {
        let result = tasks
        if (searchTerm) {
            const q = searchTerm.toLowerCase()
            result = result.filter(
                (t) =>
                    t.title.toLowerCase().includes(q) ||
                    (t.description || '').toLowerCase().includes(q) ||
                    (t.agent?.name || '').toLowerCase().includes(q)
            )
        }
        return sortTasks(result)
    }, [tasks, searchTerm])

    const todoCount = tasks.filter((t) => t.status === 'todo').length
    const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length
    const blockedCount = tasks.filter((t) => t.status === 'blocked').length
    const doneCount = tasks.filter((t) => t.status === 'done').length

    // Group tasks by department
    const tasksByDept = useMemo(() => {
        const map: Record<string, Task[]> = {}
        const unassigned: Task[] = []
        for (const task of filteredTasks) {
            const dept = getDepartment(task)
            if (dept) {
                if (!map[dept.key]) map[dept.key] = []
                map[dept.key].push(task)
            } else {
                unassigned.push(task)
            }
        }
        return { departments: map, unassigned }
    }, [filteredTasks])

    // Group tasks by epic
    const tasksByEpic = useMemo(() => {
        const map: Record<string, Task[]> = {}
        const unassigned: Task[] = []
        for (const task of filteredTasks) {
            if (task.epic_id) {
                if (!map[task.epic_id]) map[task.epic_id] = []
                map[task.epic_id].push(task)
            } else {
                unassigned.push(task)
            }
        }
        return { epics: map, unassigned }
    }, [filteredTasks])

    return (
        <div className="space-y-6 fade-in">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Task Board</h1>
                    <p className="text-sm text-charcoal mt-1">All tasks across agents, departments, and epics.</p>
                </div>
                {/* View mode toggle */}
                <div className="flex bg-surface rounded-xl p-0.5 border border-light-gray/60">
                    <button
                        onClick={() => setViewMode('department')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'department'
                                ? 'bg-white text-navy shadow-sm'
                                : 'text-charcoal hover:text-navy'
                            }`}
                    >
                        By Department
                    </button>
                    <button
                        onClick={() => setViewMode('epic')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'epic'
                                ? 'bg-white text-navy shadow-sm'
                                : 'text-charcoal hover:text-navy'
                            }`}
                    >
                        By Epic
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="To Do" value={todoCount} icon={<Clock size={18} />} />
                <StatCard label="In Progress" value={inProgressCount} icon={<ListTodo size={18} />} />
                <StatCard label="Blocked" value={blockedCount} icon={<AlertTriangle size={18} />} />
                <StatCard label="Done" value={doneCount} icon={<CheckCircle2 size={18} />} />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/50" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input pl-9"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input w-auto"
                >
                    <option value="">All Statuses</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="done">Done</option>
                    <option value="cancelled">Cancelled</option>
                </select>
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
            </div>

            {loading ? (
                <SkeletonLoader variant="card" count={3} />
            ) : viewMode === 'department' ? (
                <DepartmentView
                    tasksByDept={tasksByDept.departments}
                    unassigned={tasksByDept.unassigned}
                />
            ) : (
                <EpicView
                    tasksByEpic={tasksByEpic.epics}
                    epics={epics}
                    unassigned={tasksByEpic.unassigned}
                />
            )}
        </div>
    )
}

/* ============================================================
   DEPARTMENT VIEW
   ============================================================ */
function DepartmentView({
    tasksByDept,
    unassigned,
}: {
    tasksByDept: Record<string, Task[]>
    unassigned: Task[]
}) {
    return (
        <div className="space-y-4">
            {DEPARTMENTS.map((dept) => {
                const tasks = tasksByDept[dept.key]
                if (!tasks || tasks.length === 0) return null
                const pendingCount = tasks.filter((t) => t.status === 'todo' || t.status === 'in_progress' || t.status === 'blocked').length
                return (
                    <DepartmentSection
                        key={dept.key}
                        department={dept}
                        tasks={tasks}
                        pendingCount={pendingCount}
                    />
                )
            })}

            {unassigned.length > 0 && (
                <Card className="!p-0 overflow-hidden">
                    <div className="px-5 py-4 border-b border-light-gray/60 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-charcoal/8 flex items-center justify-center">
                            <LayoutDashboard size={14} className="text-charcoal" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-navy">Unassigned</h3>
                            <p className="text-xs text-charcoal">{unassigned.length} tasks with no department mapping</p>
                        </div>
                    </div>
                    <div className="px-5 py-3 space-y-2">
                        {unassigned.map((task) => (
                            <TaskCard key={task.id} task={task} showDepartment={false} />
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
}

function DepartmentSection({
    department,
    tasks,
    pendingCount,
}: {
    department: Department
    tasks: Task[]
    pendingCount: number
}) {
    const [expanded, setExpanded] = useState(true)
    const navigate = useNavigate()
    const Icon = department.icon
    const [iconColor, iconBg] = department.color.split(' ')

    return (
        <Card className="!p-0 overflow-hidden">
            {/* Department header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-light-gray/60">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-charcoal/40 hover:text-charcoal transition-colors"
                >
                    {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} className={iconColor} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-navy">{department.label}</h3>
                        {pendingCount > 0 && (
                            <span className="text-[11px] font-semibold text-white bg-amber-500 px-1.5 py-0.5 rounded-md">
                                {pendingCount} pending
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-charcoal">{tasks.length} tasks total</p>
                </div>
                <button
                    onClick={() => navigate(department.route)}
                    className="flex items-center gap-1 text-xs font-medium text-teal hover:text-teal/80 transition-colors"
                >
                    Open {department.label}
                    <ExternalLink size={12} />
                </button>
            </div>

            {/* Tasks */}
            {expanded && (
                <div className="px-5 py-3 space-y-2">
                    {tasks.map((task, idx) => (
                        <TaskCard key={task.id} task={task} showDepartment={false} index={idx + 1} />
                    ))}
                </div>
            )}
        </Card>
    )
}

/* ============================================================
   EPIC VIEW
   ============================================================ */
function EpicView({
    tasksByEpic,
    epics,
    unassigned,
}: {
    tasksByEpic: Record<string, Task[]>
    epics: Epic[]
    unassigned: Task[]
}) {
    return (
        <div className="space-y-4">
            {epics.map((epic) => {
                const tasks = tasksByEpic[epic.id]
                if (!tasks || tasks.length === 0) return null
                return <EpicSection key={epic.id} epic={epic} tasks={tasks} />
            })}

            {unassigned.length > 0 && (
                <Card className="!p-0 overflow-hidden">
                    <div className="px-5 py-4 border-b border-light-gray/60 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-charcoal/8 flex items-center justify-center">
                            <ListTodo size={14} className="text-charcoal" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-navy">No Epic</h3>
                            <p className="text-xs text-charcoal">{unassigned.length} tasks not linked to any epic</p>
                        </div>
                    </div>
                    <div className="px-5 py-3 space-y-2">
                        {unassigned.map((task, idx) => (
                            <TaskCard key={task.id} task={task} showDepartment index={idx + 1} />
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
}

function EpicSection({ epic, tasks }: { epic: Epic; tasks: Task[] }) {
    const [expanded, setExpanded] = useState(true)

    const doneCount = tasks.filter((t) => t.status === 'done').length
    const pendingCount = tasks.filter((t) => t.status === 'todo' || t.status === 'in_progress' || t.status === 'blocked').length
    const progressPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : epic.completion_pct

    return (
        <Card className="!p-0 overflow-hidden">
            {/* Epic header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface/50 transition-colors text-left cursor-pointer border-b border-light-gray/60"
            >
                <div className="text-charcoal/40">
                    {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
                <div className="w-9 h-9 rounded-xl bg-teal/8 flex items-center justify-center flex-shrink-0">
                    <Target size={16} className="text-teal" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-navy">{epic.title}</span>
                        <StatusBadge status={epic.status} size="sm" />
                        {pendingCount > 0 && (
                            <span className="text-[11px] font-semibold text-white bg-amber-500 px-1.5 py-0.5 rounded-md">
                                {pendingCount} pending
                            </span>
                        )}
                    </div>
                    {epic.description && (
                        <div className="text-xs text-charcoal mt-0.5 line-clamp-1">{epic.description}</div>
                    )}
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                        <div className="text-xs font-medium text-charcoal">{tasks.length} tasks</div>
                        <div className="text-[11px] text-charcoal/60">{doneCount} done</div>
                    </div>
                    <div className="w-10 h-10 relative">
                        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                            <path
                                d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 0 1 0-31"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 0 1 0-31"
                                fill="none"
                                stroke="#009886"
                                strokeWidth="3"
                                strokeDasharray={`${progressPct} ${100 - progressPct}`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-navy">
                            {progressPct}%
                        </span>
                    </div>
                </div>
            </button>

            {/* Task list */}
            {expanded && (
                <div className="px-5 py-3 space-y-2">
                    {tasks.map((task, idx) => (
                        <TaskCard key={task.id} task={task} showDepartment index={idx + 1} />
                    ))}
                </div>
            )}
        </Card>
    )
}

/* ============================================================
   TASK CARD — individual detailed task object
   ============================================================ */
function TaskCard({
    task,
    showDepartment = true,
    index,
}: {
    task: Task
    showDepartment?: boolean
    index?: number
}) {
    const navigate = useNavigate()
    const dept = getDepartment(task)

    const isDone = task.status === 'done' || task.status === 'cancelled'

    return (
        <div className={`flex items-start gap-3 p-3.5 rounded-xl transition-colors ${isDone ? 'bg-surface/60 opacity-60' : 'bg-surface hover:bg-light-gray/30'
            }`}>
            {/* Sequence number */}
            {index !== undefined && (
                <span className="text-[10px] font-bold text-charcoal/30 mt-1 w-4 text-right flex-shrink-0">
                    {index}
                </span>
            )}

            {/* Status indicator */}
            <div className="flex-shrink-0 mt-0.5">
                {task.status === 'done' ? (
                    <CheckCircle2 size={16} className="text-teal" />
                ) : task.status === 'blocked' ? (
                    <AlertTriangle size={16} className="text-red-500" />
                ) : task.status === 'in_progress' ? (
                    <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                ) : (
                    <Clock size={16} className="text-charcoal/40" />
                )}
            </div>

            {/* Task info */}
            <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-navy">{task.title}</div>
                {task.description && (
                    <div className="text-xs text-charcoal mt-0.5 line-clamp-2 leading-relaxed">{task.description}</div>
                )}
                {task.blocker_path && task.status === 'blocked' && (
                    <div className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertTriangle size={10} />
                        Blocker: {task.blocker_path}
                    </div>
                )}
            </div>

            {/* Agent */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-navy/8 flex items-center justify-center">
                    {task.agent ? (
                        <span className="text-[9px] font-bold text-navy">
                            {task.agent.name.slice(0, 2).toUpperCase()}
                        </span>
                    ) : (
                        <User size={10} className="text-charcoal/40" />
                    )}
                </div>
                <span className="text-[11px] text-charcoal font-medium max-w-[90px] truncate">
                    {task.agent?.name || 'Unassigned'}
                </span>
            </div>

            {/* Department link */}
            {showDepartment && dept && (
                <button
                    onClick={() => navigate(dept.route)}
                    className="flex items-center gap-1 text-[10px] font-medium text-teal bg-teal/5 hover:bg-teal/10 px-2 py-0.5 rounded-full transition-colors flex-shrink-0"
                >
                    {dept.label}
                    <ExternalLink size={8} />
                </button>
            )}

            {/* Priority */}
            <div className="flex-shrink-0">
                <StatusBadge status={task.priority} size="sm" />
            </div>

            {/* Status */}
            <div className="flex-shrink-0">
                <StatusBadge status={task.status} size="sm" />
            </div>

            {/* Due date */}
            {task.due_date && (
                <span className="text-[10px] text-charcoal flex-shrink-0 whitespace-nowrap">
                    {new Date(task.due_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
            )}
        </div>
    )
}
