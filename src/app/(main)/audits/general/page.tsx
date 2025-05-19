'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { auditoriaService, AuditLog, AuditLogsResponse } from '@/lib/api/services/auditoria.service';
import { AuditSidebarFilters } from '@/components/audits/AuditSidebarFilters';
import { AuditLogTable } from '@/components/audits/AuditLogTable';
 
export default function AuditsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtrosDisponibles, setFiltrosDisponibles] = useState<{
    acciones: string[];
    entidades: string[];
    resultados: string[];
  }>({
    acciones: [],
    entidades: [],
    resultados: []
  });
  const [filters, setFilters] = useState({
    accion: '',
    entidad: '',
    resultado: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await auditoriaService.getAuditLogs(page);
        setLogs(data.logs);
        setTotalPages(data.pagination.total_pages);
        setFiltrosDisponibles(data.filtros_disponibles);
      } catch (err: any) {
        if (err.message?.includes('401')) {
          setError('Sesión expirada. Por favor inicie sesión nuevamente.');
        } else if (err.message?.includes('403')) {
          setError('No tiene permisos para acceder a los logs de auditoría.');
        } else {
          setError(`Error al cargar los logs: ${err.message || 'Error desconocido'}`);
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLogs();
  }, [page, filters]);

  if (loading) return <div>Cargando logs...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-64">
        <AuditSidebarFilters
          filtrosDisponibles={filtrosDisponibles}
          filters={filters}
          onChange={setFilters}
        />
      </div>
      <div className="flex-1">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Auditoría General</h1>
            <p className="text-muted-foreground">
              Visualiza y genera reportes de la auditoría general
            </p>
          </div>
          <div className='flex flex-col gap-4'>
            <div className="grid gap-4">
              <div className="w-full overflow-x-auto">
                <AuditLogTable 
                  logs={logs}
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  onRowClick={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}