'use client';

import { useState } from 'react';
import {
  UserCircle,
  FileText,
  ShieldCheck,
  Activity,
  Settings2,
} from 'lucide-react';
import { UserGeneralInfoTab } from './tabs/UserGeneralInfoTab';
import { UserDocumentsTab } from './tabs/UserDocumentsTab';
import { UserRiskAnalysisTab } from './tabs/UserRiskAnalysisTab';
import { UserDocumentActivityTab } from './tabs/UserDocumentActivityTab';
import { UserManagementActionsTab } from './tabs/UserManagementActionsTab';

const TABS = [
  { id: 0, label: 'Información General', icon: <UserCircle className="h-5 w-5" /> },
  { id: 1, label: 'Documentación', icon: <FileText className="h-5 w-5" /> },
  { id: 2, label: 'Análisis de Riesgo', icon: <ShieldCheck className="h-5 w-5" /> },
  { id: 3, label: 'Actividad Documental', icon: <Activity className="h-5 w-5" /> },
  { id: 4, label: 'Gestión y Acciones', icon: <Settings2 className="h-5 w-5" /> },
];

export function User360View() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6">
      {/* Tabs estilo metric-tabs */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-1">
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
      <div className="bg-white dark:bg-gray-900 rounded-xl p-0 md:p-6 shadow min-h-[350px]">
        {activeTab === 0 && <UserGeneralInfoTab />}
        {activeTab === 1 && <UserDocumentsTab />}
        {activeTab === 2 && <UserRiskAnalysisTab />}
        {activeTab === 3 && <UserDocumentActivityTab />}
        {activeTab === 4 && <UserManagementActionsTab />}
      </div>
    </div>
  );
} 