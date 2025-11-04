
import { Metadata } from 'next';
import { AuditLogsPage } from '@/components/admin/audit-logs-page';

export const metadata: Metadata = {
  title: 'Log de Auditoria | IAeJovem',
  description: 'Histórico completo de ações na plataforma',
};

export default function AuditoriaPage() {
  return (
    <div className="p-6">
      <AuditLogsPage />
    </div>
  );
}
