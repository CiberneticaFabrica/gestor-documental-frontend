import { Role } from './RolesAdminPage';

export function RoleListTable({ roles, onSelect }: { roles: Role[]; onSelect: (role: Role) => void }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Rol</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Descripción</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Permisos</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Acción</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">
              <td className="px-4 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300">{role.name}</td>
              <td className="px-4 py-2 text-xs">{role.description}</td>
              <td className="px-4 py-2 text-xs">
                {role.permissions.map((perm) => (
                  <span key={perm} className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold mr-1 mb-1">{perm}</span>
                ))}
              </td>
              <td className="px-4 py-2">
                <button className="text-blue-500 hover:text-blue-700 font-semibold" onClick={() => onSelect(role)}>Editar permisos</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 