import { type ReactNode } from 'react'
import { X } from 'lucide-react'

interface DrawerProps {
    open: boolean
    onClose: () => void
    title: string
    subtitle?: string
    children: ReactNode
    width?: string
    actions?: ReactNode
}

export default function Drawer({
    open,
    onClose,
    title,
    subtitle,
    children,
    width = 'w-[480px]',
    actions,
}: DrawerProps) {
    if (!open) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-navy/30 z-40 transition-opacity"
                onClick={onClose}
            />
            {/* Panel */}
            <div className={`fixed right-0 top-0 h-full ${width} bg-white z-50 shadow-drawer flex flex-col drawer-enter`}>
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-light-gray">
                    <div>
                        <h2 className="text-lg font-semibold text-navy">{title}</h2>
                        {subtitle && <p className="text-xs text-charcoal mt-0.5">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-light-gray/60 transition-colors text-charcoal cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>
                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {children}
                </div>
                {/* Actions */}
                {actions && (
                    <div className="px-6 py-4 border-t border-light-gray flex items-center gap-3 justify-end">
                        {actions}
                    </div>
                )}
            </div>
        </>
    )
}
