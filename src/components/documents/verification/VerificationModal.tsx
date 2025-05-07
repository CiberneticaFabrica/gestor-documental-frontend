import { VerificationDocument } from './DocumentVerificationPage';

export function VerificationModal({ document, onClose }: { document: VerificationDocument; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          title="Cerrar verificación"
        >
          ✕
        </button>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Vista lado a lado */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-48 h-64 bg-gray-200 rounded shadow flex items-center justify-center text-gray-400 mb-2">
              Documento original
            </div>
            <div className="mt-2 text-xs text-gray-500">Miniatura/preview</div>
          </div>
          {/* Datos extraídos y edición */}
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-2">Datos extraídos</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="w-32 text-sm text-gray-600">Nombre</label>
                <input className="bg-gray-100 rounded px-2 py-1 flex-1" defaultValue={document.client} placeholder="Nombre del cliente" />
                <span className="text-xs text-green-600 ml-2">95%</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-32 text-sm text-gray-600">Tipo</label>
                <input className="bg-gray-100 rounded px-2 py-1 flex-1" defaultValue={document.type} placeholder="Tipo de documento" />
                <span className="text-xs text-yellow-600 ml-2">80%</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-32 text-sm text-gray-600">Fecha</label>
                <input className="bg-gray-100 rounded px-2 py-1 flex-1" defaultValue={document.uploadDate} placeholder="Fecha de carga" />
                <span className="text-xs text-green-600 ml-2">99%</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Historial de correcciones</h3>
              <ul className="text-xs text-gray-500 list-disc ml-4">
                <li>Juan Pérez corrigió el nombre el 2024-03-16</li>
                <li>María García corrigió el tipo el 2024-03-15</li>
              </ul>
            </div>
            {/* Panel de acciones */}
            <div className="mt-6 flex gap-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Aprobar</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Rechazar</button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Solicitar info</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Escalar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 