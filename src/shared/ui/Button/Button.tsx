import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import './Button.css'

// `secondary` es el aspecto base de `.btn`: no tiene modificador propio en el CSS.
type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'accent'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn('btn', `btn--${variant}`, `btn--${size}`, fullWidth && 'btn--block', className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="btn__spinner" aria-hidden /> : icon}
      {children && <span>{children}</span>}
    </button>
  )
}
