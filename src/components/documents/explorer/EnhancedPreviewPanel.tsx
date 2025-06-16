// components/documents/explorer/EnhancedPreviewPanel.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Info, 
  Download, 
  Upload, 
  Share2, 
  Edit3, 
  Clock, 
  User, 
  FileText, 
  Tag, 
  Folder,
  ExternalLink,
  Maximize2,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Document, fetchDocumentContent, DocumentPreview } from '@/services/common/documentService';
import { documentService } from '@/lib/api/services/document.service';
import { toast } from 'sonner';

interface EnhancedPreviewPanelProps {
  document: Document | null;
  onNewVersion?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  onShare?: (document: Document) => void;
}

// Compact Status Badge
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    'publicado': { 
      color: 'bg-green-100 text-green-700 border-green-200', 
      icon: CheckCircle,
      label: 'Publicado'
    },
    'pendiente_revision': { 
      color: 'bg-amber-100 text-amber-700 border-amber-200', 
      icon: Clock,
      label: 'Pendiente'
    },
    'borrador': { 
      color: 'bg-slate-100 text-slate-700 border-slate-200', 
      icon: Edit3,
      label: 'Borrador'
    },
    'rechazado': { 
      color: 'bg-red-100 text-red-700 border-red-200', 
      icon: AlertCircle,
      label: 'Rechazado'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['borrador'];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

// Compact Document Type Badge
const DocumentTypeBadge = ({ type }: { type: string }) => {
  const typeConfig = {
    'DNI': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🆔' },
    'Contrato cuenta': { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '📄' },
    'Factura': { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🧾' },
    'Certificado': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '🏆' }
  };

  const config = typeConfig[type as keyof typeof typeConfig] || { 
    color: 'bg-slate-100 text-slate-700 border-slate-200', 
    icon: '📄' 
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${config.color}`}>
      <span className="mr-1">{config.icon}</span>
      {type}
    </span>
  );
};

// Optimized Preview Component
const DocumentPreviewContent: React.FC<{ 
  document: Document; 
  previewData: DocumentPreview | null; 
  loading: boolean; 
  error: string | null; 
}> = ({ document, previewData, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="text-center">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600">Cargando previsualización...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-4">
        <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
        <h3 className="text-base font-medium text-slate-900 mb-2">Error al cargar</h3>
        <p className="text-sm text-slate-600 mb-3">{error}</p>
        <button className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
          <RefreshCw className="w-4 h-4 mr-1 inline" />
          Reintentar
        </button>
      </div>
    );
  }

  if (!previewData) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-4">
        <FileText className="w-10 h-10 text-slate-400 mb-3" />
        <h3 className="text-base font-medium text-slate-900 mb-2">Sin previsualización</h3>
        <p className="text-sm text-slate-600 mb-3">
          Este documento no se puede previsualizar
        </p>
        <button className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
          <Download className="w-4 h-4 mr-1 inline" />
          Descargar
        </button>
      </div>
    );
  }

  // Handle different file types
  if (previewData.mime_type.startsWith('image/')) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center p-3 bg-slate-50 min-h-[300px]">
          <img
            src={previewData.url_documento}
            alt={previewData.nombre_archivo}
            className="max-w-full max-h-full object-contain rounded-md shadow-sm"
            onError={() => toast.error('Error al cargar la imagen')}
          />
        </div>
        <div className="p-3 bg-white border-t border-slate-200">
          <button className="w-full bg-slate-100 text-slate-700 py-2 px-3 rounded-md hover:bg-slate-200 transition-colors text-sm font-medium flex items-center justify-center">
            <Maximize2 className="w-4 h-4 mr-1" />
            Ver en pantalla completa
          </button>
        </div>
      </div>
    );
  }

  if (previewData.mime_type === 'application/pdf') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 bg-slate-100 min-h-[400px]">
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(previewData.url_documento)}&embedded=true`}
            className="w-full h-full border-0 rounded-md"
            title={previewData.nombre_archivo}
          />
        </div>
        <div className="p-3 bg-white border-t border-slate-200">
          <button className="w-full bg-slate-100 text-slate-700 py-2 px-3 rounded-md hover:bg-slate-200 transition-colors text-sm font-medium flex items-center justify-center">
            <ExternalLink className="w-4 h-4 mr-1" />
            Abrir en nueva pestaña
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 min-h-[300px]">
      <FileText className="w-10 h-10 text-slate-400 mb-3" />
      <h3 className="text-base font-medium text-slate-900 mb-2">Formato no compatible</h3>
      <p className="text-sm text-slate-600 mb-3">
        Este tipo de archivo no se puede previsualizar
      </p>
      <div className="space-y-2">
        <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          <Download className="w-4 h-4 mr-1 inline" />
          Descargar archivo
        </button>
        <p className="text-xs text-slate-500">
          {previewData.mime_type} • {Math.round(previewData.tamano_bytes / 1024)} KB
        </p>
      </div>
    </div>
  );
};

// Compact Details Component
const DocumentDetailsContent: React.FC<{ document: Document }> = ({ document }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const DetailRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-b-0">
      <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );

  const Section: React.FC<{ title: string; icon: React.ComponentType<any>; children: React.ReactNode }> = ({ 
    title, 
    icon: Icon, 
    children 
  }) => (
    <div className="bg-white rounded-lg border border-slate-200 p-3 mb-3">
      <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center">
        <Icon className="w-4 h-4 mr-1.5 text-slate-500" />
        {title}
      </h4>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-3 space-y-3 bg-slate-50">
      {/* Basic Information */}
      <Section title="Información Básica" icon={Info}>
        <DetailRow label="Código">
          <span className="text-xs font-mono text-slate-900 bg-slate-100 px-2 py-1 rounded">
            {document.codigo_documento}
          </span>
        </DetailRow>
        <DetailRow label="Tipo">
          <DocumentTypeBadge type={document.tipo_documento} />
        </DetailRow>
        <DetailRow label="Estado">
          <StatusBadge status={document.estado} />
        </DetailRow>
        <DetailRow label="Versión">
          <div className="flex items-center text-sm">
            <span className="font-medium text-slate-900">v{document.version_actual}</span>
            {document.version_actual > 1 && (
              <span className="ml-1 text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                {document.version_actual}
              </span>
            )}
          </div>
        </DetailRow>
        <DetailRow label="Carpeta">
          <div className="flex items-center text-sm text-slate-700">
            <Folder className="w-3 h-3 mr-1 text-slate-400" />
            <span className="text-xs">{document.nombre_carpeta || 'Sin carpeta'}</span>
          </div>
        </DetailRow>
      </Section>

      {/* Client Information */}
      <Section title="Cliente" icon={User}>
        <div className="bg-slate-50 rounded-md p-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-900 text-sm">{document.cliente_nombre}</span>
            <button className="text-blue-600 hover:text-blue-700 text-xs flex items-center">
              Ver perfil
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>
      </Section>

      {/* Metadata - Compact Grid */}
      <Section title="Metadatos" icon={Clock}>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium text-slate-600 block">Creado por:</span>
            <span className="text-slate-900">{document.creado_por_usuario}</span>
          </div>
          <div>
            <span className="font-medium text-slate-600 block">Modificado por:</span>
            <span className="text-slate-900">{document.modificado_por_usuario}</span>
          </div>
          <div>
            <span className="font-medium text-slate-600 block">Creación:</span>
            <span className="text-slate-700">{formatDate(document.fecha_creacion)}</span>
          </div>
          <div>
            <span className="font-medium text-slate-600 block">Modificación:</span>
            <span className="text-slate-700">{formatDate(document.fecha_modificacion)}</span>
          </div>
        </div>
      </Section>

      {/* Description */}
      {document.descripcion && (
        <Section title="Descripción" icon={FileText}>
          <p className="text-sm text-slate-700 leading-relaxed">
            {document.descripcion}
          </p>
        </Section>
      )}

      {/* Tags */}
      {document.tags && document.tags.length > 0 && (
        <Section title="Etiquetas" icon={Tag}>
          <div className="flex flex-wrap gap-1">
            {document.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

// Main Enhanced Preview Panel Component
export const EnhancedPreviewPanel: React.FC<EnhancedPreviewPanelProps> = ({
  document,
  onNewVersion,
  onDownload,
  onShare
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'details'>('preview');
  const [previewData, setPreviewData] = useState<DocumentPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (document && activeTab === 'preview') {
      loadPreview();
    }
  }, [document?.id_documento, activeTab]);

  const loadPreview = async () => {
    if (!document) return;

    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchDocumentContent(document.id_documento);
      setPreviewData(data);
    } catch (err) {
      console.error('Error loading preview:', err);
      setError('Error al cargar la previsualización');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!document) return;

    try {
      if (onDownload) {
        onDownload(document);
      } else {
        const contentUrl = await documentService.getDocumentContentUrl(document.id_documento);
        const a = window.document.createElement('a');
        a.href = contentUrl.url;
        a.download = document.titulo;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        toast.success('Descarga iniciada');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Error al descargar el documento');
    }
  };

  const handleNewVersion = () => {
    if (document && onNewVersion) {
      onNewVersion(document);
    } else {
      toast.info('Funcionalidad de nueva versión próximamente');
    }
  };

  const handleShare = () => {
    if (document && onShare) {
      onShare(document);
    } else {
      toast.info('Funcionalidad de compartir próximamente');
    }
  };

  // Empty state
  if (!document) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50">
        <div className="max-w-sm mx-auto">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Selecciona un documento
          </h3>
          <p className="text-slate-600 mb-4 text-sm">
            Elige un documento para ver su previsualización y detalles
          </p>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
            <h4 className="font-medium text-slate-900 mb-2 text-sm">Funciones disponibles:</h4>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Previsualización de PDFs e imágenes</li>
              <li>• Información detallada del documento</li>
              <li>• Descarga directa</li>
              <li>• Gestión de versiones</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border border-slate-200 rounded-lg">
      {/* Compact Header */}
      <div className="border-b border-slate-200 p-3 bg-white rounded-t-lg">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 mr-3">
            <h3 className="text-base font-semibold text-slate-900 truncate mb-1">
              {document.titulo}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {document.cliente_nombre}
              </span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                v{document.version_actual}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <DocumentTypeBadge type={document.tipo_documento} />
            <StatusBadge status={document.estado} />
          </div>
        </div>

        {/* Compact Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDownload}
            className="flex items-center px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
          >
            <Download className="w-3 h-3 mr-1" />
            Descargar
          </button>
          <button
            onClick={handleNewVersion}
            className="flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
          >
            <Upload className="w-3 h-3 mr-1" />
            Nueva versión
          </button>
       
        </div>
      </div>

      {/* Compact Tabs */}
      <div className="border-b border-slate-200 bg-slate-50">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Info className="w-4 h-4 mr-1" />
            Detalles
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'preview' ? (
          <DocumentPreviewContent
            document={document}
            previewData={previewData}
            loading={loading}
            error={error}
          />
        ) : (
          <DocumentDetailsContent document={document} />
        )}
      </div>
    </div>
  );
};