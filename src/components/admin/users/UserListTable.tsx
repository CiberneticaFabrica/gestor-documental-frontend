import React, { useState, useEffect } from "react";
import type { User } from "./UsersAdminPage";
import { UserFilters } from "./UserFilters";

interface UserListTableProps {
  users: User[];
  onSelect: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type SortKey = 'nombre_usuario' | 'nombre' | 'email' | 'estado' | 'roles' | 'ultimo_acceso';

type SortDirection = 'asc' | 'desc';

export function UserListTable({ users, onSelect, onEdit, onDelete, onToggleStatus, page, pageSize, total, totalPages, onPageChange }: UserListTableProps) {
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    rol: ''
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('nombre_usuario');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleMenuClick = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Verificar si el click fue fuera del menú
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-button') && !target.closest('.menu-content')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredUsers = users.filter(user => {
    const searchMatch = 
      user.nombre_usuario.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.apellidos.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());
    
    const estadoMatch = !filters.estado || user.estado === filters.estado;
    const rolMatch = !filters.rol || user.roles.some(r => r.nombre_rol === filters.rol);

    return searchMatch && estadoMatch && rolMatch;
  });

  // Ordenar usuarios
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    switch (sortKey) {
      case 'nombre_usuario':
        aValue = a.nombre_usuario; bValue = b.nombre_usuario; break;
      case 'nombre':
        aValue = a.nombre + ' ' + a.apellidos; bValue = b.nombre + ' ' + b.apellidos; break;
      case 'email':
        aValue = a.email; bValue = b.email; break;
      case 'estado':
        aValue = a.estado; bValue = b.estado; break;
      case 'roles':
        aValue = a.roles.map(r => r.nombre_rol).join(',');
        bValue = b.roles.map(r => r.nombre_rol).join(',');
        break;
      case 'ultimo_acceso':
        aValue = a.ultimo_acceso || '';
        bValue = b.ultimo_acceso || '';
        break;
      default:
        aValue = '';
        bValue = '';
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDirection === 'asc' ? (
      <svg className="inline w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
    ) : (
      <svg className="inline w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
    );
  };

  return (
    <div className="space-y-4">
      
      <div className="overflow-x-auto rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm" onClick={() => handleSort('nombre_usuario')}>Usuario {sortIcon('nombre_usuario')}</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm" onClick={() => handleSort('nombre')}>Nombre {sortIcon('nombre')}</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm" onClick={() => handleSort('email')}>Email {sortIcon('email')}</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm" onClick={() => handleSort('estado')}>Estado {sortIcon('estado')}</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm" onClick={() => handleSort('roles')}>Roles {sortIcon('roles')}</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm" onClick={() => handleSort('ultimo_acceso')}>Último acceso {sortIcon('ultimo_acceso')}</th>
              <th className="px-4 py-3 text-sm"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 text-sm">
            {sortedUsers.map((user) => (
              <tr 
                key={user.id_usuario} 
                className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100 transition-colors duration-150"
                style={{ borderRadius: '12px' }}
              >
                <td className="px-4 py-2 text-sm">{user.nombre_usuario}</td>
                <td className="px-4 py-2 text-sm">{user.nombre} {user.apellidos}</td>
                <td className="px-4 py-2 text-sm">{user.email}</td>
                <td className="px-4 py-2 text-sm">
                  {user.estado === 'activo' ? (
                    <span title="Activo" className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span title="Inactivo" className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-sm">
                  {user.roles.map((rol) => (
                    <span key={rol.id_rol} className="inline-block rounded-full bg-blue-100 text-blue-700 px-3 py-0.5 text-xs font-semibold mr-1 mb-1">
                      {rol.nombre_rol}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-2 text-sm">{user.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleString() : "Nunca"}</td>
                <td className="px-4 py-2 text-sm">
                  <div className="relative">
                    <button 
                      aria-label="Menú de acciones"
                      className="menu-button p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                      onClick={(e) => handleMenuClick(user.id_usuario, e)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    <div 
                      className={`menu-content absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 ${
                        openMenuId === user.id_usuario ? '' : 'hidden'
                      }`}
                    >
                      <div className="py-1">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(user);
                          }}
                        >
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver
                          </span>
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(user);
                          }}
                        >
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </span>
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(user);
                          }}
                        >
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            {user.estado === 'activo' ? 'Desactivar' : 'Activar'}
                          </span>
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(user);
                          }}
                        >
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
   
      {/* Paginación real */}
      <div className="flex justify-between items-center mt-2 mb-4 px-2">
        <div className="text-xs text-gray-500">Mostrando {users.length} de {total} usuarios</div>
        <div className="flex gap-1">
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
          >&lt;</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`px-3 py-1 rounded text-xs ${p === page ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              onClick={() => onPageChange(p)}
              disabled={p === page}
            >{p}</button>
          ))}
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >&gt;</button>
        </div>
      </div>
    </div>
    </div>
  );
} 