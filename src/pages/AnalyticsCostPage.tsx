import { useParams } from 'react-router-dom'
import { CostDashboard } from '@/features/analytics'

export default function AnalyticsCostPage() {
  const { opId = '' } = useParams()
  return <CostDashboard opId={opId} />
}
