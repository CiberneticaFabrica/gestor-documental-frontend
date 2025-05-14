import { Document } from '@/services/common/documentService';
import { Tag } from 'lucide-react';

interface DocumentPreviewModalProps {
  document: Document | null;
  onClose: () => void;
}

export function DocumentPreviewModal({ document, onClose }: DocumentPreviewModalProps) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-3/4 h-3/4 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {document.titulo}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Información básica</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Código:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{document.codigo_documento}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Tipo:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{document.tipo_documento}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Versión:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">v{document.version_actual}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Carpeta:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{document.nombre_carpeta || '-'}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Estado:</span>
                  <span className="ml-2">
                    {document.estado ? (
                      <span className="inline-block rounded-full bg-blue-100 text-blue-700 px-3 py-0.5 text-xs font-semibold">
                        {document.estado}
                      </span>
                    ) : '-'}
                  </span>
                </p>
              </div>
            </div>

            {/* Metadatos */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Metadatos</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Creado por:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{document.creado_por_usuario}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Modificado por:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{document.modificado_por_usuario}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Fecha creación:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {new Date(document.fecha_creacion).toLocaleString()}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Última modificación:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {new Date(document.fecha_modificacion).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>

            {/* Descripción */}
            <div className="col-span-2 space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</h4>
              <p className="text-sm text-gray-900 dark:text-white">
                {document.descripcion || 'Sin descripción'}
              </p>
            </div>

            {/* Etiquetas */}
            {document.tags && document.tags.length > 0 && (
              <div className="col-span-2 space-y-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Etiquetas</h4>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Cerrar
          </button>
          <button 
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              // TODO: Implementar descarga
              console.log('Descargar documento:', document.id_documento);
            }}
          >
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
} 