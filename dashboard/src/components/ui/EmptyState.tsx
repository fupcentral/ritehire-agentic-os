import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description?: string
    actionLabel?: string
    onAction?: () => void
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="w-16 h-16 rounded-2xl bg-light-gray/50 flex items-center justify-center mb-4">
                <Icon size={28} className="text-charcoal" />
            </div>
            <h3 className="text-base font-semibold text-navy mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-charcoal max-w-sm text-center mb-4">
                    {description}
                </p>
            )}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-5 py-2.5 bg-teal text-white text-sm font-medium rounded-lg
            hover:bg-teal-dark transition-colors duration-200 cursor-pointer"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    )
}
