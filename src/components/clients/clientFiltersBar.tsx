import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Download, UserPlus, LayoutGrid, LayoutList } from 'lucide-react';

interface ClientFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  estado: string;
  onEstadoChange: (value: string) => void;
  tipoCliente: string;
  onTipoClienteChange: (value: string) => void;
  nivelRiesgo: string;
  onNivelRiesgoChange: (value: string) => void;
  onAddClient: () => void;
  onExport: () => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
}

export function ClientFiltersBar({
  search,
  onSearchChange,
  estado,
  onEstadoChange,
  tipoCliente,
  onTipoClienteChange,
  nivelRiesgo,
  onNivelRiesgoChange,
  onAddClient,
  onExport,
  viewMode,
  onViewModeChange
}: ClientFiltersBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:gap-3 gap-2 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <select
          aria-label="Filtrar por estado"
          className="w-44 px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
          value={estado}
          onChange={e => onEstadoChange(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <select
          aria-label="Filtrar por tipo de cliente"
          className="w-44 px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
          value={tipoCliente}
          onChange={e => onTipoClienteChange(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="persona_fisica">Persona Natural</option>
          <option value="empresa">Persona Jurídica</option>
          <option value="organismo_publico">Organismo Público</option>
        </select>
        <select
          aria-label="Filtrar por nivel de riesgo"
          className="w-44 px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
          value={nivelRiesgo}
          onChange={e => onNivelRiesgoChange(e.target.value)}
        >
          <option value="">Todos los niveles</option>
          <option value="bajo">Bajo</option>
          <option value="medio">Medio</option>
          <option value="alto">Alto</option>
        </select>
        <div className="flex flex-1 justify-end items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            className="text-blue-700 border-blue-700 hover:text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={onAddClient}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo cliente
          </Button>
          <Button
            variant="outline"
            className="text-green-700 border-green-700 hover:text-white hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-500 dark:focus:ring-green-800"
            onClick={onExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <div className="flex gap-2 ml-1 items-center">
            <button
              type="button"
              aria-label="Vista tabla"
              className={`p-2 rounded-md border ${viewMode === 'table' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-400 hover:bg-gray-100'} transition-colors`}
              onClick={() => onViewModeChange('table')}
            >
              <LayoutList className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Vista tarjetas"
              className={`p-2 rounded-md border ${viewMode === 'cards' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-400 hover:bg-gray-100'} transition-colors`}
              onClick={() => onViewModeChange('cards')}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 