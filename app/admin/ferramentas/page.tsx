
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Users, TrendingUp } from 'lucide-react';
import { AIInsightsDialog } from '@/components/admin/ai-insights-dialog';

export default function FerramentasPage() {
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiDialogType, setAiDialogType] = useState<'general' | 'student'>('general');

  const handleOpenAIInsights = (type: 'general' | 'student') => {
    setAiDialogType(type);
    setAiDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          🛠️ Ferramentas Avançadas
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Recursos da Fase 3 para gestão inteligente da plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Análise com IA - Geral */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleOpenAIInsights('general')}>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Análise com IA
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Gere insights inteligentes sobre o bem-estar emocional geral dos estudantes
          </p>
          <Button variant="outline" className="w-full">
            Gerar Análise Geral
          </Button>
        </Card>

        {/* Dark Mode */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <TrendingUp className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Modo Escuro
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            O modo escuro já está disponível! Use o botão no canto superior para alternar
          </p>
          <div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-lg text-center">
            ✓ Funcionalidade Ativa
          </div>
        </Card>

        {/* Info sobre outras ferramentas */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Mais Ferramentas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            • Ajuste manual de pontos (no painel de alunos)
            • Ações em massa (selecione vários alunos)
            • Log de auditoria completo
          </p>
        </Card>
      </div>

      {/* Estatísticas da Fase 3 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📊 Funcionalidades da Fase 3
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-gray-900 dark:text-white">IA para Análises</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Insights personalizados gerados por inteligência artificial sobre o bem-estar dos estudantes
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-900 dark:text-white">Ações em Massa</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Execute ações para múltiplos alunos simultaneamente: atribuir professor, ajustar pontos, enviar notificações
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-gray-900 dark:text-white">Log de Auditoria</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Histórico completo de todas as ações realizadas na plataforma para transparência total
            </p>
          </div>
        </div>
      </Card>

      {/* Dialog de IA */}
      <AIInsightsDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        type={aiDialogType}
      />
    </div>
  );
}
