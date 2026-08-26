/**
 * Nombre de pila. Para saludar: "Hola, Carlos" se lee como una persona hablando;
 * "Hola, Carlos Pérez" se lee como una base de datos.
 */
export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

/** Iniciales para los avatares del chrome (header, sidebar, portal pintan el
 * mismo dato, asi que el calculo vive en un solo sitio). */
export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
