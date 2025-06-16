// components/documents/explorer/EnhancedFilterSidebar.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  ChevronDown, 
  ChevronRight, 
  User, 
  FileText, 
  CheckCircle, 
  Calendar,
  Tag,
  Filter,
  RotateCcw
} from 'lucide-react';
import { clientService, Client } from '@/lib/api/services/client.service';
import { documentService } from '@/lib/api/services/document.service';
import { toast } from 'sonner';

interface FilterState {
  search: string;
  clienteIds: string[];
  documentTypes: string[];
  statuses: string[];
  dateRange: { from: string; to: string };
  carpetas: string[];
}

interface EnhancedFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => Promise<void>;
  initialFilters?: Partial<FilterState>;
}

interface FilterSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  icon: Icon, 
  children, 
  isExpanded, 
  onToggle 
}) => (
  <div className="border-b border-gray-200 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-3 text-gray-500" />
        <span className="font-medium text-gray-900">{title}</span>
      </div>
      {isExpanded ? 
        <ChevronDown className="w-4 h-4 text-gray-400" /> : 
        <ChevronRight className="w-4 h-4 text-gray-400" />
      }
    </button>
    {isExpanded && (
      <div className="px-4 pb-4">
        {children}
      </div>
    )}
  </div>
);

const CheckboxGroup: React.FC<{
  options: { value: string; label: string; count?: number }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  loading?: boolean;
}> = ({ options, selectedValues, onChange, loading }) => {
  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-3"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-48 overflow-y-auto">
      {options.map(option => (
        <label key={option.value} className="flex items-center group cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            checked={selectedValues.includes(option.value)}
            onChange={() => handleToggle(option.value)}
          />
          <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 flex-1">
            {option.label}
          </span>
          {option.count !== undefined && (
            <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {option.count}
            </span>
          )}
        </label>
      ))}
    </div>
  );
};

export const EnhancedFilterSidebar: React.FC<EnhancedFilterSidebarProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    clienteIds: [],
    documentTypes: [],
    statuses: [],
    dateRange: { from: '', to: '' },
    carpetas: [],
    ...initialFilters
  });

  const [expandedSections, setExpandedSections] = useState({
    search: true,
    clients: true,
    types: true,
    status: true,
    dates: false,
    folders: false
  });

  const [loadingStates, setLoadingStates] = useState({
    clients: false,
    types: false,
    folders: false
  });

  const [options, setOptions] = useState({
    clients: [] as Client[],
    documentTypes: [] as string[],
    statuses: [
      { value: 'publicado', label: 'Publicado', count: 0 },
      { value: 'pendiente_revision', label: 'Pendiente Revisión', count: 0 },
      { value: 'borrador', label: 'Borrador', count: 0 },
      { value: 'rechazado', label: 'Rechazado', count: 0 }
    ],
    carpetas: [] as string[]
  });

  // Load filter options
  useEffect(() => {
    if (isOpen) {
      loadFilterOptions();
    }
  }, [isOpen]);

  const loadFilterOptions = async () => {
    try {
      // Load clients
      setLoadingStates(prev => ({ ...prev, clients: true }));
      const clientsData = await clientService.getClients(1, 1000);
      setOptions(prev => ({ ...prev, clients: clientsData.clientes }));
      setLoadingStates(prev => ({ ...prev, clients: false }));

      // Load document types and other statistics
      // Note: You'll need to implement these endpoints or adapt based on your API
      // const statsData = await documentService.getDocumentStats();
      // setOptions(prev => ({ 
      //   ...prev, 
      //   documentTypes: statsData.types,
      //   carpetas: statsData.folders
      // }));

    } catch (error) {
      console.error('Error loading filter options:', error);
      toast.error('Error al cargar opciones de filtro');
      setLoadingStates({ clients: false, types: false, folders: false });
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = async () => {
    try {
      await onApplyFilters(filters);
      toast.success('Filtros aplicados correctamente');
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Error al aplicar filtros');
    }
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      search: '',
      clienteIds: [],
      documentTypes: [],
      statuses: [],
      dateRange: { from: '', to: '' },
      carpetas: []
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    toast.info('Filtros limpiados');
  };

  const hasActiveFilters = () => {
    return filters.search !== '' ||
           filters.clienteIds.length > 0 ||
           filters.documentTypes.length > 0 ||
           filters.statuses.length > 0 ||
           filters.dateRange.from !== '' ||
           filters.dateRange.to !== '' ||
           filters.carpetas.length > 0;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filtros Avanzados</h2>
            </div>
            <div className="flex items-center space-x-2">
              {hasActiveFilters() && (
                <button
                  onClick={handleClearFilters}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="Limpiar filtros"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Cerrar panel de filtros"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Section */}
          <FilterSection
            title="Búsqueda"
            icon={Search}
            isExpanded={expandedSections.search}
            onToggle={() => toggleSection('search')}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar en documentos..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </FilterSection>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Clients Filter */}
            <FilterSection
              title="Cliente"
              icon={User}
              isExpanded={expandedSections.clients}
              onToggle={() => toggleSection('clients')}
            >
              <CheckboxGroup
                options={options.clients.map(client => ({
                  value: client.id_cliente,
                  label: client.nombre_razon_social
                }))}
                selectedValues={filters.clienteIds}
                onChange={(values) => handleFilterChange('clienteIds', values)}
                loading={loadingStates.clients}
              />
            </FilterSection>

            {/* Document Types Filter */}
            <FilterSection
              title="Tipo de Documento"
              icon={FileText}
              isExpanded={expandedSections.types}
              onToggle={() => toggleSection('types')}
            >
              <CheckboxGroup
                options={[
                  { value: 'DNI', label: 'DNI' },
                  { value: 'Contrato cuenta', label: 'Contrato cuenta' },
                  { value: 'Factura', label: 'Factura' },
                  { value: 'Certificado', label: 'Certificado' }
                ]}
                selectedValues={filters.documentTypes}
                onChange={(values) => handleFilterChange('documentTypes', values)}
                loading={loadingStates.types}
              />
            </FilterSection>

            {/* Status Filter */}
            <FilterSection
              title="Estado"
              icon={CheckCircle}
              isExpanded={expandedSections.status}
              onToggle={() => toggleSection('status')}
            >
              <CheckboxGroup
                options={options.statuses}
                selectedValues={filters.statuses}
                onChange={(values) => handleFilterChange('statuses', values)}
              />
            </FilterSection>

            {/* Date Range Filter */}
            <FilterSection
              title="Rango de Fechas"
              icon={Calendar}
              isExpanded={expandedSections.dates}
              onToggle={() => toggleSection('dates')}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Fecha desde
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.dateRange.from}
                    onChange={(e) => handleFilterChange('dateRange', {
                      ...filters.dateRange,
                      from: e.target.value
                    })}
                    placeholder="Selecciona fecha desde"
                    title="Selecciona fecha desde"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Fecha hasta
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.dateRange.to}
                    onChange={(e) => handleFilterChange('dateRange', {
                      ...filters.dateRange,
                      to: e.target.value
                    })}
                    placeholder="Selecciona fecha hasta"
                    title="Selecciona fecha hasta"
                  />
                </div>
              </div>
            </FilterSection>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Aplicar Filtros
            </button>
            
            {hasActiveFilters() && (
              <button
                onClick={handleClearFilters}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpiar Filtros
              </button>
            )}

            <div className="text-center">
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cerrar panel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};