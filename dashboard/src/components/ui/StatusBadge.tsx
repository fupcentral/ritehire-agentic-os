import { getStatusColor, type StatusColor } from '../../lib/types'

const colorMap: Record<StatusColor, string> = {
    teal: 'bg-status-active',
    amber: 'bg-status-pending',
    red: 'bg-status-blocked',
    gray: 'bg-status-paused',
}

const labelColorMap: Record<StatusColor, string> = {
    teal: 'text-teal',
    amber: 'text-amber-500',
    red: 'text-red-500',
    gray: 'text-charcoal',
}

interface StatusBadgeProps {
    status: string
    label?: string
    size?: 'sm' | 'md'
}

export default function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
    const color = getStatusColor(status)
    const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
    const fontSize = size === 'sm' ? 'text-[11px]' : 'text-xs'

    return (
        <span className="inline-flex items-center gap-1.5">
            <span className={`${dotSize} rounded-full ${colorMap[color]}`} />
            <span className={`${fontSize} font-medium capitalize ${labelColorMap[color]}`}>
                {label || status.replace(/_/g, ' ')}
            </span>
        </span>
    )
}
