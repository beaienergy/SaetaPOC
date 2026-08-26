import { useState } from 'react'

// Logo de Saeta. A diferencia de TmeicLogo (SVG vectorial con currentColor),
// este es un PNG tal cual entregado por el cliente (decision confirmada:
// colores exactos, cero aproximacion) — por eso no admite tintado.
//
// PENDIENTE: falta el fichero real en `public/brand/saeta-logo.png`. Hasta que
// se copie ahi, cae al wordmark de texto de abajo con las mismas props
// (height) que usan Sidebar/Header/LoginPage/AppSelector, para no bloquear el
// resto de la app con un icono de imagen rota.
const LOGO_SRC = '/brand/saeta-logo.png'

export function SaetaLogo({ height = 22 }: { height?: number }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height,
          fontSize: height * 0.62,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: 'currentColor',
          whiteSpace: 'nowrap',
        }}
      >
        Saeta 2nd Brain
      </span>
    )
  }

  return (
    <img
      src={LOGO_SRC}
      alt="Saeta"
      height={height}
      style={{ height, width: 'auto', display: 'block' }}
      onError={() => setFailed(true)}
    />
  )
}
