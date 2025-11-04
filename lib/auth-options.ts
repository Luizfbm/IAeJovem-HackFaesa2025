
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        matricula: { label: 'Matrícula ou Email', type: 'text' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        const identifier = credentials?.matricula || credentials?.email
        
        if (!identifier || !credentials?.password) {
          return null
        }

        try {
          // Tentar encontrar por matrícula ou email
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { matricula: identifier.toUpperCase() },
                { email: identifier.toLowerCase() }
              ]
            }
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            name: user.name,
            matricula: user.matricula,
            email: user.email,
            role: user.role,
            serie: user.serie?.toString(),
            turma: user.turma?.toString(),
            points: user.points,
            termsAccepted: user.termsAccepted,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.matricula = user.matricula
        token.serie = user.serie
        token.turma = user.turma
        token.points = user.points
        token.termsAccepted = user.termsAccepted
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as UserRole
        session.user.matricula = token.matricula as string
        session.user.serie = token.serie as string
        session.user.turma = token.turma as string
        session.user.points = token.points as number
        session.user.termsAccepted = token.termsAccepted as boolean
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
}
