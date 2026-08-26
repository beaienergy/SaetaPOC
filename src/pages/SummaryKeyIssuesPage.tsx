import { useParams } from 'react-router-dom'
import { KeyIssuesScreen } from '@/features/summary'

export default function SummaryKeyIssuesPage() {
  const { opId = '' } = useParams()
  return <KeyIssuesScreen opId={opId} />
}
