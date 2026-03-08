import type { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
    compact?: boolean
    interactive?: boolean
    onClick?: () => void
}

export default function Card({ children, className = '', compact = false, interactive = false, onClick }: CardProps) {
    return (
        <div
            className={`${compact ? 'card-sm' : 'card'} ${interactive ? 'card-interactive cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

interface CardHeaderProps {
    title: string
    subtitle?: string
    action?: ReactNode
    icon?: ReactNode
}

export function CardHeader({ title, subtitle, action, icon }: CardHeaderProps) {
    return (
        <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-2.5">
                {icon && (
                    <div className="w-8 h-8 rounded-lg bg-teal/8 flex items-center justify-center text-teal">
                        {icon}
                    </div>
                )}
                <div>
                    <h3 className="text-[15px] font-semibold text-navy leading-tight">{title}</h3>
                    {subtitle && (
                        <p className="text-xs text-charcoal mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    )
}
