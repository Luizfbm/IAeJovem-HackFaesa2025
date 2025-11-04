
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { subDays, startOfDay, endOfDay, format } from 'date-fns'

export const dynamic = "force-dynamic"

// Obter histórico de emoções
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ALUNO') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    // Buscar conversas dos últimos N dias
    const startDate = startOfDay(subDays(new Date(), days))
    const endDate = endOfDay(new Date())

    const conversas = await prisma.conversation.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true,
        emocao: true,
        sentimentoScore: true,
        createdAt: true
      }
    })

    // Agrupar por dia
    interface EmocaoDia {
      data: string
      emocoes: string[]
      sentimentoMedio: number
      totalConversas: number
    }

    const emocoesPorDia = conversas.reduce((acc: Record<string, EmocaoDia>, conversa) => {
      const dia = format(conversa.createdAt, 'yyyy-MM-dd')
      
      if (!acc[dia]) {
        acc[dia] = {
          data: dia,
          emocoes: [],
          sentimentoMedio: 0,
          totalConversas: 0
        }
      }

      if (conversa.emocao) {
        acc[dia].emocoes.push(conversa.emocao)
      }
      
      if (conversa.sentimentoScore !== null) {
        acc[dia].sentimentoMedio += conversa.sentimentoScore
      }
      
      acc[dia].totalConversas++
      
      return acc
    }, {})

    // Calcular média de sentimento
    Object.keys(emocoesPorDia).forEach(dia => {
      if (emocoesPorDia[dia].totalConversas > 0) {
        emocoesPorDia[dia].sentimentoMedio = 
          emocoesPorDia[dia].sentimentoMedio / emocoesPorDia[dia].totalConversas
      }
    })

    return NextResponse.json({
      emocoesPorDia: Object.values(emocoesPorDia),
      totalConversas: conversas.length
    })

  } catch (error) {
    console.error('Erro ao buscar emoções:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
