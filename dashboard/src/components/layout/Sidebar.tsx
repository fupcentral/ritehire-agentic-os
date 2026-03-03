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
} from 'lucide-react'

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Command Centre' },
    { to: '/tasks', icon: ListTodo, label: 'Task Board' },
    { to: '/claude', icon: Bot, label: 'Claude Co-worker' },
    { to: '/sales', icon: TrendingUp, label: 'Sales' },
    { to: '/marketing', icon: Megaphone, label: 'Marketing' },
    { to: '/finance', icon: DollarSign, label: 'Finance' },
    { to: '/infra', icon: Server, label: 'Infrastructure' },
    { to: '/hr', icon: Users, label: 'HR & Compliance' },
]

export default function Sidebar() {
    const location = useLocation()

    return (
        <aside className="w-[260px] h-screen bg-navy flex flex-col flex-shrink-0 overflow-y-auto relative">
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

            {/* Logo */}
            <div className="relative px-6 pt-7 pb-8 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center shadow-lg shadow-teal/20">
                    <span className="text-white font-bold text-sm tracking-tight">RH</span>
                </div>
                <div>
                    <div className="text-white font-bold text-base leading-tight tracking-tight">RiteHire</div>
                    <div className="text-[10px] font-semibold tracking-[0.2em] text-white/30 uppercase mt-0.5">
                        Agentic OS
                    </div>
                </div>
            </div>

            {/* Department label */}
            <div className="relative px-6 pb-3">
                <div className="text-[10px] font-semibold tracking-[0.18em] text-white/25 uppercase">
                    Departments
                </div>
            </div>

            {/* Navigation */}
            <nav className="relative flex-1 px-3 pb-6 space-y-1">
                {navItems.map((item) => {
                    const isActive =
                        item.to === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(item.to)

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={`
                                flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium
                                transition-all duration-200 relative group
                                ${isActive
                                    ? 'bg-white/[0.08] text-white shadow-sm'
                                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                                }
                            `}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-teal rounded-r-full" />
                            )}
                            <item.icon
                                size={18}
                                strokeWidth={isActive ? 2 : 1.5}
                                className={`flex-shrink-0 transition-colors ${isActive ? 'text-teal' : ''}`}
                            />
                            <span>{item.label}</span>
                        </NavLink>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="relative px-4 py-5 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal/30 to-teal/10 flex items-center justify-center ring-1 ring-teal/20">
                        <span className="text-teal text-xs font-bold">N</span>
                    </div>
                    <div>
                        <div className="text-white/90 text-[13px] font-medium">Nabeel</div>
                        <div className="text-white/25 text-[10px] font-medium">Founder</div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
