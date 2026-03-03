import { type ReactNode } from 'react'
import { InboxIcon } from 'lucide-react'

interface EmptyStateProps {
    icon?: ReactNode
    title: string
    description?: string
    action?: ReactNode
    className?: string
}

export default function EmptyState({
    icon,
    title,
    description,
    action,
    className = '',
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
            <div className="w-12 h-12 rounded-xl bg-light-gray/60 flex items-center justify-center mb-4 text-charcoal">
                {icon || <InboxIcon size={24} />}
            </div>
            <h3 className="text-sm font-semibold text-navy mb-1">{title}</h3>
            {description && (
                <p className="text-xs text-charcoal max-w-[280px] mb-4">{description}</p>
            )}
            {action}
        </div>
    )
}
