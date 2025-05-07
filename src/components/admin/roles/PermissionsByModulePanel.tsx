export function PermissionsByModulePanel() {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-4">
      <h3 className="text-white font-semibold mb-2">Permisos por Módulo</h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[180px]">
          <h4 className="text-blue-400 font-semibold mb-1">Documentos</h4>
          <ul className="text-xs text-gray-300 list-disc ml-4">
            <li>Ver documentos</li>
            <li>Subir documentos</li>
            <li>Verificar documentos</li>
          </ul>
        </div>
        <div className="flex-1 min-w-[180px]">
          <h4 className="text-blue-400 font-semibold mb-1">Usuarios</h4>
          <ul className="text-xs text-gray-300 list-disc ml-4">
            <li>Ver usuarios</li>
            <li>Editar usuarios</li>
            <li>Asignar roles</li>
          </ul>
        </div>
        <div className="flex-1 min-w-[180px]">
          <h4 className="text-blue-400 font-semibold mb-1">Administración</h4>
          <ul className="text-xs text-gray-300 list-disc ml-4">
            <li>Gestionar roles</li>
            <li>Gestionar carpetas</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 