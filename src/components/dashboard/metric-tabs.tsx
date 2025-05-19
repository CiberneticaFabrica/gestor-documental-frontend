'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Activity,
  Database,
  Shield,
  FileClock,
  FileSearch,
} from 'lucide-react';
import VistaGeneral from '@/components/dashboard/metric-general';
import { DashboardMetricsResponse, DashboardDocumentsMetricsResponse } from '@/lib/api/services/dashboard.service';
import { dashboardService } from '@/lib/api/services/dashboard.service';
import { DocumentMetricsComponent } from '@/components/dashboard/metric-document';
import { VolumeMetricsComponent } from '@/components/dashboard/metric-volume';
import { ProcessingMetricsComponent } from '@/components/dashboard/metric-procesamiento';
import ExtractionMetricsComponent from './metric-extraccion';
import { ExtractionToggle } from './ExtractionToggle';
import { ClientsMetricsComponent } from '@/components/dashboard/metric-clients';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface MetricTabsProps {
  metrics: DashboardMetricsResponse | null;
  documentsMetrics: DashboardDocumentsMetricsResponse | null;
  loading: boolean;
}

const tabs: Tab[] = [
  {
    id: 'overview',
    label: 'Vista General',
    icon: <BarChart3 className="h-5 w-5" />,
    content: <div>Contenido de General</div>,
  },

  {
    id: 'clients',
    label: 'Vista 360° Clientes',
    icon: <Users className="h-5 w-5" />,
    content: <div>Contenido de Clientes</div>,
  },
  {
    id: 'expiring',
    label: 'Documentos',
    icon: <FileClock className="h-5 w-5" />,
    content: <div>Contenido de Documentos por Vencer</div>,
  },
  {
    id: 'performance',
    label: 'Volumen',
    icon: <Activity className="h-5 w-5" />,
    content: <div>Contenido de Rendimiento</div>,
  },
  {
    id: 'extraction',
    label: 'Extracción y Clasificación',
    icon: <FileSearch className="h-5 w-5" />,
    content: null,
  },
  {
    id: 'audit',
    label: 'Auditoría',
    icon: <Shield className="h-5 w-5" />,
    content: <div>Contenido de Auditoría</div>,
  },
  {
    id: 'integration',
    label: 'Integración',
    icon: <Database className="h-5 w-5" />,
    content: <div>Contenido de Integración</div>,
  },
];

export function MetricTabs({ metrics, documentsMetrics, loading }: MetricTabsProps) {
  
  const [activeTab, setActiveTab] = useState('overview');
  const [processingMetrics, setProcessingMetrics] = useState<any>(null);
  const [loadingProcessing, setLoadingProcessing] = useState(true);
  const [extractionMetrics, setExtractionMetrics] = useState<any>(null);
  const [loadingExtraction, setLoadingExtraction] = useState(true);
  const [showProcessing, setShowProcessing] = useState(true);
  const [volumeMetrics, setVolumeMetrics] = useState<any>(null);
  const [clientsMetrics, setClientsMetrics] = useState<any>(null);
  const [loadingClients, setLoadingClients] = useState(true);
  const [usersMetrics, setUsersMetrics] = useState<any>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [processingData, extractionData, volumeData, clientsData, usersData] = await Promise.all([
          dashboardService.getProcessingMetrics(),
          dashboardService.getExtractionMetrics(),
          dashboardService.getVolumeMetrics(),
          dashboardService.getClientsMetrics(),
          dashboardService.getUsersMetrics()
        ]);

        setProcessingMetrics(processingData);
        setExtractionMetrics(extractionData);
        setVolumeMetrics(volumeData);
        setClientsMetrics(clientsData);
        setUsersMetrics(usersData);
      } catch (error) {
        console.error('Error loading metrics:', error);
        // Manejar el error apropiadamente
      } finally {
        setLoadingProcessing(false);
        setLoadingExtraction(false);
        setLoadingClients(false);
        setLoadingUsers(false);
      }
    };

    loadMetrics();
  }, []);

  // Update the content of the overview, extraction, and expiring tabs with the actual metrics
  const updatedTabs = tabs.map(tab => {
    if (tab.id === 'overview') {
      return {
        ...tab,
        content: <VistaGeneral metrics={metrics} 
                      documentsMetrics={documentsMetrics} 
                      userMetrics={usersMetrics} 
                      volumeTrend={volumeMetrics} 
                      processingStats={processingMetrics} 
                      loading={loading} />
      };
    }
    if (tab.id === 'expiring') {
      return {
        ...tab,
        content: loading
          ? <div>Cargando métricas de documentos...</div>
          : <DocumentMetricsComponent data={documentsMetrics} />
      };
    }
    if (tab.id === 'extraction') {
      return {
        ...tab,
        content: loadingProcessing || loadingExtraction ? (
          <div>Cargando métricas...</div>
        ) : (
          <ExtractionToggle
            processingMetrics={processingMetrics}
            extractionMetrics={extractionMetrics}
            loading={loading}
          />
        ),
      };
    }
    if (tab.id === 'performance') {
      return {
        ...tab,
        content: loading
          ? <div>Cargando métricas de volumen...</div>
          : <VolumeMetricsComponent data={volumeMetrics} />
      };
    }
    if (tab.id === 'clients') {
      return {
        ...tab,
        content: loadingClients
          ? <div>Cargando métricas de clientes...</div>
          : <ClientsMetricsComponent data={clientsMetrics} />
      };
    }
    return tab;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-gray-200 dark:border-gray-700 shadow">
        <nav className="hidden md:grid md:grid-cols-7 gap-1" aria-label="Tabs">
          {updatedTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                `group relative flex flex-col items-center justify-center py-2 px-1 font-medium text-xs whitespace-nowrap rounded-md transition-all duration-200 ease-in-out ` +
                (activeTab === tab.id
                  ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700/50')
              }
            >
              <span className={`mb-1 transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-center">{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>
        {/* Versión móvil con scroll horizontal */}
        <nav className="md:hidden flex space-x-1 overflow-x-auto scrollbar-hide" aria-label="Tabs">
          {updatedTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                `group relative flex items-center py-2 px-4 font-medium text-sm whitespace-nowrap rounded-md transition-all duration-200 ease-in-out ` +
                (activeTab === tab.id
                  ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700/50')
              }
            >
              <span className={`mr-2 transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {updatedTabs.find((tab) => tab.id === activeTab)?.content}
      </div>

    
    </div>
  );
} 