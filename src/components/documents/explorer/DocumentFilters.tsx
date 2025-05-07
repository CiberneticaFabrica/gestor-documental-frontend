export function DocumentFilters() {
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-wrap gap-4 items-end">
      <div>
        <label htmlFor="tipo" className="block text-xs text-gray-400 mb-1">Tipo</label>
        <select id="tipo" className="rounded bg-gray-900 text-white px-2 py-1">
          <option>Todos</option>
          <option>DNI</option>
          <option>Comprobante Domicilio</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Cliente</label>
        <input className="rounded bg-gray-900 text-white px-2 py-1" placeholder="Buscar cliente..." />
      </div>
      <div>
        <label htmlFor="estado" className="block text-xs text-gray-400 mb-1">Estado</label>
        <select id="estado" className="rounded bg-gray-900 text-white px-2 py-1">
          <option>Todos</option>
          <option>Procesado</option>
          <option>Pendiente</option>
        </select>
      </div>
      <div>
        <label htmlFor="fecha-carga" className="block text-xs text-gray-400 mb-1">Fecha de carga</label>
        <input id="fecha-carga" type="date" className="rounded bg-gray-900 text-white px-2 py-1" />
      </div>
      <div>
        <label htmlFor="confianza" className="block text-xs text-gray-400 mb-1">Confianza</label>
        <input id="confianza" type="range" min="0" max="100" className="w-32" />
      </div>
      <div>
        <label htmlFor="validacion" className="block text-xs text-gray-400 mb-1">Validación</label>
        <select id="validacion" className="rounded bg-gray-900 text-white px-2 py-1">
          <option>Todos</option>
          <option>Requiere validación</option>
          <option>Validado</option>
        </select>
      </div>
    </div>
  );
} 