import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    icon?: ReactNode
    children: ReactNode
}

const variants = {
    primary: 'bg-teal text-white hover:bg-teal-dark shadow-sm shadow-teal/20',
    secondary: 'bg-white text-navy border border-light-gray hover:bg-surface hover:border-charcoal/20',
    ghost: 'text-charcoal hover:bg-surface hover:text-navy',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
}

const sizes = {
    sm: 'px-3 py-1.5 text-[11px] rounded-lg gap-1.5',
    md: 'px-4 py-2 text-[13px] rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-sm rounded-xl gap-2',
}

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    disabled,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
                inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]} ${sizes[size]} ${className}
            `}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 size={14} className="animate-spin" />
            ) : icon ? (
                icon
            ) : null}
            {children}
        </button>
    )
}
