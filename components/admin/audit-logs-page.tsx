
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  metadata?: any;
  ipAddress?: string;
  createdAt: string;
}

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    action: '',
    userId: '',
    startDate: '',
    endDate: '',
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(filters.action && { action: filters.action }),
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      const data = await response.json();

      if (data.logs) {
        setLogs(data.logs);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      LOGIN: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      LOGOUT: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      CREATE_USER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      UPDATE_USER: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      DELETE_USER: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      ADJUST_POINTS: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      ARCHIVE_YEAR: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      BULK_ACTION: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    };
    return colors[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const exportLogs = () => {
    const csv = [
      ['Data/Hora', 'Ação', 'Descrição', 'IP'],
      ...logs.map(log => [
        format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }),
        log.action,
        log.description,
        log.ipAddress || '-',
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📜 Log de Auditoria
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Histórico completo de ações na plataforma
          </p>
        </div>
        <Button onClick={exportLogs} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={filters.action} onValueChange={(value) => setFilters({ ...filters, action: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as ações" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as ações</SelectItem>
              <SelectItem value="LOGIN">Login</SelectItem>
              <SelectItem value="CREATE_USER">Criar Usuário</SelectItem>
              <SelectItem value="UPDATE_USER">Atualizar Usuário</SelectItem>
              <SelectItem value="DELETE_USER">Excluir Usuário</SelectItem>
              <SelectItem value="ADJUST_POINTS">Ajustar Pontos</SelectItem>
              <SelectItem value="ARCHIVE_YEAR">Arquivar Ano</SelectItem>
              <SelectItem value="BULK_ACTION">Ação em Massa</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            placeholder="Data inicial"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />

          <Input
            type="date"
            placeholder="Data final"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />

          <Button onClick={fetchLogs} variant="secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </Card>

      {/* Lista de logs */}
      <Card className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Nenhum log encontrado
              </p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                        </span>
                        {log.ipAddress && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            IP: {log.ipAddress}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {log.description}
                      </p>
                      {log.metadata && (
                        <details className="mt-2">
                          <summary className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer">
                            Ver detalhes
                          </summary>
                          <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Paginação */}
        {total > 50 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {logs.length} de {total} logs
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={logs.length < 50}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
