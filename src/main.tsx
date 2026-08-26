import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/styles/index.css'
import '@/shared/lib/i18n'
import { applyTheme, useThemeStore } from '@/shared/stores'
import { App } from '@/app/App'

// Aplica el tema persistido antes del primer render (evita el flash).
applyTheme(useThemeStore.getState().mode)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
