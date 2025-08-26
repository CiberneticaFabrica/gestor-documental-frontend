import { useEffect, useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, FileText, Users, Clock, CheckCircle2, Loader2, UploadCloud, AlertCircle, Upload, Folder, ChevronDown, ChevronRight, Activity, ArrowLeft, RefreshCw, Shield } from 'lucide-react';
import { clientService, type DocumentRequestsResponse, type ClientFoldersResponse, type ClientActivity, type ClientActivityResponse } from '@/lib/api/services/client.service';
import { useParams } from 'next/navigation';
import { DocumentUpload } from '@/components/documents/upload/DocumentUploadPage';
import { Modal } from '@/components/ui/modal';
import { documentService } from '@/lib/api/services/document.service';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fetchDocumentContent } from '@/services/common/documentService';
import { DocumentList } from './DocumentList';
import { DocumentDetail } from './DocumentDetail';
import isEqual from 'lodash/isEqual';

const COLORS = ['#3B82F6', '#10B981', '#F59E42', '#EF4444'];

export interface ClientDocument {
  id_documento: string;
  codigo_documento: string;
  titulo: string;
  descripcion?: string;
  id_tipo_documento?: string;
  tipo_documento?: string;
  version_actual?: number;
  fecha_creacion?: string;
  fecha_modificacion?: string;
  id_carpeta?: string | null;
  nombre_carpeta?: string | null;
  estado?: string;
  tags?: string[] | null;
  creado_por_usuario?: string;
  modificado_por_usuario?: string;
  fecha_asignacion?: string;
  asignado_por?: string;
  asignado_por_usuario?: string;
}

interface ClientDocumentsResponse {
  cliente: {
    id: string;
    codigo: string;
    nombre: string;
  };
  documentos: ClientDocument[];
  tipos_documento_disponibles: Array<{
    id_tipo_documento: string;
    nombre_tipo: string;
    descripcion: string;
  }>;
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export function UserDocumentsTab() {
  const params = useParams();
  const [data, setData] = useState<DocumentRequestsResponse | null>(null);
  const [documentsData, setDocumentsData] = useState<ClientDocumentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  // Polling states
  const [pendingUploads, setPendingUploads] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);
  const maxPollingAttempts = 10;
  const pollingInterval = 2000;
  const [foldersData, setFoldersData] = useState<ClientFoldersResponse | null>(null);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [foldersError, setFoldersError] = useState<string | null>(null);
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({});
  const [activity, setActivity] = useState<ClientActivity[]>([]);
  const [previews, setPreviews] = useState<{ [docId: string]: { url_documento: string, url_miniatura: string, mime_type: string } }>({});
  const [previewDoc, setPreviewDoc] = useState<{ url: string, title: string } | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<ClientDocument | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await clientService.getClientDocumentRequests(params.id as string);
        setData(response);
      } catch (err) {
        setError('Error al cargar los documentos del cliente');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  // Cargar estructura de carpetas al montar
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setFoldersLoading(true);
        const response = await clientService.getClientFolders(params.id as string);
        setFoldersData(response);
      } catch (err) {
        setFoldersError('Error al cargar la estructura documental');
        console.error(err);
      } finally {
        setFoldersLoading(false);
      }
    };
    fetchFolders();
  }, [params.id]);

  // Fetch documents
  const fetchClientDocuments = async () => {
    try {
      setDocumentsLoading(true);
      const response = await clientService.getClientDocuments(params.id as string);
      setDocumentsData(response);
    } catch (err) {
      setDocumentsError('Error al cargar los documentos del cliente');
      console.error(err);
    } finally {
      setDocumentsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDocuments();
  }, [params.id]);

  // Función auxiliar para actualizar previews de manera más eficiente
  const updateDocumentPreviews = useCallback(async (documents: ClientDocument[]) => {
    const documentsWithoutPreviews = documents.filter(doc => !previews[doc.id_documento]);
    
    // Procesar previews en lotes para evitar sobrecargar la API
    const batchSize = 3;
    for (let i = 0; i < documentsWithoutPreviews.length; i += batchSize) {
      const batch = documentsWithoutPreviews.slice(i, i + batchSize);
      
      const previewPromises = batch.map(async (doc) => {
        try {
          const data = await fetchDocumentContent(doc.id_documento);
          return {
            docId: doc.id_documento,
            preview: {
              url_documento: data.url_documento,
              url_miniatura: data.url_miniatura,
              mime_type: data.mime_type
            }
          };
        } catch {
          return {
            docId: doc.id_documento,
            preview: {
              url_documento: '',
              url_miniatura: '',
              mime_type: ''
            }
          };
        }
      });
      
      const results = await Promise.all(previewPromises);
      
      // Actualizar estado con los resultados del lote
      setPreviews(prev => {
        const updated = { ...prev };
        results.forEach(({ docId, preview }) => {
          updated[docId] = preview;
        });
        return updated;
      });
      
      // Pequeña pausa entre lotes para no sobrecargar
      if (i + batchSize < documentsWithoutPreviews.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }, [previews]);

  // useEffect optimizado que maneja los previews
  useEffect(() => {
    if (!documentsData?.documentos) return;
    
    updateDocumentPreviews(documentsData.documentos);
  }, [documentsData, updateDocumentPreviews]);

  // Polling function optimizada
  const checkProcessingStatus = useCallback(async () => {
    try {
      // Obtener documentos y solicitudes en paralelo
      const [documentsResponse, requestsResponse] = await Promise.all([
        clientService.getClientDocuments(params.id as string),
        clientService.getClientDocumentRequests(params.id as string)
      ]);
      
      if (!documentsResponse || !documentsData) {
        // Si no hay datos previos, actualizar todo
        setDocumentsData(documentsResponse);
        setData(requestsResponse);
        const foldersResponse = await clientService.getClientFolders(params.id as string);
        setFoldersData(foldersResponse);
        setPendingUploads(false);
        toast.success("¡Documento procesado correctamente!");
        return;
      }
  
      // Comparar documentos actuales con los anteriores
      const currentDocs = documentsData.documentos;
      const newDocs = documentsResponse.documentos;
      
      // SOLO buscar documentos que han cambiado a estados procesados
      const hasRelevantChanges = newDocs.some((newDoc: ClientDocument) => {
        const existingDoc = currentDocs.find(doc => doc.id_documento === newDoc.id_documento);
        
        if (!existingDoc) {
          // Documento completamente nuevo - SOLO considerar si ya está procesado
          return newDoc.estado === 'publicado' || newDoc.estado === 'pendiente_revision' || newDoc.estado === 'en_revision';
        }
        
        // Documento existente - verificar cambio de estado a procesado
        return (
          existingDoc.estado !== newDoc.estado && 
          (newDoc.estado === 'publicado' || newDoc.estado === 'pendiente_revision' || newDoc.estado === 'en_revision')
        ) || (
          // También verificar cambios en versión para documentos ya procesados
          existingDoc.version_actual !== newDoc.version_actual &&
          (newDoc.estado === 'publicado' || newDoc.estado === 'pendiente_revision' || newDoc.estado === 'en_revision')
        );
      });
  
      if (hasRelevantChanges) {
        toast.dismiss("processing-document");
        
        // Actualizar documentos y solicitudes
        setDocumentsData(documentsResponse);
        setData(requestsResponse);
        
        // Actualizar carpetas solo si es necesario
        const foldersResponse = await clientService.getClientFolders(params.id as string);
        setFoldersData(foldersResponse);
        
        // Limpiar previews para documentos actualizados y obtener nuevos
        const updatedOrNewDocs = newDocs.filter((newDoc: ClientDocument) => {
          const existingDoc = currentDocs.find(doc => doc.id_documento === newDoc.id_documento);
          
          if (!existingDoc) {
            // Solo incluir documentos nuevos que ya están procesados
            return newDoc.estado === 'publicado' || newDoc.estado === 'pendiente_revision';
          }
          
          // Incluir documentos existentes que han cambiado
          return existingDoc.estado !== newDoc.estado || 
                 existingDoc.version_actual !== newDoc.version_actual;
        });
        
        // Actualizar previews para documentos modificados
        updatedOrNewDocs.forEach((doc: ClientDocument) => {
          // Limpiar preview anterior si existe
          setPreviews(prev => {
            const updated = { ...prev };
            delete updated[doc.id_documento];
            return updated;
          });
          
          // Obtener nuevo preview
          fetchDocumentContent(doc.id_documento)
            .then(data => setPreviews(prev => ({
              ...prev,
              [doc.id_documento]: {
                url_documento: data.url_documento,
                url_miniatura: data.url_miniatura,
                mime_type: data.mime_type
              }
            })))
            .catch(() => setPreviews(prev => ({
              ...prev,
              [doc.id_documento]: {
                url_documento: '',
                url_miniatura: '',
                mime_type: ''
              }
            })));
        });
        
        setPendingUploads(false);
        toast.success("¡Documento procesado correctamente!");
        return;
      }
  
      // Si no hay cambios relevantes, continuar polling
      if (pollingCount < maxPollingAttempts) {
        setPollingCount(prev => prev + 1);
        setTimeout(checkProcessingStatus, pollingInterval);
      } else {
        toast.dismiss("processing-document");
        setPendingUploads(false);
        toast.info("El documento se ha subido pero aún está siendo procesado...");
      }
    } catch (err) {
      toast.dismiss("processing-document");
      console.error('Error al verificar estado:', err);
      setPendingUploads(false);
      toast.error("Error al verificar el estado del procesamiento");
    }
  }, [params.id, pollingCount, documentsData]);
  // Callback para éxito de subida
  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    setPendingUploads(true);
    setPollingCount(0);
    toast.info("Documento cargado, procesando...", {
      duration: Infinity,
      id: "processing-document",
      dismissible: true
    });
    setTimeout(checkProcessingStatus, pollingInterval);
  };

  // Función de refresh optimizada
  const handleRefresh = async () => {
    try {
      setLoading(true);
      
      // Obtener datos en paralelo
      const [documentsResponse, foldersResponse, requestsResponse] = await Promise.all([
        clientService.getClientDocuments(params.id as string),
        clientService.getClientFolders(params.id as string),
        clientService.getClientDocumentRequests(params.id as string)
      ]);
      
      setData(requestsResponse);
      setDocumentsData(documentsResponse);
      setFoldersData(foldersResponse);
      
      // Actualizar previews para nuevos documentos
      updateDocumentPreviews(documentsResponse.documentos);
      
      toast.success("Datos actualizados correctamente");
    } catch (err) {
      console.error('Error al actualizar:', err);
      toast.error("Error al actualizar los datos");
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (id: string) => {
    setOpenFolders(prev => ({ ...prev, [id]: !prev[id] }));
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
                  onClick={() => toggleFolder(categoria.id || categoria.nombre)}
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
    const fetchActivity = async () => {
      try {
        const response = await clientService.getClientActivity(params.id as string);
        setActivity(response.activities);
      } catch (err) {
        console.error('Error al cargar la actividad:', err);
      }
    };

    fetchActivity();
  }, [params.id]);

  const handleDocumentClick = (document: ClientDocument) => {
    setSelectedDocument(document);
  };

  const handleUploadNewVersion = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDocId(docId);
    setShowUploadModal(true);
  };

  const handleUploadNewDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDocId(null);
    setShowUploadModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="h-8 w-8 mr-2" />
        {error || 'No se pudieron cargar los documentos'}
      </div>
    );
  }

  const { solicitudes, estadisticas, tendencia_temporal } = data;

  // Preparar datos para el gráfico de estado
  const estadoData = [
    { name: 'Pendientes', value: parseInt(estadisticas.pendientes) },
    { name: 'Recibidos', value: parseInt(estadisticas.recibidos) },
    { name: 'Vencidos', value: parseInt(estadisticas.vencidos) },
    { name: 'Cancelados', value: parseInt(estadisticas.cancelados) },
  ];

  // Si hay un documento seleccionado, mostrar su detalle
  if (selectedDocument) {
    return (
      <DocumentDetail
        document={selectedDocument}
        onBack={() => setSelectedDocument(null)}
        onUploadNewVersion={(docId) => {
          setSelectedDocId(docId);
          setShowUploadModal(true);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Indicador de carga durante procesamiento */}
      {pendingUploads && (
        <div className="fixed top-0 right-0 m-4 p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg shadow-md flex items-center z-50">
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          <span>Procesando documento... Por favor espera</span>
        </div>
      )}

      <DocumentList
        data={data}
        documentsData={documentsData}
        documentsLoading={documentsLoading}
        documentsError={documentsError}
        previews={previews}
        onDocumentClick={handleDocumentClick}
        onUploadNewDocument={handleUploadNewDocument}
        onUploadNewVersion={handleUploadNewVersion}
        onPreviewClick={(url, title) => setPreviewDoc({ url, title })}
        foldersData={foldersData}
        foldersLoading={foldersLoading}
        foldersError={foldersError}
        openFolders={openFolders}
        onToggleFolder={toggleFolder}
        onRefresh={handleRefresh}
      />

      {showUploadModal && (
        <Modal onClose={() => setShowUploadModal(false)}>
          <DocumentUpload
            idCliente={params.id as string}
            idDocumento={selectedDocId || undefined}
            onUploaded={handleUploadSuccess}
            isNewVersion={!!selectedDocId}
          />
        </Modal>
      )}

      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setPreviewDoc(null)}>
          <img src={previewDoc.url} alt={previewDoc.title} className="max-w-3xl max-h-[80vh] rounded shadow-lg" />
        </div>
      )}
    </div>
  );
}
