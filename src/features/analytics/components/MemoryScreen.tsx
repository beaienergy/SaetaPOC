import { BrainMemoryPanel } from './BrainMemoryPanel'

/**
 * Memoria del brain (guion §5.6.3) — la pantalla más importante de la POC:
 * el documento de memoria que usa el agente para esta operación, editable y
 * versionado (R-04). El antiguo tablero de propuestas pendiente/aprobada/
 * rechazada se quitó a petición explícita — `useMemoryStore`/`mockMemory.ts`
 * se quedan en el repo sin usar por si se retoma más adelante.
 */
export function MemoryScreen({ opId }: { opId: string }) {
  return <BrainMemoryPanel opId={opId} />
}
