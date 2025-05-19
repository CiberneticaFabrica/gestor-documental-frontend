"use client";
import { FileText, Eye, Download, Clock, CheckCircle, AlertCircle, Tag, MoreVertical, ChevronRight, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import React from 'react';
import { Document } from '@/services/common/documentService';
import { toast } from 'sonner';
import { documentService, DocumentVersion, DocumentVersionsResponse } from '@/lib/api/services/document.service';
import { DocumentUpload } from '@/components/documents/upload/DocumentUploadPage';
import { Modal } from '@/components/ui/modal';

interface DocumentTableProps {
  documents: Document[];
  onSelect: (doc: Document) => void;
  onDocumentUpdated?: () => void; // Nueva prop para notificar cuando un documento ha sido actualizado
}

export function DocumentTable({ documents, onSelect, onDocumentUpdated }: DocumentTableProps) {
  const [showVersions, setShowVersions] = useState<boolean>(false);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Función auxiliar para obtener el ID del cliente a partir del ID del documento
  const getClientIdFromDocId = (docId: string): string => {
    const doc = documents.find(d => d.id_documento === docId);
    return doc?.id_cliente || '';
  };

  // Función auxiliar para obtener documentos filtrados por cliente
  const getDocumentsForClient = (docId: string): Document[] => {
    const doc = documents.find(d => d.id_documento === docId);
    if (!doc || !doc.id_cliente) return [];
    
    return documents.filter(d => d.id_cliente === doc.id_cliente);
  };

  const handleViewVersions = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      setSelectedDocId(docId);
      
      const data = await documentService.getVersions(docId);
      
      // Marcar la versión actual
      const doc = documents.find(d => d.id_documento === docId);
      const currentVersion = doc?.version_actual || 0;
      
      const versionsWithCurrent = data.versions.map(v => ({
        ...v,
        es_version_actual: v.numero_version === currentVersion
      }));
      
      setVersions(versionsWithCurrent);
      setShowVersions(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las versiones del documento');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadNewVersion = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDocId(docId);
    setShowUploadModal(true);
  };

  const handleVersionUploaded = async () => {
    if (!selectedDocId) return;
    
    setShowUploadModal(false);
    
    try {
      // Refrescar la lista de versiones si está visible
      if (showVersions) {
        const data = await documentService.getVersions(selectedDocId);
        const doc = documents.find(d => d.id_documento === selectedDocId);
        const currentVersion = doc?.version_actual || 0;
        
        const versionsWithCurrent = data.versions.map(v => ({
          ...v,
          es_version_actual: v.numero_version === currentVersion
        }));
        
        setVersions(versionsWithCurrent);
      }
      
      // Notificar al componente padre para refrescar la lista de documentos
      if (onDocumentUpdated) {
        onDocumentUpdated();
      }
      
      toast.success("Nueva versión subida correctamente");
    } catch (error) {
      console.error('Error al refrescar datos:', error);
      toast.error('Error al refrescar los datos');
    }
  };

  const toggleGroup = (clientName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(clientName)) {
      newExpanded.delete(clientName);
    } else {
      newExpanded.add(clientName);
    }
    setExpandedGroups(newExpanded);
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    const key = doc.id_cliente || 'sin_cliente';
    if (!acc[key]) {
      acc[key] = {
        cliente_nombre: doc.cliente_nombre || 'Sin cliente asignado',
        documentos: []
      };
    }
    acc[key].documentos.push(doc);
    return acc;
  }, {} as Record<string, { cliente_nombre: string; documentos: Document[] }>);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Overlay de carga */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-700 dark:text-gray-200">Cargando...</span>
          </div>
        </div>
      )}
      
      {/* Modal de versiones */}
      {showVersions && selectedDocId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-3/4 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Historial de Versiones
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                  onClick={() => {
                    // Abrir modal para subir nueva versión
                    setShowUploadModal(true);
                  }}
                >
                  <Upload className="h-4 w-4" />
                  Subir nueva versión
                </button>
                <button 
                  onClick={() => setShowVersions(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Versión</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Creado por</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Comentario</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tamaño</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {versions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                        No hay versiones disponibles
                      </td>
                    </tr>
                  ) : (
                    versions.map((version) => (
                      <tr key={version.id_version} className={version.id_version ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {version.id_version && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 mr-2">
                              Actual
                            </span>
                          )}
                          v{version.numero_version}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {new Date(version.fecha_creacion).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{version.creado_por_usuario}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{version.comentario_version || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {formatFileSize(version.tamano_bytes)}
                        </td>
                        <td className="px-4 py-3 text-sm flex gap-2">
                          <button 
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => {
                              // Vista previa de la versión - puedes implementar esto después
                              toast.info(`Vista previa de versión ${version.numero_version} no implementada`);
                            }}
                            title="Ver versión"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={async () => {
                              try {
                                // Obtener URL de descarga - esto depende de tu implementación
                                const contentUrl = await documentService.getDocumentContentUrl(selectedDocId);
                                
                                // Crear un enlace de descarga
                                const a = document.createElement('a');
                                a.href = contentUrl.url;
                                a.download = version.nombre_original || `documento-v${version.numero_version}.${version.extension}`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                              } catch (error) {
                                console.error('Error al descargar versión:', error);
                                toast.error('Error al descargar la versión');
                              }
                            }}
                            title="Descargar versión"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none text-sm">Cliente</th>
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
          {Object.entries(groupedDocuments).map(([id_cliente, { cliente_nombre, documentos }]) => (
            <React.Fragment key={id_cliente}>
              <tr>
                <td colSpan={8} className="bg-gray-100 dark:bg-gray-700 font-bold text-[13px] py-2 px-4">
                   {cliente_nombre}
                </td>
              </tr>
              {documentos.map((doc) => (
                <tr 
                  key={doc.id_documento} 
                  className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer text-[11px] text-gray-900 dark:text-gray-100 transition-colors duration-150 bg-gray-50 dark:bg-gray-700/50"
                  onClick={() => onSelect(doc)}
                >
                  <td className="px-4 py-2 pl-12"></td>
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
                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-center gap-1">
                      <span>v{doc.version_actual}</span>
                      {/* {doc.version_actual > 1 && (
                        <span className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={(e) => handleViewVersions(doc.id_documento, e)}
                          title="Ver versiones"
                        >
                          ({doc.version_actual > 1 ? `${doc.version_actual} versiones` : '1 versión'})
                      )} */}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex gap-1">
                      <button 
                        onClick={(e) => handleUploadNewVersion(doc.id_documento, e)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Subir nueva versión"
                      >
                        <Upload className="h-4 w-4 text-blue-500" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const menu = document.createElement('div');
                          menu.className = 'absolute mt-8 right-0 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50';
                          menu.innerHTML = `
                            <div class="py-1">
                              ${doc.version_actual > 1 ? `
                                <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                  <span class="mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                  </span>
                                  Ver versiones
                                </button>
                              ` : ''}
                              <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                <span class="mr-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                </span>
                                Descargar
                              </button>
                              <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                <span class="mr-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                                </span>
                                Nueva versión
                              </button>
                            </div>
                          `;
                          
                          // Agregar el menú
                          e.currentTarget.parentElement?.appendChild(menu);
                          
                          // Manejar clics
                          const handleMenuClick = (menuEvent: MouseEvent) => {
                            const target = menuEvent.target as HTMLElement;
                            const menuItem = target.closest('button');
                            
                            if (menuItem) {
                              const text = menuItem.textContent?.trim();
                              
                              if (text?.includes('Ver versiones')) {
                                handleViewVersions(doc.id_documento, e);
                              } else if (text?.includes('Descargar')) {
                                // TODO: Implementar descarga
                                documentService.getDocumentContentUrl(doc.id_documento)
                                  .then(data => {
                                    const a = document.createElement('a');
                                    a.href = data.url;
                                    a.download = doc.titulo || `documento-${doc.codigo_documento}`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                  })
                                  .catch(error => {
                                    console.error('Error al descargar:', error);
                                    toast.error('Error al descargar el documento');
                                  });
                              } else if (text?.includes('Nueva versión')) {
                                handleUploadNewVersion(doc.id_documento, e);
                              }
                            }
                            
                            // Eliminar el menú
                            menu.remove();
                            document.removeEventListener('click', handleMenuClick);
                          };
                          
                          // Agregar manejador de clics
                          document.addEventListener('click', handleMenuClick);
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
            </React.Fragment>
          ))}
          {documents.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                No hay documentos para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </table>

    {/* Modal para subir una nueva versión desde la tabla */}
    {showUploadModal && selectedDocId && (
      <Modal onClose={() => setShowUploadModal(false)}>
        <DocumentUpload
          idCliente={getClientIdFromDocId(selectedDocId)}
          idDocumento={selectedDocId}
          onUploaded={() => {
            setShowUploadModal(false);
            
            // Refrescar datos después de subir una nueva versión
            if (showVersions) {
              // Recargar versiones si estamos en la vista de versiones
              documentService.getVersions(selectedDocId).then(data => {
                setVersions(data.versions);
                toast.success("Nueva versión subida correctamente");
              }).catch(error => {
                console.error('Error al recargar versiones:', error);
                toast.error("Error al recargar las versiones");
              });
            } else {
              // Notificar al componente padre que debe refrescar la lista de documentos
              if (onSelect) {
                // Buscar el documento actualizado
                const documents = getDocumentsForClient(selectedDocId);
                if (documents && documents.length > 0) {
                  onSelect(documents[0]);
                }
              }
              toast.success("Nueva versión subida correctamente");
            }
          }}
            isNewVersion={true}
          />
        </Modal>
      )}
    </div>
  );
}