import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sparkles, ShieldCheck, KeyRound } from 'lucide-react'
import { LoginForm, useAuthStore } from '@/features/auth'
import { SaetaLogo, ThemeToggle, LangToggle, Button } from '@/shared/ui'
import { ROUTES } from '@/shared/config/routes'
import './LoginPage.css'

// Argumento de venta, bajo el logo: workspace unico, validacion humana
// siempre, y acceso unico Microsoft — coherente con el relato Entra ID /
// Microsoft-first de la RFP (principio "Microsoft-first").
const BRAND_POINTS = [
  { key: 'point1', icon: Sparkles },
  { key: 'point2', icon: ShieldCheck },
  { key: 'point3', icon: KeyRound },
] as const

// Red decorativa de fondo, igual patron que TMEIC-Ports-Frontend: puntos y
// conexiones escritas a mano, no generadas.
const TOP_NODES = [
  [20, 150],
  [130, 90],
  [230, 170],
  [340, 80],
  [450, 160],
  [560, 70],
  [670, 150],
  [780, 90],
  [890, 170],
] as const

const BOTTOM_NODES = [
  [300, 560],
  [410, 630],
  [520, 550],
  [630, 620],
  [740, 540],
  [850, 610],
  [960, 540],
  [1070, 620],
  [1180, 560],
] as const

function meshLines(nodes: ReadonlyArray<readonly [number, number]>) {
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
  nodes.forEach(([x1, y1], i) => {
    for (const step of [1, 2]) {
      const next = nodes[i + step]
      if (next) lines.push({ x1, y1, x2: next[0], y2: next[1] })
    }
  })
  return lines
}

const NETWORK_NODES = [...TOP_NODES, ...BOTTOM_NODES]
const NETWORK_LINES = [...meshLines(TOP_NODES), ...meshLines(BOTTOM_NODES)]

export default function LoginPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const status = useAuthStore((s) => s.status)

  if (status === 'authenticated') return <Navigate to={ROUTES.apps} replace />

  return (
    <div className="login-page">
      <div className="login-page__glow login-page__glow--a" aria-hidden />
      <div className="login-page__glow login-page__glow--b" aria-hidden />
      <div className="login-page__grid-pattern" aria-hidden />
      <svg
        className="login-page__network"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden
      >
        {NETWORK_LINES.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            className="login-page__network-line"
          />
        ))}
        {NETWORK_NODES.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 4 === 0 ? 5 : 3}
            className="login-page__network-node"
          />
        ))}
      </svg>

      <div className="login-page__toolbar">
        <ThemeToggle />
        <LangToggle />
      </div>

      <div className="login-page__center">
        <div className="login-page__logo">
          <SaetaLogo height={30} />
        </div>
        <span className="login-page__eyebrow">{t('brand.eyebrow')}</span>

        <ul className="login-page__points">
          {BRAND_POINTS.map(({ key, icon: Icon }) => (
            <li key={key} className="login-page__point">
              <span className="login-page__point-icon" aria-hidden>
                <Icon size={16} />
              </span>
              {t(`brand.${key}`)}
            </li>
          ))}
        </ul>

        <div className="login-page__card">
          <h2 className="login-page__title">{t('title')}</h2>

          <Button variant="secondary" fullWidth icon={<KeyRound size={18} />} disabled>
            {t('sso')}
          </Button>
          <p className="login-page__sso-note" role="status">
            {t('ssoPending')}
          </p>

          <div className="login-page__divider">
            <span>{t('or')}</span>
          </div>

          <LoginForm onSuccess={() => navigate(ROUTES.apps, { replace: true })} />
        </div>
      </div>

      <p className="login-page__brand-foot">{t('brand.foot')}</p>
    </div>
  )
}
