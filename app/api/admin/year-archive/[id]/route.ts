export const dynamic = 'force-dynamic';


import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { createAuditLog, getIpAddress } from '@/lib/audit';

// PATCH - Arquivar ou restaurar ano
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMINISTRADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { status } = await req.json();

    if (!status || !['ACTIVE', 'ARCHIVED'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }

    const archive = await prisma.yearArchive.update({
      where: { id: params.id },
      data: {
        status,
        archivedAt: status === 'ARCHIVED' ? new Date() : null,
        archivedBy: status === 'ARCHIVED' ? session.user.id : null,
      },
    });

    // Criar log de auditoria
    await createAuditLog({
      userId: session.user.id,
      action: status === 'ARCHIVED' ? 'ARCHIVE_YEAR' : 'RESTORE_ARCHIVE',
      description: `${status === 'ARCHIVED' ? 'Arquivou' : 'Restaurou'} o ano letivo ${archive.year}`,
      metadata: {
        archiveId: params.id,
        year: archive.year,
        status,
      },
      ipAddress: getIpAddress(req),
    });

    return NextResponse.json({ success: true, archive });
  } catch (error) {
    console.error('Erro ao atualizar arquivo:', error);
    return NextResponse.json({ error: 'Erro ao atualizar arquivo' }, { status: 500 });
  }
}

// DELETE - Excluir arquivo
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMINISTRADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const archive = await prisma.yearArchive.delete({
      where: { id: params.id },
    });

    // Criar log de auditoria
    await createAuditLog({
      userId: session.user.id,
      action: 'ARCHIVE_YEAR',
      description: `Excluiu o arquivo do ano letivo ${archive.year}`,
      metadata: {
        archiveId: params.id,
        year: archive.year,
      },
      ipAddress: getIpAddress(req),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir arquivo:', error);
    return NextResponse.json({ error: 'Erro ao excluir arquivo' }, { status: 500 });
  }
}
