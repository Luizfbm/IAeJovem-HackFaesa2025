
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// No IAeJovem, signup é permitido apenas para testes
// Em produção, apenas administradores podem criar novos usuários
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, matricula, role, serie, turma } = body

    // Validações básicas
    if (!email || !password || !name || !matricula || !role) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { matricula }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já existe com este email ou matrícula' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        matricula,
        role: role as any,
        serie: serie as any || null,
        turma: turma as any || null,
        termsAccepted: false
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        matricula: user.matricula
      }
    })

  } catch (error) {
    console.error('Erro no signup:', error)
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
}
