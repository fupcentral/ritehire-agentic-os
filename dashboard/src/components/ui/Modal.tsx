import { type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
    actions?: ReactNode
    width?: string
}

export default function Modal({
    open,
    onClose,
    title,
    children,
    actions,
    width = 'max-w-lg',
}: ModalProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-navy/40" onClick={onClose} />
            {/* Dialog */}
            <div className={`relative bg-white rounded-xl shadow-card ${width} w-full mx-4 fade-in`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-light-gray">
                    <h2 className="text-base font-semibold text-navy">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-light-gray/60 transition-colors text-charcoal cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>
                {/* Body */}
                <div className="px-6 py-5">{children}</div>
                {/* Actions */}
                {actions && (
                    <div className="px-6 py-4 border-t border-light-gray flex items-center gap-3 justify-end">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    )
}
