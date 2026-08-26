import { useParams } from 'react-router-dom'
import { TrackingScreen } from '@/features/summary'

export default function SummaryTrackingPage() {
  const { opId = '' } = useParams()
  return <TrackingScreen opId={opId} />
}
