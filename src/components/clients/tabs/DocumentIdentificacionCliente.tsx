import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, Clock, User, FileText, Shield, Calendar, MapPin, Eye, Download, History, Info, Edit2, Save, X } from 'lucide-react';
import { fetchDocumentContent, fetchDocumentDownload, fetchDocumentData, fetchDocumentStatus } from '@/services/common/documentService';
import { toast } from 'sonner';

interface DocumentIdentificacionClienteProps {
  documentData: any;
  onBack: () => void;
  onRefresh?: () => void;
}

export function DocumentIdentificacionCliente({ documentData: initialDocumentData, onBack, onRefresh }: DocumentIdentificacionClienteProps) {
  
  const [showFullText, setShowFullText] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState(initialDocumentData);
  const [editedData, setEditedData] = useState({
    nombre_completo: '',
    numero_documento: '',
    genero: '',
    fecha_emision: '',
    fecha_expiracion: '',
    pais_emision: ''
  });
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  console.log('Document Data:', documentData);

  const { documento, tipo_documento, version_actual, cliente, documento_especializado, analisis_ia, historial_procesamiento, validacion } = documentData;

  // Inicializar los datos editables cuando cambia documentData
  useEffect(() => {
    if (documentData?.documento_especializado?.documento_identificacion) {
      const doc = documentData.documento_especializado.documento_identificacion;
      setEditedData({
        nombre_completo: doc.nombre_completo || '',
        numero_documento: doc.numero_documento || '',
        genero: doc.genero || '',
        fecha_emision: doc.fecha_emision || '',
        fecha_expiracion: doc.fecha_expiracion || '',
        pais_emision: doc.pais_emision || ''
      });
    }
  }, [documentData]);

  const handleApprove = async () => {
    try {
      const response = await fetchDocumentStatus(documentData.documento.id, 'publicado');
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
      const response = await fetchDocumentStatus(documentData.documento.id, 'rechazado');
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurar los datos originales
    if (documentData?.documento_especializado?.documento_identificacion) {
      const doc = documentData.documento_especializado.documento_identificacion;
      setEditedData({
        nombre_completo: doc.nombre_completo || '',
        numero_documento: doc.numero_documento || '',
        genero: doc.genero || '',
        fecha_emision: doc.fecha_emision || '',
        fecha_expiracion: doc.fecha_expiracion || '',
        pais_emision: doc.pais_emision || ''
      });
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        nombre_completo: editedData.nombre_completo,
        numero_documento: editedData.numero_documento,
        fecha_emision: editedData.fecha_emision,
        fecha_expiracion: editedData.fecha_expiracion,
        lugar_nacimiento: documentData.documento_especializado.documento_identificacion.lugar_nacimiento || '',
        genero: editedData.genero,
        pais_emision: editedData.pais_emision,
        tipo_documento: documentData.tipo_documento.nombre,
        autoridad_emision: documentData.documento_especializado.documento_identificacion.autoridad_emision || '',
        nacionalidad: documentData.documento_especializado.documento_identificacion.nacionalidad || '',
        codigo_pais: documentData.documento_especializado.documento_identificacion.codigo_pais || 'PAN'
      };

      await fetchDocumentData(documentData.documento.id, updatedData);
      
      // Actualizar los datos locales con los nuevos valores
      setDocumentData((prev: typeof initialDocumentData) => ({
        ...prev,
        documento_especializado: {
          ...prev.documento_especializado,
          documento_identificacion: {
            ...prev.documento_especializado.documento_identificacion,
            nombre_completo: editedData.nombre_completo,
            numero_documento: editedData.numero_documento,
            genero: editedData.genero,
            fecha_emision: editedData.fecha_emision,
            fecha_expiracion: editedData.fecha_expiracion,
            pais_emision: editedData.pais_emision
          }
        }
      }));
  
      setIsEditing(false);
      toast.success("Cambios guardados", {
        description: "Los datos del documento han sido actualizados correctamente.",
      });
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      toast.error("Error al guardar", {
        description: "No se pudieron guardar los cambios. Por favor, intente nuevamente.",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'publicado': return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rechazado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (riesgo: string) => {
    switch (riesgo.toLowerCase()) {
      case 'bajo': return 'text-green-600 bg-green-50';
      case 'medio': return 'text-yellow-600 bg-yellow-50';
      case 'alto': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const isExpired = new Date(documento_especializado.documento_identificacion.fecha_expiracion) < new Date();

  const handlePreviewClick = async () => {
    if (showPreview) {
      setShowPreview(false);
      return;
    }

    setShowPreview(true);
    setLoading(true);
    setError(null);
    try {
      console.log('Document Data:', documentData);
      const data = await fetchDocumentContent(documentData.documento.id);
      setPreviewData(data);
    } catch (err) {
      console.error('Error fetching preview:', err);
      setError('Error al cargar la previsualización');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await fetchDocumentDownload(documentData.documento.id);
      
      // Crear una URL para el blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear un elemento <a> temporal
      const a = document.createElement('a');
      a.href = url;
      a.download = documentData.documento.titulo || 'documento';
      document.body.appendChild(a);
      
      // Simular clic para iniciar la descarga
      a.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar el documento:', error);
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
          <div className="fixed right-0 top-0 h-full w-[400px] bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 z-40">
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
      <div className={`${showPreview ? 'mr-[400px]' : ''} transition-all duration-300`}>
        {/* Header con acciones principales */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Volver
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revisión de Documento</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Documento de Identificación • {tipo_documento.nombre}</p>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex items-center gap-3">
                {(documento.estado === 'pendiente_revision' || documento.estado === 'rechazado') && (
                  <>
              
                    <button
                      onClick={handleApprove}
                      className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Aprobar Documento
                    </button>
                  </>
                )}
                { (documento.estado === 'pendiente_revision' || documento.estado === 'publicado') && (
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Rechazar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal - Información detallada */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Resumen del documento */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Información del Documento</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Código: {documento.codigo}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(documento.estado)}`}>
                      {documento.estado.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Fecha de creación:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(documento.fechas.creacion).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Versión actual:</span>
                        <span className="font-medium text-gray-900 dark:text-white">v{version_actual.numero}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Download className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Tamaño:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {(version_actual.tamano_bytes / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Formato:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{version_actual.extension.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Ubicación:</span>
                        <span className="text-gray-900 dark:text-white">{documentData.ubicacion.nombre_carpeta}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del titular */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Información del Titular</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Datos extraídos del documento</p>
                      </div>
                    </div>
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                        Editar
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <Save className="h-4 w-4" />
                          Guardar
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Datos Personales</h4>
                        <div className="space-y-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Nombre completo:</span>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedData.nombre_completo}
                                onChange={(e) => handleInputChange('nombre_completo', e.target.value)}
                                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                title="Nombre completo"
                                placeholder="Ingrese el nombre completo"
                                aria-label="Nombre completo"
                              />
                            ) : (
                              <p className="font-semibold text-gray-900 dark:text-white text-lg">
                                {documento_especializado.documento_identificacion.nombre_completo}
                              </p>
                            )}
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Número de documento:</span>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedData.numero_documento}
                                onChange={(e) => handleInputChange('numero_documento', e.target.value)}
                                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                                title="Número de documento"
                                placeholder="Ingrese el número de documento"
                                aria-label="Número de documento"
                              />
                            ) : (
                              <p className="font-mono font-medium text-gray-900 dark:text-white">
                                {documento_especializado.documento_identificacion.numero_documento}
                              </p>
                            )}
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Género:</span>
                            {isEditing ? (
                              <select
                                value={editedData.genero}
                                onChange={(e) => handleInputChange('genero', e.target.value)}
                                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                title="Género"
                                aria-label="Seleccione el género"
                              >
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                              </select>
                            ) : (
                              <p className="font-medium text-gray-900 dark:text-white">
                                {documento_especializado.documento_identificacion.genero === 'F' ? 'Femenino' : 'Masculino'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Vigencia del Documento</h4>
                        <div className="space-y-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Fecha de emisión:</span>
                            {isEditing ? (
                              <input
                                type="date"
                                value={editedData.fecha_emision}
                                onChange={(e) => handleInputChange('fecha_emision', e.target.value)}
                                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                title="Fecha de emisión"
                                aria-label="Fecha de emisión"
                              />
                            ) : (
                              <p className="font-medium text-gray-900 dark:text-white">
                                {new Date(documento_especializado.documento_identificacion.fecha_emision).toLocaleDateString('es-ES')}
                              </p>
                            )}
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Fecha de expiración:</span>
                            {isEditing ? (
                              <input
                                type="date"
                                value={editedData.fecha_expiracion}
                                onChange={(e) => handleInputChange('fecha_expiracion', e.target.value)}
                                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                title="Fecha de expiración"
                                aria-label="Fecha de expiración"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <p className={`font-medium ${isExpired ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                                  {new Date(documento_especializado.documento_identificacion.fecha_expiracion).toLocaleDateString('es-ES')}
                                </p>
                                {isExpired && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                    <AlertTriangle className="h-3 w-3" />
                                    Vencido
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">País de emisión:</span>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedData.pais_emision}
                                onChange={(e) => handleInputChange('pais_emision', e.target.value)}
                                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                title="País de emisión"
                                placeholder="Ingrese el país de emisión"
                                aria-label="País de emisión"
                              />
                            ) : (
                              <p className="font-medium text-gray-900 dark:text-white">
                                {documento_especializado.documento_identificacion.pais_emision}
                              </p>
                            )}
                          </div>
                        </div>
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
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Análisis por Inteligencia Artificial</h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Procesamiento automático del documento</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          parseFloat(validacion.confianza_extraccion) < 0.5 
                            ? 'text-red-600 dark:text-red-400'
                            : parseFloat(validacion.confianza_extraccion) < 0.75
                              ? 'text-yellow-600 dark:text-yellow-400' 
                              : 'text-purple-600 dark:text-purple-400'
                        }`}>
                          {(parseFloat(validacion.confianza_extraccion) * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Confianza</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {analisis_ia.estado_analisis}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Estado</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {analisis_ia.metadatos_extraccion.text_blocks_count}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Bloques de texto</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {analisis_ia.metadatos_extraccion.forms_count}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Formularios</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">Texto Extraído</h4>
                        <button
                          onClick={() => setShowFullText(!showFullText)}
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          {showFullText ? 'Ocultar' : 'Ver completo'}
                        </button>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-gray-700 dark:text-gray-300 leading-relaxed">
                          {showFullText 
                            ? analisis_ia.texto_extraido 
                            : `${analisis_ia.texto_extraido.substring(0, 150)}...`
                          }
                        </p>
                      </div>
                    </div>

                    {analisis_ia.entidades_detectadas && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Entidades Detectadas</h4>
                        <div className="space-y-2">
                          {analisis_ia.entidades_detectadas.phone && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">ID:</span>
                              <div className="flex gap-2">
                                {analisis_ia.entidades_detectadas.phone.map((phone: string, index: number) => (
                                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {phone}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Panel lateral derecho */}
            <div className="space-y-6">
              {/* Panel de acciones rápidas */}
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
                  {/*<button 
                    onClick={handleDownload}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Descargar Documento
                  </button>
                  {/*<button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
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
                    <p className="font-medium text-gray-900 dark:text-white">{cliente.nombre}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Código:</span>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">{cliente.codigo}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Segmento:</span>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{cliente.segmento_bancario}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Nivel de riesgo:</span>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ml-2 ${getRiskColor(cliente.nivel_riesgo)}`}>
                      {cliente.nivel_riesgo.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Estado documental:</span>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{cliente.estado_documental}</p>
                  </div>
                </div>
              </div>

              {/* Historial de procesamiento */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <History className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Historial</h3>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {historial_procesamiento.slice(0, 5).map((proceso: any, index: number) => (
                    <div key={proceso.id_registro} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${proceso.estado_proceso === 'completado' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {proceso.servicio_procesador}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(proceso.timestamp_fin).toLocaleTimeString('es-ES')} • {proceso.duracion_ms}ms
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">Nota Importante</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Revise cuidadosamente todos los datos antes de aprobar. Una vez aprobado, este documento será válido para procesos bancarios.
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