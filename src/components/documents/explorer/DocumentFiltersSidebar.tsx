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
        aria-expanded="true"
      >
        {open ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
        {title}
      </button>
      {open && <div className="mt-2 pl-6">{children}</div>}
    </div>
  );
}

interface DocumentFiltersSidebarProps {
  onSearch: (filters: any) => void; // Callback para pasar los filtros al padre
}

export function DocumentFiltersSidebar({ onSearch }: DocumentFiltersSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    const filters = {
      search_term: searchTerm,
      document_types: null,
      status: null,
      date_from: null,
      date_to: null,
      fecha_modificacion_desde: null,
      fecha_modificacion_hasta: null,
      folders: null,
      tags: null,
      metadata_filters: null,
      creators: null,
      modificado_por: null,
      cliente_id: null,
      cliente_nombre: null,
      tipo_cliente: null,
      segmento_cliente: null,
      nivel_riesgo: null,
      estado_documental: null,
      categoria_bancaria: null,
      confianza_extraccion_min: null,
      validado_manualmente: null,
      incluir_eliminados: null,
      texto_extraido: null,
      con_alertas_documento: null,
      con_comentarios: null,
      tipo_formato: null,
      page: 1,
      page_size: 20,
      sort_by: "fecha_modificacion",
      sort_order: "DESC"
    };
    onSearch(filters);
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar documentos..."
          className="w-full px-3 py-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>
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