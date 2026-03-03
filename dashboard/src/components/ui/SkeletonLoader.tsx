interface SkeletonLoaderProps {
    variant?: 'card' | 'row' | 'stat' | 'text'
    count?: number
    className?: string
}

function SkeletonCard() {
    return (
        <div className="card space-y-3">
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-2/3 rounded" />
        </div>
    )
}

function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 py-3 px-4">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-3 w-32 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-3 w-16 rounded" />
        </div>
    )
}

function SkeletonStat() {
    return (
        <div className="card-sm space-y-2">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-6 w-16 rounded" />
        </div>
    )
}

function SkeletonText() {
    return (
        <div className="space-y-2">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-4/5 rounded" />
        </div>
    )
}

export default function SkeletonLoader({ variant = 'card', count = 3, className = '' }: SkeletonLoaderProps) {
    const Component = {
        card: SkeletonCard,
        row: SkeletonRow,
        stat: SkeletonStat,
        text: SkeletonText,
    }[variant]

    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <Component key={i} />
            ))}
        </div>
    )
}
