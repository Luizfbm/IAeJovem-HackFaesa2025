
import { prisma } from '@/lib/db';
import { AuditAction } from '@prisma/client';

export async function createAuditLog({
  userId,
  action,
  description,
  metadata,
  ipAddress,
}: {
  userId: string;
  action: AuditAction;
  description: string;
  metadata?: any;
  ipAddress?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        description,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
        ipAddress,
      },
    });
  } catch (error) {
    console.error('Erro ao criar log de auditoria:', error);
  }
}

export function getIpAddress(req: Request): string | undefined {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip');
  return ip || undefined;
}
