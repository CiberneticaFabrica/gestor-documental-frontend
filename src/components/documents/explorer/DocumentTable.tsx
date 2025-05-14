import { FileText, Eye, Download, Clock, CheckCircle, AlertCircle, Tag, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import React from 'react';
import { Document } from '@/services/common/documentService';
import { toast } from 'sonner';
import { documentService, DocumentVersion, DocumentVersionsResponse } from '@/lib/api/services/document.service';

interface DocumentTableProps {
  documents: Document[];
  onSelect: (doc: Document) => void;
}

export function DocumentTable({ documents, onSelect }: DocumentTableProps) {
  const [showVersions, setShowVersions] = useState<boolean>(false);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const handleViewVersions = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const data = await documentService.getVersions(docId);
      setVersions(data.versions);
      setSelectedDocId(docId);
      setShowVersions(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las versiones del documento');
    }
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Modal de versiones */}
      {showVersions && selectedDocId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-3/4 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Historial de Versiones
              </h3>
              <button 
                onClick={() => setShowVersions(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Versión</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Creado por</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Comentario</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {versions.map((version) => (
                    <tr key={version.id_version}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">v{version.numero_version}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {new Date(version.fecha_creacion).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{version.creado_por_usuario}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{version.comentario_version}</td>
                      <td className="px-4 py-3 text-sm">
                        <button 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => {
                            // TODO: Implementar descarga de versión
                            console.log('Descargar versión:', version.id_version);
                          }}
                          title="Descargar versión"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Código</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Título</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Tipo</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Carpeta</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Estado</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Versión</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm"></th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 text-sm">
          {documents.map((doc) => (
            <tr key={doc.id_documento} className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => onSelect(doc)}>
              <td className="px-4 py-2 text-sm">{doc.codigo_documento}</td>
              <td className="px-4 py-2 text-sm">{doc.titulo}</td>
              <td className="px-4 py-2 text-sm">{doc.tipo_documento}</td>
              <td className="px-4 py-2 text-sm">{doc.nombre_carpeta || '-'}</td>
              <td className="px-4 py-2 text-sm">
                {doc.estado ? (
                  <span className="inline-block rounded-full bg-blue-100 text-blue-700 px-3 py-0.5 text-xs font-semibold">
                    {doc.estado}
                  </span>
                ) : '-'}
              </td>
              <td className="px-4 py-2 text-sm">v{doc.version_actual}</td>
              <td className="px-4 py-2 text-sm">
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const menu = document.createElement('div');
                      menu.className = 'absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50';
                      menu.innerHTML = `
                        <div class="py-1">
                          ${doc.version_actual > 1 ? `
                            <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Ver versiones
                            </button>
                          ` : ''}
                          <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Descargar
                          </button>
                        </div>
                      `;
                      
                      const handleClick = (e: MouseEvent) => {
                        const target = e.target as HTMLElement;
                        if (target.textContent?.includes('Ver versiones')) {
                          handleViewVersions(doc.id_documento, e as unknown as React.MouseEvent);
                        } else if (target.textContent?.includes('Descargar')) {
                          // TODO: Implementar descarga
                          console.log('Descargar documento:', doc.id_documento);
                        }
                        document.removeEventListener('click', handleClick);
                        menu.remove();
                      };
                      
                      document.addEventListener('click', handleClick);
                      e.currentTarget.parentElement?.appendChild(menu);
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Acciones"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 