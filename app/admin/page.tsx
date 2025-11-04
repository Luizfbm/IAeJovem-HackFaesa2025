
'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Settings, 
  Archive, 
  FileText, 
  Heart,
  LogOut,
  Users,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(' ')[0] || 'Administrador'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-iaj-blue to-iaj-pink flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">IAeJovem</h1>
              <p className="text-xs text-gray-500">Painel Administrativo</p>
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
            Bem-vindo, {firstName}!
          </h2>
          <p className="text-gray-600">
            Gerencie o sistema IAeJovem através das ferramentas abaixo
          </p>
        </div>

        {/* Admin Tools Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Ferramentas */}
          <Link href="/admin/ferramentas">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-iaj-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2">Ferramentas</CardTitle>
                <p className="text-sm text-gray-600">
                  Ajuste pontos, gerenciamento de usuários e configurações do sistema
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Arquivamento */}
          <Link href="/admin/arquivamento">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Archive className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2">Arquivamento</CardTitle>
                <p className="text-sm text-gray-600">
                  Gerencie arquivamento de anos letivos e dados históricos
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Auditoria */}
          <Link href="/admin/auditoria">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-rose-50 to-rose-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2">Auditoria</CardTitle>
                <p className="text-sm text-gray-600">
                  Visualize logs de atividades e ações no sistema
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-iaj-blue" />
                <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">3</div>
              <p className="text-xs text-gray-500 mt-1">Total de usuários no sistema</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-rose-500" />
                <CardTitle className="text-sm font-medium">Conversas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">3</div>
              <p className="text-xs text-gray-500 mt-1">Conversas registradas</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <CardTitle className="text-sm font-medium">Sistema</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-gray-500 mt-1">Todos os serviços operacionais</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
