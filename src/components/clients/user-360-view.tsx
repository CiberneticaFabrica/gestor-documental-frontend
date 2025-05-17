'use client';

import { useState } from 'react';
import {
  UserCircle,
  FileText,
  ShieldCheck,
  Activity,
  Settings2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Globe,
  AlertCircle,
  CheckCircle,
  XCircle,
  Briefcase,
  CalendarCheck,
  UserCheck,
  ClipboardList,
  BarChart2,
  MessageSquare,
  Link2,
} from 'lucide-react';
import { UserGeneralInfoTab } from './tabs/UserGeneralInfoTab';
import { UserDocumentsTab } from './tabs/UserDocumentsTab';
import { UserRiskAnalysisTab } from './tabs/UserRiskAnalysisTab';
import { UserDocumentActivityTab } from './tabs/UserDocumentActivityTab';
import { UserManagementActionsTab } from './tabs/UserManagementActionsTab';
import { type ClientDetailResponse } from '@/lib/api/services/client.service';

const TABS = [
  { id: 0, label: 'Información General', icon: <UserCircle className="h-5 w-5" /> },
  { id: 1, label: 'Documentación', icon: <FileText className="h-5 w-5" /> },
  { id: 2, label: 'Análisis de Riesgo', icon: <ShieldCheck className="h-5 w-5" /> },
  { id: 3, label: 'Actividad Documental', icon: <Activity className="h-5 w-5" /> },
  { id: 4, label: 'Gestión y Acciones', icon: <Settings2 className="h-5 w-5" /> },
];

interface User360ViewProps {
  clientData: ClientDetailResponse;
}

export function User360View({ clientData }: User360ViewProps) {
  const { cliente, estadisticas, actividad_reciente, vista_cache } = clientData;
  const [activeTab, setActiveTab] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo':
        return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400';
      case 'inactivo':
        return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'bajo':
        return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'alto':
        return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">

        {/* Tabs */}
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-gray-200 dark:border-gray-700 shadow">
        {/* Desktop grid */}
        <nav className="hidden md:grid md:grid-cols-5 gap-1" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex flex-col items-center justify-center py-2 px-1 font-medium text-xs whitespace-nowrap rounded-md transition-all duration-200 ease-in-out
                ${
                  activeTab === tab.id
                    ? 'bg-blue-500/10 text-blue-500 shadow-sm'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                }
              `}
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
        {/* Mobile scroll */}
        <nav className="md:hidden flex space-x-1 overflow-x-auto scrollbar-hide" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex items-center py-2 px-4 font-medium text-sm whitespace-nowrap rounded-md transition-all duration-200 ease-in-out
                ${
                  activeTab === tab.id
                    ? 'bg-blue-500/10 text-blue-500 shadow-sm'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                }
              `}
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

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-0   shadow min-h-[350px]">
        {activeTab === 0 && <UserGeneralInfoTab clientData={clientData} />}
        {activeTab === 1 && <UserDocumentsTab />}
        {activeTab === 2 && <UserRiskAnalysisTab />}
        {activeTab === 3 && <UserDocumentActivityTab />}
        {activeTab === 4 && <UserManagementActionsTab />}
      </div>
 

    </div>
  );
} 