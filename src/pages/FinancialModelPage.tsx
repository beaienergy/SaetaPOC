import { useParams } from 'react-router-dom'
import { FinancialModelScreen } from '@/features/financial-model'

/**
 * Modelo financiero (guion §5.4, UC-07). Toda la logica vive en
 * `src/features/financial-model` — esta pagina solo resuelve `opId` desde la
 * ruta (misma forma que `DocumentsKnowledgePage`) y monta la pantalla.
 */
export default function FinancialModelPage() {
  const { opId = '' } = useParams()
  return <FinancialModelScreen opId={opId} />
}
