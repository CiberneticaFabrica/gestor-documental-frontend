'use client';

import { useState } from 'react';
import {
  BarChart3,
  Users,
  Activity,
  Database,
  Shield,
  FileClock,
  FileSearch,
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const tabs: Tab[] = [
  {
    id: 'overview',
    label: 'Vista General',
    icon: <BarChart3 className="h-5 w-5" />,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Documentos Procesados</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-500 mt-2">1,234</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Últimas 24h</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tasa de Éxito</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">98.5%</p>
            <p className="text-sm text-gray-500 mt-1">Procesamiento exitoso</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tiempo Medio</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">45s</p>
            <p className="text-sm text-gray-500 mt-1">Por documento</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Colas Pendientes</h3>
            <p className="text-3xl font-bold text-purple-500 mt-2">23</p>
            <p className="text-sm text-gray-500 mt-1">En procesamiento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Estado del Sistema</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">UploadProcessor</span>
                <span className="text-green-500">Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">TextractCallback</span>
                <span className="text-green-500">Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">SQS Queue</span>
                <span className="text-yellow-500">23 mensajes</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Uso de Recursos</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">CPU</span>
                <span className="text-blue-500">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Memoria</span>
                <span className="text-blue-500">2.3GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Almacenamiento</span>
                <span className="text-blue-500">156GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'extraction',
    label: 'Extracción y Clasificación',
    icon: <FileSearch className="h-5 w-5" />,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Precisión de Clasificación</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">96.8%</p>
            <p className="text-sm text-gray-500 mt-1">Documentos correctamente clasificados</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Confianza Promedio</h3>
            <p className="text-3xl font-bold text-blue-500 mt-2">92.5%</p>
            <p className="text-sm text-gray-500 mt-1">Por tipo de documento</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Revisiones Manuales</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">3.2%</p>
            <p className="text-sm text-gray-500 mt-1">Documentos que requieren revisión</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Calidad de Extracción</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Tasa de Completitud</span>
                <span className="text-green-500">98.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Puntuación de Confianza</span>
                <span className="text-blue-500">94.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Errores Comunes</span>
                <span className="text-yellow-500">1.5%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Errores por Tipo</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Formato Inválido</span>
                <span className="text-red-500">0.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Datos Incompletos</span>
                <span className="text-red-500">0.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Calidad de Imagen</span>
                <span className="text-red-500">0.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'clients',
    label: 'Vista 360° Clientes',
    icon: <Users className="h-5 w-5" />,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Completitud Promedio</h3>
            <p className="text-3xl font-bold text-blue-500 mt-2">87.5%</p>
            <p className="text-sm text-gray-500 mt-1">Documentación completa</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Clientes Críticos</h3>
            <p className="text-3xl font-bold text-red-500 mt-2">12</p>
            <p className="text-sm text-gray-500 mt-1">Documentación incompleta</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Alertas Activas</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">8</p>
            <p className="text-sm text-gray-500 mt-1">Incumplimientos regulatorios</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribución por Completitud</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">0-25%</span>
                <span className="text-red-500">5 clientes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">25-50%</span>
                <span className="text-yellow-500">7 clientes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">50-75%</span>
                <span className="text-blue-500">15 clientes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">75-100%</span>
                <span className="text-green-500">73 clientes</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Documentos Críticos Pendientes</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">KYC</span>
                <span className="text-red-500">3 clientes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Compliance</span>
                <span className="text-red-500">5 clientes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Legal</span>
                <span className="text-red-500">4 clientes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'expiring',
    label: 'Documentos por Vencer',
    icon: <FileClock className="h-5 w-5" />,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vencen en 5 días</h3>
            <p className="text-3xl font-bold text-red-500 mt-2">15</p>
            <p className="text-sm text-gray-500 mt-1">Documentos críticos</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vencen en 15 días</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">28</p>
            <p className="text-sm text-gray-500 mt-1">Documentos pendientes</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vencen en 30 días</h3>
            <p className="text-3xl font-bold text-blue-500 mt-2">45</p>
            <p className="text-sm text-gray-500 mt-1">Documentos por renovar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Renovaciones</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Tasa de Renovación</span>
                <span className="text-green-500">92.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Tiempo Promedio</span>
                <span className="text-blue-500">3.2 días</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Sin Respuesta</span>
                <span className="text-red-500">7.5%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribución por Tipo</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">KYC</span>
                <span className="text-blue-500">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Compliance</span>
                <span className="text-blue-500">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Legal</span>
                <span className="text-blue-500">40%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'performance',
    label: 'Rendimiento',
    icon: <Activity className="h-5 w-5" />,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tiempo Promedio</h3>
            <p className="text-3xl font-bold text-blue-500 mt-2">45s</p>
            <p className="text-sm text-gray-500 mt-1">Por documento</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Uso de Recursos</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">65%</p>
            <p className="text-sm text-gray-500 mt-1">Eficiencia del sistema</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Coste AWS</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">$234</p>
            <p className="text-sm text-gray-500 mt-1">Este mes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tiempos por Etapa</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Carga</span>
                <span className="text-blue-500">5s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Extracción</span>
                <span className="text-blue-500">25s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Clasificación</span>
                <span className="text-blue-500">15s</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Costes por Servicio</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Textract</span>
                <span className="text-blue-500">$120</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">S3</span>
                <span className="text-blue-500">$45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Lambda</span>
                <span className="text-blue-500">$69</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'audit',
    label: 'Auditoría',
    icon: <Shield className="h-5 w-5" />,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Operaciones</h3>
            <p className="text-3xl font-bold text-blue-500 mt-2">1,234</p>
            <p className="text-sm text-gray-500 mt-1">Últimas 24h</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Revisiones Manuales</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">45</p>
            <p className="text-sm text-gray-500 mt-1">Pendientes</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Errores Críticos</h3>
            <p className="text-3xl font-bold text-red-500 mt-2">3</p>
            <p className="text-sm text-gray-500 mt-1">Requieren atención</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Últimas Operaciones</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Usuario: admin</span>
                <span className="text-blue-500">Hace 5m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Usuario: system</span>
                <span className="text-blue-500">Hace 15m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Usuario: auditor</span>
                <span className="text-blue-500">Hace 30m</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revisiones Manuales</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Tiempo Promedio</span>
                <span className="text-blue-500">15m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Pendientes</span>
                <span className="text-yellow-500">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Completadas</span>
                <span className="text-green-500">33</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'integration',
    label: 'Integración',
    icon: <Database className="h-5 w-5" />,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Solicitudes API</h3>
            <p className="text-3xl font-bold text-blue-500 mt-2">2,345</p>
            <p className="text-sm text-gray-500 mt-1">Últimas 24h</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tasa de Éxito</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">99.8%</p>
            <p className="text-sm text-gray-500 mt-1">Integraciones exitosas</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tiempo Respuesta</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">120ms</p>
            <p className="text-sm text-gray-500 mt-1">Promedio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Estado de Sincronización</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Core Banking</span>
                <span className="text-green-500">Sincronizado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">CRM</span>
                <span className="text-green-500">Sincronizado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Compliance</span>
                <span className="text-yellow-500">Pendiente</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Últimas Actualizaciones</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Core Banking</span>
                <span className="text-blue-500">Hace 5m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">CRM</span>
                <span className="text-blue-500">Hace 15m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Compliance</span>
                <span className="text-blue-500">Hace 30m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export function MetricTabs() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-gray-200 dark:border-gray-700 shadow">
        <nav className="hidden md:grid md:grid-cols-7 gap-1" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex flex-col items-center justify-center py-2 px-1 font-medium text-xs whitespace-nowrap rounded-md transition-all duration-200 ease-in-out
                ${
                  activeTab === tab.id
                    ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
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
        {/* Versión móvil con scroll horizontal */}
        <nav className="md:hidden flex space-x-1 overflow-x-auto scrollbar-hide" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex items-center py-2 px-4 font-medium text-sm whitespace-nowrap rounded-md transition-all duration-200 ease-in-out
                ${
                  activeTab === tab.id
                    ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
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

      <div className="mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
} 