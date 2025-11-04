
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface BulkActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStudents: Array<{ id: string; name: string; matricula: string }>;
  teachers?: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
}

export function BulkActionsDialog({
  open,
  onOpenChange,
  selectedStudents,
  teachers = [],
  onSuccess,
}: BulkActionsDialogProps) {
  const [action, setAction] = useState<string>('');
  const [teacherId, setTeacherId] = useState<string>('');
  const [points, setPoints] = useState<string>('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!action) {
      toast.error('Selecione uma ação');
      return;
    }

    if (selectedStudents.length === 0) {
      toast.error('Nenhum aluno selecionado');
      return;
    }

    const studentIds = selectedStudents.map(s => s.id);

    let body: any = { action, studentIds };

    if (action === 'assign_teacher') {
      if (!teacherId) {
        toast.error('Selecione um professor');
        return;
      }
      body.teacherId = teacherId;
    } else if (action === 'adjust_points') {
      if (!points || !reason) {
        toast.error('Preencha todos os campos');
        return;
      }
      body.points = parseInt(points);
      body.reason = reason;
    } else if (action === 'send_notification') {
      if (!reason) {
        toast.error('Digite a mensagem');
        return;
      }
      body.reason = reason;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/admin/bulk-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Ação executada com sucesso!');
        setAction('');
        setTeacherId('');
        setPoints('');
        setReason('');
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.error || 'Erro ao executar ação');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao executar ação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Ações em Massa
          </DialogTitle>
          <DialogDescription>
            Execute uma ação para {selectedStudents.length} aluno(s) selecionado(s)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {selectedStudents.length > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {selectedStudents.length} aluno(s) selecionado(s)
                </span>
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1 max-h-32 overflow-y-auto">
                {selectedStudents.map(s => (
                  <div key={s.id}>• {s.name} ({s.matricula})</div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="action">Ação *</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assign_teacher">Atribuir a um Professor</SelectItem>
                <SelectItem value="adjust_points">Ajustar Pontos</SelectItem>
                <SelectItem value="send_notification">Enviar Notificação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {action === 'assign_teacher' && (
            <div className="space-y-2">
              <Label htmlFor="teacher">Professor *</Label>
              <Select value={teacherId} onValueChange={setTeacherId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um professor" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {action === 'adjust_points' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="points">Ajuste de Pontos *</Label>
                <Input
                  id="points"
                  type="number"
                  placeholder="Ex: +50 ou -20"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Justificativa *</Label>
                <Textarea
                  id="reason"
                  placeholder="Descreva o motivo do ajuste..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          {action === 'send_notification' && (
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem *</Label>
              <Textarea
                id="message"
                placeholder="Digite a mensagem para os alunos..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !action}>
            {loading ? 'Executando...' : 'Executar Ação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
