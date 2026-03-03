import { NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
    LayoutDashboard,
    Activity,
    Bot,
    Linkedin,
    Mail,
    Kanban,
    Users,
    DollarSign,
    ChevronDown,
    ChevronRight,
} from 'lucide-react'

const navSections = [
    {
        label: 'AGENTS',
        items: [
            { to: '/', icon: LayoutDashboard, label: 'Executive' },
            { to: '/activity', icon: Activity, label: 'Actions' },
            { to: '/agents', icon: Bot, label: 'Agents' },
        ],
    },
    {
        label: 'GTM',
        expandable: true,
        items: [
            { to: '/gtm/linkedin', icon: Linkedin, label: 'LinkedIn' },
            { to: '/gtm/email', icon: Mail, label: 'Email' },
        ],
    },
    {
        label: null,
        items: [
            { to: '/pipeline', icon: Kanban, label: 'Pipeline' },
            { to: '/contacts', icon: Users, label: 'Contacts' },
            { to: '/finance', icon: DollarSign, label: 'Finance' },
        ],
    },
]

export default function Sidebar() {
    const location = useLocation()
    const [gtmOpen, setGtmOpen] = useState(
        location.pathname.startsWith('/gtm')
    )

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

            {/* Navigation */}
            <nav className="flex-1 px-3 pb-6 space-y-1">
                {navSections.map((section, sIdx) => (
                    <div key={sIdx} className="mb-2">
                        {/* Section label */}
                        {section.label && !section.expandable && (
                            <div className="px-3 py-2 text-[10px] font-semibold tracking-[0.15em] text-charcoal uppercase">
                                {section.label}
                            </div>
                        )}

                        {/* Expandable GTM header */}
                        {section.label && section.expandable && (
                            <button
                                onClick={() => setGtmOpen(!gtmOpen)}
                                className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-semibold
                  tracking-[0.15em] text-charcoal uppercase hover:text-white/60 transition-colors cursor-pointer"
                            >
                                <span>{section.label}</span>
                                {gtmOpen ? (
                                    <ChevronDown size={12} />
                                ) : (
                                    <ChevronRight size={12} />
                                )}
                            </button>
                        )}

                        {/* Items (conditionally hidden for GTM) */}
                        {(!section.expandable || gtmOpen) &&
                            section.items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.to === '/'}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive
                                            ? 'bg-white/10 text-white border-l-2 border-teal ml-0 pl-[10px]'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`
                                    }
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                    </div>
                ))}
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
