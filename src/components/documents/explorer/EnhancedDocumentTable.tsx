"use client";
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Eye, 
  Download, 
  Upload, 
  MoreVertical, 
  User, 
  Folder, 
  Clock,
  Tag,
  SortAsc,
  SortDesc,
  CheckCircle,
  AlertCircle,
  Edit3
} from 'lucide-react';
import { Document } from '@/services/common/documentService';
import { documentService } from '@/lib/api/services/document.service';
import { toast } from 'sonner';

interface EnhancedDocumentTableProps {
  documents: Document[];
  onSelect: (doc: Document) => void;
  onDocumentUpdated?: () => void;
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
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
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${config.color}`}>
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
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${config.color}`}>
      <span className="mr-1">{config.icon}</span>
      {type}
    </span>
  );
};

// Compact Sort Button
const SortButton = ({ 
  field, 
  children, 
  sortBy, 
  sortOrder, 
  onSort 
}: { 
  field: string; 
  children: React.ReactNode; 
  sortBy: string; 
  sortOrder: string; 
  onSort: (field: string) => void;
}) => (
  <button
    onClick={() => onSort(field)}
    className="flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors uppercase tracking-wide"
  >
    <span>{children}</span>
    {sortBy === field && (
      sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
    )}
  </button>
);

// Compact Document Actions Dropdown
const DocumentActionsDropdown = ({ 
  document, 
  onAction 
}: { 
  document: Document; 
  onAction: (action: string, doc: Document) => void;
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowActions(!showActions);
        }}
        className="p-1 rounded hover:bg-slate-100 transition-colors"
        title="Más acciones"
      >
        <MoreVertical className="w-4 h-4 text-slate-400" />
      </button>
      
      {showActions && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowActions(false)}
          />
          <div className="absolute right-0 top-6 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAction('view', document);
                setShowActions(false);
              }}
              className="w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver detalles
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAction('download', document);
                setShowActions(false);
              }}
              className="w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAction('newVersion', document);
                setShowActions(false);
              }}
              className="w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              Nueva versión
            </button>
            {document.version_actual > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAction('viewVersions', document);
                  setShowActions(false);
                }}
                className="w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
              >
                <Clock className="w-4 h-4 mr-2" />
                Ver versiones
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Compact Document Table Row
const DocumentTableRow = ({ 
  document, 
  onSelect, 
  onAction 
}: { 
  document: Document; 
  onSelect: (doc: Document) => void; 
  onAction: (action: string, doc: Document) => void;
}) => {
  return (
    <tr
      className="hover:bg-blue-50/50 cursor-pointer transition-colors group border-b border-slate-100"
      onClick={() => onSelect(document)}
    >
      <td className="px-3 py-2.5">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {document.titulo}
            </div>
            <div className="text-xs text-slate-500 font-mono">{document.codigo_documento}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5">
        <DocumentTypeBadge type={document.tipo_documento} />
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center text-sm text-slate-700 min-w-0">
          <User className="w-3 h-3 mr-1.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">{document.cliente_nombre}</span>
        </div>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center text-sm text-slate-600 min-w-0">
          <Folder className="w-3 h-3 mr-1.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">{document.nombre_carpeta || 'Sin carpeta'}</span>
        </div>
      </td>
      <td className="px-3 py-2.5">
        <StatusBadge status={document.estado} />
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center text-sm">
          <span className="font-medium text-slate-900">v{document.version_actual}</span>
          {document.version_actual > 1 && (
            <span className="ml-1.5 text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
              {document.version_actual}
            </span>
          )}
        </div>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center text-sm text-slate-600">
          <Clock className="w-3 h-3 mr-1.5 text-slate-400" />
          <span className="text-xs">
            {new Date(document.fecha_modificacion).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit'
            })}
          </span>
        </div>
      </td>
      <td className="px-3 py-2.5 text-right">
        <DocumentActionsDropdown document={document} onAction={onAction} />
      </td>
    </tr>
  );
};

// Main Enhanced Document Table Component
export const EnhancedDocumentTable: React.FC<EnhancedDocumentTableProps> = ({
  documents,
  onSelect,
  onDocumentUpdated,
  loading = false,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange
}) => {
  const [sortBy, setSortBy] = useState('fecha_modificacion');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortedDocuments, setSortedDocuments] = useState(documents);

  useEffect(() => {
    const sorted = [...documents].sort((a, b) => {
      let aVal = (a as any)[sortBy];
      let bVal = (b as any)[sortBy];

      if (sortBy === 'fecha_modificacion' || sortBy === 'fecha_creacion') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setSortedDocuments(sorted);
  }, [documents, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
  };

  const handleDocumentAction = async (action: string, doc: Document) => {
    try {
      switch (action) {
        case 'download':
          const contentUrl = await documentService.getDocumentContentUrl(doc.id_documento);
          const a = document.createElement('a');
          a.href = contentUrl.url;
          a.download = doc.titulo;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          toast.success('Descarga iniciada');
          break;
        
        case 'view':
          onSelect(doc);
          break;
          
        case 'newVersion':
          toast.info('Funcionalidad de nueva versión');
          break;
          
        case 'viewVersions':
          toast.info('Mostrando versiones del documento');
          break;
          
        default:
          console.log(`Acción no implementada: ${action}`);
      }
    } catch (error) {
      console.error('Error al ejecutar acción:', error);
      toast.error('Error al ejecutar la acción');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-100 rounded-t-lg"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 border-t border-slate-100"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-3 py-2.5 text-left">
                <SortButton 
                  field="titulo" 
                  sortBy={sortBy} 
                  sortOrder={sortOrder} 
                  onSort={handleSort}
                >
                  Documento
                </SortButton>
              </th>
              <th className="px-3 py-2.5 text-left">
                <SortButton 
                  field="tipo_documento" 
                  sortBy={sortBy} 
                  sortOrder={sortOrder} 
                  onSort={handleSort}
                >
                  Tipo
                </SortButton>
              </th>
              <th className="px-3 py-2.5 text-left">
                <SortButton 
                  field="cliente_nombre" 
                  sortBy={sortBy} 
                  sortOrder={sortOrder} 
                  onSort={handleSort}
                >
                  Cliente
                </SortButton>
              </th>
              <th className="px-3 py-2.5 text-left">
                <SortButton 
                  field="nombre_carpeta" 
                  sortBy={sortBy} 
                  sortOrder={sortOrder} 
                  onSort={handleSort}
                >
                  Carpeta
                </SortButton>
              </th>
              <th className="px-3 py-2.5 text-left">
                <SortButton 
                  field="estado" 
                  sortBy={sortBy} 
                  sortOrder={sortOrder} 
                  onSort={handleSort}
                >
                  Estado
                </SortButton>
              </th>
              <th className="px-3 py-2.5 text-left">
                <SortButton 
                  field="version_actual" 
                  sortBy={sortBy} 
                  sortOrder={sortOrder} 
                  onSort={handleSort}
                >
                  Versión
                </SortButton>
              </th>
              <th className="px-3 py-2.5 text-left">
                <SortButton 
                  field="fecha_modificacion" 
                  sortBy={sortBy} 
                  sortOrder={sortOrder} 
                  onSort={handleSort}
                >
                  Modificado
                </SortButton>
              </th>
              <th className="px-3 py-2.5 text-right">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Acciones
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedDocuments.map((document) => (
              <DocumentTableRow
                key={document.id_documento}
                document={document}
                onSelect={onSelect}
                onAction={handleDocumentAction}
              />
            ))}
          </tbody>
        </table>

        {sortedDocuments.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-slate-900 mb-2">No hay documentos</h3>
            <p className="text-slate-600 text-sm">No se encontraron documentos que coincidan con los criterios.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
        <button
          type="button"
          className="px-3 py-1.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          onClick={() => onPageChange && onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Anterior
        </button>
        <span className="text-sm text-slate-600">
          Página {page} de {totalPages}
        </span>
        <button
          type="button"
          className="px-3 py-1.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          onClick={() => onPageChange && onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};