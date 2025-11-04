
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AIInsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'general' | 'student';
  studentId?: string;
  studentName?: string;
}

export function AIInsightsDialog({
  open,
  onOpenChange,
  type,
  studentId,
  studentName,
}: AIInsightsDialogProps) {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const generateInsights = async () => {
    try {
      setLoading(true);
      setInsights('');
      setData(null);

      const response = await fetch('/api/admin/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          filters: type === 'student' ? { studentId } : {},
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setInsights(result.insights);
        setData(result.data);
      } else {
        toast.error(result.error || 'Erro ao gerar insights');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao gerar insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Análise com IA
          </DialogTitle>
          <DialogDescription>
            {type === 'general'
              ? 'Análise geral do bem-estar emocional dos estudantes'
              : `Análise personalizada do aluno ${studentName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!insights && !loading && (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Clique no botão abaixo para gerar uma análise com inteligência artificial
              </p>
              <Button onClick={generateInsights}>
                Gerar Análise
              </Button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Gerando análise com IA...
              </p>
            </div>
          )}

          {insights && !loading && (
            <div>
              {data && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {type === 'general' ? (
                    <>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {data.totalStudents}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Alunos</div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {data.totalConversations}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Conversas</div>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {data.avgScore}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Score Médio</div>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {data.studentsAtRisk}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Em Risco</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {data.totalConversations}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Conversas</div>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {data.avgScore}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Score Médio</div>
                      </div>
                      <div className="col-span-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 capitalize">
                          {data.trend}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Tendência</div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Análise Gerada por IA
                </h4>
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {insights}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={generateInsights} variant="outline" className="flex-1">
                  Gerar Nova Análise
                </Button>
                <Button onClick={() => onOpenChange(false)} className="flex-1">
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
