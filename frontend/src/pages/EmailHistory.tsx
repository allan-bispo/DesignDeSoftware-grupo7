import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, Clock, Search, Filter, Eye } from 'lucide-react';
import { emailService, EmailLog, EmailLogFilters, EmailStats } from '../services/api/emailService';

const EMAIL_TYPES = {
  expiration_warning_7_days: '7 Dias para Expiração',
  expiration_warning_1_day: '1 Dia para Expiração',
  expiration_alert: 'Alerta de Expiração',
  test_email: 'Email de Teste',
  general: 'Geral',
};

const EMAIL_STATUSES = {
  sent: 'Enviado',
  failed: 'Falha',
  pending: 'Pendente',
};

export default function EmailHistory() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [filters, setFilters] = useState<EmailLogFilters>({ page: 1, limit: 20 });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchLogs();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchStats = async () => {
    try {
      const response = await emailService.getEmailStats();
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await emailService.getEmailLogs(filters);
      setLogs(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Erro ao buscar logs de email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof EmailLogFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleViewDetails = async (logId: string) => {
    try {
      const response = await emailService.getEmailLogById(logId);
      setSelectedLog(response.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do log:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Histórico de Emails</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe todos os emails enviados pelo sistema
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Emails</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enviados</p>
                <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Falhas</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search className="w-4 h-4 inline mr-1" />
              Buscar
            </label>
            <input
              type="text"
              placeholder="Email, assunto ou curso..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter className="w-4 h-4 inline mr-1" />
              Tipo
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
            >
              <option value="">Todos</option>
              {Object.entries(EMAIL_TYPES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
            >
              <option value="">Todos</option>
              {Object.entries(EMAIL_STATUSES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ page: 1, limit: 20 });
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destinatário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assunto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Envio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Nenhum email encontrado
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}
                      >
                        {getStatusIcon(log.status)}
                        {EMAIL_STATUSES[log.status as keyof typeof EMAIL_STATUSES]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {EMAIL_TYPES[log.type as keyof typeof EMAIL_TYPES] || log.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.recipientName}</div>
                      <div className="text-xs text-gray-500">{log.recipientEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {log.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.sentAt
                        ? new Date(log.sentAt).toLocaleString('pt-BR')
                        : new Date(log.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(log.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
              {pagination.total} emails
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Detalhes do Email</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedLog.status)}`}
                >
                  {getStatusIcon(selectedLog.status)}
                  {EMAIL_STATUSES[selectedLog.status as keyof typeof EMAIL_STATUSES]}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <p className="text-gray-900">
                  {EMAIL_TYPES[selectedLog.type as keyof typeof EMAIL_TYPES] ||
                    selectedLog.type}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinatário
                  </label>
                  <p className="text-gray-900">{selectedLog.recipientName}</p>
                  <p className="text-sm text-gray-500">{selectedLog.recipientEmail}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Envio
                  </label>
                  <p className="text-gray-900">
                    {selectedLog.sentAt
                      ? new Date(selectedLog.sentAt).toLocaleString('pt-BR')
                      : 'Não enviado'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assunto
                </label>
                <p className="text-gray-900">{selectedLog.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Corpo do Email
                </label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">
                    {selectedLog.body}
                  </pre>
                </div>
              </div>

              {selectedLog.errorMessage && (
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    Mensagem de Erro
                  </label>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-red-900">{selectedLog.errorMessage}</p>
                  </div>
                </div>
              )}

              {selectedLog.messageId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID da Mensagem (AWS SES)
                  </label>
                  <p className="text-sm text-gray-600 font-mono">{selectedLog.messageId}</p>
                </div>
              )}

              {selectedLog.course && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Curso Relacionado
                  </label>
                  <p className="text-gray-900">{selectedLog.course.name}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
