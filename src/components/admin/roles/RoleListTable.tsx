import { Role as APIRole } from '@/services/common/roleService';
import { useState } from 'react';
import { toast } from 'sonner';

interface Role extends APIRole {
  permissions?: string[];
}

interface RoleListTableProps {
  roles: APIRole[];
  onSelect: (role: Role) => void;
  onDelete?: (roleId: string) => void;
  onViewPermissions?: (roleId: string) => void;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function RoleListTable({ roles, onSelect, onDelete, onViewPermissions, page, pageSize, total, totalPages, onPageChange }: RoleListTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  const filteredRoles = roles.filter(role => 
    role.nombre_rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (roleId: string) => {
    if (window.confirm('¿Está seguro de eliminar este rol?')) {
      try {
        const token = localStorage.getItem("session_token");
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/roles/${roleId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Rol eliminado exitosamente");
        if (onDelete) onDelete(roleId);
      } catch (error) {
        console.error("Error al eliminar el rol:", error);
        toast.error("Error al eliminar el rol");
      }
    }
    setShowActionsMenu(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
 
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Rol</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Descripción</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 text-sm">
          {filteredRoles.map((role) => (
            <tr key={role.id_rol} className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100 transition-colors duration-150">
              <td className="px-4 py-2 text-sm">{role.nombre_rol}</td>
              <td className="px-4 py-2 text-sm">{role.descripcion || '-'}</td>
              <td className="px-4 py-2 relative text-sm">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowActionsMenu(showActionsMenu === role.id_rol ? null : role.id_rol)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                      title="Acciones"
                      aria-label="Mostrar acciones"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    {showActionsMenu === role.id_rol && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border dark:border-gray-700">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setShowActionsMenu(null);
                              onSelect({ ...role, permissions: [] });
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Editar rol
                          </button>
                          <button
                            onClick={() => {
                              setShowActionsMenu(null);
                              if (onViewPermissions) onViewPermissions(role.id_rol);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Ver permisos
                          </button>
                          <button
                            onClick={() => handleDelete(role.id_rol)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Eliminar rol
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4 px-2">
        <div className="text-xs text-gray-500">Mostrando {roles.length} de {total} roles</div>
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
  );
} 