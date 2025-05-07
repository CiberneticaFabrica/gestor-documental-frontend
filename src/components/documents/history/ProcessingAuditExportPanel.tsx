export function ProcessingAuditExportPanel() {
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row gap-6 mt-4">
      <div className="flex-1">
        <h3 className="text-white font-semibold mb-2">Exportar informe de trazabilidad</h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">Descargar informe</button>
      </div>
      <div className="flex-1">
        <h3 className="text-white font-semibold mb-2">Exportación certificada</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">Exportar para regulador</button>
      </div>
      <div className="flex-1">
        <h3 className="text-white font-semibold mb-2">Logs técnicos</h3>
        <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full">Descargar logs</button>
      </div>
    </div>
  );
} 