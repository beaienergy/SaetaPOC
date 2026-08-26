import { useParams } from 'react-router-dom'
import { ReportsScreen } from '@/features/reports'

export default function ReportsPage() {
  const { opId = '' } = useParams()
  return <ReportsScreen opId={opId} />
}
