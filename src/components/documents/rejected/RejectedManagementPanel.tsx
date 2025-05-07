export function RejectedManagementPanel({ onAppeal }: { onAppeal: () => void }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <h3 className="text-white font-semibold mb-2">Plantillas de comunicación</h3>
        <label htmlFor="plantilla-comunicacion" className="sr-only">Plantilla de comunicación</label>
        <select id="plantilla-comunicacion" className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-2" title="Plantilla de comunicación">
          <option>Seleccione una plantilla...</option>
          <option>Solicitud de nuevo documento</option>
          <option>Notificación de rechazo</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Enviar comunicación</button>
      </div>
      <div className="flex-1">
        <h3 className="text-white font-semibold mb-2">Programar seguimiento</h3>
        <label htmlFor="programar-seguimiento" className="sr-only">Fecha y hora de seguimiento</label>
        <input id="programar-seguimiento" type="datetime-local" className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-2" title="Fecha y hora de seguimiento" />
        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Programar</button>
      </div>
      <div className="flex-1">
        <h3 className="text-white font-semibold mb-2">Solicitar nueva documentación</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">Solicitar</button>
        <button onClick={onAppeal} className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full">Iniciar apelación</button>
      </div>
    </div>
  );
} 