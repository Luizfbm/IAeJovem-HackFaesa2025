
'use client'

import { useState } from 'react'
import { Heart, Users, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LoginModal from '@/components/auth/login-modal'
import TermsModal from '@/components/terms-modal'
import PrivacyModal from '@/components/privacy-modal'
import Image from 'next/image'

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-rose-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header com Logo */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-rose-500 flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
              <span className="text-iaj-blue">IAe</span>
              <span className="text-iaj-pink">Jovem</span>
              <span className="text-gray-600 text-2xl md:text-3xl ml-2">(IAJ)</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              Um espaço tranquilo para você se expressar
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Lado Esquerdo - Conteúdo */}
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 rounded-lg gradient-iaj-blue">
                  <div className="w-10 h-10 rounded-full bg-iaj-blue flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Conversa Acolhedora</h3>
                    <p className="text-gray-600">
                      Converse com a Ayla, que está sempre aqui para te ouvir com empatia e compreensão.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg gradient-iaj-pink">
                  <div className="w-10 h-10 rounded-full bg-iaj-pink flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Totalmente Confidencial</h3>
                    <p className="text-gray-600">
                      Suas conversas são completamente privadas e seguras. Só você e a Ayla.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg gradient-iaj-green">
                  <div className="w-10 h-10 rounded-full bg-iaj-green flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Apoio Emocional</h3>
                    <p className="text-gray-600">
                      Receba suporte emocional personalizado e ganhe pontos por cuidar do seu bem-estar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de Login */}
              <div className="text-center">
                <Button
                  onClick={() => setShowLogin(true)}
                  size="lg"
                  className="bg-gradient-to-r from-iaj-blue to-iaj-pink hover:from-blue-600 hover:to-rose-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-iaj hover:shadow-iaj-hover transition-all duration-300 animate-scale-in"
                >
                  Entrar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Faça login com sua matrícula escolar
                </p>
              </div>
            </div>

            {/* Lado Direito - Ilustração */}
            <div className="hidden lg:block animate-fade-in">
              <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-50 to-rose-100 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-iaj-blue to-iaj-pink mx-auto flex items-center justify-center shadow-lg">
                      <Heart className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700">Olá!</h3>
                    <p className="text-gray-600 max-w-xs mx-auto">
                      Sou a Ayla e estou aqui para te ouvir. Como você está se sentindo hoje?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer com Links Legais (apenas desktop) */}
          <div className="hidden md:block mt-16 pt-8 border-t border-gray-200">
            <div className="flex justify-center space-x-8 text-sm">
              <button
                onClick={() => setShowTerms(true)}
                className="text-gray-500 hover:text-iaj-blue transition-colors"
              >
                Termos de Uso
              </button>
              <button
                onClick={() => setShowPrivacy(true)}
                className="text-gray-500 hover:text-iaj-blue transition-colors"
              >
                Política de Privacidade
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
      <TermsModal open={showTerms} onOpenChange={setShowTerms} />
      <PrivacyModal open={showPrivacy} onOpenChange={setShowPrivacy} />
    </>
  )
}
