import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
    maxWidth?: string
}

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-navy/30 backdrop-blur-[3px] modal-backdrop"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative bg-white rounded-2xl shadow-modal ${maxWidth} w-full modal-content`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-light-gray/60">
                    <h2 className="text-base font-bold text-navy">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-surface transition-colors text-charcoal/50 hover:text-charcoal cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                    {children}
                </div>
            </div>
        </div>
    )
}
