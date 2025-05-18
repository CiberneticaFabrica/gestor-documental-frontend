import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DocumentTable } from './DocumentTable';
import { clientService, Client } from '@/lib/api/services/client.service';
import { documentService } from '@/lib/api/services/document.service';
import Select from 'react-select';

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
  const [clientes, setClientes] = useState<Client[]>([]);
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);

  useEffect(() => {
    async function fetchClientes() {
      try {
        const data = await clientService.getClients(1, 1000);
        setClientes(data.clientes);
      } catch (error) {
        // Maneja el error si lo deseas
        console.error('Error al obtener clientes:', error);
      }
    }
    fetchClientes();
  }, []);

  const handleSearch = async () => {
    const filters = {
      search_term: searchTerm,
      cliente_id: selectedClientes.length > 0 ? selectedClientes : null,
      // ...otros filtros
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
      <FilterGroup title="Cliente">
        <Select
          isMulti
          options={clientes.map(cliente => ({
            value: cliente.id_cliente,
            label: cliente.nombre_razon_social
          }))}
          value={clientes
            .filter(cliente => selectedClientes.includes(cliente.id_cliente))
            .map(cliente => ({
              value: cliente.id_cliente,
              label: cliente.nombre_razon_social
            }))
          }
          onChange={options => {
            setSelectedClientes(options ? options.map(opt => opt.value) : []);
          }}
          placeholder="Seleccionar cliente(s)..."
          className="text-sm"
          classNamePrefix="react-select"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: 'var(--tw-bg-opacity, 1) #374151', // dark:bg-gray-700
              color: 'white',
              borderColor: '#4B5563', // dark:border-gray-600
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: 'var(--tw-bg-opacity, 1) #374151',
              color: 'white',
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? '#2563eb' : '#374151',
              color: 'white',
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: '#2563eb',
              color: 'white',
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: 'white',
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: 'white',
              ':hover': {
                backgroundColor: '#1e40af',
                color: 'white',
              },
            }),
          }}
          theme={theme => ({
            ...theme,
            borderRadius: 6,
            colors: {
              ...theme.colors,
              primary25: '#2563eb',
              primary: '#2563eb',
              neutral0: '#374151',
              neutral80: 'white',
            },
          })}
        />
      </FilterGroup>
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