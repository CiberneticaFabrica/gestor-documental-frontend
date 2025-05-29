import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, Clock, User, FileText, Shield, Calendar, MapPin, Eye, Download, History, Info, X } from 'lucide-react';
import { toast } from 'sonner';
import { fetchDocumentStatus, fetchDocumentContent } from '@/services/common/documentService';

interface DocumentContratoClienteProps {
  documentData: any;
  onBack: () => void;
  onRefresh?: () => void;
}

export function DocumentContratoCliente({ documentData: initialDocumentData, onBack, onRefresh }: DocumentContratoClienteProps) {
  const [showFullText, setShowFullText] = useState(false);
  const [documentData, setDocumentData] = useState(initialDocumentData);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const { documento, tipo_documento, version_actual, cliente, documento_especializado, analisis_ia, historial_procesamiento, validacion } = documentData;

  const handleApprove = async () => {
    try {
      const response = await fetchDocumentStatus(documento.id, 'publicado');
      setDocumentData((prev: typeof initialDocumentData) => ({
        ...prev,
        documento: {
          ...prev.documento,
          estado: 'publicado'
        }
      }));
      toast.success("Documento aprobado", {
        description: `Actualización completada`,
      });
    } catch (error) {
      console.error('Error al aprobar el documento:', error);
      toast.error("Error al aprobar", {
        description: "No se pudo aprobar el documento. Por favor, intente nuevamente.",
      });
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetchDocumentStatus(documento.id, 'rechazado');
      setDocumentData((prev: typeof initialDocumentData) => ({
        ...prev,
        documento: {
          ...prev.documento,
          estado: 'rechazado'
        }
      }));
      toast.error("Documento rechazado", {
        description: `Actualización completada`,
      });
    } catch (error) {
      console.error('Error al rechazar el documento:', error);
      toast.error("Error al rechazar", {
        description: "No se pudo rechazar el documento. Por favor, intente nuevamente.",
      });
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'publicado': return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rechazado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (riesgo: string) => {
    switch (riesgo?.toLowerCase()) {
      case 'bajo': return 'text-green-600 bg-green-50';
      case 'medio': return 'text-yellow-600 bg-yellow-50';
      case 'alto': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handlePreviewClick = async () => {
    if (showPreview) {
      setShowPreview(false);
      return;
    }

    setShowPreview(true);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDocumentContent(documentData.documento.id);
      setPreviewData(data);
    } catch (err) {
      console.error('Error fetching preview:', err);
      setError('Error al cargar la previsualización');
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-500">
          <span className="mb-2">{error}</span>
          <span className="text-sm text-gray-500">Por favor, intente más tarde o contacte al administrador</span>
        </div>
      );
    }

    if (!previewData) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <span className="mb-2">No se puede previsualizar este documento</span>
          <span className="text-sm">El documento no está disponible en este momento</span>
        </div>
      );
    }

    if (previewData.mime_type.startsWith('image/')) {
      return (
        <div className="h-full flex items-center justify-center">
          <img
            src={previewData.url_documento}
            alt={previewData.nombre_archivo}
            className="max-w-full max-h-full object-contain cursor-zoom-in"
            onClick={() => setIsImageZoomed(true)}
            onError={(e) => {
              console.error('Error loading image:', e);
              setError('Error al cargar la imagen');
            }}
          />
        </div>
      );
    }

    if (previewData && previewData.mime_type === 'application/pdf' && previewData.url_documento) {
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(previewData.url_documento)}&embedded=true`}
          style={{ width: '100%', height: '100%' }}
          frameBorder="0"
          title="Vista previa PDF"
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <span className="mb-2">Formato no soportado para previsualización</span>
        <a
          href={previewData.url_documento}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
          download={previewData.nombre_archivo}
        >
          Descargar archivo
        </a>
      </div>
    );
  };

  const handleBack = () => {
    if (onRefresh) {
      onRefresh();
    }
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Panel lateral derecho fijo para la imagen */}
      {showPreview && (
        <>
          <div className="fixed right-0 top-0 h-full w-[700px] bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 z-40">
            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all"
                title="Cerrar vista previa"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="h-full overflow-y-auto p-6">
              {renderPreview()}
            </div>
            <div className="absolute bottom-4 right-4 z-10">
              <button
                onClick={() => window.open(`https://docs.google.com/gview?url=${encodeURIComponent(previewData.url_documento)}&embedded=true`, '_blank')}
                className="p-2 ml-2 text-blue-600 hover:text-blue-800 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all"
                title="Ver en pantalla completa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2" />
                </svg>
              </button>
            </div>
          </div>
          {isImageZoomed && previewData && previewData.mime_type.startsWith('image/') && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
              onClick={() => setIsImageZoomed(false)}
            >
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setIsImageZoomed(false)}
                  className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow hover:bg-opacity-100 transition"
                  title="Cerrar imagen ampliada"
                >
                  <X className="h-6 w-6 text-gray-700" />
                </button>
                <img
                  src={previewData.url_documento}
                  alt={previewData.nombre_archivo}
                  className="max-w-3xl max-h-[80vh] rounded shadow-lg"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Contenido principal con margen derecho cuando el preview está activo */}
      <div className={`${showPreview ? 'mr-[700px]' : ''} transition-all duration-300`}>
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                  Volver
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revisión de Contrato</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Documento de Contrato • {tipo_documento?.nombre || 'Sin tipo'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {(documento.estado === 'pendiente_revision' || documento.estado === 'rechazado') && (
                  <button onClick={handleApprove} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Aprobar Contrato
                  </button>
                )}
                {(documento.estado === 'pendiente_revision' || documento.estado === 'publicado') && (
                  <button onClick={handleReject} className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                    Rechazar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Información del contrato */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Información del Contrato</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Código: {documento?.codigo || 'Sin código'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(documento?.estado)}`}>
                      {documento?.estado?.toUpperCase() || 'SIN ESTADO'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detalles del Contrato</h4>
                        {analisis_ia?.entidades_detectadas ? (
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Número de contrato:</span>
                              <p className="font-mono font-medium text-gray-900 dark:text-white">
                                {analisis_ia.entidades_detectadas.numero_contrato?.answer || 'No disponible'}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Monto del préstamo:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {analisis_ia.entidades_detectadas.monto_prestamo?.answer || 'No disponible'}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Tasa de interés:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {analisis_ia.entidades_detectadas.tasa_interes?.answer || 'No disponible'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            No hay información detallada del contrato disponible.
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Fechas Importantes</h4>
                        {analisis_ia?.entidades_detectadas ? (
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Fecha del contrato:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {analisis_ia.entidades_detectadas.fecha_contrato?.answer || 'No disponible'}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Plazo del préstamo:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {analisis_ia.entidades_detectadas.plazo_meses?.answer || 'No disponible'} meses
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Cuota mensual:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {analisis_ia.entidades_detectadas.cuota_mensual?.answer || 'No disponible'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            No hay fechas importantes registradas para este contrato.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Análisis de IA */}
              {analisis_ia && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Análisis por IA</h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Procesamiento automático</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          parseFloat(validacion?.confianza_extraccion || '0') < 0.5 
                            ? 'text-red-600 dark:text-red-400'
                            : parseFloat(validacion?.confianza_extraccion || '0') < 0.75
                              ? 'text-yellow-600 dark:text-yellow-400' 
                              : 'text-purple-600 dark:text-purple-400'
                        }`}>
                          {(parseFloat(validacion?.confianza_extraccion || '0') * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Confianza</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Texto Extraído</h4>
                      {analisis_ia?.texto_extraido_preview && (
                        <button onClick={() => setShowFullText(!showFullText)} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          {showFullText ? 'Ocultar' : 'Ver completo'}
                        </button>
                      )}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      {analisis_ia?.texto_extraido_preview ? (
                        <p className="text-sm font-mono text-gray-700 dark:text-gray-300 leading-relaxed">
                          {showFullText 
                            ? analisis_ia.texto_extraido_full 
                            : analisis_ia.texto_extraido_preview
                          }
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No hay texto extraído disponible para este documento.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Panel lateral */}
            <div className="space-y-6">
              {/* Acciones rápidas */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <button 
                    onClick={handlePreviewClick}
                    className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      showPreview 
                        ? 'text-red-700 bg-red-50 border border-red-200 hover:bg-red-100' 
                        : 'text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100'
                    }`}
                    title={showPreview ? "Ocultar imagen del documento" : "Ver imagen del documento"}
                  >
                    <Eye className="h-4 w-4" />
                    {showPreview ? 'Ocultar Imagen' : 'Ver Imagen Original'}
                  </button>
                  {/* <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                    Descargar Contrato
                  </button>
                  <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                    Generar Reporte
                  </button>*/}
                </div>
              </div>

              {/* Información del cliente */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cliente</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Nombre:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{cliente?.nombre || 'No disponible'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Código:</span>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">{cliente?.codigo || 'No disponible'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Nivel de riesgo:</span>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ml-2 ${getRiskColor(cliente?.nivel_riesgo)}`}>
                      {cliente?.nivel_riesgo?.toUpperCase() || 'NO DISPONIBLE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nota importante */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">Nota Importante</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Revise cuidadosamente todos los términos y condiciones del contrato antes de aprobar. Una vez aprobado, este documento será vinculante para ambas partes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 