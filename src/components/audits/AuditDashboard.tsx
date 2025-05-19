import { useEffect, useState } from 'react';
import { auditoriaService, AuditLog, AuditLogsResponse } from '@/lib/api/services/auditoria.service';
import { AuditSidebarFilters } from './AuditSidebarFilters';
import { AuditKPIBar } from './AuditKPIBar';
import { AuditLogTable } from './AuditLogTable';
import { AuditLogDetailDrawer } from './AuditLogDetailDrawer';

export function AuditDashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtrosDisponibles, setFiltrosDisponibles] = useState<any>({ acciones: [], entidades: [], resultados: [] });
  const [filters, setFilters] = useState<any>({ accion: '', entidad: '', resultado: '', startDate: '', endDate: '' });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Aquí puedes adaptar para pasar filtros a la API
        const data: AuditLogsResponse = await auditoriaService.getAuditLogs(page, filters);
        setLogs(data.logs);
        setTotalPages(data.pagination.total_pages);
        setFiltrosDisponibles(data.filtros_disponibles);
      } catch (err: any) {
        setError('Error al cargar los logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page, filters]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar de filtros */}
      <div className="w-full md:w-64">
        <AuditSidebarFilters
          filtrosDisponibles={filtrosDisponibles}
          filters={filters}
          onChange={setFilters}
        />
      </div>
      {/* Panel principal */}
      <div className="flex-1 space-y-6">
        <AuditKPIBar logs={logs} />
        {loading ? (
          <div>Cargando logs...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <AuditLogTable
            logs={logs}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onRowClick={setSelectedLog}
          />
        )}
        <AuditLogDetailDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
      </div>
    </div>
  );
} 