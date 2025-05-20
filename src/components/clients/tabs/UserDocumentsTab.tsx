import { useEffect, useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, FileText, Users, Clock, CheckCircle2, Loader2, UploadCloud, AlertCircle, Upload, Folder, ChevronDown, ChevronRight } from 'lucide-react';
import { clientService, type DocumentRequestsResponse, type ClientFoldersResponse } from '@/lib/api/services/client.service';
import { useParams } from 'next/navigation';
import { DocumentUpload } from '@/components/documents/upload/DocumentUploadPage';
import { Modal } from '@/components/ui/modal';
import { documentService } from '@/lib/api/services/document.service';
import { toast } from 'sonner';

const COLORS = ['#3B82F6', '#10B981', '#F59E42', '#EF4444'];

export function UserDocumentsTab() {
  const params = useParams();
  const [data, setData] = useState<DocumentRequestsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Polling function
  const checkProcessingStatus = useCallback(async () => {
    try {
      const response = await clientService.getClientDocumentRequests(params.id as string);
      const hasChanges = JSON.stringify(response?.solicitudes) !== JSON.stringify(data?.solicitudes);
      if (hasChanges) {
        setData(response);
        // Actualizar también la estructura documental
        const foldersResponse = await clientService.getClientFolders(params.id as string);
        setFoldersData(foldersResponse);
        setPendingUploads(false);
        toast.success("¡Documento procesado correctamente!", { id: "processing-document" });
        toast.dismiss("processing-document");
        return;
      }
      if (pollingCount < maxPollingAttempts) {
        setPollingCount(prev => prev + 1);
        setTimeout(checkProcessingStatus, pollingInterval);
      } else {
        setPendingUploads(false);
        toast.info("El documento se ha subido pero aún está siendo procesado. Los cambios aparecerán pronto.", { id: "processing-document" });
        toast.dismiss("processing-document");
      }
    } catch (err) {
      console.error('Error al verificar estado:', err);
      setPendingUploads(false);
      toast.error("Error al verificar el estado del procesamiento", { id: "processing-document" });
      toast.dismiss("processing-document");
    }
  }, [data?.solicitudes, params.id, pollingCount]);

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

  return (
    <div className="space-y-8">
      {/* Indicador de carga durante procesamiento */}
      {pendingUploads && (
        <div className="fixed top-0 right-0 m-4 p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg shadow-md flex items-center z-50">
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          <span>Procesando documento... Por favor espera</span>
        </div>
      )}


 

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

      <div className="flex justify-end">
        <button
          onClick={handleUploadNewDocument}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Subir nuevo documento
        </button>
      </div>
 
      {/* Gráfico de estado */}
      <div className="flex gap-8">
                {/* Columna de gráfico (20%) */}
          <div className="w-[30%]">
                      {/* Bloque de estructura documental */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-blue-500" />
                  Estructura Documental
                </div>
                {renderFolderTree()}
              </div>
        </div>
        {/* Columna de tablas (80%) */}
        <div className="w-[70%] space-y-8">
          {/* Tabla unificada de documentos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Lista de Documentos
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 font-medium text-left">Estado</th>
                    <th className="py-3 font-medium text-left">Documento</th>
                    <th className="py-3 font-medium text-left">Fecha Solicitud</th>
                    <th className="py-3 font-medium text-left">Fecha Límite</th>
                    <th className="py-3 font-medium text-left">Días Restantes</th>
                    <th className="py-3 font-medium text-left">Notas</th>
                    <th className="py-3 font-medium text-left">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {solicitudes.map((doc) => (
                    <tr key={doc.id_solicitud} className="text-gray-700 dark:text-gray-300">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {doc.estado === 'recibido' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <Loader2 className="h-5 w-5 text-yellow-500" />
                          )}
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            doc.estado === 'recibido'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300'
                          }`}>
                            {doc.estado === 'recibido' ? 'Recibido' : 'Pendiente'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 font-medium">{doc.tipo_documento_nombre}</td>
                      <td className="py-3">{new Date(doc.fecha_solicitud).toLocaleDateString()}</td>
                      <td className="py-3">{new Date(doc.fecha_limite).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          doc.dias_restantes <= 7 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300'
                            : doc.dias_restantes <= 30
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300'
                        }`}>
                          {doc.dias_restantes} días
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{doc.notas}</td>
                      <td className="py-3">
                        <button 
                          onClick={(e) => handleUploadNewVersion(doc.id_documento_recibido || '', e)}
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
          </div>
        </div>


      </div>

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
    </div>
  );
} 