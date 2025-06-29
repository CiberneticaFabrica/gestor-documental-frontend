'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ArrowLeft,
  Eye,
  Download,
  Shield,
  Brain,
  Clock,
  Building,
  AlertTriangle,
  Info,
  Activity,
  Database,
  Zap,
  X
} from 'lucide-react';
import { workflowService, DocumentReview } from '@/lib/api/services/workflow.service';
import { fetchDocumentContent, fetchDocumentDownload } from '@/services/common/documentService';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function DocumentReviewPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  
  const [documentData, setDocumentData] = useState<DocumentReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectionComment, setRejectionComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const fetchDocumentReview = async () => {
    try {
      setLoading(true);
      const data = await workflowService.getDocumentReview(documentId);
      setDocumentData(data);
    } catch (error) {
      toast.error('Error al cargar detalles del documento');
      console.error('Error fetching document review:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchDocumentReview();
    }
  }, [documentId]);

  const handleApprove = async () => {
    if (!approvalComment.trim()) {
      toast.error('Debes agregar un comentario para aprobar');
      return;
    }

    try {
      setApproving(true);
      await workflowService.approveDocument(documentId, {
        comentario: approvalComment
      });
      toast.success('Documento aprobado exitosamente');
      router.push('/kyc/pending-documents');
    } catch (error) {
      toast.error('Error al aprobar documento');
      console.error('Error approving document:', error);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionComment.trim()) {
      toast.error('Debes agregar un comentario para rechazar');
      return;
    }
    if (!rejectionReason) {
      toast.error('Debes seleccionar un motivo de rechazo');
      return;
    }

    try {
      setRejecting(true);
      await workflowService.rejectDocument(documentId, {
        comentario: rejectionComment,
        motivo_rechazo: rejectionReason
      });
      toast.success('Documento rechazado exitosamente');
      router.push('/kyc/pending-documents');
    } catch (error) {
      toast.error('Error al rechazar documento');
      console.error('Error rejecting document:', error);
    } finally {
      setRejecting(false);
    }
  };

  const handlePreviewClick = async () => {
    if (showPreview) {
      setShowPreview(false);
      return;
    }

    setShowPreview(true);
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const data = await fetchDocumentContent(documentId);
      setPreviewData(data);
    } catch (err) {
      console.error('Error fetching preview:', err);
      setPreviewError('Error al cargar la previsualización');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await fetchDocumentDownload(documentId);
      
      // Crear una URL para el blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear un elemento <a> temporal
      const a = document.createElement('a');
      a.href = url;
      a.download = documentData?.documento.titulo || 'documento';
      document.body.appendChild(a);
      
      // Simular clic para iniciar la descarga
      a.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar el documento:', error);
      toast.error('Error al descargar el documento');
    }
  };

  const renderPreview = () => {
    if (previewLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (previewError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-500">
          <span className="mb-2">{previewError}</span>
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
              setPreviewError('Error al cargar la imagen');
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

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad.toLowerCase()) {
      case 'alta': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'media': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'baja': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const getRiskColor = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case 'alto': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'medio': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'bajo': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'aprobado': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'rechazado': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'en_revision': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ConfidenceBar = ({ value, label }: { value: number, label: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            value >= 0.8 ? 'bg-green-500' : 
            value >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando documento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center py-16">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Documento no encontrado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">El documento que buscas no existe o ha sido eliminado</p>
          <Button asChild variant="outline">
            <Link href="/kyc/pending-documents">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Documentos Pendientes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { documento, datos_especializados, analisis_ia } = documentData;

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
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/kyc/pending-documents">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                  </Link>
                </Button>
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Revisión de Documento
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {documento.codigo_documento} • {documento.tipo_documento}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getStatusColor(documento.estado_documento)}>
                  {documento.estado_documento.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge className={getPriorityColor(documento.prioridad)}>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {documento.prioridad.toUpperCase()}
                </Badge>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePreviewClick}
                    className={showPreview ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : ''}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? 'Ocultar' : 'Ver Original'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Document Overview */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Información General del Documento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Título del Documento
                        </label>
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {documento.titulo}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Código de Documento
                        </label>
                        <p className="text-base font-mono text-gray-900 dark:text-gray-100">
                          {documento.codigo_documento}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tipo de Documento
                        </label>
                        <Badge variant="outline" className="text-sm">
                          {documento.tipo_documento}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fecha de Inicio
                        </label>
                        <p className="text-base text-gray-900 dark:text-gray-100">
                          {formatDate(documento.fecha_inicio)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Prioridad
                        </label>
                        <Badge className={getPriorityColor(documento.prioridad)}>
                          {documento.prioridad.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confianza de Extracción
                        </label>
                        <ConfidenceBar 
                          value={parseFloat(documento.confianza_extraccion)} 
                          label="Precisión IA"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descripción
                    </label>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      {documento.descripcion}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* AI Analysis */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Brain className="h-5 w-5 mr-2 text-purple-600" />
                    Análisis de Inteligencia Artificial
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipo Detectado
                      </label>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {analisis_ia.tipo_documento}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confianza de Clasificación
                      </label>
                      <ConfidenceBar 
                        value={parseFloat(analisis_ia.confianza_clasificacion)} 
                        label="Clasificación"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Entidades Detectadas
                    </label>
                    <div className="grid gap-3">
                      {Object.entries(analisis_ia.entidades_detectadas).map(([key, entity]) => (
                        <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                          <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                            {key.replace('_', ' ')}
                          </span>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {entity.answer}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {entity.confidence}% confianza
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Texto Extraído
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border max-h-48 overflow-y-auto">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {analisis_ia.texto_extraido}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Extracted Data */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Database className="h-5 w-5 mr-2 text-emerald-600" />
                    Datos Extraídos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nombre Completo
                        </label>
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {documento.datos_extraidos_ia.nombre_completo}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Número de Identificación
                        </label>
                        <p className="text-base font-mono text-gray-900 dark:text-gray-100">
                          {documento.datos_extraidos_ia.numero_identificacion}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fecha de Nacimiento
                        </label>
                        <p className="text-base text-gray-900 dark:text-gray-100">
                          {documento.datos_extraidos_ia.fecha_nacimiento}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Lugar de Nacimiento
                        </label>
                        <p className="text-base text-gray-900 dark:text-gray-100">
                          {documento.datos_extraidos_ia.lugar_nacimiento}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fecha de Emisión
                        </label>
                        <p className="text-base text-gray-900 dark:text-gray-100">
                          {documento.datos_extraidos_ia.fecha_emision}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fecha de Expiración
                        </label>
                        <p className="text-base text-gray-900 dark:text-gray-100">
                          {documento.datos_extraidos_ia.fecha_expiracion}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          País de Emisión
                        </label>
                        <p className="text-base text-gray-900 dark:text-gray-100">
                          {documento.datos_extraidos_ia.pais_emision}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Client Information */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <User className="h-5 w-5 mr-2 text-indigo-600" />
                    Información del Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre/Razón Social
                    </label>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {documento.nombre_razon_social}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Código de Cliente
                    </label>
                    <p className="text-base font-mono text-gray-900 dark:text-gray-100">
                      {documento.codigo_cliente}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tipo de Cliente
                    </label>
                    <Badge variant="outline">
                      {documento.tipo_cliente}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nivel de Riesgo
                    </label>
                    <Badge className={getRiskColor(documento.nivel_riesgo)}>
                      {documento.nivel_riesgo.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Segmento Bancario
                    </label>
                    <p className="text-base text-gray-900 dark:text-gray-100">
                      {documento.segmento_bancario}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/kyc/clients-review/${documento.id_cliente}`}>
                      <User className="h-4 w-4 mr-2" />
                      Ver Perfil Completo
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="h-5 w-5 mr-2 text-gray-600" />
                    Acciones de Revisión
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Approve Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobar Documento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Aprobar Documento</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Comentario de Aprobación
                          </label>
                          <Textarea
                            placeholder="Agrega un comentario sobre la aprobación..."
                            value={approvalComment}
                            onChange={(e) => setApprovalComment(e.target.value)}
                            rows={4}
                            className="resize-none"
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <Button 
                            onClick={handleApprove} 
                            disabled={approving || !approvalComment.trim()}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {approving ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Aprobando...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirmar Aprobación
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Reject Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar Documento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Rechazar Documento</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Motivo de Rechazo
                          </label>
                          <Select value={rejectionReason} onValueChange={setRejectionReason}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un motivo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="calidad_insuficiente">Calidad Insuficiente</SelectItem>
                              <SelectItem value="documento_incompleto">Documento Incompleto</SelectItem>
                              <SelectItem value="informacion_inconsistente">Información Inconsistente</SelectItem>
                              <SelectItem value="documento_expirado">Documento Expirado</SelectItem>
                              <SelectItem value="tipo_documento_incorrecto">Tipo de Documento Incorrecto</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Comentario de Rechazo
                          </label>
                          <Textarea
                            placeholder="Explica el motivo del rechazo..."
                            value={rejectionComment}
                            onChange={(e) => setRejectionComment(e.target.value)}
                            rows={4}
                            className="resize-none"
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <Button 
                            onClick={handleReject} 
                            disabled={rejecting || !rejectionComment.trim() || !rejectionReason}
                            variant="destructive"
                          >
                            {rejecting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Rechazando...
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Confirmar Rechazo
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Document Timeline */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="h-5 w-5 mr-2 text-orange-600" />
                    Cronología del Documento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Documento Recibido
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(documento.fecha_inicio)}
                        </p>
                      </div>
                    </div>
                    
                    {documento.fecha_validacion && (
                      <>
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Validación Manual
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatDate(documento.fecha_validacion)}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          En Revisión
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Estado actual
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                    Métricas Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tiempo en revisión</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {Math.ceil((new Date().getTime() - new Date(documento.fecha_inicio).getTime()) / (1000 * 60 * 60 * 24))} días
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Calidad de extracción</span>
                      <span className={`text-sm font-medium ${
                        parseFloat(documento.confianza_extraccion) >= 0.8 ? 'text-green-600' :
                        parseFloat(documento.confianza_extraccion) >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {parseFloat(documento.confianza_extraccion) >= 0.8 ? 'Excelente' :
                         parseFloat(documento.confianza_extraccion) >= 0.6 ? 'Buena' : 'Necesita revisión'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Campos extraídos</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {Object.keys(analisis_ia.entidades_detectadas).length} entidades
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <Info className="h-3 w-3" />
                      <span>Procesado con IA el {formatDate(documento.fecha_inicio)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}