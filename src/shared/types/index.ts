// Tipos agnosticos de dominio, compartidos por toda la app.

export type ID = string

// Esta POC solo simula dos roles (guion §1.5): Admin ve Analitica IA completa y
// Conocimiento base; Usuario no. No hay mas granularidad porque no hay backend
// que la haga cumplir de verdad — es una affordance de demo, no seguridad real.
export type Role = 'admin' | 'user'

export type Locale = 'es' | 'en'
export type ThemeMode = 'light' | 'dark' | 'system'
