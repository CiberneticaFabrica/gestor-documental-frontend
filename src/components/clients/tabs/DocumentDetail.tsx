import { ArrowLeft, Upload, FileText, Clock, User, Tag, Folder } from 'lucide-react';
import { type ClientDocument } from './UserDocumentsTab';

interface DocumentDetailProps {
  document: ClientDocument;
  onBack: () => void;
  onUploadNewVersion: (docId: string) => void;
}

export function DocumentDetail({ document, onBack, onUploadNewVersion }: DocumentDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detalle del Documento</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Información General</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Título</label>
                <p className="font-medium text-gray-900 dark:text-white">{document.titulo}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Código</label>
                <p className="font-medium text-gray-900 dark:text-white">{document.codigo_documento}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Tipo de Documento</label>
                <p className="font-medium text-gray-900 dark:text-white">{document.tipo_documento || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Versión Actual</label>
                <p className="font-medium text-gray-900 dark:text-white">v{document.version_actual || '1'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Detalles Adicionales</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Estado</label>
                <p className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  document.estado === 'publicado' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300'
                }`}>
                  {document.estado || 'Pendiente'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Carpeta</label>
                <p className="font-medium text-gray-900 dark:text-white">{document.nombre_carpeta || 'Sin carpeta'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Fecha de Creación</label>
                <p className="font-medium text-gray-900 dark:text-white">
                  {document.fecha_creacion ? new Date(document.fecha_creacion).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Última Modificación</label>
                <p className="font-medium text-gray-900 dark:text-white">
                  {document.fecha_modificacion ? new Date(document.fecha_modificacion).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {document.descripcion && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Descripción</h3>
            <p className="text-gray-600 dark:text-gray-300">{document.descripcion}</p>
          </div>
        )}

        {document.tags && document.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Etiquetas</h3>
            <div className="flex flex-wrap gap-2">
              {document.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => onUploadNewVersion(document.id_documento)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Subir nueva versión
          </button>
        </div>
      </div>
    </div>
  );
} 