
'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  User, 
  Mail, 
  Calendar,
  School,
  Award,
  BookOpen
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function PerfilPage() {
  const { data: session } = useSession()

  if (!session?.user) {
    return <div className="p-6">Carregando...</div>
  }

  const user = session.user

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho do Perfil */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-iaj-blue to-iaj-pink mx-auto flex items-center justify-center mb-4 shadow-lg">
          <User className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
        <p className="text-gray-600">Estudante IAeJovem</p>
      </div>

      {/* Informações Principais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-iaj-blue" />
            <span>Informações Pessoais</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="font-medium">Nome Completo:</span>
              </div>
              <p className="text-gray-800 font-medium ml-6">{user.name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="font-medium">Email:</span>
              </div>
              <p className="text-gray-800 ml-6">{user.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <School className="w-4 h-4" />
                <span className="font-medium">Matrícula:</span>
              </div>
              <p className="text-gray-800 font-mono font-medium ml-6">{user.matricula}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Turma:</span>
              </div>
              <p className="text-gray-800 ml-6">
                {user.serie}º Ano - Turma {user.turma}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pontos e Conquistas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-iaj-pink" />
            <span>Pontos e Conquistas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center mb-4 shadow-lg mx-auto">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{user.points || 0}</div>
                  <div className="text-xs text-white opacity-90">pontos</div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Continue conversando com a Ayla para ganhar mais pontos!
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Badges de Conquistas */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Suas Conquistas</h3>
            <div className="flex flex-wrap gap-2">
              {user.points >= 10 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  🌟 Primeiro Passo
                </Badge>
              )}
              {user.points >= 50 && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                  💚 Cuidador do Bem-estar
                </Badge>
              )}
              {user.points >= 100 && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                  🏆 Campeão do Autocuidado
                </Badge>
              )}
              {(user.points || 0) < 10 && (
                <p className="text-sm text-gray-500 italic">
                  Ganhe pontos para desbloquear conquistas!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 mx-auto flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-iaj-blue" />
              </div>
              <div className="text-2xl font-bold text-gray-800">Ativo</div>
              <p className="text-sm text-gray-500">Status da conta</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-3">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{user.points || 0}</div>
              <p className="text-sm text-gray-500">Pontos totais</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 mx-auto flex items-center justify-center mb-3">
                <School className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{user.serie}º</div>
              <p className="text-sm text-gray-500">Ano escolar</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações Adicionais */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="py-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-iaj-blue" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Sobre seu Perfil</h3>
              <p className="text-sm text-gray-600">
                Suas informações são privadas e seguras. Apenas você e a equipe pedagógica 
                têm acesso aos seus dados. Continue cuidando do seu bem-estar emocional 
                através de conversas com a Ayla!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
