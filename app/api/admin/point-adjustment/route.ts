export const dynamic = 'force-dynamic';


import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { createAuditLog, getIpAddress } from '@/lib/audit';

// POST - Ajustar pontos de um aluno
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMINISTRADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { userId, points, reason } = await req.json();

    if (!userId || points === undefined || !reason) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // Buscar o aluno
    const student = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!student || student.role !== 'ALUNO') {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    // Criar o ajuste
    const adjustment = await prisma.pointAdjustment.create({
      data: {
        userId,
        adminId: session.user.id,
        points,
        reason,
      },
    });

    // Atualizar os pontos do aluno
    const newPoints = Math.max(0, student.points + points);
    await prisma.user.update({
      where: { id: userId },
      data: { points: newPoints },
    });

    // Criar log de auditoria
    await createAuditLog({
      userId: session.user.id,
      action: 'ADJUST_POINTS',
      description: `Ajustou ${points > 0 ? '+' : ''}${points} pontos para ${student.name} (${student.matricula})`,
      metadata: {
        studentId: userId,
        studentName: student.name,
        studentMatricula: student.matricula,
        pointsAdjusted: points,
        previousPoints: student.points,
        newPoints,
        reason,
      },
      ipAddress: getIpAddress(req),
    });

    // Criar notificação para o aluno
    await prisma.notification.create({
      data: {
        userId,
        message: `Seus pontos foram ajustados: ${points > 0 ? '+' : ''}${points}. Motivo: ${reason}`,
      },
    });

    return NextResponse.json({
      success: true,
      adjustment,
      newPoints,
    });
  } catch (error) {
    console.error('Erro ao ajustar pontos:', error);
    return NextResponse.json({ error: 'Erro ao ajustar pontos' }, { status: 500 });
  }
}

// GET - Listar ajustes de pontos
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMINISTRADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const where: any = {};
    if (userId) {
      where.userId = userId;
    }

    const adjustments = await prisma.pointAdjustment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ adjustments });
  } catch (error) {
    console.error('Erro ao buscar ajustes:', error);
    return NextResponse.json({ error: 'Erro ao buscar ajustes' }, { status: 500 });
  }
}
