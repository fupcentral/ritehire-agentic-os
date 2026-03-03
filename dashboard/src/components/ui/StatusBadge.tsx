import { getStatusColor, formatStatus, type StatusColor } from '../../lib/types'

interface StatusBadgeProps {
    status: string
    size?: 'sm' | 'md'
    className?: string
}

const colorMap: Record<StatusColor, string> = {
    teal: 'bg-status-active',
    amber: 'bg-status-pending',
    red: 'bg-status-blocked',
    gray: 'bg-status-paused',
}

export default function StatusBadge({ status, size = 'md', className = '' }: StatusBadgeProps) {
    const color = getStatusColor(status)
    const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
    const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs'

    return (
        <span className={`inline-flex items-center gap-1.5 ${className}`}>
            <span className={`${dotSize} rounded-full ${colorMap[color]} flex-shrink-0`} />
            <span className={`${textSize} font-medium text-charcoal capitalize`}>
                {formatStatus(status)}
            </span>
        </span>
    )
}
