import { useParams } from 'react-router-dom'
import { ChatScreen } from '@/features/chat'

/** Guion §5.1 — Chat + historial. La pantalla real vive en `features/chat`;
 * esta pagina solo resuelve `:opId` de la ruta y delega. */
export default function ChatPage() {
  const { opId = '' } = useParams()
  return <ChatScreen opId={opId} />
}
