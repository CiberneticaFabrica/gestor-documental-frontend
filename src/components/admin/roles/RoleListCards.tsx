import { Role } from '@/services/common/roleService';

interface RoleListCardsProps {
  roles: Role[];
  onSelect: (role: Role) => void;
  onDelete?: (roleId: string) => void;
  onViewPermissions?: (roleId: string) => void;
}

export function RoleListCards({ roles, onSelect, onDelete, onViewPermissions }: RoleListCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {roles.map(role => (
        <div key={role.id_rol} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-2 hover:shadow-lg transition cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-blue-700 dark:text-blue-300 text-base">{role.nombre_rol}</span>
            <div className="flex gap-1">
              <button
                title="Editar rol"
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                onClick={e => { e.stopPropagation(); onSelect(role); }}
              >
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button
                title="Ver permisos"
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                onClick={e => { e.stopPropagation(); onViewPermissions && onViewPermissions(role.id_rol); }}
              >
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
              {onDelete && (
                <button
                  title="Eliminar rol"
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                  onClick={e => { e.stopPropagation(); onDelete && onDelete(role.id_rol); }}
                >
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-200 mb-1">{role.descripcion || '-'}</div>
          {/* Aquí podrías mostrar badges de permisos si los tienes */}
        </div>
      ))}
    </div>
  );
} 