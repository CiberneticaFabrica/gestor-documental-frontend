"use client";

import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  Flag,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: string;
  workflow_name: string;
  due_date: string;
  created_at: string;
  estimated_hours: number;
  actual_hours?: number;
  tags: string[];
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Revisar contrato de cliente ABC',
    description: 'Revisar y validar los términos del contrato comercial para el cliente ABC Corp.',
    status: 'in_progress',
    priority: 'high',
    assigned_to: 'Juan Pérez',
    workflow_name: 'Aprobación de Contratos',
    due_date: '2024-01-25',
    created_at: '2024-01-20',
    estimated_hours: 4,
    actual_hours: 2.5,
    tags: ['contratos', 'legal', 'revisión'],
  },
  {
    id: '2',
    title: 'Validar documentación técnica',
    description: 'Verificar la documentación técnica del proyecto de infraestructura.',
    status: 'pending',
    priority: 'medium',
    assigned_to: 'María García',
    workflow_name: 'Revisión de Documentos',
    due_date: '2024-01-28',
    created_at: '2024-01-22',
    estimated_hours: 6,
    tags: ['técnico', 'validación', 'documentación'],
  },
  {
    id: '3',
    title: 'Completar onboarding de nuevo cliente',
    description: 'Finalizar el proceso de incorporación del cliente XYZ Industries.',
    status: 'completed',
    priority: 'high',
    assigned_to: 'Carlos López',
    workflow_name: 'Onboarding de Clientes',
    due_date: '2024-01-20',
    created_at: '2024-01-15',
    estimated_hours: 8,
    actual_hours: 7.5,
    tags: ['onboarding', 'cliente', 'finalizado'],
  },
  {
    id: '4',
    title: 'Auditoría de seguridad del sistema',
    description: 'Realizar auditoría completa de seguridad del sistema de gestión.',
    status: 'overdue',
    priority: 'urgent',
    assigned_to: 'Ana Rodríguez',
    workflow_name: 'Auditoría Interna',
    due_date: '2024-01-18',
    created_at: '2024-01-10',
    estimated_hours: 12,
    actual_hours: 10,
    tags: ['auditoría', 'seguridad', 'urgente'],
  },
  {
    id: '5',
    title: 'Actualizar políticas de la empresa',
    description: 'Revisar y actualizar las políticas internas de la organización.',
    status: 'pending',
    priority: 'low',
    assigned_to: 'Luis Martínez',
    workflow_name: 'Gestión de Políticas',
    due_date: '2024-02-01',
    created_at: '2024-01-23',
    estimated_hours: 3,
    tags: ['políticas', 'actualización'],
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.workflow_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssigned = assignedFilter === 'all' || task.assigned_to === assignedFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
  });

  const getUniqueAssignees = () => {
    return Array.from(new Set(tasks.map(task => task.assigned_to)));
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <ClipboardList className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Tareas</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona y organiza tus tareas asignadas</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Tarea
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <ClipboardList className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.pending}</p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Clock className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Progreso</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completadas</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vencidas</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                title="Filtrar por estado"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completadas</option>
                <option value="overdue">Vencidas</option>
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
              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                title="Filtrar por asignado"
              >
                <option value="all">Todos los asignados</option>
                {getUniqueAssignees().map(assignee => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de tareas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tareas</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTasks.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron tareas</h3>
                <p className="text-gray-500 dark:text-gray-400">No hay tareas que coincidan con los filtros aplicados</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{task.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                          {task.status === 'pending' && 'Pendiente'}
                          {task.status === 'in_progress' && 'En Progreso'}
                          {task.status === 'completed' && 'Completada'}
                          {task.status === 'overdue' && 'Vencida'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'urgent' && 'Urgente'}
                          {task.priority === 'high' && 'Alta'}
                          {task.priority === 'medium' && 'Media'}
                          {task.priority === 'low' && 'Baja'}
                        </span>
                        {isOverdue(task.due_date) && task.status !== 'completed' && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full border bg-red-100 text-red-800 border-red-200">
                            Vencida
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{task.assigned_to}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClipboardList className="h-4 w-4" />
                          <span>{task.workflow_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Vence: {new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{task.estimated_hours}h estimadas</span>
                          {task.actual_hours && (
                            <span className="text-gray-400">• {task.actual_hours}h reales</span>
                          )}
                        </div>
                      </div>

                      {task.tags.length > 0 && (
                        <div className="flex items-center gap-2">
                          {task.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Más opciones">
                        <MoreVertical className="h-4 w-4" />
                      </button>
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