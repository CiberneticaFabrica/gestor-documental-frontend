import React, { useState, useEffect } from "react";
import type { User } from "./UsersAdminPage";
import { UserFilters } from "./UserFilters";

interface UserListTableProps {
  users: User[];
  onSelect: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export function UserListTable({ users, onSelect, onEdit, onDelete, onToggleStatus }: UserListTableProps) {
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    rol: ''
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

  return (
    <div className="space-y-4">
      <UserFilters onFilter={setFilters} />
      
      <div className="overflow-x-auto rounded shadow bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Usuario</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Roles</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Último acceso</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <tr 
                key={user.id_usuario} 
                className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100" 
              >
                <td className="px-4 py-2">{user.nombre_usuario}</td>
                <td className="px-4 py-2">{user.nombre} {user.apellidos}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.estado === 'activo' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {user.estado}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {user.roles.map((rol) => rol.nombre_rol).join(", ")}
                </td>
                <td className="px-4 py-2">
                  {user.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleString() : "Nunca"}
                </td>
                <td className="px-4 py-2">
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
      </div>
    </div>
  );
} 