import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { Button } from '@/shared/ui'
import { useEscape } from '@/shared/hooks'
import { useRoleStore } from '@/shared/stores'
import { STORAGE_KEYS } from '@/shared/config/storage'
import { getOperation } from '@/features/operations'
import { cn } from '@/shared/lib/utils'
import './OnboardingTour.css'

const SIDEBAR_STEP_KEYS = ['chat', 'documents', 'summary', 'financialModel', 'reports', 'analytics'] as const
type SidebarStepKey = (typeof SIDEBAR_STEP_KEYS)[number]
type StepKey = 'welcome' | SidebarStepKey

const CARD_WIDTH = 320
const CARD_GAP = 16
const VIEWPORT_MARGIN = 16
/** Alto aproximado de la tarjeta — no se conoce el real antes de pintar, pero
 * alcanza para que el clamp de `top` no la saque de la pantalla en el caso
 * habitual (título + 2-3 líneas + pie). */
const CARD_HEIGHT_ESTIMATE = 220

interface TargetRect {
  top: number
  left: number
  right: number
  width: number
  height: number
}

function measure(key: StepKey): TargetRect | null {
  if (key === 'welcome') return null
  const el = document.querySelector(`[data-tour="sidebar-${key}"]`)
  if (!el) return null
  const rect = el.getBoundingClientRect()
  return { top: rect.top, left: rect.left, right: rect.right, width: rect.width, height: rect.height }
}

/**
 * Tour de bienvenida (pedido explícito): al entrar por primera vez a una
 * operación, un paso por cada apartado del sidebar explicando brevemente qué
 * hace — con el elemento resaltado, igual que un onboarding de producto
 * típico. Se enseña una sola vez por navegador (`localStorage`), no una vez
 * por operación. Se salta en móvil (< 1024px): ahí el sidebar es un cajón
 * fuera de pantalla por defecto y no hay nada que señalar.
 */
export function OnboardingTour({ opId }: { opId: string }) {
  const { t } = useTranslation('onboarding')
  const role = useRoleStore((s) => s.role)
  const operation = getOperation(opId)

  const [isActive, setIsActive] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [rect, setRect] = useState<TargetRect | null>(null)

  const steps = useMemo<StepKey[]>(
    () => ['welcome', ...SIDEBAR_STEP_KEYS.filter((key) => key !== 'analytics' || role === 'admin')],
    [role],
  )

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEYS.onboardingSeen)) return
    if (window.innerWidth < 1024) return
    const timer = setTimeout(() => setIsActive(true), 400)
    return () => clearTimeout(timer)
    // Solo al montar el shell de la operación (no en cada cambio de operación
    // ni de rol): "la primera vez que se pincha en un proyecto", una vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (stepIndex >= steps.length) setStepIndex(0)
  }, [steps, stepIndex])

  useEffect(() => {
    if (!isActive) return
    const key = steps[stepIndex]
    const update = () => setRect(measure(key))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [isActive, steps, stepIndex])

  useEscape(isActive, () => close())

  if (!isActive) return null

  const key = steps[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === steps.length - 1

  function close() {
    localStorage.setItem(STORAGE_KEYS.onboardingSeen, '1')
    setIsActive(false)
  }

  const cardStyle = rect ? cardPositionStyle(rect) : centeredCardStyle()

  return createPortal(
    <div className="onboarding-tour">
      <div
        className="onboarding-tour__spotlight"
        style={rect ? spotlightStyle(rect) : undefined}
        onClick={close}
      />

      <div className="onboarding-tour__card" style={cardStyle} role="dialog" aria-label={t('stepCounter', { current: stepIndex + 1, total: steps.length })}>
        <button type="button" className="onboarding-tour__close" onClick={close} aria-label={t('skip')}>
          <X size={14} />
        </button>

        <span className="onboarding-tour__counter">{t('stepCounter', { current: stepIndex + 1, total: steps.length })}</span>

        <h3 className="onboarding-tour__title">
          {key === 'welcome' ? t('welcome.title', { project: operation?.name ?? '' }) : t(`steps.${key}.title`)}
        </h3>
        <p className="onboarding-tour__body">
          {key === 'welcome' ? t('welcome.body', { count: steps.length - 1 }) : t(`steps.${key}.body`)}
        </p>

        <div className="onboarding-tour__footer">
          <div className="onboarding-tour__dots">
            {steps.map((s, i) => (
              <span key={s} className={cn('onboarding-tour__dot', i === stepIndex && 'is-active')} />
            ))}
          </div>

          <div className="onboarding-tour__actions">
            {!isFirst && (
              <Button variant="ghost" size="sm" onClick={() => setStepIndex((i) => i - 1)}>
                {t('back')}
              </Button>
            )}
            {!isLast ? (
              <Button variant="primary" size="sm" onClick={() => setStepIndex((i) => i + 1)}>
                {t('next')}
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={close}>
                {t('finish')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function spotlightStyle(rect: TargetRect): CSSProperties {
  const pad = 6
  return {
    top: rect.top - pad,
    left: rect.left - pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  }
}

function cardPositionStyle(rect: TargetRect): CSSProperties {
  let left = rect.right + CARD_GAP
  if (left + CARD_WIDTH > window.innerWidth - VIEWPORT_MARGIN) {
    left = Math.max(VIEWPORT_MARGIN, window.innerWidth - CARD_WIDTH - VIEWPORT_MARGIN)
  }
  const idealTop = rect.top + rect.height / 2 - CARD_HEIGHT_ESTIMATE / 2
  const top = Math.min(
    Math.max(idealTop, VIEWPORT_MARGIN),
    window.innerHeight - CARD_HEIGHT_ESTIMATE - VIEWPORT_MARGIN,
  )
  return { top, left }
}

function centeredCardStyle(): CSSProperties {
  return {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }
}
