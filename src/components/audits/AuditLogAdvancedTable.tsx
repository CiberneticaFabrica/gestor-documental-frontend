import React, { useState, useMemo, useEffect } from 'react'; 
import { 
  Search, 
  Download, 
  Filter, 
  MoreVertical, 
  Calendar,
  User,
  Activity,
  Database,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Settings,
  FileText,
  Clock,
  Shield
} from 'lucide-react';
 
import { userService, User as AppUser } from '@/services/common/userService';

// Tipos de datos simulados para el ejemplo
interface AuditLog {
  id_registro: string;
  fecha_hora: string;
  nombre_usuario: string;
  accion: string;
  entidad_afectada: string;
  resultado: 'Exitoso' | 'Fallido' | 'Pendiente';
  ip_address?: string;
  detalles?: string;
  nivel_riesgo?: 'Alto' | 'Medio' | 'Bajo';
  direccion_ip?: string;
}

interface AuditLogAdvancedTableProps {
  logs: AuditLog[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRowClick?: (log: AuditLog) => void;
  onExport: (format: 'csv' | 'excel') => void;
  onSort: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  filters: any;
  onFilterChange: (filters: any) => void;
}

// Datos de ejemplo para demostración
 
export const AuditLogAdvancedTable: React.FC<AuditLogAdvancedTableProps> = ({ 
  loading = false,
  page = 1,
  totalPages = 10,
  onPageChange = () => {},
  onRowClick = () => {},
  onExport = () => {},
  onSort = () => {},
  sortColumn = '',
  sortDirection = 'asc',
  filters = {},
  onFilterChange = () => {},
  logs
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [users, setUsers] = useState<AppUser[]>([]);

  useEffect(() => {
    // Cargar la lista de usuarios reales
    const fetchUsers = async () => {
      try {
        const res = await userService.getUsers?.();
        if (Array.isArray(res)) setUsers(res);
      } catch (e) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // Función para obtener el icono según el resultado
  const getResultIcon = (resultado: string) => {
    switch (resultado) {
      case 'Exitoso':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Fallido':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Pendiente':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  // Función para obtener el color según el nivel de riesgo
  const getRiskColor = (nivel: string) => {
    switch (nivel) {
      case 'Alto':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Bajo':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener el icono de ordenamiento
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-600" />
      : <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  // Toggle selección de filas
  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  // Seleccionar/deseleccionar todas las filas
  const toggleAllRows = () => {
    setSelectedRows(prev => 
      prev.length === logs.length ? [] : logs.map(log => log.id_registro)
    );
  };

  // Estadísticas rápidas
  const stats = useMemo(() => {
    const total = logs.length;
    const exitosos = logs.filter(log => log.resultado === 'Exitoso').length;
    const fallidos = logs.filter(log => log.resultado === 'Fallido').length;
    const pendientes = logs.filter(log => log.resultado === 'Pendiente').length;
    
    return { total, exitosos, fallidos, pendientes };
  }, [logs]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header con estadísticas */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Registro de Auditoría
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitoreo y seguimiento de actividades del sistema
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {viewMode === 'table' ? 'Vista Tarjeta' : 'Vista Tabla'}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Exitosos</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.exitosos}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">Fallidos</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.fallidos}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.pendientes}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Barra de herramientas */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar en registros de auditoría..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                value={filters.search || ''}
                onChange={e => onFilterChange({ ...filters, search: e.target.value })}
              />
            </div>
            {selectedRows.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg text-sm font-medium text-blue-700 dark:text-blue-300">
                {selectedRows.length} seleccionado{selectedRows.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onExport('csv')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={() => onExport('excel')}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
            <button
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Configuración"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Panel de filtros expandible */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="fecha-desde" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha desde
                </label>
                <input
                  id="fecha-desde"
                  type="date"
                  title="Selecciona la fecha desde"
                  placeholder="Fecha desde"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Usuario
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  title="Filtrar por usuario"
                  value={filters.usuario_id || ''}
                  onChange={e => onFilterChange({ ...filters, usuario_id: e.target.value })}
                >
                  <option value="">Todos los usuarios</option>
                  {users.map(user => (
                    <option key={user.id_usuario} value={user.id_usuario}>
                      {user.email || user.nombre_usuario || user.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resultado
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  title="Filtrar por resultado"
                >
                  <option value="">Todos</option>
                  <option value="Exitoso">Exitoso</option>
                  <option value="Fallido">Fallido</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>
              <div>
                <label htmlFor="fecha-hasta" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha hasta
                </label>
                <input
                  id="fecha-hasta"
                  type="date"
                  title="Selecciona la fecha hasta"
                  placeholder="Fecha hasta"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando registros...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No se encontraron registros
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No hay registros de auditoría que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          /* Vista de tabla */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      title="Seleccionar todos"
                      checked={selectedRows.length === logs.length}
                      onChange={toggleAllRows}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => onSort('fecha_hora', sortColumn === 'fecha_hora' && sortDirection === 'asc' ? 'desc' : 'asc')}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Fecha y Hora
                      {getSortIcon('fecha_hora')}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => onSort('usuario', sortColumn === 'usuario' && sortDirection === 'asc' ? 'desc' : 'asc')}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Usuario
                      {getSortIcon('usuario')}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Acción
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Entidad
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Resultado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Riesgo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Detalles</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">IP</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr 
                    key={log.id_registro} 
                    className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                      selectedRows.includes(log.id_registro) ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        title="Seleccionar fila"
                        checked={selectedRows.includes(log.id_registro)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleRowSelection(log.id_registro);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(log.fecha_hora).toLocaleDateString('es-ES')}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {new Date(log.fecha_hora).toLocaleTimeString('es-ES')}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {log.nombre_usuario ? log.nombre_usuario.split('@')[0] : ''}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          {log.direccion_ip || log.ip_address || ''}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {log.accion}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">{log.entidad_afectada}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getResultIcon(log.resultado)}
                        <span className="text-sm font-medium">{log.resultado}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(log.nivel_riesgo || 'Bajo')}`}>
                        {log.nivel_riesgo || 'Bajo'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-700 dark:text-gray-300 max-w-xs truncate">
                      {typeof log.detalles === 'string' ? log.detalles : JSON.stringify(log.detalles)}
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-700 dark:text-gray-300">
                      {log.direccion_ip || log.ip_address || ''}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Más acciones"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Vista de tarjetas */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logs.map((log) => (
              <div
                key={log.id_registro}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getResultIcon(log.resultado)}
                    <span className="text-sm font-medium">{log.resultado}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(log.nivel_riesgo || 'Bajo')}`}>
                    {log.nivel_riesgo || 'Bajo'}
                  </span>
                </div>
                
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">{log.accion}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{log.entidad_afectada}</p>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {log.nombre_usuario.split('@')[0]}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {new Date(log.fecha_hora).toLocaleString('es-ES')}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginación mejorada */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando registros del {((page - 1) * 10) + 1} al {Math.min(page * 10, logs.length * totalPages)} de {logs.length * totalPages} total
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(1)}
              disabled={page <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Primera
            </button>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      pageNum === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Última
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};