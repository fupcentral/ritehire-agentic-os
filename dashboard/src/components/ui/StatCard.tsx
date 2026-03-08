import type { ReactNode } from 'react'

interface StatCardProps {
    label: string
    value: string | number
    icon?: ReactNode
    trend?: string
    trendUp?: boolean
}

export default function StatCard({ label, value, icon, trend, trendUp }: StatCardProps) {
    return (
        <div className="card-sm flex items-start justify-between group">
            <div>
                <div className="text-xs font-medium text-charcoal mb-1">{label}</div>
                <div className="text-xl font-bold text-navy">{value}</div>
                {trend && (
                    <div className={`text-[11px] font-medium mt-1.5 ${trendUp ? 'text-teal' : 'text-red-500'}`}>
                        {trend}
                    </div>
                )}
            </div>
            {icon && (
                <div className="w-10 h-10 rounded-xl bg-teal/8 flex items-center justify-center text-teal group-hover:bg-teal/12 transition-colors">
                    {icon}
                </div>
            )}
        </div>
    )
}
