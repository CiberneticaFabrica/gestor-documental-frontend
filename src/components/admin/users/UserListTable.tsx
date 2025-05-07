import { User } from './UsersAdminPage';

export function UserListTable({ users, onSelect }: { users: User[]; onSelect: (user: User) => void }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <input className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2" placeholder="Buscar nombre..." />
        <input className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2" placeholder="Buscar email..." />
        <label htmlFor="filtro-rol" className="sr-only">Filtrar por rol</label>
        <select id="filtro-rol" className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2" title="Filtrar por rol">
          <option>Todos los roles</option>
          <option>Administrador</option>
          <option>Validador</option>
        </select>
        <label htmlFor="filtro-estado" className="sr-only">Filtrar por estado</label>
        <select id="filtro-estado" className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2" title="Filtrar por estado">
          <option>Todos los estados</option>
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Nombre</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Email</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Rol</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Estado</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Grupo</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Acción</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">
              <td className="px-4 py-2 text-xs">{user.name}</td>
              <td className="px-4 py-2 text-xs">{user.email}</td>
              <td className="px-4 py-2 text-xs">{user.role}</td>
              <td className="px-4 py-2 text-xs">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${user.status === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.status}</span>
              </td>
              <td className="px-4 py-2 text-xs">{user.group}</td>
              <td className="px-4 py-2">
                <button className="text-blue-500 hover:text-blue-700 font-semibold" onClick={() => onSelect(user)}>Ver detalle</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 