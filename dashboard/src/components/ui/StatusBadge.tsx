import { getStatusColor, formatStatus } from '../../lib/types'

interface StatusBadgeProps {
    status: string
    size?: 'sm' | 'md'
}

const dotColors: Record<string, string> = {
    teal: 'bg-status-active',
    amber: 'bg-status-pending',
    red: 'bg-status-blocked',
    gray: 'bg-status-paused',
}

const textColors: Record<string, string> = {
    teal: 'text-teal',
    amber: 'text-amber-600',
    red: 'text-red-500',
    gray: 'text-charcoal',
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const color = getStatusColor(status)

    return (
        <span className={`inline-flex items-center gap-1.5 ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColors[color]}`} />
            <span className={`font-medium ${textColors[color]}`}>
                {formatStatus(status)}
            </span>
        </span>
    )
}
