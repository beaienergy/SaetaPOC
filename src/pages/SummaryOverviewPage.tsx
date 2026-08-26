import { useParams } from 'react-router-dom'
import { OverviewScreen } from '@/features/summary'

export default function SummaryOverviewPage() {
  const { opId = '' } = useParams()
  return <OverviewScreen opId={opId} />
}
