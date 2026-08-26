export interface User {
  name: string
  email: string
}

export interface Credentials {
  email: string
  password: string
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'
