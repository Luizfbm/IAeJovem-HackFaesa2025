
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
import { Shield } from 'lucide-react'

interface TermsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-iaj-blue flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-2xl">Termos de Uso</DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="h-96 pr-4">
          <div className="space-y-6 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-iaj-blue">1. Sobre o IAeJovem</h3>
              <p>
                O IAeJovem (IAJ) é uma plataforma de apoio emocional voltada para estudantes, 
                oferecendo um espaço seguro e acolhedor para expressão de sentimentos e busca de apoio.
              </p>
            </div>

            <div className="bg-rose-50 p-4 rounded-lg border-l-4 border-iaj-pink">
              <h3 className="font-semibold text-lg mb-2 text-iaj-pink">🔒 CONFIDENCIALIDADE ABSOLUTA</h3>
              <p className="font-medium">
                <strong>TODAS as suas conversas são completamente CONFIDENCIAIS.</strong>
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Suas conversas com a Ayla são privadas e seguras</li>
                <li>Nenhum conteúdo específico das conversas é compartilhado</li>
                <li>Apenas informações gerais de bem-estar são monitoradas para seu cuidado</li>
                <li>Professores e coordenadores não têm acesso ao conteúdo das conversas</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-iaj-blue">2. Como Funciona</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Converse livremente com a Ayla sobre seus sentimentos</li>
                <li>Ganhe pontos por cuidar do seu bem-estar emocional</li>
                <li>Troque pontos por recompensas na loja</li>
                <li>Seus professores acompanham apenas seu bem-estar geral</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-iaj-blue">3. Uso Responsável</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Use a plataforma de forma respeitosa</li>
                <li>Seja honesto sobre seus sentimentos</li>
                <li>Procure ajuda profissional quando necessário</li>
                <li>Não compartilhe seu login com outras pessoas</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-iaj-blue">4. Suporte de Emergência</h3>
              <p>
                Em situações de risco, a Ayla pode oferecer recursos de ajuda imediata, 
                incluindo contatos de emergência e centros de apoio.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-iaj-blue">5. Seus Direitos</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Direito à privacidade e confidencialidade</li>
                <li>Direito de interromper conversas a qualquer momento</li>
                <li>Direito de solicitar exclusão de dados pessoais</li>
                <li>Direito ao suporte emocional adequado</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-center font-medium text-iaj-blue">
                Ao usar o IAeJovem, você concorda com estes termos e 
                reconhece que suas conversas são totalmente confidenciais.
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-iaj-blue hover:bg-blue-600"
          >
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
