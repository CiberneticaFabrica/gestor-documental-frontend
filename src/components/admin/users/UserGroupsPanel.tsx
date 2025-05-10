export function UserGroupsPanel() {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-4">
      <h3 className="text-gray-500 dark:text-gray-300 uppercase font-semibold mb-2">Gestión de Grupos</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">Oficina Central</span>
        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">Sucursal Norte</span>
        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">Sucursal Sur</span>
      </div>
      <div className="flex gap-2">
        <input className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2" placeholder="Nuevo grupo..." />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Agregar grupo</button>
      </div>
    </div>
  );
} 