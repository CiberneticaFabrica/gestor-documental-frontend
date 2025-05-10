import { User } from './UsersAdminPage';

export function UserDetailDrawer({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/40">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md h-full shadow-xl p-6 overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          title="Cerrar detalle"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Detalle de Usuario</h2>
        <div className="mb-4">
          <div className="font-semibold text-blue-700 dark:text-blue-300">{user.nombre} {user.apellidos}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
          <div className="text-xs text-gray-500">Usuario: {user.nombre_usuario}</div>
          <div className="text-xs text-gray-500">Roles: {user.roles.map(role => role.nombre_rol).join(', ')}</div>
          <div className="text-xs text-gray-500">Estado: {user.estado}</div>
          <div className="text-xs text-gray-500">Último acceso: {user.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleString() : 'Nunca'}</div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Actividad reciente</h3>
          <ul className="text-xs text-gray-500 list-disc ml-4">
            <li>Inició sesión el 2024-03-20</li>
            <li>Verificó 3 documentos</li>
            <li>Cambió su contraseña</li>
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Permisos asignados</h3>
          <ul className="text-xs text-gray-500 list-disc ml-4">
            <li>Ver dashboard</li>
            <li>Leer documentos</li>
            <li>Crear documentos</li>
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Roles</h3>
          <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{user.roles.map(role => role.nombre_rol).join(', ')}</span>
        </div>
      </div>
    </div>
  );
} 