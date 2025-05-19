import React from 'react';

interface AuditSidebarFiltersProps {
  filtrosDisponibles: {
    acciones: string[];
    entidades: string[];
    resultados: string[];
  };
  filters: {
    accion: string;
    entidad: string;
    resultado: string;
    startDate?: string;
    endDate?: string;
  };
  onChange: (filters: any) => void;
}

export function AuditSidebarFilters({ filtrosDisponibles, filters, onChange }: AuditSidebarFiltersProps) {
  return (
    <aside className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 space-y-4 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold mb-2">Filtros</h2>
      <div className="space-y-2">
        <label htmlFor="filtro-accion" className="block text-xs font-semibold mb-1">Acción</label>
        <select
          id="filtro-accion"
          className="w-full border rounded px-2 py-1"
          value={filters.accion}
          onChange={e => onChange({ ...filters, accion: e.target.value })}
        >
          <option value="">Todas</option>
          {filtrosDisponibles.acciones.map(a => (
            <option key={a} value={a}>{a || '(vacío)'}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="filtro-entidad" className="block text-xs font-semibold mb-1">Entidad</label>
        <select
          id="filtro-entidad"
          className="w-full border rounded px-2 py-1"
          value={filters.entidad}
          onChange={e => onChange({ ...filters, entidad: e.target.value })}
        >
          <option value="">Todas</option>
          {filtrosDisponibles.entidades.map(e => (
            <option key={e} value={e}>{e || '(vacío)'}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="filtro-resultado" className="block text-xs font-semibold mb-1">Resultado</label>
        <select
          id="filtro-resultado"
          className="w-full border rounded px-2 py-1"
          value={filters.resultado}
          onChange={e => onChange({ ...filters, resultado: e.target.value })}
        >
          <option value="">Todos</option>
          {filtrosDisponibles.resultados.map(r => (
            <option key={r} value={r}>{r || '(vacío)'}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="filtro-fecha-inicio" className="block text-xs font-semibold mb-1">Fecha inicio</label>
        <input
          id="filtro-fecha-inicio"
          type="date"
          className="w-full border rounded px-2 py-1 mb-1"
          value={filters.startDate || ''}
          onChange={e => onChange({ ...filters, startDate: e.target.value })}
        />
        <label htmlFor="filtro-fecha-fin" className="block text-xs font-semibold mb-1">Fecha fin</label>
        <input
          id="filtro-fecha-fin"
          type="date"
          className="w-full border rounded px-2 py-1"
          value={filters.endDate || ''}
          onChange={e => onChange({ ...filters, endDate: e.target.value })}
        />
      </div>
      <button
        className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded py-1 mt-2 hover:bg-gray-300 dark:hover:bg-gray-600"
        onClick={() => onChange({ accion: '', entidad: '', resultado: '', startDate: '', endDate: '' })}
      >
        Limpiar filtros
      </button>
    </aside>
  );
} 