import { useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { LogIn, Mail, Lock } from 'lucide-react'
import { Button, Input, LabeledField } from '@/shared/ui'
import { useAuthStore } from '../store/authStore'
import './LoginForm.css'

/** `Input` con un icono fijo a la izquierda. Local a este formulario. */
function IconInput({ icon, ...rest }: { icon: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="login-form__field">
      <span className="login-form__field-icon" aria-hidden>
        {icon}
      </span>
      <Input className="login-form__field-input" {...rest} />
    </div>
  )
}

/**
 * Sin backend (alcance de esta POC): la única validación es contra la
 * credencial hardcodeada de `authApi` (puerta simbólica, no seguridad real).
 */
export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation('auth')
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(false)
    try {
      await login({ email, password })
      onSuccess()
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <LabeledField label={t('email')} htmlFor="email">
        <IconInput
          icon={<Mail size={16} />}
          id="email"
          type="email"
          value={email}
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@saetayield.com"
        />
      </LabeledField>
      <LabeledField label={t('password')} htmlFor="password">
        <IconInput
          icon={<Lock size={16} />}
          id="password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </LabeledField>

      {error && (
        <p className="login-form__error" role="alert">
          {t('error')}
        </p>
      )}

      <Button type="submit" variant="primary" fullWidth loading={submitting} icon={<LogIn size={18} />}>
        {submitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  )
}
