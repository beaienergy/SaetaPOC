// Convierte minutos a texto legible de operativa: "45 min", "3 h 20 min", "2 d 4 h".
// Unidades cortas iguales en ES y EN, asi que no pasa por i18n.
export function formatMinutes(min: number | null | undefined): string {
  if (min == null) return '—'
  const total = Math.max(0, Math.round(min))
  if (total < 60) return `${total} min`
  const hours = Math.floor(total / 60)
  if (hours < 24) {
    const rest = total % 60
    return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`
  }
  const days = Math.floor(hours / 24)
  const restHours = hours % 24
  return restHours === 0 ? `${days} d` : `${days} d ${restHours} h`
}
