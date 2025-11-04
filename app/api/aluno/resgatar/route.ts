
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

// Resgatar produto
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ALUNO') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    // Buscar produto
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    if (product.stock <= 0) {
      return NextResponse.json(
        { error: 'Produto esgotado' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (user.points < product.pointsCost) {
      return NextResponse.json(
        { error: 'Pontos insuficientes' },
        { status: 400 }
      )
    }

    // Gerar código único de resgate
    const code = `IAJ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Criar resgate e atualizar pontos e estoque em uma transação
    const redemption = await prisma.$transaction(async (tx) => {
      // Criar resgate
      const redemption = await tx.redemption.create({
        data: {
          userId: user.id,
          productId: product.id,
          code,
          status: 'AGUARDANDO_RETIRADA'
        },
        include: {
          product: true
        }
      })

      // Atualizar pontos do usuário
      await tx.user.update({
        where: { id: user.id },
        data: {
          points: {
            decrement: product.pointsCost
          }
        }
      })

      // Atualizar estoque do produto
      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: {
            decrement: 1
          }
        }
      })

      // Criar notificação
      await tx.notification.create({
        data: {
          userId: user.id,
          message: `Parabéns! Você resgatou: ${product.name}. Código de retirada: ${code}`,
          read: false
        }
      })

      return redemption
    })

    return NextResponse.json({ 
      redemption,
      code,
      message: 'Produto resgatado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao resgatar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
