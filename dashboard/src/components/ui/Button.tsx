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

const variants = {
    primary: 'bg-teal text-white hover:bg-teal-dark shadow-sm',
    secondary: 'bg-light-gray text-navy hover:bg-light-gray/80',
    ghost: 'bg-transparent text-charcoal hover:bg-light-gray/50',
    danger: 'bg-status-blocked text-white hover:bg-red-600',
}

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    className = '',
    type = 'button',
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    )
}
