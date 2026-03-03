interface SkeletonLoaderProps {
    variant?: 'text' | 'card' | 'row' | 'circle'
    count?: number
    className?: string
}

function SkeletonLine({ className = '' }: { className?: string }) {
    return <div className={`skeleton h-4 rounded ${className}`} />
}

function SkeletonCard() {
    return (
        <div className="card space-y-4">
            <SkeletonLine className="w-1/3 h-5" />
            <SkeletonLine className="w-full" />
            <SkeletonLine className="w-2/3" />
            <SkeletonLine className="w-1/2" />
        </div>
    )
}

function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 py-3 px-4">
            <SkeletonLine className="w-8 h-8 rounded-full !rounded-full" />
            <div className="flex-1 space-y-2">
                <SkeletonLine className="w-1/3" />
                <SkeletonLine className="w-1/2 h-3" />
            </div>
            <SkeletonLine className="w-16 h-6" />
        </div>
    )
}

export default function SkeletonLoader({
    variant = 'card',
    count = 1,
    className = '',
}: SkeletonLoaderProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: count }).map((_, i) => {
                switch (variant) {
                    case 'text':
                        return <SkeletonLine key={i} className="w-full" />
                    case 'card':
                        return <SkeletonCard key={i} />
                    case 'row':
                        return <SkeletonRow key={i} />
                    case 'circle':
                        return <div key={i} className="skeleton w-10 h-10 rounded-full" />
                    default:
                        return <SkeletonCard key={i} />
                }
            })}
        </div>
    )
}
