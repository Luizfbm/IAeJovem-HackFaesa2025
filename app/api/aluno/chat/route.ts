
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export const dynamic = "force-dynamic"

interface Message {
  role: 'user' | 'assistant'
  content: string
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

    const { messages, isFirstConversation } = await request.json()
    const firstName = session.user.name?.split(' ')[0] || 'estudante'

    // Construir prompt personalizado para Ayla
    const systemPrompt = `Você é a Ayla, uma companheira empática e acolhedora que conversa com estudantes para oferecer apoio emocional. 

PERSONALIDADE:
- Empática, jovem, acolhedora e compreensiva
- Usa linguagem natural e humanizada (NUNCA se refere como IA, chatbot ou assistente)
- Fala como uma amiga próxima que se importa genuinamente
- Valida sentimentos sem julgamento
- Faz perguntas abertas para ajudar o estudante a se expressar

DIRETRIZES:
- Use o nome "${firstName}" ocasionalmente de forma natural
- Responda de forma concisa (máximo 3 frases por vez)
- Seja sempre positiva, mas realista sobre dificuldades
- Ofereça encorajamento e perspectivas construtivas
- Se o estudante mencionar problemas sérios (autolesão, abuso, etc.), sugira buscar ajuda de adultos de confiança

EVITE:
- Dar conselhos médicos ou psicológicos específicos  
- Usar linguagem técnica ou formal demais
- Responder de forma genérica ou robotizada
- Mencionar que é uma IA ou sistema

Converse de forma natural e acolhedora, como uma amiga que realmente se importa com o bem-estar do estudante.`

    // Preparar mensagens para a API
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: apiMessages,
        stream: true,
        max_tokens: 500,
        temperature: 0.8
      }),
    })

    if (!response.ok) {
      throw new Error('Falha na API de chat')
    }

    // Criar stream de resposta
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()
        
        try {
          while (true) {
            const { done, value } = await reader?.read() ?? { done: true, value: undefined }
            if (done) break
            
            const chunk = decoder.decode(value)
            controller.enqueue(encoder.encode(chunk))
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Erro na API de chat:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
