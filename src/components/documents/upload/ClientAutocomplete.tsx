import { useEffect, useRef, useState } from 'react';
import { clientService, Client } from '@/lib/api/services/client.service';
import { Search, User } from 'lucide-react';

interface ClientAutocompleteProps {
  value: string | null;
  onChange: (id: string | null) => void;
  label?: string;
}

export function ClientAutocomplete({ value, onChange, label }: ClientAutocompleteProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    clientService.getClients()
      .then(data => setClients(data.clientes))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c =>
    c.nombre_razon_social.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setHighlighted(0);
  }, [search, open]);

  // Cerrar el dropdown al hacer click fuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      setHighlighted(h => Math.min(h + 1, filtered.length - 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setHighlighted(h => Math.max(h - 1, 0));
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (filtered[highlighted]) {
        onChange(filtered[highlighted].id_cliente);
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const selectedClient = clients.find(c => c.id_cliente === value);

  return (
    <div className="flex flex-col gap-1 relative">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          className="pl-9 pr-3 py-2 w-full rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-blue-400"
          placeholder="Buscar cliente..."
          value={open ? search : selectedClient?.nombre_razon_social || ''}
          onChange={e => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            if (!search && selectedClient) setSearch(selectedClient.nombre_razon_social);
          }}
          onBlur={() => {
            if (!selectedClient || search !== selectedClient.nombre_razon_social) setSearch('');
          }}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoComplete="off"
        />
      </div>
      {open && (
        <div
          ref={listRef}
          className="absolute left-0 top-full z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-auto animate-fade-in"
        >
          {loading ? (
            <div className="p-3 text-xs text-gray-400">Cargando clientes...</div>
          ) : filtered.length === 0 ? (
            <div className="p-3 text-xs text-gray-400">No se encontraron clientes</div>
          ) : (
            filtered.map((c, i) => (
              <button
                key={c.id_cliente}
                className={`flex items-center w-full px-3 py-2 gap-2 text-left text-sm rounded transition-colors
                  ${i === highlighted ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700'}`}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => {
                  onChange(c.id_cliente);
                  setOpen(false);
                }}
                tabIndex={-1}
                type="button"
              >
                <User className="h-4 w-4 mr-1 text-blue-400 dark:text-blue-300" />
                {c.nombre_razon_social}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
} 