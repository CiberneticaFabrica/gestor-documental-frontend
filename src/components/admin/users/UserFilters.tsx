import { useState } from 'react';

interface UserFiltersProps {
  onFilter: (filters: {
    search: string;
    estado: string;
    rol: string;
  }) => void;
}

export function UserFilters({ onFilter }: UserFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    rol: ''
  });

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            placeholder="Buscar por nombre, email o usuario..."
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
        <div>
          <select
            aria-label="Filtrar por estado"
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={filters.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <div>
          <select
            aria-label="Filtrar por rol"
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={filters.rol}
            onChange={(e) => handleChange('rol', e.target.value)}
          >
            <option value="">Todos los roles</option>
            <option value="administrador">Administrador</option>
            <option value="gestor_cliente">Gestor Cliente</option>
            <option value="oficial_kyc">Oficial KYC</option>
            <option value="auditor">Auditor</option>
          </select>
        </div>
      </div>
    </div>
  );
}
