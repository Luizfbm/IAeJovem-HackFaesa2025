
'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MessageCircle, 
  Star, 
  Gift, 
  TrendingUp,
  Heart,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Stats {
  totalConversations: number
  totalPoints: number
  lastConversation: string | null
  weeklyConversations: number
}

export default function AlunoHomePage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/aluno/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const firstName = session?.user?.name?.split(' ')[0] || 'Estudante'

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Cabeçalho Principal */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-iaj-blue to-iaj-pink p-6 rounded-2xl text-white shadow-lg">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold">Olá, {firstName}!</h1>
            <p className="text-blue-100">Como você está se sentindo hoje?</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-iaj-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-iaj-blue group-hover:translate-x-1 transition-transform" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Conversar com Ayla</h3>
            <p className="text-gray-600 text-sm mb-4">
              Tenha uma conversa acolhedora e ganhe pontos cuidando do seu bem-estar.
            </p>
            <Link href="/aluno/conversar">
              <Button className="w-full bg-iaj-blue hover:bg-blue-600">
                Começar conversa
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-100 hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-yellow-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Meus Pontos</h3>
            <p className="text-gray-600 text-sm mb-4">
              Acompanhe seus pontos e veja seu histórico de atividades.
            </p>
            <Link href="/aluno/pontos">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600">
                Ver pontos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-pink-100 hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-iaj-pink flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-iaj-pink group-hover:translate-x-1 transition-transform" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Loja de Pontos</h3>
            <p className="text-gray-600 text-sm mb-4">
              Troque seus pontos por recompensas incríveis na nossa loja.
            </p>
            <Link href="/aluno/loja">
              <Button className="w-full bg-iaj-pink hover:bg-rose-600">
                Explorar loja
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center p-6 border-0 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-iaj-blue to-blue-400 mx-auto flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {loading ? '...' : stats?.totalConversations || 0}
          </div>
          <p className="text-sm text-gray-600">Conversas realizadas</p>
        </Card>

        <Card className="text-center p-6 border-0 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {session?.user?.points || 0}
          </div>
          <p className="text-sm text-gray-600">Pontos acumulados</p>
        </Card>

        <Card className="text-center p-6 border-0 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 mx-auto flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {loading ? '...' : stats?.weeklyConversations || 0}
          </div>
          <p className="text-sm text-gray-600">Esta semana</p>
        </Card>

        <Card className="text-center p-6 border-0 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mx-auto flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {loading ? '...' : stats?.lastConversation ? 'Hoje' : 'Nunca'}
          </div>
          <p className="text-sm text-gray-600">Última conversa</p>
        </Card>
      </div>

      {/* Mensagem Motivacional */}
      <Card className="border-0 bg-gradient-to-r from-iaj-green to-emerald-400 text-white shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            Cuidar de você é sempre importante
          </h3>
          <p className="opacity-90 mb-6">
            Lembre-se: não há problema em não estar bem todos os dias. 
            A Ayla está sempre aqui para te ouvir e apoiar.
          </p>
          <Link href="/aluno/conversar">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-iaj-green hover:bg-gray-100"
            >
              Conversar agora
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
