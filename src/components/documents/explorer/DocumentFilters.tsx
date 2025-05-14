"use client";
import { useState } from 'react';

interface DocumentFiltersProps {
  onFilterChange: (filters: {
    search: string;
    type: string;
    status: string;
  }) => void;
}

export function DocumentFilters({ onFilterChange }: DocumentFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: ''
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar documentos..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          aria-label="Buscar documentos"
        />
        <select 
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          aria-label="Filtrar por tipo de documento"
        >
          <option value="">Todos los tipos</option>
          <option value="DNI">DNI</option>
          <option value="Contrato cuenta">Contrato cuenta</option>
        </select>
        <select 
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="publicado">Publicado</option>
        </select>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          aria-label="Crear nuevo documento"
        >
          Nuevo Documento
        </button>
      </div>
    </div>
  );
} 