import { type ReactNode } from 'react'

interface StatCardProps {
    label: string
    value: string | number
    icon?: ReactNode
    trend?: string
    className?: string
}

export default function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
    return (
        <div className={`card-sm flex items-start gap-3.5 ${className}`}>
            {icon && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal/15 to-teal/5 flex items-center justify-center text-teal flex-shrink-0">
                    {icon}
                </div>
            )}
            <div className="min-w-0">
                <p className="text-[11px] text-charcoal/60 font-semibold uppercase tracking-wider truncate">
                    {label}
                </p>
                <p className="text-xl font-bold text-navy mt-0.5 tracking-tight">{value}</p>
                {trend && (
                    <p className="text-[11px] text-charcoal/50 mt-0.5 font-medium">{trend}</p>
                )}
            </div>
        </div>
    )
}
