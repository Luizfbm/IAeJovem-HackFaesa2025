
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = "force-dynamic"

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ALUNO') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { messages, duration } = await request.json()
    const userId = session.user.id

    // Só processar se a conversa teve pelo menos 1 minuto
    if (duration < 60) {
      return NextResponse.json({ 
        message: 'Conversa muito curta, não salva' 
      })
    }

    // Calcular score emocional básico e detectar emoção
    const emotionalAnalysis = analyzeEmotions(messages)
    const score = emotionalAnalysis.score
    const emocao = emotionalAnalysis.emocao
    const sentimentoScore = emotionalAnalysis.sentimentoScore

    // Verificar se é primeira conversa do dia para dar pontos
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const conversationToday = await prisma.conversation.findFirst({
      where: {
        userId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    const shouldAwardPoints = !conversationToday

    // Salvar conversa com emoção e sentimento
    const conversation = await prisma.conversation.create({
      data: {
        userId,
        messages,
        score,
        duration,
        emocao,
        sentimentoScore
      }
    })

    // Criar score record
    await prisma.score.create({
      data: {
        userId,
        conversationId: conversation.id,
        score
      }
    })

    // Dar pontos se for primeira conversa do dia
    if (shouldAwardPoints) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: 10
          }
        }
      })

      // Criar notificação de risco se score muito baixo (0-3)
      if (score <= 3) {
        // Buscar professor responsável
        const assignment = await prisma.assignment.findFirst({
          where: { studentId: userId },
          include: { teacher: true }
        })

        if (assignment) {
          await prisma.notification.create({
            data: {
              userId: assignment.teacherId,
              message: `Aluno ${session.user.name} apresenta score emocional baixo. Recomenda-se atenção especial.`
            }
          })
        }

        // Notificar administradores também
        const admins = await prisma.user.findMany({
          where: { role: 'ADMINISTRADOR' }
        })

        for (const admin of admins) {
          await prisma.notification.create({
            data: {
              userId: admin.id,
              message: `Aluno ${session.user.name} em situação de risco emocional.`
            }
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      pointsAwarded: shouldAwardPoints ? 10 : 0,
      score
    })

  } catch (error) {
    console.error('Erro ao encerrar conversa:', error)
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    )
  }
}

// Função para analisar emoções e sentimentos
function analyzeEmotions(messages: ConversationMessage[]): {
  score: number
  emocao: string
  sentimentoScore: number
} {
  if (!messages || messages.length === 0) {
    return { score: 7, emocao: 'neutro', sentimentoScore: 0 }
  }

  // Pegar apenas mensagens do usuário
  const userMessages = messages.filter(m => m.role === 'user')
  
  if (userMessages.length === 0) {
    return { score: 7, emocao: 'neutro', sentimentoScore: 0 }
  }

  // Palavras por categoria emocional
  const emotionWords = {
    feliz: ['bem', 'bom', 'ótimo', 'feliz', 'alegre', 'animado', 'legal', 'adorei', 'incrível', 'maravilhoso', 'contente', 'satisfeito'],
    tranquilo: ['tranquilo', 'calmo', 'relaxado', 'paz', 'sereno', 'equilibrado'],
    triste: ['triste', 'mal', 'ruim', 'deprimido', 'sozinho', 'perdido', 'desanimado', 'chateado'],
    ansioso: ['ansioso', 'preocupado', 'estressado', 'nervoso', 'tenso', 'angústia', 'pânico', 'inseguro'],
    irritado: ['irritado', 'raiva', 'ódio', 'bravo', 'furioso', 'frustrado']
  }

  // Contar palavras por emoção
  const emotionCounts: Record<string, number> = {
    feliz: 0,
    tranquilo: 0,
    triste: 0,
    ansioso: 0,
    irritado: 0
  }

  let positiveCount = 0
  let negativeCount = 0

  userMessages.forEach(message => {
    const words = message.content.toLowerCase().split(/\s+/)

    words.forEach(word => {
      Object.entries(emotionWords).forEach(([emotion, keywords]) => {
        if (keywords.some(keyword => word.includes(keyword))) {
          emotionCounts[emotion]++
          
          // Contar como positivo ou negativo
          if (emotion === 'feliz' || emotion === 'tranquilo') {
            positiveCount++
          } else {
            negativeCount++
          }
        }
      })
    })
  })

  // Determinar emoção predominante
  let mainEmotion = 'neutro'
  let maxCount = 0
  
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    if (count > maxCount) {
      maxCount = count
      mainEmotion = emotion
    }
  })

  // Calcular sentimento score (-1 a 1)
  const totalEmotionalWords = positiveCount + negativeCount
  let sentimentoScore = 0
  
  if (totalEmotionalWords > 0) {
    sentimentoScore = (positiveCount - negativeCount) / totalEmotionalWords
  }

  // Calcular score geral (0-10)
  let baseScore = 7 // Neutro
  
  if (totalEmotionalWords === 0) {
    baseScore = 7
  } else {
    // Converter sentimentoScore (-1 a 1) para score (0-10)
    // -1 = 0, 0 = 5, 1 = 10
    baseScore = 5 + (sentimentoScore * 5)
  }

  // Ajustar baseado na emoção predominante
  if (mainEmotion === 'feliz') baseScore = Math.max(baseScore, 8)
  if (mainEmotion === 'tranquilo') baseScore = Math.max(baseScore, 7.5)
  if (mainEmotion === 'triste') baseScore = Math.min(baseScore, 4)
  if (mainEmotion === 'ansioso') baseScore = Math.min(baseScore, 5)
  if (mainEmotion === 'irritado') baseScore = Math.min(baseScore, 4.5)

  // Ajustar se mensagens muito curtas (pode indicar desânimo)
  const messageLength = userMessages.join(' ').length
  if (messageLength < 50 && negativeCount > 0) {
    baseScore = Math.max(baseScore - 1, 0)
  }

  // Garantir que está no range 0-10
  const finalScore = Math.max(0, Math.min(10, baseScore))
  
  return {
    score: Math.round(finalScore * 10) / 10,
    emocao: mainEmotion,
    sentimentoScore: Math.round(sentimentoScore * 100) / 100
  }
}
