import './LiveBadge.css'

// Rotulo fijo en ambos idiomas. Si alguna vez debe traducirse, la clave ya
// existe sin usar en common: `states.live`.
export function LiveBadge() {
  return (
    <span className="live-badge">
      <span className="live-badge__dot" aria-hidden />
      LIVE
    </span>
  )
}
