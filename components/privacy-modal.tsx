
'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Lock } from 'lucide-react'

interface PrivacyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PrivacyModal({ open, onOpenChange }: PrivacyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-iaj-pink flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-2xl">Política de Privacidade</DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="h-96 pr-4">
          <div className="space-y-6 text-sm text-gray-700">
            <div className="bg-rose-50 p-4 rounded-lg border-l-4 border-iaj-pink">
              <h3 className="font-semibold text-lg mb-2 text-iaj-pink">🛡️ Compromisso com sua Privacidade</h3>
              <p className="font-medium">
                No IAeJovem, sua privacidade é nossa prioridade absoluta. 
                Protegemos suas informações com o mais alto nível de segurança.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-iaj-blue">1. Informações Coletadas</h3>
              <p className="mb-2">Coletamos apenas o essencial:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Nome, matrícula e dados acadêmicos básicos</li>
                <li>Conversas com a Ayla (criptografadas e protegidas)</li>
                <li>Pontos e resgates realizados</li>
                <li>Indicadores gerais de bem-estar (sem detalhes das conversas)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-iaj-blue">2. Como Protegemos seus Dados</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Criptografia avançada:</strong> Todas as conversas são criptografadas</li>
                <li><strong>Acesso restrito:</strong> Apenas sistemas autorizados processam os dados</li>
                <li><strong>Servidores seguros:</strong> Infraestrutura protegida e monitorada</li>
                <li><strong>Auditoria regular:</strong> Verificações constantes de segurança</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-iaj-blue">3. Quem Pode Ver Suas Informações</h3>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-medium text-green-800">✅ O que professores e coordenadores veem:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-green-700">
                  <li>Apenas indicadores gerais de bem-estar (verde/amarelo/vermelho)</li>
                  <li>Frequência de conversas (sem conteúdo)</li>
                  <li>Pontos acumulados</li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg mt-3">
                <p className="font-medium text-red-800">❌ O que eles NÃO veem:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-red-700">
                  <li>Conteúdo das suas conversas</li>
                  <li>Detalhes sobre o que você conversou</li>
                  <li>Mensagens específicas trocadas com a Ayla</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-iaj-blue">4. Retenção de Dados</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Conversas: Mantidas durante o período escolar</li>
                <li>Dados acadêmicos: Conforme política da instituição</li>
                <li>Você pode solicitar exclusão a qualquer momento</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-iaj-blue">5. Seus Direitos</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Acessar suas informações</li>
                <li>Corrigir dados incorretos</li>
                <li>Solicitar exclusão de dados</li>
                <li>Saber como seus dados são usados</li>
                <li>Revogar consentimento a qualquer momento</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-iaj-blue">6. Situações Especiais</h3>
              <p>
                Apenas em casos de risco iminente à segurança, informações relevantes 
                podem ser compartilhadas com profissionais qualificados para garantir sua proteção.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-center font-medium text-iaj-blue">
                Dúvidas sobre privacidade? Entre em contato com a coordenação.
                Estamos aqui para proteger você e seus dados.
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-iaj-pink hover:bg-rose-600"
          >
            Compreendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
