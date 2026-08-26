import { useParams } from 'react-router-dom'
import { FactsScreen } from '@/features/summary'

export default function SummaryFactsPage() {
  const { opId = '' } = useParams()
  return <FactsScreen opId={opId} />
}
