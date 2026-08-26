import { cn } from '@/shared/lib/utils'
import './Skeleton.css'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  radius?: string
  className?: string
}

export function Skeleton({ width = '100%', height = 16, radius, className }: SkeletonProps) {
  return (
    <span
      className={cn('skeleton', className)}
      style={{ width, height, borderRadius: radius ?? 'var(--radius-sm)' }}
      aria-hidden
    />
  )
}

interface SkeletonRowsProps {
  rows?: number
}

export function SkeletonRows({ rows = 5 }: SkeletonRowsProps) {
  return (
    <div className="skeleton-rows">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={40} />
      ))}
    </div>
  )
}
