import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    open: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    width?: string
}

export default function Modal({ open, onClose, title, children, width = 'max-w-lg' }: ModalProps) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [open])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Modal Content */}
            <div
                className={`relative bg-white rounded-xl shadow-[var(--shadow-card)] ${width} w-full mx-4
          animate-in fade-in zoom-in-95 duration-200`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-light-gray">
                    <h2 className="text-lg font-semibold text-navy">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-light-gray/50
              transition-colors cursor-pointer"
                    >
                        <X size={18} className="text-charcoal" />
                    </button>
                </div>
                {/* Body */}
                <div className="px-6 py-4">{children}</div>
            </div>
        </div>
    )
}
