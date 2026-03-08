interface SkeletonLoaderProps {
    variant?: 'row' | 'card' | 'stat' | 'text'
    count?: number
}

function SkeletonRow() {
    return (
        <div className="flex items-center gap-3 py-3">
            <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="skeleton h-3 rounded-md w-3/4" />
                <div className="skeleton h-2.5 rounded-md w-1/2" />
            </div>
        </div>
    )
}

function SkeletonCard() {
    return (
        <div className="skeleton rounded-xl h-24" />
    )
}

function SkeletonStat() {
    return (
        <div className="card-sm space-y-3">
            <div className="skeleton h-3 rounded-md w-1/2" />
            <div className="skeleton h-6 rounded-md w-2/3" />
        </div>
    )
}

function SkeletonText() {
    return (
        <div className="space-y-2">
            <div className="skeleton h-3 rounded-md w-full" />
            <div className="skeleton h-3 rounded-md w-4/5" />
            <div className="skeleton h-3 rounded-md w-3/5" />
        </div>
    )
}

export default function SkeletonLoader({ variant = 'row', count = 3 }: SkeletonLoaderProps) {
    const Component =
        variant === 'card' ? SkeletonCard :
            variant === 'stat' ? SkeletonStat :
                variant === 'text' ? SkeletonText :
                    SkeletonRow

    return (
        <div className={variant === 'card' || variant === 'stat' ? 'grid grid-cols-2 lg:grid-cols-4 gap-4' : 'space-y-1'}>
            {Array.from({ length: count }).map((_, i) => (
                <Component key={i} />
            ))}
        </div>
    )
}
