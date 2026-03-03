import { type ReactNode } from 'react'

interface ButtonProps {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md'
    onClick?: () => void
    disabled?: boolean
    className?: string
    type?: 'button' | 'submit'
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled,
    className = '',
    type = 'button',
}: ButtonProps) {
    const base =
        'inline-flex items-center justify-center gap-1.5 font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none'

    const sizes = {
        sm: 'px-3.5 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
    }

    const variants = {
        primary:
            'bg-gradient-to-b from-teal to-teal-dark text-white shadow-sm shadow-teal/20 hover:shadow-md hover:shadow-teal/30 active:scale-[0.98]',
        secondary:
            'bg-white text-navy border border-light-gray hover:border-charcoal/20 hover:bg-surface active:scale-[0.98]',
        ghost:
            'text-charcoal hover:bg-surface hover:text-navy',
        danger:
            'bg-gradient-to-b from-red-500 to-red-600 text-white shadow-sm shadow-red-500/20 hover:shadow-md hover:shadow-red-500/30 active:scale-[0.98]',
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    )
}
