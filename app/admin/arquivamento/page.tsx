
import { Metadata } from 'next';
import { YearArchivePage } from '@/components/admin/year-archive-page';

export const metadata: Metadata = {
  title: 'Arquivamento de Ano Letivo | IAeJovem',
  description: 'Gerencie o arquivamento de dados por ano letivo',
};

export default function ArquivamentoPage() {
  return (
    <div className="p-6">
      <YearArchivePage />
    </div>
  );
}
