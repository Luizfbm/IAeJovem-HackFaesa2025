
'use client'

import { useEffect, useState } from 'react'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

interface Notification {
  id: string
  message: string
  read: boolean
  createdAt: string
}

export default function NotificacoesDropdown() {
  const [notificacoes, setNotificacoes] = useState<Notification[]>([])
  const [naoLidas, setNaoLidas] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarNotificacoes()
    
    // Atualizar notificações a cada 30 segundos
    const interval = setInterval(carregarNotificacoes, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const carregarNotificacoes = async () => {
    try {
      const response = await fetch('/api/aluno/notificacoes')
      if (response.ok) {
        const data = await response.json()
        setNotificacoes(data.notificacoes)
        setNaoLidas(data.naoLidas)
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    }
  }

  const marcarComoLida = async (notificacaoId: string) => {
    try {
      const response = await fetch('/api/aluno/notificacoes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificacaoId })
      })

      if (response.ok) {
        carregarNotificacoes()
      }
    } catch (error) {
      console.error('Erro ao marcar notificação:', error)
    }
  }

  const marcarTodasComoLidas = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/aluno/notificacoes', {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Todas as notificações foram marcadas como lidas')
        carregarNotificacoes()
      }
    } catch (error) {
      console.error('Erro ao marcar todas notificações:', error)
      toast.error('Erro ao marcar notificações')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {naoLidas > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
              variant="destructive"
            >
              {naoLidas > 9 ? '9+' : naoLidas}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {naoLidas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={marcarTodasComoLidas}
              disabled={loading}
              className="h-6 text-xs"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-96">
          {notificacoes.length === 0 ? (
            <div className="text-center py-8 px-4 text-gray-500 text-sm">
              Você não tem notificações
            </div>
          ) : (
            notificacoes.map((notificacao) => (
              <DropdownMenuItem
                key={notificacao.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${
                  !notificacao.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => !notificacao.read && marcarComoLida(notificacao.id)}
              >
                <div className="flex items-start justify-between w-full">
                  <p className="text-sm flex-1 whitespace-normal">
                    {notificacao.message}
                  </p>
                  {!notificacao.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1 ml-2" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(notificacao.createdAt), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
