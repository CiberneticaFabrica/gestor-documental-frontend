'use client';
import React, { useEffect, useState } from 'react';
import { auditoriaService, AuditLog, AuditLogsResponse } from '@/lib/api/services/auditoria.service';
import { AuditSidebarFilters } from './AuditSidebarFilters';
import { AuditKPIBar } from './AuditKPIBar';
import { AuditLogTable } from './AuditLogTable';
import { AuditLogDetailDrawer } from './AuditLogDetailDrawer';

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
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [stats, setStats] = useState<SecurityLogStats | null>(null);

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
  const renderLoginLogoutGitHubHeatmap = () => {
    if (!logs.length) return null;
    // Agrupar por fecha (YYYY-MM-DD) y contar logins/logouts
    const dayMap: Record<string, { login: number; logout: number }> = {};
    logs.forEach(log => {
      const date = log.fecha_hora.slice(0, 10);
      if (!dayMap[date]) dayMap[date] = { login: 0, logout: 0 };
      if (log.accion === 'login') dayMap[date].login += 1;
      if (log.accion === 'logout') dayMap[date].logout += 1;
    });
    // Obtener año base
    const allDates = Object.keys(dayMap).sort();
    const year = allDates.length > 0 ? new Date(allDates[0]).getFullYear() : new Date().getFullYear();
    // Primer lunes de enero
    let start = new Date(year, 0, 1);
    while (start.getDay() !== 1) start.setDate(start.getDate() + 1); // 1=Lun
    // Último día de diciembre
    let end = new Date(year, 11, 31);
    // Avanzar hasta el último domingo de diciembre
    while (end.getDay() !== 0) end.setDate(end.getDate() + 1); // 0=Dom
    // Generar matriz de semanas (columnas) y días (filas)
    const weeks: { date: string; login: number; logout: number; day: number; month: number }[][] = [];
    let d = new Date(start);
    for (let w = 0; d <= end; w++) {
      weeks[w] = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = d.toISOString().slice(0, 10);
        weeks[w][i] = {
          date: dateStr,
          login: dayMap[dateStr]?.login || 0,
          logout: dayMap[dateStr]?.logout || 0,
          day: d.getDay(),
          month: d.getMonth(),
        };
        d.setDate(d.getDate() + 1);
      }
    }
    // Si faltan semanas para llegar a 53, rellenar con semanas vacías
    while (weeks.length < 53) {
      const lastMonth = weeks[weeks.length - 1][0]?.month ?? 11;
      const emptyWeek = Array.from({ length: 7 }, (_, i) => ({ date: '', login: 0, logout: 0, day: (i + 1) % 7, month: lastMonth }));
      weeks.push(emptyWeek);
    }
    // Días y meses en español
    const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    // Encabezado de meses
    const monthLabels: { name: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wIdx) => {
      const firstDay = week[0];
      if (firstDay && firstDay.month !== lastMonth) {
        monthLabels.push({ name: months[firstDay.month], col: wIdx });
        lastMonth = firstDay.month;
      }
    });
    // Función para color
    const getColor = (login: number, logout: number) => {
      if (login > 0 && logout > 0) {
        return `linear-gradient(90deg, rgba(34,197,94,${Math.min(0.2 + login/5,1)}) 50%, rgba(239,68,68,${Math.min(0.2 + logout/5,1)}) 50%)`;
      }
      if (login > 0) return `rgba(34,197,94,${Math.min(0.2 + login/5,1)})`;
      if (logout > 0) return `rgba(239,68,68,${Math.min(0.2 + logout/5,1)})`;
      return '#e5e7eb';
    };
    return (
      <div className="mb-6">
        <div className="text-xs font-semibold mb-1">Logins (verde) y Logouts (rojo) por día</div>
        <div className="overflow-x-auto">
          {/* Encabezado de meses */}
          <div className="flex ml-10 mb-1">
            {monthLabels.map((m, i) => (
              <div key={i} className="text-center text-xs text-gray-500" style={{ minWidth: '28px', marginLeft: i === 0 ? `${m.col * 28}px` : `${(m.col - monthLabels[i-1].col) * 28}px` }}>{m.name}</div>
            ))}
          </div>
          <div className="flex">
            {/* Días de la semana */}
            <div className="flex flex-col mr-1">
              {daysOfWeek.map((d, i) => (
                <div key={i} className="h-4 text-xs text-gray-500" style={{ height: '28px' }}>{d}</div>
              ))}
            </div>
            {/* Celdas del heatmap */}
            <div className="flex">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col">
                  {daysOfWeek.map((_, dIdx) => {
                    const cell = week[dIdx];
                    return (
                      <div
                        key={dIdx}
                        title={cell && cell.date ? `${cell.date}: ${cell.login} login(s), ${cell.logout} logout(s)` : ''}
                        className="w-4 h-4 m-0.5 rounded"
                        style={{ background: cell ? getColor(cell.login, cell.logout) : '#e5e7eb' }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render del heatmap de cambios de password (ejemplo visual simple)
  const renderPasswordHeatmap = () => {
    if (!stats?.cambios_password_ultimo_mes) return null;
    return (
      <div className="my-4">
        <div className="text-xs text-gray-500 mb-1">Cambios de contraseña (último mes)</div>
        <div className="flex gap-1">
          {stats.cambios_password_ultimo_mes.map((d, i) => (
            <div key={i} title={`${d.fecha}: ${d.count} cambios`} className="w-4 h-4 rounded bg-blue-100 border border-blue-200 flex items-end">
              <div style={{ height: `${Math.min(100, d.count * 2)}%` }} className="w-full bg-blue-500 rounded-b" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Sidebar de filtros solo para fechas
  const renderDateFilters = () => (
    <aside className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 space-y-4 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold mb-2">Filtros</h2>
      <div className="space-y-2">
        <label htmlFor="filtro-fecha-inicio" className="block text-xs font-semibold mb-1">Fecha inicio</label>
        <input
          id="filtro-fecha-inicio"
          type="date"
          className="w-full border rounded px-2 py-1 mb-1"
          value={filters.startDate || ''}
          onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
        />
        <label htmlFor="filtro-fecha-fin" className="block text-xs font-semibold mb-1">Fecha fin</label>
        <input
          id="filtro-fecha-fin"
          type="date"
          className="w-full border rounded px-2 py-1"
          value={filters.endDate || ''}
          onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
        />
      </div>
      <button
        className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded py-1 mt-2 hover:bg-gray-300 dark:hover:bg-gray-600"
        onClick={() => setFilters({ startDate: '', endDate: '' })}
      >
        Limpiar filtros
      </button>
    </aside>
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
      
        {renderLoginLogoutGitHubHeatmap()}
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar de filtros solo fechas */}
        <div className="w-full md:w-64">{renderDateFilters()}</div>
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
    </div>
  );
}
