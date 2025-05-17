import { type Client } from '@/lib/api/services/client.service';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import Link from 'next/link';

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <Link href={`/clients/${client.id_cliente}`} className="hover:underline">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{client.nombre_razon_social}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{client.codigo_cliente}</p>
        </Link>
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Editar"
          >
            <Edit className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Más opciones"
          >
            <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Tipo:</span>
          <span className="text-sm font-medium capitalize">{client.tipo_cliente.replace('_', ' ')}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Estado:</span>
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
            client.estado === 'activo' ? 'bg-green-100 dark:bg-green-500/20' : 'bg-red-100 dark:bg-red-500/20'
          }`}>
            {client.estado === 'activo' ? (
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Riesgo:</span>
          <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
            client.nivel_riesgo === 'bajo' 
              ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' :
            client.nivel_riesgo === 'medio' 
              ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
              'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
          }`}>
            {client.nivel_riesgo}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Estado Doc:</span>
          <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
            client.estado_documental === 'completo' 
              ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' :
            client.estado_documental === 'incompleto' 
              ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
              'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
          }`}>
            {client.estado_documental}
          </span>
        </div>
      </div>
    </div>
  );
} 