import { useParams } from 'react-router-dom'
import { TracesScreen } from '@/features/analytics'

export default function AnalyticsTracesPage() {
  const { opId = '' } = useParams()
  return <TracesScreen opId={opId} />
}
