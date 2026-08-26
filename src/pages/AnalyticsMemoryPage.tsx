import { useParams } from 'react-router-dom'
import { MemoryScreen } from '@/features/analytics'

export default function AnalyticsMemoryPage() {
  const { opId = '' } = useParams()
  return <MemoryScreen opId={opId} />
}
