
'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Heart, Shield, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TermsAcceptancePage() {
  const { data: session, update } = useSession()
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAccept = async () => {
    if (!session?.user?.id) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/user/accept-terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        // Atualizar sessão
        await update({ termsAccepted: true })
        
        // Redirecionar baseado no papel do usuário
        if (session.user.role === 'ALUNO') {
          router.push('/aluno')
        } else if (session.user.role === 'PROFESSOR') {
          router.push('/professor')
        } else if (session.user.role === 'ADMINISTRADOR') {
          router.push('/admin')
        }
      }
    } catch (error) {
      console.error('Erro ao aceitar termos:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-rose-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-iaj">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-iaj-blue to-iaj-pink flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            <span className="text-iaj-blue">Bem-vindo</span>{' '}
            <span className="text-gray-700">ao IAeJovem!</span>
          </CardTitle>
          <p className="text-gray-600 text-lg mt-2">
            Olá, {session?.user?.name}! Antes de começar, precisamos do seu consentimento.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Destaque da Confidencialidade */}
          <div className="bg-gradient-to-r from-rose-50 to-blue-50 p-6 rounded-lg border-l-4 border-iaj-pink">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-iaj-pink flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-iaj-pink mb-2">
                  🔒 SUAS CONVERSAS SÃO TOTALMENTE CONFIDENCIAIS
                </h3>
                <p className="text-gray-700 font-medium">
                  Todas as suas conversas com a Ayla são completamente privadas e seguras. 
                  Apenas você tem acesso ao conteúdo das suas conversas.
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-600 list-disc list-inside">
                  <li>Professores veem apenas indicadores gerais de bem-estar</li>
                  <li>Nenhum conteúdo específico das conversas é compartilhado</li>
                  <li>Seus dados são protegidos com criptografia avançada</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resumo dos Termos */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-iaj-blue text-lg">📱 Como usar o IAeJovem</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Converse livremente com a Ayla sobre seus sentimentos</li>
                <li>• Ganhe pontos cuidando do seu bem-estar emocional</li>
                <li>• Troque pontos por recompensas na loja</li>
                <li>• Receba apoio acolhedor sempre que precisar</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-iaj-green text-lg">🛡️ Seus direitos</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Direito à privacidade e confidencialidade absoluta</li>
                <li>• Direito de interromper conversas quando quiser</li>
                <li>• Direito ao suporte emocional adequado</li>
                <li>• Direito de solicitar exclusão dos seus dados</li>
              </ul>
            </div>
          </div>

          {/* Aceitar Termos */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="accept-terms"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked as boolean)}
                className="mt-1"
              />
              <div className="space-y-2 flex-1">
                <label 
                  htmlFor="accept-terms" 
                  className="text-sm font-medium leading-relaxed cursor-pointer"
                >
                  Li e aceito os termos de uso do IAeJovem. Entendo que:
                </label>
                <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                  <li>Minhas conversas são completamente confidenciais</li>
                  <li>A plataforma é para apoio emocional e bem-estar</li>
                  <li>Posso interromper o uso a qualquer momento</li>
                  <li>Meus dados são protegidos e privados</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="order-2 sm:order-1"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            
            <Button
              onClick={handleAccept}
              disabled={!accepted || loading}
              className="bg-gradient-to-r from-iaj-blue to-iaj-pink hover:from-blue-600 hover:to-rose-600 text-white px-8 py-3 order-1 sm:order-2"
            >
              {loading ? 'Processando...' : 'Aceitar e Continuar'}
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500">
            Ao aceitar, você concorda com os{' '}
            <span className="text-iaj-blue font-medium cursor-pointer">
              Termos de Uso
            </span>{' '}
            e{' '}
            <span className="text-iaj-blue font-medium cursor-pointer">
              Política de Privacidade
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
