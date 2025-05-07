import { X } from 'lucide-react';

type Document = {
  id: string;
  thumbnail: string;
  type: string;
  typeIcon: string;
  client: string;
  uploadDate: string;
  status: string;
  confidence: number;
  expiry: string;
};

export function DocumentPreviewModal({ document, onClose }: { document: Document | null, onClose: () => void }) {
  if (!document) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          title="Cerrar previsualización"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Previsualización */}
          <div className="flex-1 flex flex-col items-center">
            <img src={document.thumbnail} alt="preview" className="w-48 h-64 object-cover rounded shadow" />
            <div className="mt-2 text-xs text-gray-500">Miniatura del documento</div>
          </div>
          {/* Metadatos */}
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-2">Metadatos</h2>
            <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">ID: <span className="font-mono">{document.id}</span></div>
            <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">Tipo: {document.type}</div>
            <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">Cliente: {document.client}</div>
            <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">Fecha de carga: {document.uploadDate}</div>
            <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">Estado: {document.status}</div>
            <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">Confianza: {document.confidence}%</div>
            <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">Vencimiento: {document.expiry}</div>
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Historial de acciones</h3>
              <ul className="text-xs text-gray-500 list-disc ml-4">
                <li>Subido por {document.client} el {document.uploadDate}</li>
                <li>Procesado automáticamente</li>
                <li>Sin incidencias</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 