"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserListTable } from './UserListTable';
import { UserFormModal } from './UserFormModal';
import { UserDetailDrawer } from './UserDetailDrawer';
import { UserGroupsPanel } from './UserGroupsPanel';
import { fetchUsers } from './fetchUsers';

import { UserStatsCards } from './UserStatsCards';
import { UserFiltersBar } from './UserFiltersBar';

export interface User {
  id_usuario: string;
  nombre_usuario: string;
  nombre: string;
  apellidos: string;
  email: string;
  estado: string;
  fecha_creacion: string;
  ultimo_acceso: string | null;
  requiere_2fa: number;
  roles: { id_rol: string; nombre_rol: string }[];
}

// Esqueleto para vista de cards
function UserListCards({ 
  users, 
  onSelect, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: { 
  users: User[]; 
  onSelect: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {users.map(user => (
        <div key={user.id_usuario} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-700 dark:text-blue-300">{user.nombre_usuario}</span>
            {user.estado === 'activo' ? (
              <span title="Activo" className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
            ) : (
              <span title="Inactivo" className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100">
                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </span>
            )}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-200">{user.nombre} {user.apellidos}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.roles.map((rol) => (
              <span key={rol.id_rol} className="inline-block rounded-full bg-blue-100 text-blue-700 px-3 py-0.5 text-xs font-semibold">
                {rol.nombre_rol}
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2">Último acceso: {user.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleString() : 'Nunca'}</div>
          
          {/* Action buttons */}
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(user);
              }}
              className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              title="Ver detalles"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(user);
              }}
              className="p-1.5 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              title="Editar usuario"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(user);
              }}
              className={`p-1.5 rounded-full ${
                user.estado === 'activo' 
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800' 
                  : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
              } transition-colors`}
              title={user.estado === 'activo' ? 'Desactivar usuario' : 'Activar usuario'}
            >
              {user.estado === 'activo' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(user);
              }}
              className="p-1.5 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              title="Eliminar usuario"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filters, setFilters] = useState({ search: '', estado: '', rol: '' });
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = async (pageToLoad = page, pageSizeToLoad = pageSize) => {
    setLoading(true);
    try {
      const data = await fetchUsers(pageToLoad, pageSizeToLoad);
      setUsers(data.users);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.total_pages);
      setPage(data.pagination.page);
      setPageSize(data.pagination.page_size);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleEdit = (user: User) => {
    // Implementar lógica de edición
    console.log('Editar usuario:', user);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        const token = localStorage.getItem("session_token");
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/users/${user.id_usuario}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        loadUsers(); // Recargar lista
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const token = localStorage.getItem("session_token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/users/${user.id_usuario}/status`,
        {
          estado: user.estado === 'activo' ? 'inactivo' : 'activo'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      loadUsers(); // Recargar lista
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  // Estadísticas rápidas
  const activos = users.filter(u => u.estado === 'activo').length;
  const inactivos = users.filter(u => u.estado === 'inactivo').length;
  const roles = Array.from(new Set(users.flatMap(u => u.roles.map(r => r.nombre_rol)))).length;

  // Filtros para la tabla (solo frontend, sobre la página actual)
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[80vh]">
      {/* Panel lateral info */}
     
      {/* Panel principal */}
      <div className="md:col-span-4 flex flex-col gap-2">
        <UserStatsCards total={total} activos={activos} inactivos={inactivos} roles={roles} />
        <UserFiltersBar
          search={filters.search}
          onSearchChange={v => setFilters(f => ({ ...f, search: v }))}
          estado={filters.estado}
          onEstadoChange={v => setFilters(f => ({ ...f, estado: v }))}
          rol={filters.rol}
          onRolChange={v => setFilters(f => ({ ...f, rol: v }))}
          onAddUser={() => setShowForm(true)}
          onExport={() => {}}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <div className="flex-1">
      {loading ? (
        <div className="text-center text-gray-400">Cargando usuarios...</div>
          ) : viewMode === 'table' ? (
        <UserListTable 
              users={filteredUsers}
              onSelect={setSelectedUser}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              page={page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          ) : (
            <UserListCards
              users={filteredUsers}
          onSelect={setSelectedUser}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}
        </div>
      </div>
      {showForm && (
        <UserFormModal 
          onClose={() => setShowForm(false)} 
          onUserCreated={() => loadUsers(1, pageSize)}
        />
      )}
      {selectedUser && (
        <UserDetailDrawer 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
} 