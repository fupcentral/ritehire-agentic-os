import { X } from 'lucide-react'

interface DrawerProps {
    open: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    width?: string
}

export default function Drawer({ open, onClose, title, children, width = 'max-w-xl' }: DrawerProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Drawer Panel */}
            <div
                className={`relative bg-white ${width} w-full h-full shadow-[var(--shadow-drawer)]
          overflow-y-auto`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-light-gray px-6 py-4 flex items-center justify-between z-10">
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
