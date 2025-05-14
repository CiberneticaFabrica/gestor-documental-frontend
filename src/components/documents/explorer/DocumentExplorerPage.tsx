"use client";
import { useEffect, useState } from 'react';
import { Document, fetchDocuments, fetchDocumentContent } from '@/services/common/documentService';
import { toast } from 'sonner';
import { DocumentTable } from './DocumentTable';
// import { DocumentFilters } from './DocumentFilters';
import { DocumentPreviewModal } from './DocumentPreviewModal';

function PreviewPanel({ document }: { document: Document }) {
  const [tab, setTab] = useState<'preview' | 'details'>('preview');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      if (tab === 'preview') {
        setLoading(true);
        setError(null);
        try {
          console.log('Fetching preview for document:', document);
          const url = await fetchDocumentContent(document.id_documento);
          console.log('Received preview URL:', url);
          setPreviewUrl(url);
        } catch (err) {
          console.error('Error fetching preview:', err);
          setError('Error al cargar la previsualización');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPreview();
  }, [document.id_documento, tab]);

  const renderPreview = () => {
    console.log('Rendering preview with:', { loading, error, previewUrl, document });
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

    if (!previewUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <span className="mb-2">No se puede previsualizar este documento</span>
          <span className="text-sm">El documento no está disponible en este momento</span>
        </div>
      );
    }

    // Determinar el tipo de archivo por la extensión
    const extension = document.titulo.split('.').pop()?.toLowerCase();
    console.log('File extension:', extension);
    console.log('Preview URL:', previewUrl);
    
    if (extension === 'pdf') {
      return (
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          title={`Preview of ${document.titulo}`}
        />
      );
    }

    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      console.log('Rendering image preview for:', document.titulo);
      return (
        <div className="h-full flex items-center justify-center">
          <img
            src={previewUrl}
            alt={document.titulo}
            className="max-w-full max-h-full object-contain"
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
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
        >
          Descargar archivo
        </a>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-2">
        <button
          className={`px-4 py-2 text-sm font-semibold rounded-t ${tab === 'preview' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}
          onClick={() => setTab('preview')}
        >
          Preview
        </button>
        <button
          className={`px-4 py-2 text-sm font-semibold rounded-t ${tab === 'details' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}
          onClick={() => setTab('details')}
        >
          Details
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {tab === 'preview' ? (
          <div className="h-full">
            {renderPreview()}
          </div>
        ) : (
          <div className="text-sm text-gray-700 dark:text-gray-200 space-y-2">
            <div><span className="font-semibold">Código:</span> {document.codigo_documento}</div>
            <div><span className="font-semibold">Tipo:</span> {document.tipo_documento}</div>
            <div><span className="font-semibold">Versión:</span> v{document.version_actual}</div>
            <div><span className="font-semibold">Carpeta:</span> {document.nombre_carpeta || '-'}</div>
            <div><span className="font-semibold">Estado:</span> {document.estado}</div>
            <div><span className="font-semibold">Creado por:</span> {document.creado_por_usuario}</div>
            <div><span className="font-semibold">Modificado por:</span> {document.modificado_por_usuario}</div>
            <div><span className="font-semibold">Fecha creación:</span> {new Date(document.fecha_creacion).toLocaleString()}</div>
            <div><span className="font-semibold">Última modificación:</span> {new Date(document.fecha_modificacion).toLocaleString()}</div>
            <div><span className="font-semibold">Descripción:</span> {document.descripcion || 'Sin descripción'}</div>
            {document.tags && document.tags.length > 0 && (
              <div>
                <span className="font-semibold">Etiquetas:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {document.tags.map((tag, i) => (
                    <span key={i} className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded px-2 py-0.5 text-xs">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function DocumentExplorerPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: ''
  });

  const loadDocuments = async (pageToLoad = page, pageSizeToLoad = pageSize) => {
    setLoading(true);
    try {
      const data = await fetchDocuments(pageToLoad, pageSizeToLoad);
      setDocuments(data.documentos);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.total_pages);
      setPage(data.pagination.page);
      setPageSize(data.pagination.page_size);
    } catch (error) {
      console.error("Error al cargar documentos:", error);
      toast.error("Error al cargar documentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [page, pageSize]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // TODO: Implementar filtrado en el backend
    console.log('Filtros aplicados:', newFilters);
  };

  const handleDocumentSelect = (doc: Document) => {
    setSelectedDocument(doc);
  };

  return (
    <div className="flex h-[80vh] bg-gray-100 dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      {/* Sidebar de filtros */}
      <aside className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
        <div className="font-bold text-gray-700 dark:text-gray-200 mb-4 text-lg">Filtros</div>
        {/* Aquí irá el componente de filtros avanzado */}
        <div className="text-gray-500 text-sm">(Filtros próximamente...)</div>
      </aside>

      {/* Listado de documentos */}
      <main className="flex-1 flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Explorador de Documentos</h1>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <DocumentTable 
            documents={documents} 
            onSelect={handleDocumentSelect}
          />
        </div>
        {/* Paginación */}
        <div className="flex justify-between items-center px-6 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500">Mostrando {documents.length} de {total} documentos</div>
          <div className="flex gap-1">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >&lt;</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`px-3 py-1 rounded text-xs ${p === page ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                onClick={() => setPage(p)}
                disabled={p === page}
              >{p}</button>
            ))}
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >&gt;</button>
          </div>
        </div>
      </main>

      {/* Panel de previsualización */}
      <aside className="w-[420px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
        <div className="font-bold text-gray-700 dark:text-gray-200 mb-4 text-lg">Previsualización</div>
        {selectedDocument ? (
          <PreviewPanel document={selectedDocument} />
        ) : (
          <div className="text-gray-400 text-sm flex items-center justify-center h-full">Selecciona un documento para previsualizar</div>
        )}
      </aside>
    </div>
  );
} 