import { Component, type ErrorInfo, type ReactNode } from 'react'
import i18n from '@/shared/lib/i18n/i18n'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

// Evita la pantalla en blanco ante un error de render no controlado.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error no controlado en la UI:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: '100vh',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            padding: 24,
          }}
        >
          <div>
            <h1 style={{ marginBottom: 8 }}>{i18n.t('common:errorBoundary.title')}</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>
              {i18n.t('common:errorBoundary.hint')}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '9px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)',
                cursor: 'pointer',
              }}
            >
              {i18n.t('common:errorBoundary.reload')}
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
