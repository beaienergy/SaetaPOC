import clsx, { type ClassValue } from 'clsx'

// Une clases condicionalmente. Envoltorio de clsx para tener un unico punto de entrada.
export const cn = (...inputs: ClassValue[]): string => clsx(inputs)
