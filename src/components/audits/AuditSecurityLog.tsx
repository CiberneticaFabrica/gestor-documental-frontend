'use client';
import React, { useEffect, useState } from 'react';
import { auditoriaService, AuditLog, AuditLogsResponse } from '@/lib/api/services/auditoria.service';
import { AuditSidebarFilters } from './AuditSidebarFilters';
 
import { AuditLogAdvancedTable } from '@/components/audits/AuditLogAdvancedTable';
import TimelineActivityChart from '@/components/audits/TimelineActivityChart';

interface SecurityLogStats {
  intentos_login_fallidos_24h: number;
  distribucion_resultados: { resultado: string; count: number }[];
  top_ips_error: { ip: string; count: number }[];
  cambios_password_ultimo_mes: { fecha: string; count: number }[];
}

export function AuditSecurityLog() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtrosDisponibles, setFiltrosDisponibles] = useState<any>({ acciones: [], entidades: [], resultados: [] });
  const [filters, setFilters] = useState<{ startDate?: string; endDate?: string }>({ startDate: '', endDate: '' });
  const [stats, setStats] = useState<SecurityLogStats | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await auditoriaService.getSecurityEvents(
          page,
          50,
          filters.startDate || undefined,
          filters.endDate || undefined
        );
        setLogs(data.eventos);
        setTotalPages(data.pagination.total_pages);
        setFiltrosDisponibles(data.filtros_disponibles || { acciones: [], entidades: [], resultados: [] });
        setStats(data.estadisticas);
      } catch (err: any) {
        setError('Error al cargar los logs de seguridad');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page, filters]);

  // Heatmap tipo GitHub: 7 filas (Lun-Dom) x 53 columnas (semanas)
  const renderTimelineChart = () => {
    return (
      <TimelineActivityChart 
        logs={logs}
        height={300}
        showStats={true}
        variant="area"
        timeRange="month"
      />
    );
  };
  // Render del heatmap de cambios de password (ejemplo visual simple)
 



  const handleExport = (format: 'csv' | 'excel') => {
    // Implement the export logic here
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Timeline Chart en la parte superior */}
      <div className="w-full">
        {renderTimelineChart()}
      </div>
      
      {/* Contenido principal */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar de filtros solo fechas */}
        
        {/* Panel principal */}
        <div className="flex-1 space-y-6">
         
          {loading ? (
            <div>Cargando logs...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <AuditLogAdvancedTable
              logs={logs.map(log => ({
                ...log,
                id_registro: String(log.id_registro),
                nombre_usuario: log.nombre_usuario || '',
                resultado:
                  log.resultado === 'exito'
                    ? 'Exitoso'
                    : log.resultado === 'fallo'
                    ? 'Fallido'
                    : 'Pendiente',
                detalles: typeof log.detalles === 'string' ? log.detalles : JSON.stringify(log.detalles),
              }))}
              loading={loading}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onExport={handleExport}
              onSort={handleSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              filters={filters}
              onFilterChange={setFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
