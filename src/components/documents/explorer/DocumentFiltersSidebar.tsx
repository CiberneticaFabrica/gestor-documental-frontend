import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterGroup({ title, children, defaultOpen = true }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button
        className="flex items-center w-full text-left font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open ? "true" : "false"}
      >
        {open ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
        {title}
      </button>
      {open && <div className="mt-2 pl-6">{children}</div>}
    </div>
  );
}

export function DocumentFiltersSidebar() {
  // TODO: Recibir y manejar los filtros desde props o contexto
  return (
    <div>
      <FilterGroup title="Perfil">
        <div className="flex flex-col gap-1">
          <label className="inline-flex items-center text-sm">
            <input type="checkbox" className="form-checkbox mr-2" /> Cliente
          </label>
          <label className="inline-flex items-center text-sm">
            <input type="checkbox" className="form-checkbox mr-2" /> Autor
          </label>
        </div>
      </FilterGroup>
      <FilterGroup title="Tipo de documento">
        <select className="w-full px-2 py-1 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm" aria-label="Tipo de documento">
          <option value="">Todos</option>
          <option value="contrato">Contrato</option>
          <option value="acuerdo">Acuerdo</option>
        </select>
      </FilterGroup>
      <FilterGroup title="Fechas">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Creado desde</label>
          <input type="date" className="w-full px-2 py-1 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm" aria-label="Creado desde" placeholder="Desde" />
          <label className="text-xs text-gray-500">Creado hasta</label>
          <input type="date" className="w-full px-2 py-1 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm" aria-label="Creado hasta" placeholder="Hasta" />
        </div>
      </FilterGroup>
      <FilterGroup title="Estado">
        <div className="flex flex-col gap-1">
          <label className="inline-flex items-center text-sm">
            <input type="checkbox" className="form-checkbox mr-2" /> Borrador
          </label>
          <label className="inline-flex items-center text-sm">
            <input type="checkbox" className="form-checkbox mr-2" /> Publicado
          </label>
        </div>
      </FilterGroup>
    </div>
  );
} 