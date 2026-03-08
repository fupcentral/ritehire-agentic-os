import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
    icon?: ReactNode
    title: string
    description: string
    action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-light-gray/60 flex items-center justify-center text-charcoal/40 mb-4">
                {icon || <Inbox size={22} />}
            </div>
            <h4 className="text-sm font-semibold text-navy mb-1">{title}</h4>
            <p className="text-xs text-charcoal max-w-[280px] mb-4">{description}</p>
            {action && <div>{action}</div>}
        </div>
    )
}
