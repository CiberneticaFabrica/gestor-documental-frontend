// components/documents/explorer/EnhancedDocumentExplorerPage.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Upload, 
  RefreshCw,
  Plus,
  Settings,
  Download,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Eye
} from 'lucide-react';
import { Document, fetchDocuments, DocumentsResponse } from '@/services/common/documentService';
import { documentService } from '@/lib/api/services/document.service';
import { toast } from 'sonner';

// Import your enhanced components
import { EnhancedDocumentTable } from './EnhancedDocumentTable';
import { EnhancedFilterSidebar } from './EnhancedFilterSidebar';
import { EnhancedPreviewPanel } from './EnhancedPreviewPanel';

interface FilterState {
  search: string;
  clienteIds: string[];
  documentTypes: string[];
  statuses: string[];
  dateRange: { from: string; to: string };
  carpetas: string[];
}

// Compact Stats Cards Component
const StatsCards: React.FC<{ documents: Document[] }> = ({ documents }) => {
  const stats = {
    total: documents.length,
    publicados: documents.filter(d => d.estado === 'publicado').length,
    pendientes: documents.filter(d => d.estado === 'pendiente_revision').length,
    borradores: documents.filter(d => d.estado === 'borrador').length
  };

  const StatCard: React.FC<{ 
    title: string; 
    value: number; 
    icon: React.ElementType; 
    color: string;
    bgColor: string;
  }> = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">{title}</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <StatCard
        title="Total"
        value={stats.total}
        icon={FileText}
        color="text-blue-600"
        bgColor="bg-blue-100"
      />
      <StatCard
        title="Publicados"
        value={stats.publicados}
        icon={CheckCircle}
        color="text-green-600"
        bgColor="bg-green-100"
      />
      <StatCard
        title="Pendientes"
        value={stats.pendientes}
        icon={Clock}
        color="text-amber-600"
        bgColor="bg-amber-100"
      />
      <StatCard
        title="Borradores"
        value={stats.borradores}
        icon={AlertCircle}
        color="text-slate-600"
        bgColor="bg-slate-100"
      />
    </div>
  );
};

// Compact Loading Component
const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center h-48">
    <div className="text-center">
      <RefreshCw className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-3" />
      <h3 className="text-base font-medium text-slate-900 mb-1">Cargando documentos</h3>
      <p className="text-slate-600 text-sm">Espera mientras cargamos tus documentos...</p>
    </div>
  </div>
);

// Compact Error Component
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="flex items-center justify-center h-48">
    <div className="text-center max-w-md">
      <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
      <h3 className="text-base font-medium text-slate-900 mb-2">Error al cargar documentos</h3>
      <p className="text-slate-600 mb-3 text-sm">{error}</p>
      <button
        onClick={onRetry}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <RefreshCw className="w-4 h-4 mr-1 inline" />
        Reintentar
      </button>
    </div>
  </div>
);

// Main Enhanced Document Explorer Component
export const EnhancedDocumentExplorerPage: React.FC = () => {
  // State management
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 1
  });

  // Active filters
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    search: '',
    clienteIds: [],
    documentTypes: [],
    statuses: [],
    dateRange: { from: '', to: '' },
    carpetas: []
  });

  // Load documents
  const loadDocuments = useCallback(async (page = 1, pageSize = 50) => {
    setLoading(true);
    setError(null);
    
    try {
      const data: DocumentsResponse = await fetchDocuments(page, pageSize);
      setDocuments(data.documentos);
      setFilteredDocuments(data.documentos);
      setPagination({
        page: data.pagination.page,
        pageSize: data.pagination.page_size,
        total: data.pagination.total,
        totalPages: data.pagination.total_pages
      });
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('Error al cargar los documentos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Search functionality
  useEffect(() => {
    if (!searchTerm) {
      setFilteredDocuments(documents);
      return;
    }

    const filtered = documents.filter(doc =>
      doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.codigo_documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tipo_documento.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredDocuments(filtered);
  }, [searchTerm, documents]);

  // Apply filters
  const handleApplyFilters = async (filters: FilterState) => {
    setLoading(true);
    setActiveFilters(filters);
    
    try {
      // If using search filters, call the search API
      if (Object.values(filters).some(value => 
        Array.isArray(value) ? value.length > 0 : value !== ''
      )) {
        const searchData = await documentService.searchDocuments({
          search_term: filters.search,
          cliente_id: filters.clienteIds.length > 0 ? filters.clienteIds : undefined,
          tipo_documento: filters.documentTypes.length > 0 ? filters.documentTypes : undefined,
          estado: filters.statuses.length > 0 ? filters.statuses : undefined,
          fecha_desde: filters.dateRange.from || undefined,
          fecha_hasta: filters.dateRange.to || undefined
        });
        
        const documentos = Array.isArray(searchData.documentos) ? searchData.documentos : [];
        setFilteredDocuments(documentos);
        toast.success(`Se encontraron ${documentos.length} documentos`);
      } else {
        // No filters, show all documents
        setFilteredDocuments(documents);
      }
      
      setShowFilters(false);
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Error al aplicar filtros');
      setFilteredDocuments(documents);
    } finally {
      setLoading(false);
    }
  };

  // Refresh documents
  const handleRefresh = () => {
    loadDocuments(pagination.page, pagination.pageSize);
    toast.success('Documentos actualizados');
  };

  // Document selection
  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
  };

  // Document updated callback
  const handleDocumentUpdated = () => {
    loadDocuments(pagination.page, pagination.pageSize);
  };

  // Upload handlers
  const handleUploadDocument = () => {
    toast.info('Funcionalidad de subida de documentos próximamente');
  };

  const handleNewVersion = (document: Document) => {
    toast.info(`Nueva versión para: ${document.titulo}`);
  };

  const handleDownload = (document: Document) => {
    toast.info(`Descargando: ${document.titulo}`);
  };

  const handleShare = (document: Document) => {
    toast.info(`Compartiendo: ${document.titulo}`);
  };

  // Check if filters are active
  const hasActiveFilters = () => {
    return activeFilters.search !== '' ||
           activeFilters.clienteIds.length > 0 ||
           activeFilters.documentTypes.length > 0 ||
           activeFilters.statuses.length > 0 ||
           activeFilters.dateRange.from !== '' ||
           activeFilters.dateRange.to !== '' ||
           activeFilters.carpetas.length > 0;
  };

  const getActiveFiltersCount = () => {
    return [
      activeFilters.clienteIds.length,
      activeFilters.documentTypes.length,
      activeFilters.statuses.length,
      activeFilters.carpetas.length,
      activeFilters.search ? 1 : 0,
      (activeFilters.dateRange.from || activeFilters.dateRange.to) ? 1 : 0
    ].reduce((a, b) => a + b, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Compact Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Explorador de Documentos
              </h1>
              <p className="text-slate-600 text-sm mt-0.5">
                Gestiona y visualiza todos tus documentos
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                title="Alternar estadísticas"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 rounded-lg hover:bg-slate-100"
                title="Actualizar"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleUploadDocument}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Subir Documento
              </button>
            </div>
          </div>
        </div>

        {/* Compact Toolbar */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Compact Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar documentos..."
                  className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-72 transition-colors text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Compact Filters Button */}
              <button
                onClick={() => setShowFilters(true)}
                className={`flex items-center px-3 py-2 border rounded-lg transition-colors text-sm ${
                  hasActiveFilters()
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-1" />
                Filtros
                {hasActiveFilters() && (
                  <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              {/* Compact Results Count */}
              <span className="text-sm text-slate-600">
                {filteredDocuments.length} de {documents.length}
              </span>
            </div>

            {/* Compact View Toggle */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-slate-200 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Vista de tabla"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Vista de cuadrícula"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-4">
          {/* Compact Statistics Cards */}
          {showStats && <StatsCards documents={filteredDocuments} />}

          {/* Content Area */}
          <div className="flex gap-4">
            {/* Documents List */}
            <div className="flex-1 min-w-0">
              {loading && <LoadingState />}
              
              {error && (
                <ErrorState 
                  error={error} 
                  onRetry={() => loadDocuments(pagination.page, pagination.pageSize)} 
                />
              )}
              
              {!loading && !error && (
                <EnhancedDocumentTable
                  documents={filteredDocuments}
                  onSelect={handleDocumentSelect}
                  onDocumentUpdated={handleDocumentUpdated}
                  loading={loading}
                  page={pagination.page}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  totalPages={pagination.totalPages}
                  onPageChange={(newPage) => {
                    setPagination((prev) => ({ ...prev, page: newPage }));
                    loadDocuments(newPage, pagination.pageSize);
                  }}
                />
              )}
            </div>

            {/* Compact Preview Panel */}
            <div className="w-80 flex-shrink-0">
              <EnhancedPreviewPanel
                document={selectedDocument}
                onNewVersion={handleNewVersion}
                onDownload={handleDownload}
                onShare={handleShare}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Sidebar */}
      <EnhancedFilterSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={activeFilters}
      />
    </div>
  );
};