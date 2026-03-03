import { type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
    actions?: ReactNode
}

export default function Modal({ open, onClose, title, children, actions }: ModalProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-navy/20 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-[480px] max-w-[90vw] max-h-[85vh] flex flex-col overflow-hidden fade-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-light-gray/50">
                    <h2 className="text-base font-semibold text-navy tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface rounded-xl transition-colors text-charcoal/40 hover:text-charcoal cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
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
