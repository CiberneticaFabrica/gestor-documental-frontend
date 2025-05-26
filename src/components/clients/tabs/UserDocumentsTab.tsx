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

  useEffect(() => {
    if (!documentsData) return;
    documentsData.documentos.forEach(doc => {
      if (!previews[doc.id_documento]) {
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
      }
    });
  }, [documentsData]);

  // Polling function
  const checkProcessingStatus = useCallback(async () => {
    try {
      const [requestsResponse, documentsResponse] = await Promise.all([
        clientService.getClientDocumentRequests(params.id as string),
        clientService.getClientDocuments(params.id as string)
      ]);
      
      const hasRequestChanges = requestsResponse?.solicitudes.some(solicitud => 
        solicitud.estado === 'recibido' && solicitud.id_documento_recibido !== null
      );

      const hasDocumentChanges = documentsResponse?.documentos.some((doc: ClientDocument) => 
        doc.estado === 'publicado' || doc.estado === 'pendiente_revision' 
      );

      if (hasRequestChanges || hasDocumentChanges) {
        toast.dismiss("processing-document");
        setData(requestsResponse);
        const foldersResponse = await clientService.getClientFolders(params.id as string);
        setFoldersData(foldersResponse);
        setDocumentsData(documentsResponse);
        setPendingUploads(false);
        toast.success("¡Documento procesado correctamente!");
        return;
      }

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
  }, [params.id, pollingCount]);

  // Callback para éxito de subida
  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    setPendingUploads(true);
    setPollingCount(0);
    toast.info("Documento subido, procesando...", {
      duration: Infinity,
      id: "processing-document",
      dismissible: true
    });
    setTimeout(checkProcessingStatus, pollingInterval);
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

  const handleRefresh = async () => {
    try {
      setLoading(true);
      // Actualizar todos los datos
      const [requestsResponse, foldersResponse, documentsResponse] = await Promise.all([
        clientService.getClientDocumentRequests(params.id as string),
        clientService.getClientFolders(params.id as string),
        clientService.getClientDocuments(params.id as string)
      ]);
      
      setData(requestsResponse);
      setFoldersData(foldersResponse);
      setDocumentsData(documentsResponse);
      
      toast.success("Datos actualizados correctamente");
    } catch (err) {
      console.error('Error al actualizar:', err);
      toast.error("Error al actualizar los datos");
    } finally {
      setLoading(false);
    }
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