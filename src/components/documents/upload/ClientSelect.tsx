import { useEffect, useState } from 'react';
import { clientService, Client } from '@/lib/api/services/client.service';
import { Search } from 'lucide-react';

interface ClientSelectProps {
  value: string | null;
  onChange: (id: string | null) => void;
  label?: string;
}

export function ClientSelect({ value, onChange, label }: ClientSelectProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    clientService.getClients()
      .then(data => setClients(data.clientes))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c =>
    c.nombre_razon_social.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          className="pl-9 pr-3 py-2 w-full rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm mb-2"
          placeholder="Buscar cliente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          disabled={loading}
        />
      </div>
      <select
        className="w-full px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        disabled={loading}
        aria-label="Seleccionar cliente"
      >
        <option value="">Selecciona un cliente...</option>
        {filtered.map(c => (
          <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_razon_social}</option>
        ))}
      </select>
      {loading && <div className="text-xs text-gray-400 mt-1">Cargando clientes...</div>}
      {!loading && filtered.length === 0 && <div className="text-xs text-gray-400 mt-1">No se encontraron clientes</div>}
    </div>
  );
} 