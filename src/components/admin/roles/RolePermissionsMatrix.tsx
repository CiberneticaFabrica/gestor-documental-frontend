import { Role } from './RolesAdminPage';

const allPermissions = [
  'dashboard',
  'users',
  'documents',
  'admin',
  'verify',
  'edit',
  'delete',
];

export function RolePermissionsMatrix({ role, onClose }: { role: Role; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          title="Cerrar matriz"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Permisos de {role.name}</h2>
        <form className="space-y-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mb-4">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500">Permiso</th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500">Asignado</th>
              </tr>
            </thead>
            <tbody>
              {allPermissions.map((perm) => (
                <tr key={perm}>
                  <td className="px-4 py-2 text-xs">{perm}</td>
                  <td className="px-4 py-2 text-center">
                    <label htmlFor={`perm-${perm}`} className="sr-only">{`Asignar permiso ${perm}`}</label>
                    <input id={`perm-${perm}`} type="checkbox" checked={role.permissions.includes(perm)} readOnly title={`Asignar permiso ${perm}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Guardar</button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
} 