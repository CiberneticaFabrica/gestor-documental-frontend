"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { workflowService, KycClient } from '@/lib/api/services/workflow.service';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Download,
  RefreshCw,
  MoreVertical,
  User,
  Building,
  Calendar,
  Eye,
  Edit,
  ChevronDown,
  ArrowUpDown,
  Grid3X3,
  List,
  FileText,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface FilterState {
  search: string;
  riesgo: string;
  prioridad: string;
  estado: string;
  tipoCliente: string;
}

type ViewMode = 'table' | 'cards';
type SortField = 'nombre' | 'riesgo' | 'prioridad' | 'completitud' | 'fecha';
type SortOrder = 'asc' | 'desc';

const RISK_COLORS = {
  alto: 'destructive',
  medio: 'secondary', 
  bajo: 'default'
} as const;

const PRIORITY_COLORS = {
  alta: 'destructive',
  media: 'secondary',
  baja: 'default'  
} as const;

const STATUS_ICONS = {
  pendiente: Clock,
  en_revision: AlertTriangle,
  completado: CheckCircle,
  rechazado: AlertTriangle
};

const STATUS_COLORS = {
  pendiente: 'text-yellow-600 bg-yellow-50',
  en_revision: 'text-orange-600 bg-orange-50',
  completado: 'text-green-600 bg-green-50',
  rechazado: 'text-red-600 bg-red-50'
};

export default function KycClientsPage() {
  const [clients, setClients] = useState<KycClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortField, setSortField] = useState<SortField>('nombre');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  const [pageSize] = useState(50); // Aumentar el tamaño de página para mostrar más clientes
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    riesgo: 'todos',
    prioridad: 'todos', 
    estado: 'todos',
    tipoCliente: 'todos'
  });

  const fetchClients = async (showRefreshLoader = false, page = 1) => {
    if (showRefreshLoader) setRefreshing(true);
    else setLoading(true);
    
    setError(null);
    try {
      const data = await workflowService.getKycClients({
        page: page,
        limit: pageSize
      });
      setClients(data.clientes);
      setTotalClients(data.pagination.total);
      setTotalPages(data.pagination.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Error al cargar los clientes KYC. Intente nuevamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filtrado y búsqueda
  const filteredClients = useMemo(() => {
    let filtered = clients.filter(client => {
      const matchesSearch = client.nombre_razon_social.toLowerCase().includes(filters.search.toLowerCase()) ||
                           client.codigo_cliente.toLowerCase().includes(filters.search.toLowerCase()) ||
                           client.gestor_principal_nombre.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesRisk = filters.riesgo === 'todos' || client.nivel_riesgo === filters.riesgo;
      const matchesPriority = filters.prioridad === 'todos' || client.prioridad === filters.prioridad;
      const matchesStatus = filters.estado === 'todos' || client.estado_documental === filters.estado;
      const matchesType = filters.tipoCliente === 'todos' || client.tipo_cliente === filters.tipoCliente;

      return matchesSearch && matchesRisk && matchesPriority && matchesStatus && matchesType;
    });

    // Ordenamiento
    return filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'nombre':
          aValue = a.nombre_razon_social.toLowerCase();
          bValue = b.nombre_razon_social.toLowerCase();
          break;
        case 'riesgo':
          const riskOrder = { alto: 3, medio: 2, bajo: 1 };
          aValue = riskOrder[a.nivel_riesgo as keyof typeof riskOrder] || 0;
          bValue = riskOrder[b.nivel_riesgo as keyof typeof riskOrder] || 0;
          break;
        case 'prioridad':
          const priorityOrder = { alta: 3, media: 2, baja: 1 };
          aValue = priorityOrder[a.prioridad as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.prioridad as keyof typeof priorityOrder] || 0;
          break;
        case 'completitud':
          aValue = getCompletitudLimitada(a.porcentaje_completitud);
          bValue = getCompletitudLimitada(b.porcentaje_completitud);
          break;
        default:
          aValue = a.nombre_razon_social.toLowerCase();
          bValue = b.nombre_razon_social.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [clients, filters, sortField, sortOrder]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = totalClients; // Usar el total real de clientes
    const altoRiesgo = clients.filter(c => c.nivel_riesgo === 'alto').length;
    const altaPrioridad = clients.filter(c => c.prioridad === 'alta').length;
    const completados = clients.filter(c => c.estado_documental === 'completado').length;
    const enRevision = clients.filter(c => c.estado_documental === 'en_revision').length;
    const promedioCompletitud = clients.length > 0 
      ? Math.round(clients.reduce((sum, c) => sum + Math.min(Number(c.porcentaje_completitud), 100), 0) / clients.length)
      : 0;

    return { total, altoRiesgo, altaPrioridad, completados, enRevision, promedioCompletitud };
  }, [clients, totalClients]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      riesgo: 'todos',
      prioridad: 'todos',
      estado: 'todos', 
      tipoCliente: 'todos'
    });
  };

  const handlePageChange = (page: number) => {
    fetchClients(false, page);
  };

  const handleRefresh = () => {
    fetchClients(true, currentPage);
  };

  const getStatusIcon = (estado: string) => {
    const Icon = STATUS_ICONS[estado as keyof typeof STATUS_ICONS] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const formatClientType = (tipo: string) => {
    return tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatStatus = (estado: string) => {
    return estado.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRiskBadgeVariant = (nivel: string) => {
    return RISK_COLORS[nivel as keyof typeof RISK_COLORS] || 'default';
  };

  const getPriorityBadgeVariant = (prioridad: string) => {
    return PRIORITY_COLORS[prioridad as keyof typeof PRIORITY_COLORS] || 'default';
  };

  const getCompletitudLimitada = (completitud: string | number) => {
    return Math.min(Number(completitud), 100);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control KYC</h1>
          <p className="text-gray-600 mt-1">Gestión integral del proceso de conocimiento del cliente</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Clientes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-green-600 mt-1">↗ Activo</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Alto Riesgo</p>
                <p className="text-3xl font-bold text-red-600">{stats.altoRiesgo}</p>
                <p className="text-xs text-gray-500 mt-1">Requiere atención</p>
              </div>
              <div className="p-3 bg-red-50 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">En Revisión</p>
                <p className="text-3xl font-bold text-orange-600">{stats.enRevision}</p>
                <p className="text-xs text-gray-500 mt-1">Pendientes</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completados</p>
                <p className="text-3xl font-bold text-green-600">{stats.completados}</p>
                <p className="text-xs text-green-600 mt-1">✓ Finalizados</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completitud Promedio</p>
                <p className="text-3xl font-bold text-blue-600">{stats.promedioCompletitud}%</p>
                <Progress value={stats.promedioCompletitud} className="mt-2 h-2" />
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Vista */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar clientes, códigos o gestores..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="h-8"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className="h-8"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Select value={filters.riesgo} onValueChange={(value) => handleFilterChange('riesgo', value)}>
                <SelectTrigger className="w-40 border-gray-200">
                  <SelectValue placeholder="Nivel de Riesgo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los riesgos</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="bajo">Bajo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.prioridad} onValueChange={(value) => handleFilterChange('prioridad', value)}>
                <SelectTrigger className="w-40 border-gray-200">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las prioridades</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.estado} onValueChange={(value) => handleFilterChange('estado', value)}>
                <SelectTrigger className="w-40 border-gray-200">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_revision">En Revisión</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.tipoCliente} onValueChange={(value) => handleFilterChange('tipoCliente', value)}>
                <SelectTrigger className="w-40 border-gray-200">
                  <SelectValue placeholder="Tipo Cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="persona_natural">Persona Natural</SelectItem>
                  <SelectItem value="persona_juridica">Persona Jurídica</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters} size="sm" className="border-gray-200">
                <Filter className="w-4 h-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
            
            {Object.values(filters).some(f => f !== 'todos' && f !== '') && (
              <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                Mostrando <span className="font-semibold">{filteredClients.length}</span> de <span className="font-semibold">{totalClients}</span> clientes
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Contenido Principal */}
      {filteredClients.length === 0 && !loading ? (
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron clientes</h3>
            <p className="text-gray-500 mb-4">Intenta ajustar los filtros de búsqueda o cargar más datos</p>
            <Button onClick={clearFilters} variant="outline">
              Limpiar todos los filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === 'table' ? (
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow className="border-gray-200">
                        <TableHead className="w-12 pl-6"></TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('nombre')}
                        >
                          <div className="flex items-center gap-2">
                            Cliente
                            <ArrowUpDown className="w-4 h-4 text-gray-400" />
                          </div>
                        </TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('riesgo')}
                        >
                          <div className="flex items-center gap-2">
                            Riesgo
                            <ArrowUpDown className="w-4 h-4 text-gray-400" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('prioridad')}
                        >
                          <div className="flex items-center gap-2">
                            Prioridad
                            <ArrowUpDown className="w-4 h-4 text-gray-400" />
                          </div>
                        </TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Gestor</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('completitud')}
                        >
                          <div className="flex items-center gap-2">
                            Completitud
                            <ArrowUpDown className="w-4 h-4 text-gray-400" />
                          </div>
                        </TableHead>
                        <TableHead className="w-32">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id_cliente} className="border-gray-100 hover:bg-gray-50/50 transition-colors">
                          <TableCell className="pl-6">
                            {/* <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs font-medium bg-blue-100 text-blue-700">
                                {getInitials(client.nombre_razon_social)}
                              </AvatarFallback>
                            </Avatar> */}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="font-semibold text-gray-900 truncate max-w-xs" title={client.nombre_razon_social}>
                                {client.nombre_razon_social}
                              </div>
                              <div className="text-sm text-gray-500 font-mono">
                                {client.codigo_cliente}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {client.tipo_cliente === 'persona_juridica' ? 
                                <Building className="w-4 h-4 text-blue-500" /> : 
                                <User className="w-4 h-4 text-green-500" />
                              }
                              <span className="text-sm">
                                {formatClientType(client.tipo_cliente)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRiskBadgeVariant(client.nivel_riesgo)} className="font-medium">
                              {client.nivel_riesgo.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getPriorityBadgeVariant(client.prioridad)} className="font-medium">
                              {client.prioridad.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[client.estado_documental as keyof typeof STATUS_COLORS] || 'text-gray-600 bg-gray-50'}`}>
                              {getStatusIcon(client.estado_documental)}
                              {formatStatus(client.estado_documental)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900 font-medium">
                              {client.gestor_principal_nombre}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <Progress 
                                  value={getCompletitudLimitada(client.porcentaje_completitud)} 
                                  className="h-2"
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-700 min-w-[3rem] text-right">
                                {getCompletitudLimitada(client.porcentaje_completitud)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Link href={`/kyc/clients-review/${client.id_cliente}`}>
                                <Button size="sm" variant="default" className="h-8 px-3">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Ver
                                </Button>
                              </Link>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredClients.map(client => (
                <Card key={client.id_cliente} className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-200 group overflow-hidden">
                  <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* <Avatar className="w-10 h-10">
                          <AvatarFallback className="text-sm font-semibold bg-blue-100 text-blue-700">
                            {getInitials(client.nombre_razon_social)}
                          </AvatarFallback>
                        </Avatar> */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {client.tipo_cliente === 'persona_juridica' ? 
                              <Building className="w-4 h-4 text-blue-500" /> : 
                              <User className="w-4 h-4 text-green-500" />
                            }
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {client.codigo_cliente}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-blue-700 transition-colors" 
                              title={client.nombre_razon_social}>
                            {client.nombre_razon_social}
                          </h3>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant={getRiskBadgeVariant(client.nivel_riesgo)} className="text-xs font-medium">
                        Riesgo {client.nivel_riesgo}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(client.prioridad)} className="text-xs font-medium">
                        Prioridad {client.prioridad}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 pb-6">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600">Gestor:</span>
                          <span className="font-medium text-gray-900 truncate">{client.gestor_principal_nombre}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          {getStatusIcon(client.estado_documental)}
                          <span className="text-gray-600">Estado:</span>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[client.estado_documental as keyof typeof STATUS_COLORS] || 'text-gray-600 bg-gray-50'}`}>
                            {formatStatus(client.estado_documental)}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600">Tipo:</span>
                          <span className="font-medium text-gray-900">{formatClientType(client.tipo_cliente)}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Completitud</span>
                          <span className="text-sm font-bold text-gray-900">{getCompletitudLimitada(client.porcentaje_completitud)}%</span>
                        </div>
                        <Progress 
                          value={getCompletitudLimitada(client.porcentaje_completitud)} 
                          className="h-3"
                        />
                        <div className="text-xs text-gray-500">
                          {getCompletitudLimitada(client.porcentaje_completitud) >= 80 ? '✓ Documentación completa' :
                           getCompletitudLimitada(client.porcentaje_completitud) >= 60 ? '⚠ Documentos pendientes' : 
                           '❌ Documentación incompleta'}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link href={`/kyc/clients-review/${client.id_cliente}`} className="flex-1">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-colors">
                            <Eye className="w-4 h-4 mr-2" />
                            Verificar
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="px-3">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-semibold">{((currentPage - 1) * pageSize) + 1}</span> a{' '}
                <span className="font-semibold">
                  {Math.min(currentPage * pageSize, totalClients)}
                </span> de{' '}
                <span className="font-semibold">{totalClients}</span> clientes
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="text-gray-400">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="w-8 h-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información adicional */}
      <div className="text-center text-sm text-gray-500 py-4">
        Última actualización: {new Date().toLocaleString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    </div>
  );
}