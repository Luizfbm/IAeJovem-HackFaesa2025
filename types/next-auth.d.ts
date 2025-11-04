
import { UserRole } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface User {
    role: UserRole
    matricula: string
    serie?: string
    turma?: string
    points: number
    termsAccepted: boolean
  }

  interface Session {
    user: User & {
      id: string
      name: string
      email: string
      role: UserRole
      matricula: string
      serie?: string
      turma?: string
      points: number
      termsAccepted: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    matricula: string
    serie?: string
    turma?: string
    points: number
    termsAccepted: boolean
  }
}
