export const dynamic = 'force-dynamic';


import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { createAuditLog, getIpAddress } from '@/lib/audit';

// GET - Listar anos arquivados
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMINISTRADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const archives = await prisma.yearArchive.findMany({
      orderBy: { year: 'desc' },
    });

    return NextResponse.json({ archives });
  } catch (error) {
    console.error('Erro ao buscar arquivos:', error);
    return NextResponse.json({ error: 'Erro ao buscar arquivos' }, { status: 500 });
  }
}

// POST - Criar arquivo de ano letivo
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMINISTRADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { year, description } = await req.json();

    if (!year) {
      return NextResponse.json({ error: 'Ano é obrigatório' }, { status: 400 });
    }

    // Verificar se já existe um arquivo para este ano
    const existingArchive = await prisma.yearArchive.findFirst({
      where: { year },
    });

    if (existingArchive) {
      return NextResponse.json({ error: 'Já existe um arquivo para este ano' }, { status: 400 });
    }

    // Calcular estatísticas
    const totalStudents = await prisma.user.count({
      where: { role: 'ALUNO' },
    });

    const totalPoints = await prisma.user.aggregate({
      where: { role: 'ALUNO' },
      _sum: { points: true },
    });

    const totalConversations = await prisma.conversation.count();

    // Criar arquivo
    const archive = await prisma.yearArchive.create({
      data: {
        year,
        description,
        status: 'ACTIVE',
        totalStudents,
        totalPoints: totalPoints._sum.points || 0,
        totalConversations,
      },
    });

    // Criar log de auditoria
    await createAuditLog({
      userId: session.user.id,
      action: 'ARCHIVE_YEAR',
      description: `Criou arquivo para o ano letivo ${year}`,
      metadata: {
        year,
        description,
        totalStudents,
        totalPoints: totalPoints._sum.points || 0,
        totalConversations,
      },
      ipAddress: getIpAddress(req),
    });

    return NextResponse.json({ success: true, archive });
  } catch (error) {
    console.error('Erro ao criar arquivo:', error);
    return NextResponse.json({ error: 'Erro ao criar arquivo' }, { status: 500 });
  }
}
