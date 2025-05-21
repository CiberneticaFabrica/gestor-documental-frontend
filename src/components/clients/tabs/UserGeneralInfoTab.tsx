"use client";

import {
  Briefcase, CheckCircle2, AlertTriangle, CalendarCheck, UserCheck, ShieldCheck, FileText, Activity, 
  ClipboardList, BarChart2, MessageSquare, Link2, Clock, AlertCircle, Mail, Phone, MapPin, Globe,
  Building2, UserCog, FileCheck, FileX, FileClock, FileWarning,
  Loader2, PieChartIcon, Folder, ChevronDown, ChevronRight
} from 'lucide-react';

import { type ClientDetailResponse, type DocumentRequestsResponse, type ClientFoldersResponse } from '@/lib/api/services/client.service';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { ResponsiveContainer } from 'recharts';
import { useParams } from 'next/navigation';
import { clientService } from '@/lib/api/services/client.service';
import { PieChart, Pie, Cell } from 'recharts';

// Si ClientActivity no está disponible, defínelo aquí para evitar el error de linter
type ClientActivity = {
  fecha_hora: string;
  accion: string;
  entidad_afectada: string;
  id_entidad_afectada?: string;
  detalles?: Record<string, any>;
  resultado?: string;
  usuario_nombre?: string;
};

interface UserGeneralInfoTabProps {
  clientData: ClientDetailResponse;
  documentRequests?: DocumentRequestsResponse;
}

export function UserGeneralInfoTab({ clientData, documentRequests }: UserGeneralInfoTabProps) {
  const { cliente, estadisticas, actividad_reciente, vista_cache } = clientData;
  const params = useParams();
  const [data, setData] = useState<DocumentRequestsResponse | null>(null);
  const [tablaVista, setTablaVista] = useState<'pendientes' | 'recibidos'>('pendientes');
  const [foldersData, setFoldersData] = useState<ClientFoldersResponse | null>(null);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [foldersError, setFoldersError] = useState<string | null>(null);
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({});
  const [activity, setActivity] = useState<ClientActivity[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);
  const solicitudes = (data?.solicitudes || documentRequests?.solicitudes) || [];

  console.log('documentRequests:', documentRequests);
  console.log('solicitudes:', solicitudes);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activo':
        return 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300';
      case 'inactivo':
        return 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      case 'pendiente':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'bajo':
        return 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300';
      case 'medio':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'alto':
        return 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300';
    }
  };

  const calculateDocumentProgress = () => {
    const total = estadisticas.solicitudes.total_requests;
    const received = parseInt(estadisticas.solicitudes.received_requests);
    return total > 0 ? (received / total) * 100 : 0;
  };

  const donutData = [
    { name: 'Pendientes', value: parseInt(estadisticas.solicitudes.pending_requests), color: '#3B82F6' }, // azul
    { name: 'Recibidos', value: parseInt(estadisticas.solicitudes.received_requests), color: '#10B981' }, // verde
    { name: 'Vencidos', value: parseInt(estadisticas.solicitudes.overdue_requests), color: '#EF4444' }, // rojo
    
  ];
  const total = donutData.reduce((acc, d) => acc + d.value, 0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await clientService.getClientDocumentRequests(params.id as string);
      setData(response);
    };
    fetchData();
  }, [params.id]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setActivityLoading(true);
        const response = await clientService.getClientActivity(params.id as string);
        setActivity(response.activities);
      } catch (err) {
        setActivityError('Error al cargar la actividad reciente');
      } finally {
        setActivityLoading(false);
      }
    };
    fetchActivity();
  }, [params.id]);
  // Cargar estructura de carpetas al montar
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setFoldersLoading(true);
        const response = await clientService.getClientFolders(params.id as string);
        setFoldersData(response);
      } catch (err) {
        setFoldersError('Error al cargar la estructura documental');
        console.error(err);
      } finally {
        setFoldersLoading(false);
      }
    };
    fetchFolders();
  }, [params.id]);

  const toggleFolder = (id: string) => {
    setOpenFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderFolderTree = () => {
    if (foldersLoading) return <div className="text-gray-500">Cargando estructura documental...</div>;
    if (foldersError) return <div className="text-red-500">{foldersError}</div>;
    if (!foldersData || !foldersData.categorias.length) return <div className="text-gray-400">No hay carpetas definidas.</div>;
    return (
      <div className="relative pl-6">
        {/* Línea vertical */}
        <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-300" style={{ zIndex: 0 }} />
        <div className="space-y-2 relative z-10">
          {foldersData.categorias.map((categoria: any) => {
            const carpetaEntry = Object.values(foldersData.documentos_por_carpeta).find((c: any) => c.nombre_carpeta === categoria.nombre);
            const documentos = carpetaEntry ? (carpetaEntry as any).documentos : [];
            const isOpen = openFolders[categoria.id] ?? false; // Por defecto abiertas
            return (
              <div key={categoria.id || categoria.nombre} className="border rounded p-2 bg-gray-50">
                <div
                  className="flex items-center   text-blue-600 mb-1 cursor-pointer select-none"
                  onClick={() => toggleFolder(categoria.id || categoria.nombre)}
                >
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                  )}
                  <Folder className="h-5 w-5 mr-2 text-yellow-500" />
                  {categoria.nombre}
                  <span className="ml-2 text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">{documentos.length}</span>
                </div>
                {isOpen && (
                  <ul className="ml-8 list-none">
                    {documentos.length === 0 && (
                      <li className="text-gray-400 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-300" />
                        Sin documentos
                      </li>
                    )}
                    {documentos.map((doc: any) => (
                      <li key={doc.id} className="text-gray-700 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-400" />
                        <span className="font-medium">{doc.titulo}</span>
                        <span className="text-xs text-gray-500 ml-2">({doc.tipo})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header con información principal */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-blue-400 flex items-center justify-center text-white text-3xl font-bold border-4 border-blue-300 shadow">
              {cliente.nombre_razon_social.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{cliente.nombre_razon_social}</h1>
                <Badge variant="outline" className={getStatusColor(cliente.estado)}>
                  {cliente.estado}
                </Badge>
              </div>
              <div className="text-blue-100 text-sm font-mono">
                {cliente.tipo_cliente} &bull; ID: {cliente.codigo_cliente}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <UserCog className="w-4 h-4 mr-2" />
              Editar Cliente
            </Button>
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <FileText className="w-4 h-4 mr-2" />
              Solicitar Documento
            </Button>
          </div>
        </div>
      </div>

      {/* Grid de información principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna 1 - Información básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Tipo de Cliente:</span>
                <span className="font-medium">{cliente.tipo_cliente}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Documento:</span>
                <span className="font-medium">{cliente.documento_identificacion}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Segmento:</span>
                <span className="font-medium">{cliente.segmento_bancario}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <UserCheck className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Gestor:</span>
                <span className="font-medium">{cliente.gestor_principal_nombre}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Columna 2 - Estado Documental */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Estado documental
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span>Completitud documental</span>
              <span className="font-medium">{calculateDocumentProgress().toFixed(0)}%</span>
            </div>
            <div className="w-full">
              <div className="h-2 rounded-full bg-gray-100 relative overflow-hidden">
                <div
                  className="h-2 rounded-full bg-red-500 transition-all"
                  style={{ width: `${calculateDocumentProgress()}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex items-center bg-blue-50 rounded-lg p-4 min-h-[70px]">
                <FileCheck className="w-6 h-6 text-blue-500 mr-3" />
                <div>
                  <div className="text-xs text-blue-900">Documentos recibidos</div>
                  <div className="text-xl font-bold text-blue-900">{estadisticas.solicitudes.received_requests}</div>
                </div>
              </div>
              <div className="flex items-center bg-yellow-50 rounded-lg p-4 min-h-[70px]">
                <FileClock className="w-6 h-6 text-yellow-600 mr-3" />
                <div>
                  <div className="text-xs text-yellow-900">Documentos pendientes</div>
                  <div className="text-xl font-bold text-yellow-900">{estadisticas.solicitudes.pending_requests}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas y Estado General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Estado General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              {/* Donut chart */}
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                      stroke="none"
                      isAnimationActive={true}
                      animationDuration={1200}
                    >
                      {donutData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Total in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold">{total}</span>
                  <span className="text-xs text-gray-500"> Documentos</span>
                </div>
              </div>
              {/* Legend */}
              <div className="flex flex-col gap-2">
                {donutData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-gray-700 dark:text-gray-200">{entry.name}</span>
                    <span className="ml-2 text-sm font-semibold">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Fila 1, Col 1: Información de contacto */}
  <Card className="md:col-span-1">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Mail className="w-5 h-5" />
        Información de Contacto
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{cliente.datos_contacto.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{cliente.datos_contacto.telefono}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{cliente.datos_contacto.direccion}</span>
        </div>
      </div>
    </CardContent>
  </Card>
  {/* Fila 1, Col 2: Preferencias de comunicación */}
  <Card className="md:col-span-1">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Preferencias de Comunicación
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-500" />
          <span className="text-sm">Canal: {cliente.preferencias_comunicacion.canal_preferido}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm">Horario: {cliente.preferencias_comunicacion.horario_preferido}</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm">Idioma: {cliente.preferencias_comunicacion.idioma}</span>
        </div>
      </div>
    </CardContent>
  </Card>
  {/* Fila 1 y 2, Col 3: Actividad reciente */}
  <Card className="md:col-span-1 md:row-span-2 h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Actividad Reciente
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
     
        <div className="relative pl-6">
          {/* Línea vertical */}
          <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
          <ul className="space-y-6 relative z-10">
            {activity && activity.length > 0 ? (
              activity.slice(0, 7).map((actividad, idx) => (
                <li key={idx} className="relative flex items-start gap-3">
                  {/* Círculo con ícono */}
                  <span className="absolute -left-6 top-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                    <Activity className="w-4 h-4 text-blue-500" />
                  </span>
                  <div className="ml-4"> {/* Separación del icono */}
                    <div className="text-sm text-gray-800 dark:text-gray-100">
                      <span className="font-medium">{actividad.accion}</span>
                      {actividad.detalles?.nombre_cliente && (
                        <> <span className="text-gray-500"> cliente </span>
                          <span className="font-semibold text-blue-600 hover:underline cursor-pointer ml-1">
                            {actividad.detalles.nombre_cliente}
                          </span>
                        </>
                      )}
                      {actividad.entidad_afectada && !actividad.detalles?.nombre_cliente && (
                        <span className="text-gray-500 ml-1"> {actividad.entidad_afectada}</span>
                      )}
                      {actividad.resultado && (
                        <span className="ml-2 text-xs text-gray-400">({actividad.resultado})</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {actividad.usuario_nombre && <span className="mr-2">{actividad.usuario_nombre}</span>}
                      {new Date(actividad.fecha_hora).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-400">No hay actividad reciente.</li>
            )}
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
  {/* Fila 2, Col 1 y 2: Documentos (toggle) */}
  <div className="md:col-span-2">
    {/* Bloque de estructura documental */}
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
      <div className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
        <PieChartIcon className="h-5 w-5 text-blue-500" />
        Estructura Documental
      </div>
      {renderFolderTree()}
    </div>
  </div>
</div>
 

   

     
    </div>

    
  );
} 