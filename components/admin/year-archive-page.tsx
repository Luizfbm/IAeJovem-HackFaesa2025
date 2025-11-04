
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Archive, FolderArchive, FolderOpen, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface YearArchive {
  id: string;
  year: number;
  description?: string;
  status: string;
  archivedAt?: string;
  totalStudents: number;
  totalPoints: number;
  totalConversations: number;
  createdAt: string;
}

export function YearArchivePage() {
  const [archives, setArchives] = useState<YearArchive[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [year, setYear] = useState<string>('');
  const [description, setDescription] = useState('');

  const fetchArchives = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/year-archive');
      const data = await response.json();
      if (data.archives) {
        setArchives(data.archives);
      }
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const handleCreate = async () => {
    if (!year) {
      toast.error('Informe o ano letivo');
      return;
    }

    try {
      const response = await fetch('/api/admin/year-archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: parseInt(year),
          description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Arquivo criado com sucesso!');
        setYear('');
        setDescription('');
        setDialogOpen(false);
        fetchArchives();
      } else {
        toast.error(data.error || 'Erro ao criar arquivo');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao criar arquivo');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';

    try {
      const response = await fetch(`/api/admin/year-archive/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(newStatus === 'ARCHIVED' ? 'Ano arquivado!' : 'Ano restaurado!');
        fetchArchives();
      } else {
        toast.error('Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este arquivo? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/year-archive/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Arquivo excluído!');
        fetchArchives();
      } else {
        toast.error('Erro ao excluir arquivo');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao excluir arquivo');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📦 Arquivamento de Ano Letivo
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie o arquivamento de dados por ano letivo
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar Arquivo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Arquivo de Ano Letivo</DialogTitle>
              <DialogDescription>
                Crie um registro para arquivar dados de um ano letivo específico
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="year">Ano Letivo *</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="Ex: 2025"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Ex: Ano letivo completo, turmas A, B e C..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>
                Criar Arquivo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {archives.length === 0 ? (
            <Card className="col-span-full p-12 text-center">
              <FolderArchive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum arquivo criado ainda
              </p>
            </Card>
          ) : (
            archives.map((archive) => (
              <Card key={archive.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {archive.status === 'ARCHIVED' ? (
                      <Archive className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    ) : (
                      <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Ano {archive.year}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          archive.status === 'ARCHIVED'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {archive.status === 'ARCHIVED' ? 'Arquivado' : 'Ativo'}
                      </span>
                    </div>
                  </div>
                </div>

                {archive.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {archive.description}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {archive.totalStudents}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Alunos</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {archive.totalPoints}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pontos</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {archive.totalConversations}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Conversas</div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Criado em {format(new Date(archive.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                  {archive.archivedAt && (
                    <> • Arquivado em {format(new Date(archive.archivedAt), 'dd/MM/yyyy', { locale: ptBR })}</>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={archive.status === 'ARCHIVED' ? 'default' : 'outline'}
                    onClick={() => handleToggleStatus(archive.id, archive.status)}
                    className="flex-1"
                  >
                    {archive.status === 'ARCHIVED' ? (
                      <>
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Restaurar
                      </>
                    ) : (
                      <>
                        <Archive className="h-4 w-4 mr-2" />
                        Arquivar
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(archive.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
