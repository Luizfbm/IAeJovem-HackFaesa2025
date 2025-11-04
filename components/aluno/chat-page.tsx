'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  RotateCcw, 
  Clock,
  Heart,
  Bot,
  User,
  Loader2,
  Mic,
  MicOff,
  Keyboard,
  Pause,
  Play
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type ConversationMode = 'text' | 'voice'

export default function ChatPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationStarted, setConversationStarted] = useState(false)
  const [conversationTime, setConversationTime] = useState(0)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)

  const firstName = session?.user?.name?.split(' ')[0] || 'estudante'

  // Timer da conversa
  useEffect(() => {
    if (conversationStarted) {
      timerRef.current = setInterval(() => {
        setConversationTime(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [conversationStarted])

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  // Verificar se é primeira conversa do dia
  useEffect(() => {
    const checkFirstConversation = async () => {
      try {
        const response = await fetch('/api/aluno/check-daily-conversation')
        if (response.ok) {
          const data = await response.json()
          setIsFirstTime(data.isFirstToday)
        }
      } catch (error) {
        console.error('Erro ao verificar conversa diária:', error)
      }
    }

    checkFirstConversation()
  }, [])

  // Inicializar conversa com Ayla
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = isFirstTime 
        ? `Olá! Sou a Ayla, como você está se sentindo hoje?`
        : `Olá ${firstName}, como posso te ajudar hoje?`
      
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      }])
    }
  }, [isFirstTime, firstName])

  // Timer de inatividade (3 minutos)
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    if (conversationStarted) {
      inactivityTimerRef.current = setTimeout(() => {
        endConversationDueToInactivity()
      }, 3 * 60 * 1000) // 3 minutos
    }
  }

  const endConversationDueToInactivity = async () => {
    const inactivityMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: 'Percebi que você ficou um tempo sem responder. Vou encerrar nossa conversa por agora, mas estarei sempre aqui quando você quiser conversar novamente. Cuide-se! 💙',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, inactivityMessage])
    await endConversation()
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Iniciar conversa se for a primeira mensagem do usuário
    if (!conversationStarted) {
      setConversationStarted(true)
    }

    resetInactivityTimer()

    try {
      const response = await fetch('/api/aluno/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          isFirstConversation: isFirstTime
        })
      })

      if (response.ok) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = ''

        if (reader) {
          const assistantMsgId = `msg-${Date.now()}-assistant`
          
          // Adicionar mensagem vazia da Ayla
          setMessages(prev => [...prev, {
            id: assistantMsgId,
            role: 'assistant',
            content: '',
            timestamp: new Date()
          }])

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  break
                }
                
                try {
                  const parsed = JSON.parse(data)
                  if (parsed.choices?.[0]?.delta?.content) {
                    assistantMessage += parsed.choices[0].delta.content
                    
                    // Atualizar mensagem em tempo real
                    setMessages(prev => prev.map(m => 
                      m.id === assistantMsgId 
                        ? { ...m, content: assistantMessage }
                        : m
                    ))
                  }
                } catch (e) {
                  // Ignorar linhas inválidas
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: 'Desculpe, tive um problema técnico. Pode tentar novamente?',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const clearConversation = () => {
    setMessages([{
      id: 'welcome-new',
      role: 'assistant', 
      content: `Olá ${firstName}, vamos começar uma nova conversa! Como você está se sentindo?`,
      timestamp: new Date()
    }])
    setConversationStarted(false)
    setConversationTime(0)
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
  }

  const endConversation = async () => {
    if (!conversationStarted || conversationTime < 60) {
      clearConversation()
      return
    }

    try {
      await fetch('/api/aluno/end-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp
          })),
          duration: conversationTime
        })
      })

      // Limpar timers
      if (timerRef.current) clearInterval(timerRef.current)
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)

      clearConversation()
    } catch (error) {
      console.error('Erro ao encerrar conversa:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-iaj-pink to-rose-400 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-800">Conversando com Ayla</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {conversationStarted && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(conversationTime)}</span>
                  </div>
                )}
                <span className="text-xs">
                  {conversationTime >= 60 ? 'Conversa válida para pontos!' : conversationTime > 0 ? 'Mínimo 1 min para ganhar pontos' : ''}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearConversation}
              className="text-gray-600"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Limpar
            </Button>
            
            {conversationStarted && (
              <Button
                variant="outline"
                size="sm"
                onClick={endConversation}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Encerrar conversa
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start space-x-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-iaj-pink to-rose-400 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={cn(
                  'max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm',
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-iaj-blue to-blue-500 text-white ml-auto'
                    : 'bg-white text-gray-800 border'
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p
                  className={cn(
                    'text-xs mt-2',
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  )}
                >
                  {format(message.timestamp, 'HH:mm', { locale: ptBR })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-iaj-blue to-blue-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-iaj-pink to-rose-400 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-iaj-pink" />
                  <span className="text-sm text-gray-600">Ayla está pensando...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              disabled={loading}
              className="flex-1 border-gray-300 focus:border-iaj-blue"
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-iaj-blue to-blue-500 hover:from-blue-600 hover:to-blue-600 px-6"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
