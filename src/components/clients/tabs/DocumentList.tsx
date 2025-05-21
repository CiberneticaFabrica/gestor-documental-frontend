import { FileText, Loader2, Upload, AlertCircle, CheckCircle2, Clock, Folder, ChevronDown, ChevronRight } from 'lucide-react';
import { type DocumentRequestsResponse, type ClientFoldersResponse } from '@/lib/api/services/client.service';
import { type ClientDocument } from './UserDocumentsTab';
import { useState, useEffect } from 'react';
import { documentService } from '@/lib/api/services/document.service';
import type { DocumentVersion } from '@/lib/api/services/document.service';
import React from 'react';

interface DocumentListProps {
  data: DocumentRequestsResponse;
  documentsData: {
    documentos: ClientDocument[];
  } | null;
  documentsLoading: boolean;
  documentsError: string | null;
  previews: { [docId: string]: { url_documento: string, url_miniatura: string, mime_type: string } };
  onDocumentClick: (document: ClientDocument) => void;
  onUploadNewDocument: (e: React.MouseEvent) => void;
  onUploadNewVersion: (docId: string, e: React.MouseEvent) => void;
  onPreviewClick: (url: string, title: string) => void;
  foldersData: ClientFoldersResponse | null;
  foldersLoading: boolean;
  foldersError: string | null;
  openFolders: { [key: string]: boolean };
  onToggleFolder: (id: string) => void;
}

interface VersionDetailModalProps {
  versions: DocumentVersion[];
  onClose: () => void;
  onPreviewClick: (url: string, title: string) => void;
  previews: { [docId: string]: { url_documento: string, url_miniatura: string, mime_type: string } };
}

export const VersionDetailModal: React.FC<VersionDetailModalProps> = ({ versions, onClose, onPreviewClick, previews }) => {
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
  const selectedVersion = versions[selectedVersionIndex];

  if (!versions.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />
      {/* Panel lateral */}
      <div className="relative ml-auto h-full w-full max-w-lg bg-white dark:bg-gray-800 shadow-xl flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 z-10"
          onClick={onClose}
        >✕</button>
        
        {/* Tabs de versiones */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1 p-4">
            {versions.map((version, index) => (
              <button
                key={version.id_version}
                onClick={() => setSelectedVersionIndex(index)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedVersionIndex === index
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                v{version.numero_version}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de la versión seleccionada */}
        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="text-xl font-bold mb-4">Detalle de la Versión</h2>
          <div className="mb-4">
            <b>Nombre:</b> {selectedVersion.nombre_original}
          </div>
          <div className="mb-2"><b>Versión:</b> v{selectedVersion.numero_version}</div>
          <div className="mb-2"><b>Fecha:</b> {new Date(selectedVersion.fecha_creacion).toLocaleString()}</div>
          <div className="mb-2"><b>Usuario:</b> {selectedVersion.creado_por_usuario}</div>
          <div className="mb-2"><b>Comentario:</b> {selectedVersion.comentario_version}</div>
          <div className="mb-2"><b>Tamaño:</b> {(selectedVersion.tamano_bytes / 1024).toFixed(1)} KB</div>
          <div className="mb-2"><b>Tipo:</b> {selectedVersion.mime_type}</div>
          <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded mt-4">
            {previews[selectedVersion.id_version] ? (
              <img
                src={
                  previews[selectedVersion.id_version].mime_type.startsWith('image/')
                    ? previews[selectedVersion.id_version].url_documento
                    : previews[selectedVersion.id_version].url_miniatura
                }
                alt={selectedVersion.nombre_original}
                className="w-full h-48 object-contain rounded cursor-pointer"
                onClick={() =>
                  onPreviewClick(
                    previews[selectedVersion.id_version].mime_type.startsWith('image/')
                      ? previews[selectedVersion.id_version].url_documento
                      : previews[selectedVersion.id_version].url_miniatura,
                    selectedVersion.nombre_original
                  )
                }
              />
            ) : (
              <span className="text-gray-400">Sin previsualización</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function DocumentList({
  data,
  documentsData,
  documentsLoading,
  documentsError,
  previews,
  onDocumentClick,
  onUploadNewDocument,
  onUploadNewVersion,
  onPreviewClick,
  foldersData,
  foldersLoading,
  foldersError,
  openFolders,
  onToggleFolder
}: DocumentListProps) {
  const { solicitudes, estadisticas } = data;
  const [tab, setTab] = useState<'detalle' | 'versiones'>('detalle');
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [versionPreviewUrl, setVersionPreviewUrl] = useState('');

  const handlePreview = (versionId: string) => {
    documentService.getDocumentContentUrl(versionId)
      .then((data: { url: string }) => setPreviewUrl(data.url));
  };

  const renderFolderTree = () => {
    if (foldersLoading) return <div className="text-gray-500">Cargando estructura documental...</div>;
    if (foldersError) return <div className="text-red-500">{foldersError}</div>;
    if (!foldersData || !foldersData.categorias.length) return <div className="text-gray-400">No hay carpetas definidas.</div>;
    return (
      <div className="relative pl-6">
        {/* Línea vertical */}
        <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-300" style={{ zIndex: 0 }} />
        <div className="space-y-2 relative z-10">
          {foldersData.categorias.map((categoria: any) => {
            const carpetaEntry = Object.values(foldersData.documentos_por_carpeta).find((c: any) => c.nombre_carpeta === categoria.nombre);
            const documentos = carpetaEntry ? (carpetaEntry as any).documentos : [];
            const isOpen = openFolders[categoria.id] ?? true; // Por defecto abiertas
            return (
              <div key={categoria.id || categoria.nombre} className="border rounded p-2 bg-gray-50">
                <div
                  className="flex items-center font-semibold text-blue-700 mb-1 cursor-pointer select-none"
                  onClick={() => onToggleFolder(categoria.id || categoria.nombre)}
                >
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                  )}
                  <Folder className="h-5 w-5 mr-2 text-yellow-500" />
                  {categoria.nombre}
                  <span className="ml-2 text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">{documentos.length}</span>
                </div>
                {isOpen && (
                  <ul className="ml-8 list-none">
                    {documentos.length === 0 && (
                      <li className="text-gray-400 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-300" />
                        Sin documentos
                      </li>
                    )}
                    {documentos.map((doc: any) => (
                      <li key={doc.id} className="text-gray-700 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-400" />
                        <span className="font-medium">{doc.titulo}</span>
                        <span className="text-xs text-gray-500 ml-2">({doc.tipo})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (tab === 'versiones' && selectedDocumentId) {
      documentService.getVersions(selectedDocumentId)
        .then(data => setVersions(data.versions));
    }
  }, [tab, selectedDocumentId]);

  return (
    <div className="space-y-8">
      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Solicitudes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{estadisticas.total_solicitudes}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-500">{estadisticas.pendientes}</p>
            </div>
            <Loader2 className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recibidos</p>
              <p className="text-2xl font-bold text-green-500">{estadisticas.recibidos}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Vencidos</p>
              <p className="text-2xl font-bold text-red-500">{estadisticas.vencidos}</p>
            </div>
            <Clock className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Lista horizontal de documentos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex items-center gap-4">
        <div className="flex flex-wrap gap-2 flex-1">
          {solicitudes.map((doc) => (
            <div
              key={doc.id_solicitud}
              className="flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 min-w-[180px] max-w-[220px] h-14"
              style={{ minHeight: 44, maxHeight: 44 }}
            >
              <div className={`w-1 h-8 rounded-full mr-2 ${
                doc.estado === 'recibido'
                  ? 'bg-green-500'
                  : doc.dias_restantes <= 7
                  ? 'bg-red-500'
                  : doc.dias_restantes <= 30
                  ? 'bg-yellow-400'
                  : 'bg-red-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs text-gray-900 dark:text-white truncate">{doc.tipo_documento_nombre}</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                  {new Date(doc.fecha_solicitud).toLocaleDateString()} | {doc.dias_restantes} días
                </div>
              </div>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                doc.estado === 'recibido'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {doc.estado === 'recibido' ? 'Recibido' : 'Pendiente'}
              </span>
            </div>
          ))}
        </div>
        <div className="ml-4">
          <button
            onClick={onUploadNewDocument}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Subir nuevo documento
          </button>
        </div>
      </div>

      {/* Estructura documental y tabla de documentos */}
      <div className="flex gap-8">
        {/* Columna de estructura documental (30%) */}
        <div className="w-[30%]">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
            <div className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Folder className="h-5 w-5 text-blue-500" />
              Estructura Documental
            </div>
            {renderFolderTree()}
          </div>
        </div>

        {/* Columna de tabla de documentos (70%) */}
        <div className="w-[70%]">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Documentos del Cliente
            </div>
            {tab === 'detalle' && (
              documentsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : documentsError ? (
                <div className="text-red-500 text-center py-4">{documentsError}</div>
              ) : documentsData && documentsData.documentos.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 font-medium text-left">Documento</th>
                        <th className="py-3 font-medium text-left">Título</th>
                        <th className="py-3 font-medium text-left">Tipo</th>
                        <th className="py-3 font-medium text-left">Versión</th>
                        <th className="py-3 font-medium text-left">Carpeta</th>
                        <th className="py-3 font-medium text-left">Estado</th>
                        <th className="py-3 font-medium text-left">Fecha Creación</th>
                        <th className="py-3 font-medium text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {documentsData.documentos.map((doc) => (
                        <tr key={doc.id_documento} className="text-gray-700 dark:text-gray-300">
                          <td className="py-3">
                            {previews[doc.id_documento] ? (
                              <img
                                src={
                                  previews[doc.id_documento].mime_type.startsWith('image/')
                                    ? previews[doc.id_documento].url_documento
                                    : previews[doc.id_documento].url_miniatura
                                }
                                alt={doc.titulo}
                                className="w-16 h-16 object-cover rounded cursor-pointer"
                                onClick={() =>
                                  onPreviewClick(
                                    previews[doc.id_documento].mime_type.startsWith('image/')
                                      ? previews[doc.id_documento].url_documento
                                      : previews[doc.id_documento].url_miniatura,
                                    doc.titulo
                                  )
                                }
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded" />
                            )}
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => onDocumentClick(doc)}
                              className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {doc.titulo}
                            </button>
                          </td>
                          <td className="py-3">{doc.tipo_documento || 'N/A'}</td>
                          <td className="py-3">
                            {doc.version_actual && doc.version_actual > 1 ? (
                              <button
                                className="text-blue-600 underline hover:text-blue-800"
                                onClick={async () => {
                                  try {
                                    const data = await documentService.getVersions(doc.id_documento);
                                    if (!data.versions || data.versions.length === 0) {
                                      alert('No hay versiones disponibles para este documento.');
                                      return;
                                    }
                                    setVersions(data.versions);
                                    setShowVersionModal(true);
                                  } catch (err) {
                                    alert('No se pudo obtener el detalle de la versión. El documento no tiene versiones o hubo un error.');
                                  }
                                }}
                              >
                                v{doc.version_actual}
                              </button>
                            ) : (
                              <>v{doc.version_actual || '1'}</>
                            )}
                          </td>
                          <td className="py-3">{doc.nombre_carpeta || 'Sin carpeta'}</td>
                          <td className="py-3">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              doc.estado === 'publicado' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300'
                            }`}>
                              {doc.estado || 'Pendiente'}
                            </span>
                          </td>
                          <td className="py-3">{doc.fecha_creacion ? new Date(doc.fecha_creacion).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-3">
                            <button 
                              onClick={(e) => onUploadNewVersion(doc.id_documento, e)}
                              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                              title="Subir nueva versión"
                            >
                              <Upload className="h-4 w-4 text-blue-500" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay documentos disponibles
                </div>
              )
            )}
            {tab === 'versiones' && selectedDocumentId && (
              <div>
                <div className="flex items-center mb-4">
                  <button
                    className="text-blue-600 hover:underline mr-4"
                    onClick={() => setTab('detalle')}
                  >
                    ← Volver a documentos
                  </button>
                  <h3 className="text-lg font-bold">Historial de Versiones</h3>
                </div>
                {versions.length === 0 ? (
                  <div className="text-gray-500">No hay versiones para este documento.</div>
                ) : (
                  <table className="w-full text-sm mb-4">
                    <thead>
                      <tr className="text-gray-500 dark:text-gray-400 border-b">
                        <th className="py-2">Versión</th>
                        <th className="py-2">Fecha</th>
                        <th className="py-2">Usuario</th>
                        <th className="py-2">Comentario</th>
                        <th className="py-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {versions.map((v) => (
                        <tr key={v.id_version} className="border-b">
                          <td className="py-2 font-bold">v{v.numero_version}</td>
                          <td className="py-2">{new Date(v.fecha_creacion).toLocaleString()}</td>
                          <td className="py-2">{v.creado_por_usuario}</td>
                          <td className="py-2">{v.comentario_version}</td>
                          <td className="py-2">
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => {
                                setSelectedVersion(v);
                                setVersionPreviewUrl(v.ubicacion_almacenamiento_ruta);
                                setShowVersionModal(true);
                              }}
                            >
                              Previsualizar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showVersionModal && versions.length > 0 && (
        <VersionDetailModal
          versions={versions}
          onClose={() => setShowVersionModal(false)}
          onPreviewClick={onPreviewClick}
          previews={previews}
        />
      )}
    </div>
  );
} 