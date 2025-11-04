
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, matricula, password } = body

    const identifier = email || matricula

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/matrícula e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário por email ou matrícula
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { matricula: identifier.toUpperCase() }
        ]
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Retornar dados do usuário (sem a senha)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        matricula: user.matricula,
        role: user.role,
        serie: user.serie,
        turma: user.turma,
        points: user.points,
        termsAccepted: user.termsAccepted
      }
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
