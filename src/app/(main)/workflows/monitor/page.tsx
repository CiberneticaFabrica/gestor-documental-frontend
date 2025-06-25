"use client";

import React, { useState, useEffect } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Users,
  Workflow,
  BarChart3,
  Calendar,
  Filter,
} from 'lucide-react';

interface WorkflowInstance {
  id: string;
  workflow_name: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  current_step: string;
  progress: number;
  started_at: string;
  estimated_completion: string;
  participants: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const mockInstances: WorkflowInstance[] = [
  {
    id: '1',
    workflow_name: 'Aprobación de Contratos',
    status: 'running',
    current_step: 'Revisión Legal',
    progress: 65,
    started_at: '2024-01-20T10:30:00',
    estimated_completion: '2024-01-22T16:00:00',
    participants: ['Juan Pérez', 'María García', 'Carlos López'],
    priority: 'high',
  },
  {
    id: '2',
    workflow_name: 'Revisión de Documentos',
    status: 'paused',
    current_step: 'Validación Técnica',
    progress: 45,
    started_at: '2024-01-19T14:15:00',
    estimated_completion: '2024-01-21T12:00:00',
    participants: ['Ana Rodríguez', 'Luis Martínez'],
    priority: 'medium',
  },
  {
    id: '3',
    workflow_name: 'Onboarding de Clientes',
    status: 'completed',
    current_step: 'Finalizado',
    progress: 100,
    started_at: '2024-01-15T09:00:00',
    estimated_completion: '2024-01-18T17:00:00',
    participants: ['Sofia Torres', 'Miguel Herrera', 'Elena Vargas'],
    priority: 'low',
  },
  {
    id: '4',
    workflow_name: 'Auditoría Interna',
    status: 'failed',
    current_step: 'Verificación Final',
    progress: 85,
    started_at: '2024-01-18T11:45:00',
    estimated_completion: '2024-01-20T15:30:00',
    participants: ['Roberto Silva', 'Carmen Ruiz'],
    priority: 'urgent',
  },
];

export default function WorkflowMonitorPage() {
  const [instances, setInstances] = useState<WorkflowInstance[]>(mockInstances);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'paused':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredInstances = instances.filter(instance => {
    const matchesStatus = statusFilter === 'all' || instance.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || instance.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const getTimeRemaining = (estimatedCompletion: string) => {
    const endTime = new Date(estimatedCompletion);
    const timeDiff = endTime.getTime() - currentTime.getTime();
    
    if (timeDiff <= 0) return 'Vencido';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const stats = {
    total: instances.length,
    running: instances.filter(i => i.status === 'running').length,
    completed: instances.filter(i => i.status === 'completed').length,
    failed: instances.filter(i => i.status === 'failed').length,
    paused: instances.filter(i => i.status === 'paused').length,
    averageProgress: Math.round(instances.reduce((acc, i) => acc + i.progress, 0) / instances.length),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monitor de Flujos</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monitoreo en tiempo real de procesos activos</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Última actualización</p>
              <p className="text-lg font-mono text-gray-900 dark:text-white">
                {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas en tiempo real */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <BarChart3 className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ejecutándose</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.running}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completados</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.completed}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fallidos</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failed}</p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pausados</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.paused}</p>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progreso Prom.</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.averageProgress}%</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                title="Filtrar por estado"
              >
                <option value="all">Todos los estados</option>
                <option value="running">Ejecutándose</option>
                <option value="completed">Completados</option>
                <option value="failed">Fallidos</option>
                <option value="paused">Pausados</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                title="Filtrar por prioridad"
              >
                <option value="all">Todas las prioridades</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Más filtros
            </button>
          </div>
        </div>

        {/* Lista de instancias */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Instancias Activas</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredInstances.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No hay instancias activas</h3>
                <p className="text-gray-500 dark:text-gray-400">No se encontraron flujos que coincidan con los filtros</p>
              </div>
            ) : (
              filteredInstances.map((instance) => (
                <div key={instance.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{instance.workflow_name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(instance.status)}`}>
                          {instance.status === 'running' && 'Ejecutándose'}
                          {instance.status === 'completed' && 'Completado'}
                          {instance.status === 'failed' && 'Fallido'}
                          {instance.status === 'paused' && 'Pausado'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(instance.priority)}`}>
                          {instance.priority === 'urgent' && 'Urgente'}
                          {instance.priority === 'high' && 'Alta'}
                          {instance.priority === 'medium' && 'Media'}
                          {instance.priority === 'low' && 'Baja'}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Paso actual: {instance.current_step}</span>
                          <span>{instance.progress}% completado</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              instance.status === 'completed' ? 'bg-green-500' :
                              instance.status === 'failed' ? 'bg-red-500' :
                              instance.status === 'paused' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${instance.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{instance.participants.length} participantes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Iniciado: {new Date(instance.started_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Restante: {getTimeRemaining(instance.estimated_completion)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 