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
        <div className={`card-sm flex items-start gap-3 ${className}`}>
            {icon && (
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center text-teal flex-shrink-0">
                    {icon}
                </div>
            )}
            <div className="min-w-0">
                <p className="text-xs text-charcoal font-medium truncate">{label}</p>
                <p className="text-xl font-bold text-navy mt-0.5">{value}</p>
                {trend && <p className="text-[11px] text-charcoal mt-0.5">{trend}</p>}
            </div>
        </div>
    )
}
