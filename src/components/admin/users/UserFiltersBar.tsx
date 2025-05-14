import React from 'react';
import { Button } from '@/components/ui/button';

interface UserFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  estado: string;
  onEstadoChange: (value: string) => void;
  rol: string;
  onRolChange: (value: string) => void;
  onAddUser: () => void;
  onExport: () => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
}

export function UserFiltersBar({
  search,
  onSearchChange,
  estado,
  onEstadoChange,
  rol,
  onRolChange,
  onAddUser,
  onExport,
  viewMode,
  onViewModeChange
}: UserFiltersBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:gap-3 gap-2 w-full">
        <input
          type="text"
          placeholder="Buscar usuario, email..."
          className="w-44 px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
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
          aria-label="Filtrar por rol"
          className="w-44 px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
          value={rol}
          onChange={e => onRolChange(e.target.value)}
        >
          <option value="">Todos los roles</option>
          <option value="administrador">Administrador</option>
          <option value="gestor_cliente">Gestor Cliente</option>
          <option value="oficial_kyc">Oficial KYC</option>
          <option value="auditor">Auditor</option>
        </select>
        <div className="flex flex-1 justify-end items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            className="text-blue-700 border-blue-700 hover:text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={onAddUser}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Nuevo usuario
          </Button>
          <Button
            variant="outline"
            className="text-green-700 border-green-700 hover:text-white hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-500 dark:focus:ring-green-800"
            onClick={onExport}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m0 0l-3-3m3 3l3-3" /></svg>
            Exportar
          </Button>
          <div className="flex gap-2 ml-1 items-center">
            <button
              type="button"
              aria-label="Vista tabla"
              className={`p-2 rounded-md border ${viewMode === 'table' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-400 hover:bg-gray-100'} transition-colors`}
              onClick={() => onViewModeChange('table')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
            </button>
            <button
              type="button"
              aria-label="Vista tarjetas"
              className={`p-2 rounded-md border ${viewMode === 'cards' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-400 hover:bg-gray-100'} transition-colors`}
              onClick={() => onViewModeChange('cards')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="7" rx="2"/><rect x="4" y="13" width="16" height="7" rx="2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 