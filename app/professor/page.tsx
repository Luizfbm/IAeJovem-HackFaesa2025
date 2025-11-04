
'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Heart,
  LogOut,
  Users,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Award,
  FileText
} from 'lucide-react'

export default function ProfessorPage() {
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(' ')[0] || 'Professor(a)'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-iaj-pink flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">IAeJovem</h1>
              <p className="text-xs text-gray-500">Painel do Professor</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Olá, {firstName}!
          </h2>
          <p className="text-gray-600">
            Acompanhe o progresso e bem-estar emocional dos seus alunos
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Meus Alunos */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-iaj-blue flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-2">Meus Alunos</CardTitle>
              <p className="text-sm text-gray-600 mb-4">
                Visualize informações e progresso dos seus alunos
              </p>
              <div className="text-3xl font-bold text-iaj-blue">1</div>
              <p className="text-xs text-gray-500 mt-1">aluno cadastrado</p>
            </CardContent>
          </Card>

          {/* Conversas */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-2">Conversas</CardTitle>
              <p className="text-sm text-gray-600 mb-4">
                Acompanhe as interações dos alunos com Ayla
              </p>
              <div className="text-3xl font-bold text-purple-500">3</div>
              <p className="text-xs text-gray-500 mt-1">conversas registradas</p>
            </CardContent>
          </Card>

          {/* Notas e Observações */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-rose-100 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-2">Notas</CardTitle>
              <p className="text-sm text-gray-600 mb-4">
                Adicione observações sobre os alunos
              </p>
              <div className="text-3xl font-bold text-rose-500">1</div>
              <p className="text-xs text-gray-500 mt-1">nota registrada</p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Features */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Progresso Geral */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <CardTitle className="text-base">Progresso Geral</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Engajamento</span>
                <span className="text-sm font-semibold text-green-600">Alto</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-gray-500">
                Os alunos estão utilizando bem a plataforma
              </p>
            </CardContent>
          </Card>

          {/* Recursos */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-iaj-blue" />
                <CardTitle className="text-base">Recursos</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Award className="w-4 h-4 mr-2" />
                Sistema de Pontos
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Heart className="w-4 h-4 mr-2" />
                Bem-estar Emocional
              </Button>
              <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
                Acompanhe métricas e insights sobre seus alunos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        <Card className="mt-8 bg-gradient-to-r from-iaj-blue to-purple-500 text-white border-0">
          <CardContent className="py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Sistema em Desenvolvimento</h3>
                <p className="text-blue-100 text-sm">
                  Novas funcionalidades para acompanhamento pedagógico serão adicionadas em breve. 
                  Por enquanto, você pode acompanhar as estatísticas gerais dos seus alunos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
