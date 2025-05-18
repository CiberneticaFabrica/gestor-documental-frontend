'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit,
  Lock,
  Trash2,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { clientService, type Client } from '@/lib/api/services/client.service';
import { ClientFiltersBar } from '@/components/clients/clientFiltersBar';
import { ClientCard } from '@/components/clients/client-card';
import { NewClientForm } from '@/components/clients/new-client-form';

type SortField = keyof Client;
type SortDirection = 'asc' | 'desc';

export function ClientsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('nombre_razon_social');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [estado, setEstado] = useState('');
  const [tipoCliente, setTipoCliente] = useState('');
  const [nivelRiesgo, setNivelRiesgo] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);

  useEffect(() => {
    loadClients();
  }, [currentPage, pageSize]);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const response = await clientService.getClients(currentPage, pageSize);
      setClients(response.clientes);
      setTotalPages(response.pagination.total_pages);
      setTotalItems(response.pagination.total);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const filteredClients = clients
    .filter((client) => {
      const searchMatch = client.nombre_razon_social.toLowerCase().includes(searchTerm.toLowerCase());
      const estadoMatch = !estado || client.estado === estado;
      const tipoMatch = !tipoCliente || client.tipo_cliente === tipoCliente;
      const riesgoMatch = !nivelRiesgo || client.nivel_riesgo === nivelRiesgo;
      return searchMatch && estadoMatch && tipoMatch && riesgoMatch;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction * aValue.localeCompare(bValue);
      }
      return 0;
    });

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md text-sm ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {i}
        </button>
      );
    }

    const startItem = ((currentPage - 1) * pageSize) + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando {startItem} - {endItem} de {totalItems} clientes
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Ir a la primera página"
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-500 dark:text-gray-400">...</span>}
            </>
          )}
          {pages}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-500 dark:text-gray-400">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Ir a la última página"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <ClientFiltersBar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        estado={estado}
        onEstadoChange={setEstado}
        tipoCliente={tipoCliente}
        onTipoClienteChange={setTipoCliente}
        nivelRiesgo={nivelRiesgo}
        onNivelRiesgoChange={setNivelRiesgo}
        onAddClient={() => setIsNewClientModalOpen(true)}
        onExport={() => {/* TODO: Implementar */}}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <NewClientForm
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onSuccess={() => {
          loadClients();
          setIsNewClientModalOpen(false);
        }}
      />

      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Riesgo</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Estado Doc.</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Segmento</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Fecha Creación</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    Cargando clientes...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron clientes
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr 
                    key={client.id_cliente} 
                    className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100 transition-colors duration-150"
                  >
                    <td className="px-4 py-2">
                      <Link href={`/clients/${client.id_cliente}`} className="flex items-center gap-3 hover:underline">
                        <div>
                          <div className="font-medium">{client.nombre_razon_social}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{client.documento_identificacion}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-2">
                      <span className="capitalize">{client.tipo_cliente.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-2">
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
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                        client.nivel_riesgo === 'bajo' 
                          ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' :
                        client.nivel_riesgo === 'medio' 
                          ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                          'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                      }`}>
                        {client.nivel_riesgo}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                        client.estado_documental === 'completo' 
                          ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' :
                        client.estado_documental === 'incompleto' 
                          ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                          'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                      }`}>
                        {client.estado_documental}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-gray-700 dark:text-gray-300">{client.segmento}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-gray-700 dark:text-gray-300">
                        {new Date(client.fecha_alta).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            const menu = document.createElement('div');
                            menu.className = 'absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50';
                            menu.innerHTML = `
                              <div class="py-1">
                                <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  Descargar
                                </button>
                              </div>
                            `;
                            
                            const handleClick = (e: MouseEvent) => {
                              const target = e.target as HTMLElement;
                              if (target.textContent?.includes('Descargar')) {
                                // TODO: Implementar descarga
                                console.log('Descargar documento:', client.id_cliente);
                              }
                              document.removeEventListener('click', handleClick);
                              menu.remove();
                            };
                            
                            document.addEventListener('click', handleClick);
                            e.currentTarget.parentElement?.appendChild(menu);
                          }}
                          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Acciones"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="p-4">
            {renderPagination()}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-4">
              Cargando clientes...
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-4">
              No se encontraron clientes
            </div>
          ) : (
            filteredClients.map((client) => (
              <ClientCard key={client.id_cliente} client={client} />
            ))
          )}
        </div>
      )}
    </div>
  );
} 