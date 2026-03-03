import { type ReactNode } from 'react'
import { X } from 'lucide-react'

interface DrawerProps {
    open: boolean
    onClose: () => void
    title: string
    subtitle?: string
    children: ReactNode
    actions?: ReactNode
}

export default function Drawer({ open, onClose, title, subtitle, children, actions }: DrawerProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-navy/20 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-[420px] max-w-[90vw] h-full bg-white shadow-2xl flex flex-col drawer-enter">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-light-gray/50">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-navy tracking-tight truncate">{title}</h2>
                        {subtitle && (
                            <p className="text-[11px] text-charcoal/50 mt-0.5 font-medium truncate">{subtitle}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface rounded-xl transition-colors flex-shrink-0 text-charcoal/40 hover:text-charcoal cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {children}
                </div>

                {/* Actions */}
                {actions && (
                    <div className="px-6 py-4 border-t border-light-gray/50 flex items-center justify-end gap-2 bg-surface/50">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    )
}
