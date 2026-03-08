import { NavLink, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    TrendingUp,
    Megaphone,
    DollarSign,
    Server,
    Users,
    ListTodo,
    Bot,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const mainNav = [
    { to: '/', icon: LayoutDashboard, label: 'Command Centre' },
]

const departments = [
    { to: '/sales', icon: TrendingUp, label: 'Sales' },
    { to: '/marketing', icon: Megaphone, label: 'Marketing' },
    { to: '/finance', icon: DollarSign, label: 'Finance' },
    { to: '/infra', icon: Server, label: 'Infrastructure' },
    { to: '/hr', icon: Users, label: 'HR & Compliance' },
]

const tools = [
    { to: '/tasks', icon: ListTodo, label: 'Task Board' },
    { to: '/claude', icon: Bot, label: 'Claude Co-worker' },
]

function NavSection({ title, items, collapsed }: { title: string; items: typeof mainNav; collapsed: boolean }) {
    const location = useLocation()

    return (
        <div className="mb-2">
            {!collapsed && (
                <div className="px-6 pb-2 pt-4">
                    <div className="text-[10px] font-semibold tracking-[0.18em] text-white/25 uppercase">
                        {title}
                    </div>
                </div>
            )}
            <nav className="px-3 space-y-0.5">
                {items.map((item) => {
                    const isActive =
                        item.to === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(item.to)

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            title={collapsed ? item.label : undefined}
                            className={`
                                flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium
                                transition-all duration-200 relative group
                                ${isActive
                                    ? 'bg-white/[0.08] text-white shadow-sm'
                                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                                }
                            `}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-teal rounded-r-full" />
                            )}
                            <item.icon
                                size={18}
                                strokeWidth={isActive ? 2 : 1.5}
                                className={`flex-shrink-0 transition-colors ${isActive ? 'text-teal' : ''}`}
                            />
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    )
                })}
            </nav>
        </div>
    )
}

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside
            className={`${collapsed ? 'w-[72px]' : 'w-[260px]'} h-screen bg-navy flex flex-col flex-shrink-0 overflow-y-auto overflow-x-hidden relative transition-all duration-300`}
        >
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

            {/* Logo */}
            <div className="relative px-5 pt-7 pb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center shadow-lg shadow-teal/20 flex-shrink-0">
                    <span className="text-white font-bold text-sm tracking-tight">RH</span>
                </div>
                {!collapsed && (
                    <div>
                        <div className="text-white font-bold text-base leading-tight tracking-tight">RiteHire</div>
                        <div className="text-[10px] font-semibold tracking-[0.2em] text-white/30 uppercase mt-0.5">
                            Agentic OS
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Sections */}
            <div className="relative flex-1">
                <NavSection title="" items={mainNav} collapsed={collapsed} />
                <NavSection title="Departments" items={departments} collapsed={collapsed} />
                <NavSection title="Tools" items={tools} collapsed={collapsed} />
            </div>

            {/* Footer */}
            <div className="relative px-3 py-4 border-t border-white/[0.06]">
                <div className={`flex items-center gap-3 px-3 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal/30 to-teal/10 flex items-center justify-center ring-1 ring-teal/20 flex-shrink-0">
                        <span className="text-teal text-xs font-bold">N</span>
                    </div>
                    {!collapsed && (
                        <div>
                            <div className="text-white/90 text-[13px] font-medium">Nabeel</div>
                            <div className="text-white/25 text-[10px] font-medium">Founder</div>
                        </div>
                    )}
                </div>

                {/* Collapse button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="mt-3 w-full flex items-center justify-center p-1.5 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>
        </aside>
    )
}
