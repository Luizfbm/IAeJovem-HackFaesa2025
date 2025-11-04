
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
import { toast } from 'sonner';

interface PointAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: {
    id: string;
    name: string;
    matricula: string;
    points: number;
  } | null;
  onSuccess?: () => void;
}

export function PointAdjustmentDialog({
  open,
  onOpenChange,
  student,
  onSuccess,
}: PointAdjustmentDialogProps) {
  const [points, setPoints] = useState<string>('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!student || !points || !reason) {
      toast.error('Preencha todos os campos');
      return;
    }

    const pointsNum = parseInt(points);
    if (isNaN(pointsNum)) {
      toast.error('Pontos inválidos');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/admin/point-adjustment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: student.id,
          points: pointsNum,
          reason,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Pontos ajustados com sucesso! Novo saldo: ${data.newPoints}`);
        setPoints('');
        setReason('');
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.error || 'Erro ao ajustar pontos');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao ajustar pontos');
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  const newPoints = student.points + (parseInt(points) || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajustar Pontos</DialogTitle>
          <DialogDescription>
            Adicione ou remova pontos do aluno {student.name} ({student.matricula})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Pontos atuais</Label>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {student.points} pontos
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Ajuste de pontos</Label>
            <Input
              id="points"
              type="number"
              placeholder="Ex: +50 ou -20"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Use números positivos para adicionar e negativos para remover
            </p>
          </div>

          {points && (
            <div className="space-y-2">
              <Label>Novo saldo</Label>
              <div className={`text-2xl font-bold ${newPoints >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {Math.max(0, newPoints)} pontos
              </div>
            </div>
          )}

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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !points || !reason}>
            {loading ? 'Ajustando...' : 'Confirmar Ajuste'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
