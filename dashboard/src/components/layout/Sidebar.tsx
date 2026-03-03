import { NavLink, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    TrendingUp,
    Megaphone,
    DollarSign,
    Server,
    Users,
} from 'lucide-react'

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Command Centre' },
    { to: '/sales', icon: TrendingUp, label: 'Sales' },
    { to: '/marketing', icon: Megaphone, label: 'Marketing' },
    { to: '/finance', icon: DollarSign, label: 'Finance' },
    { to: '/infra', icon: Server, label: 'Infrastructure' },
    { to: '/hr', icon: Users, label: 'HR & Compliance' },
]

export default function Sidebar() {
    const location = useLocation()

    return (
        <aside className="w-[240px] h-screen bg-navy flex flex-col flex-shrink-0 overflow-y-auto">
            {/* Logo */}
            <div className="px-5 py-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center">
                    <span className="text-white font-bold text-sm">RH</span>
                </div>
                <div>
                    <div className="text-white font-bold text-[15px] leading-tight">RiteHire</div>
                    <div className="text-[10px] font-medium tracking-[0.15em] text-charcoal uppercase">
                        Agentic OS
                    </div>
                </div>
            </div>

            {/* Department label */}
            <div className="px-5 pb-2">
                <div className="text-[10px] font-semibold tracking-[0.15em] text-charcoal uppercase">
                    Departments
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 pb-6 space-y-0.5">
                {navItems.map((item) => {
                    const isActive =
                        item.to === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(item.to)

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                                    ? 'bg-white/10 text-white border-l-2 border-teal pl-[10px]'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-teal/20 flex items-center justify-center">
                        <span className="text-teal text-xs font-semibold">N</span>
                    </div>
                    <div>
                        <div className="text-white text-xs font-medium">Nabeel</div>
                        <div className="text-charcoal text-[10px]">Founder</div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
