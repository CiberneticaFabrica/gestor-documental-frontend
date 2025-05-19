import React, { useState } from 'react';
import { AuditLog } from '@/lib/api/services/auditoria.service';
import { ChevronUp, ChevronDown, User, FileText, Search, Activity } from 'lucide-react';

interface AuditLogTableProps {
  logs: AuditLog[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRowClick: (log: AuditLog) => void;
}

function groupBy<T>(arr: T[], key: (item: T) => string) {
  return arr.reduce((acc, item) => {
    const k = key(item) || 'Sin valor';
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

function getActionIcon(action?: string) {
  switch (action) {
    case 'login':
      return <User className="h-4 w-4 text-blue-500" />;
    case 'logout':
      return <User className="h-4 w-4 text-gray-500" />;
    case 'crear':
      return <FileText className="h-4 w-4 text-green-500" />;
    case 'modificar':
      return <FileText className="h-4 w-4 text-orange-500" />;
    case 'eliminar':
      return <FileText className="h-4 w-4 text-red-500" />;
    case 'ver':
      return <Search className="h-4 w-4 text-purple-500" />;
    case 'descargar':
      return <FileText className="h-4 w-4 text-blue-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
}

export function AuditLogTable({ logs, page, totalPages, onPageChange, onRowClick }: AuditLogTableProps) {
  // Estado para agrupación, búsqueda, filtros, expansión de grupos
  const [groupBy, setGroupBy] = useState('date');
  const [search, setSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Filtrado y agrupación
  const filteredLogs = logs.filter(log => {
    // Aplica búsqueda y filtros aquí
    // ...
    return true;
  });

  const groupedLogs = groupLogs(filteredLogs, groupBy);

  function groupLogs(logs: AuditLog[], groupBy: string): Record<string, AuditLog[]> {
    switch (groupBy) {
      case 'date':
        return groupByFn(logs, l => l.fecha_hora?.slice(0, 10) || 'Sin fecha');
      case 'user':
        return groupByFn(logs, l => l.nombre_usuario || l.usuario_id || 'Sin usuario');
      case 'action':
        return groupByFn(logs, l => l.accion || 'Sin acción');
      case 'entity':
        return groupByFn(logs, l => l.entidad_afectada || 'Sin entidad');
      default:
        return { 'Todos los registros': logs };
    }
  }

  // Helper para agrupar
  function groupByFn<T>(arr: T[], key: (item: T) => string) {
    return arr.reduce((acc, item) => {
      const k = key(item);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }

  function toggleGroup(groupName: string) {
    setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  }

  return (
    <div className="w-full">
      {/* Barra de filtros y búsqueda */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <label htmlFor="group-by-select" className="sr-only">Agrupar por</label>
        <select
          id="group-by-select"
          value={groupBy}
          onChange={e => setGroupBy(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="date">Agrupar por fecha</option>
          <option value="user">Agrupar por usuario</option>
          <option value="action">Agrupar por acción</option>
          <option value="entity">Agrupar por entidad</option>
        </select>
        {/* ...otros filtros */}
      </div>

      {/* Resultados agrupados */}
      <div className="border rounded-lg overflow-hidden">
        {Object.entries(groupedLogs).map(([groupName, logs]) => {
          const isExpanded = expandedGroups[groupName] !== false;
          return (
            <div key={groupName} className="border-b last:border-b-0">
              <div
                className="bg-gray-100 p-3 cursor-pointer flex items-center justify-between"
                onClick={() => toggleGroup(groupName)}
              >
                <span className="font-medium">{groupName} <span className="ml-2 text-xs bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full">{logs.length}</span></span>
                {isExpanded ? <ChevronUp /> : <ChevronDown />}
              </div>
              {isExpanded && (
                <div className="divide-y">
                  {logs.map(log => (
                    <div key={log.id_registro} className="p-4 hover:bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between">
                      {/* Iconos, badges, detalles resumidos */}
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.accion)}
                        <span className="font-semibold">{log.accion || 'Acción no especificada'}</span>
                        {/* ...otros campos */}
                      </div>
                      <button className="text-blue-600 hover:underline text-xs" onClick={() => onRowClick(log)}>Ver detalles</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Paginación */}
      <div className="flex justify-between items-center mt-4 px-2">
        <div className="text-xs text-gray-500">Mostrando {logs.length} registros</div>
        <div className="flex gap-1">
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
          >&lt;</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`px-3 py-1 rounded text-xs ${p === page ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              onClick={() => onPageChange(p)}
              disabled={p === page}
            >{p}</button>
          ))}
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >&gt;</button>
        </div>
      </div>
    </div>
  );
} 