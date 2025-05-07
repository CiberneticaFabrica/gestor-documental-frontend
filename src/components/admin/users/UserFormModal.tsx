export function UserFormModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          title="Cerrar formulario"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Nuevo Usuario</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
            <input id="nombre" className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2" placeholder="Nombre completo" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input id="email" type="email" className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2" placeholder="usuario@ejemplo.com" />
          </div>
          <div>
            <label htmlFor="rol" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Rol</label>
            <select id="rol" className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
              <option>Administrador</option>
              <option>Validador</option>
            </select>
          </div>
          <div>
            <label htmlFor="grupo" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Grupo</label>
            <input id="grupo" className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2" placeholder="Oficina, sucursal, etc." />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Guardar</button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
} 