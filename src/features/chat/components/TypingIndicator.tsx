import './TypingIndicator.css'

/** Indicador de "escribiendo…" (guion §5.1): bienvenido pero no obligatorio
 * — sustituye al streaming token a token real que la POC no necesita. */
export function TypingIndicator() {
  return (
    <span className="typing-indicator" aria-hidden>
      <span className="typing-indicator__dot" />
      <span className="typing-indicator__dot" />
      <span className="typing-indicator__dot" />
    </span>
  )
}
