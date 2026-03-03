import { type ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
    size?: 'default' | 'sm'
    padding?: boolean
}

export default function Card({ children, className = '', size = 'default', padding = true }: CardProps) {
    const base = size === 'sm' ? 'card-sm' : 'card'
    return (
        <div className={`${base} ${!padding ? '!p-0' : ''} ${className}`}>
            {children}
        </div>
    )
}

interface CardHeaderProps {
    title: string
    subtitle?: string
    action?: ReactNode
    className?: string
}

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
    return (
        <div className={`flex items-center justify-between mb-4 ${className}`}>
            <div>
                <h3 className="text-base font-semibold text-navy">{title}</h3>
                {subtitle && <p className="text-xs text-charcoal mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
    )
}
