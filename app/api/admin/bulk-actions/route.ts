export const dynamic = 'force-dynamic';


import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { createAuditLog, getIpAddress } from '@/lib/audit';

// POST - Executar ação em massa
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMINISTRADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { action, studentIds, teacherId, points, reason } = await req.json();

    if (!action || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    let result: any = {};

    switch (action) {
      case 'assign_teacher':
        if (!teacherId) {
          return NextResponse.json({ error: 'Professor não especificado' }, { status: 400 });
        }

        // Remover atribuições antigas
        await prisma.assignment.deleteMany({
          where: { studentId: { in: studentIds } },
        });

        // Criar novas atribuições
        const assignments = await prisma.assignment.createMany({
          data: studentIds.map(studentId => ({
            teacherId,
            studentId,
          })),
        });

        result = { assignmentsCreated: assignments.count };

        // Log de auditoria
        await createAuditLog({
          userId: session.user.id,
          action: 'BULK_ACTION',
          description: `Atribuiu ${studentIds.length} alunos ao professor`,
          metadata: {
            action: 'assign_teacher',
            studentIds,
            teacherId,
            count: studentIds.length,
          },
          ipAddress: getIpAddress(req),
        });
        break;

      case 'adjust_points':
        if (points === undefined || !reason) {
          return NextResponse.json({ error: 'Pontos ou motivo não especificados' }, { status: 400 });
        }

        // Buscar alunos
        const students = await prisma.user.findMany({
          where: {
            id: { in: studentIds },
            role: 'ALUNO',
          },
        });

        // Criar ajustes e atualizar pontos
        for (const student of students) {
          await prisma.pointAdjustment.create({
            data: {
              userId: student.id,
              adminId: session.user.id,
              points,
              reason,
            },
          });

          const newPoints = Math.max(0, student.points + points);
          await prisma.user.update({
            where: { id: student.id },
            data: { points: newPoints },
          });

          // Criar notificação
          await prisma.notification.create({
            data: {
              userId: student.id,
              message: `Seus pontos foram ajustados: ${points > 0 ? '+' : ''}${points}. Motivo: ${reason}`,
            },
          });
        }

        result = { adjustmentsCreated: students.length };

        // Log de auditoria
        await createAuditLog({
          userId: session.user.id,
          action: 'BULK_ACTION',
          description: `Ajustou pontos de ${studentIds.length} alunos (${points > 0 ? '+' : ''}${points})`,
          metadata: {
            action: 'adjust_points',
            studentIds,
            points,
            reason,
            count: studentIds.length,
          },
          ipAddress: getIpAddress(req),
        });
        break;

      case 'send_notification':
        if (!reason) {
          return NextResponse.json({ error: 'Mensagem não especificada' }, { status: 400 });
        }

        const notifications = await prisma.notification.createMany({
          data: studentIds.map(studentId => ({
            userId: studentId,
            message: reason,
          })),
        });

        result = { notificationsSent: notifications.count };

        // Log de auditoria
        await createAuditLog({
          userId: session.user.id,
          action: 'BULK_ACTION',
          description: `Enviou notificação para ${studentIds.length} alunos`,
          metadata: {
            action: 'send_notification',
            studentIds,
            message: reason,
            count: studentIds.length,
          },
          ipAddress: getIpAddress(req),
        });
        break;

      default:
        return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Erro ao executar ação em massa:', error);
    return NextResponse.json({ error: 'Erro ao executar ação' }, { status: 500 });
  }
}
