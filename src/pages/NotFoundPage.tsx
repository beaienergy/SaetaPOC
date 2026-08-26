import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'

export default function NotFoundPage() {
  return (
    <div style={{ height: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <div>
        <h1>404</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '8px 0 16px' }}>
          This page doesn't exist.
        </p>
        <Link to={ROUTES.apps}>Back to applications</Link>
      </div>
    </div>
  )
}
