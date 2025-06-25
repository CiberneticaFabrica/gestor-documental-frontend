"use client";

import React, { useState } from 'react';
import {
  Cog,
  Save,
  RefreshCw,
  Bell,
  Shield,
  Users,
  Clock,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface WorkflowSettings {
  autoStart: boolean;
  maxConcurrentWorkflows: number;
  timeoutMinutes: number;
  notifications: {
    email: boolean;
    push: boolean;
    slack: boolean;
  };
  security: {
    requireApproval: boolean;
    auditLog: boolean;
    encryption: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cacheTTL: number;
    backgroundProcessing: boolean;
  };
}

const defaultSettings: WorkflowSettings = {
  autoStart: true,
  maxConcurrentWorkflows: 10,
  timeoutMinutes: 30,
  notifications: {
    email: true,
    push: false,
    slack: true,
  },
  security: {
    requireApproval: true,
    auditLog: true,
    encryption: false,
  },
  performance: {
    cacheEnabled: true,
    cacheTTL: 300,
    backgroundProcessing: true,
  },
};

export default function WorkflowSettingsPage() {
  const [settings, setSettings] = useState<WorkflowSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (section: keyof WorkflowSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, any>),
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Cog className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración de Flujos</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona la configuración del sistema de flujos de trabajo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Restablecer
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Configuración General */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración General</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Inicio Automático</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Los flujos se inician automáticamente cuando se cumplen las condiciones</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoStart}
                    onChange={(e) => handleSettingChange('autoStart', '', e.target.checked)}
                    className="sr-only peer"
                    title="Habilitar inicio automático de flujos"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Máximo de Flujos Concurrentes
                  </label>
                  <input
                    type="number"
                    value={settings.maxConcurrentWorkflows}
                    onChange={(e) => handleSettingChange('maxConcurrentWorkflows', '', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="1"
                    max="50"
                    title="Número máximo de flujos concurrentes"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Número máximo de flujos que pueden ejecutarse simultáneamente</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Tiempo de Espera (minutos)
                  </label>
                  <input
                    type="number"
                    value={settings.timeoutMinutes}
                    onChange={(e) => handleSettingChange('timeoutMinutes', '', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="5"
                    max="1440"
                    title="Tiempo de espera en minutos"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tiempo máximo de espera antes de marcar como fallido</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notificaciones</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notificaciones por Email</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Recibir notificaciones por correo electrónico</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    className="sr-only peer"
                    title="Habilitar notificaciones por email"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notificaciones Push</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Recibir notificaciones push en el navegador</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    className="sr-only peer"
                    title="Habilitar notificaciones push"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notificaciones Slack</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enviar notificaciones a canales de Slack</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.slack}
                    onChange={(e) => handleSettingChange('notifications', 'slack', e.target.checked)}
                    className="sr-only peer"
                    title="Habilitar notificaciones Slack"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Seguridad</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Requerir Aprobación</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Los flujos críticos requieren aprobación manual</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.requireApproval}
                    onChange={(e) => handleSettingChange('security', 'requireApproval', e.target.checked)}
                    className="sr-only peer"
                    title="Requerir aprobación manual para flujos críticos"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Registro de Auditoría</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mantener un registro completo de todas las acciones</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.auditLog}
                    onChange={(e) => handleSettingChange('security', 'auditLog', e.target.checked)}
                    className="sr-only peer"
                    title="Habilitar registro de auditoría"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Encriptación de Datos</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Encriptar datos sensibles en reposo y en tránsito</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.encryption}
                    onChange={(e) => handleSettingChange('security', 'encryption', e.target.checked)}
                    className="sr-only peer"
                    title="Habilitar encriptación de datos"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Rendimiento */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Rendimiento</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Habilitar Caché</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Usar caché para mejorar el rendimiento</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.performance.cacheEnabled}
                    onChange={(e) => handleSettingChange('performance', 'cacheEnabled', e.target.checked)}
                    className="sr-only peer"
                    title="Habilitar caché para mejorar rendimiento"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    TTL del Caché (segundos)
                  </label>
                  <input
                    type="number"
                    value={settings.performance.cacheTTL}
                    onChange={(e) => handleSettingChange('performance', 'cacheTTL', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="60"
                    max="3600"
                    title="Tiempo de vida del caché en segundos"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tiempo de vida del caché en segundos</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Procesamiento en Segundo Plano</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ejecutar tareas pesadas en segundo plano</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.performance.backgroundProcessing}
                      onChange={(e) => handleSettingChange('performance', 'backgroundProcessing', e.target.checked)}
                      className="sr-only peer"
                      title="Habilitar procesamiento en segundo plano"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 