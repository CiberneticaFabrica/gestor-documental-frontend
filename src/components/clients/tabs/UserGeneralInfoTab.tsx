"use client";

import {
  Briefcase, CheckCircle2, AlertTriangle, CalendarCheck, UserCheck, ShieldCheck, FileText, Activity, 
  ClipboardList, BarChart2, MessageSquare, Link2, Clock, AlertCircle, Mail, Phone, MapPin, Globe,
  Building2, UserCog, FileCheck, FileX, FileClock, FileWarning,
  Loader2, PieChartIcon, Folder, ChevronDown, ChevronRight, X, Save, User
} from 'lucide-react';

import { type ClientDetailResponse, type DocumentRequestsResponse, type ClientFoldersResponse, type ClientRequest } from '@/lib/api/services/client.service';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';
import { ResponsiveContainer } from 'recharts';
import { useParams } from 'next/navigation';
import { clientService } from '@/lib/api/services/client.service';
import { PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

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
  
  // Estado para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState<ClientRequest | null>(null);
  
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
    console.log('foldersData:', foldersData);
    console.log('foldersLoading:', foldersLoading);
    console.log('foldersError:', foldersError);
  
    if (foldersLoading) return <div className="text-gray-500">Cargando estructura documental...</div>;
    if (foldersError) return <div className="text-red-500">{foldersError}</div>;
    if (!foldersData) return <div className="text-gray-400">No hay datos de carpetas disponibles.</div>;
    if (!foldersData.categorias || foldersData.categorias.length === 0) return <div className="text-gray-400">No hay carpetas definidas.</div>;
  
    return (
      <div className="relative pl-6">
        {/* Línea vertical */}
        <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-300 z-0" />
        <div className="space-y-2 relative z-10">
          {foldersData.categorias.map((categoria: any) => {
            const documentos = categoria.documentos_existentes_detalle || [];
            const isOpen = openFolders[categoria.id] ?? false;
            
            return (
              <div key={categoria.id} className="border rounded p-2 bg-gray-50">
                <div
                  className="flex items-center text-blue-600 mb-1 cursor-pointer select-none"
                  onClick={() => toggleFolder(categoria.id)}
                >
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                  )}
                  <Folder className="h-5 w-5 mr-2 text-yellow-500" />
                  {categoria.nombre}
                  <span className="ml-2 text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
                    {documentos.length}
                  </span>
                </div>
                {isOpen && (
                  <ul className="ml-8 list-none">
                    {documentos.length === 0 ? (
                      <li className="text-gray-400 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-300" />
                        Sin documentos
                      </li>
                    ) : (
                      documentos.map((doc: any) => (
                        <li key={doc.id_documento} className="text-gray-700 flex items-center mb-2">
                          <FileText className="h-4 w-4 mr-2 text-blue-400" />
                          <span className="font-medium">{doc.titulo}</span>
                          <span className="text-xs text-gray-500 ml-2">({doc.tipo_documento})</span>
                          {doc.validado ? (
                            <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" />
                          ) : null}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Funciones para manejar la edición del cliente
  const handleEditClick = () => {
    setEditForm({
      tipo_cliente: cliente.tipo_cliente,
      nombre_razon_social: cliente.nombre_razon_social,
      documento_identificacion: cliente.documento_identificacion,
      estado: cliente.estado,
      segmento: cliente.segmento,
      segmento_bancario: cliente.segmento_bancario,
      nivel_riesgo: cliente.nivel_riesgo,
      gestor_principal_id: cliente.gestor_principal_id,
      gestor_kyc_id: cliente.gestor_kyc_id,
      datos_contacto: { ...cliente.datos_contacto },
      preferencias_comunicacion: { ...cliente.preferencias_comunicacion },
      metadata_personalizada: { ...cliente.metadata_personalizada },
    });
    setShowEditModal(true);
  };

  const handleEditChange = (field: string, value: any, nested?: string) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      if (nested) {
        return { ...prev, [nested]: { ...(prev as any)[nested], [field]: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleEditSave = async () => {
    if (!editForm) return;
    setEditLoading(true);
    try {
      await clientService.updateClient(cliente.id_cliente, editForm);
      toast.success('Cliente actualizado correctamente');
      setShowEditModal(false);
      // Opcional: recargar datos del cliente aquí si es necesario
    } catch (err) {
      toast.error('Error al actualizar el cliente');
    } finally {
      setEditLoading(false);
    }
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
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={handleEditClick}>
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
        {/* Información básica */}
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

        {/* Estado documental */}
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
            <Progress value={calculateDocumentProgress()} />
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

        {/* Estado General */}
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
                    >
                      {donutData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold">{total}</span>
                  <span className="text-xs text-gray-500">Documentos</span>
                </div>
              </div>
              {/* Legend */}
              <div className="flex flex-col gap-2">
                {donutData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-gray-700">{entry.name}</span>
                    <span className="ml-2 text-sm font-semibold">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información de contacto */}
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

        {/* Preferencias de comunicación */}
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

        {/* Actividad reciente */}
  <Card className="md:col-span-1 md:row-span-2 h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Actividad Reciente
      </CardTitle>
    </CardHeader>
    <CardContent>
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
        <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
          <ul className="space-y-6 relative z-10">
            {activity && activity.length > 0 ? (
              activity.slice(0, 7).map((actividad, idx) => (
                <li key={idx} className="relative flex items-start gap-3">
                        <span className="absolute -left-6 top-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border border-gray-300">
                    <Activity className="w-4 h-4 text-blue-500" />
                  </span>
                        <div className="ml-4">
                          <div className="text-sm text-gray-800">
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

        {/* Estructura documental */}
  <div className="md:col-span-2">
          <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
            <div className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <PieChartIcon className="h-5 w-5 text-blue-500" />
        Estructura Documental
      </div>
      {renderFolderTree()}
    </div>
  </div>
</div>
 
      {/* Modal de edición de cliente */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Editar Cliente</h2>
              </div>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors" 
                title="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
              {/* Campos principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre o Razón Social</Label>
                  <Input 
                    value={editForm!.nombre_razon_social} 
                    onChange={e => handleEditChange('nombre_razon_social', e.target.value)} 
                    required 
                    aria-label="Nombre o Razón Social"
                  />
                </div>
                <div>
                  <Label>Tipo de Cliente</Label>
                  <Input 
                    value={editForm!.tipo_cliente} 
                    onChange={e => handleEditChange('tipo_cliente', e.target.value)} 
                    required 
                    aria-label="Tipo de Cliente"
                  />
                </div>
                <div>
                  <Label>Documento Identificación</Label>
                  <Input 
                    value={editForm!.documento_identificacion} 
                    onChange={e => handleEditChange('documento_identificacion', e.target.value)} 
                    required 
                    aria-label="Documento Identificación"
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Input 
                    value={editForm!.estado} 
                    onChange={e => handleEditChange('estado', e.target.value)} 
                    required 
                    aria-label="Estado"
                  />
                </div>
                <div>
                  <Label>Segmento</Label>
                  <Input 
                    value={editForm!.segmento} 
                    onChange={e => handleEditChange('segmento', e.target.value)} 
                    aria-label="Segmento"
                  />
                </div>
                <div>
                  <Label>Segmento Bancario</Label>
                  <Input 
                    value={editForm!.segmento_bancario} 
                    onChange={e => handleEditChange('segmento_bancario', e.target.value)} 
                    aria-label="Segmento Bancario"
                  />
                </div>
                <div>
                  <Label>Nivel de Riesgo</Label>
                  <Input 
                    value={editForm!.nivel_riesgo} 
                    onChange={e => handleEditChange('nivel_riesgo', e.target.value)} 
                    aria-label="Nivel de Riesgo"
                  />
                </div>
                <div>
                  <Label>Gestor Principal ID</Label>
                  <Input 
                    value={editForm!.gestor_principal_id || ''} 
                    onChange={e => handleEditChange('gestor_principal_id', e.target.value)} 
                    aria-label="Gestor Principal ID"
                  />
                </div>
                <div>
                  <Label>Gestor KYC ID</Label>
                  <Input 
                    value={editForm!.gestor_kyc_id || ''} 
                    onChange={e => handleEditChange('gestor_kyc_id', e.target.value)} 
                    aria-label="Gestor KYC ID"
                  />
                </div>
              </div>

              {/* Datos de contacto */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold mb-2">Datos de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input 
                      value={editForm!.datos_contacto.email} 
                      onChange={e => handleEditChange('email', e.target.value, 'datos_contacto')} 
                      aria-label="Email"
                    />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input 
                      value={editForm!.datos_contacto.telefono} 
                      onChange={e => handleEditChange('telefono', e.target.value, 'datos_contacto')} 
                      aria-label="Teléfono"
                    />
                  </div>
                  <div>
                    <Label>Dirección</Label>
                    <Input 
                      value={editForm!.datos_contacto.direccion} 
                      onChange={e => handleEditChange('direccion', e.target.value, 'datos_contacto')} 
                      aria-label="Dirección"
                    />
                  </div>
                </div>
              </div>

              {/* Preferencias de comunicación */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold mb-2">Preferencias de Comunicación</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Idioma</Label>
                    <Input 
                      value={editForm!.preferencias_comunicacion.idioma} 
                      onChange={e => handleEditChange('idioma', e.target.value, 'preferencias_comunicacion')} 
                      aria-label="Idioma"
                    />
                  </div>
                  <div>
                    <Label>Canal Preferido</Label>
                    <Input 
                      value={editForm!.preferencias_comunicacion.canal_preferido} 
                      onChange={e => handleEditChange('canal_preferido', e.target.value, 'preferencias_comunicacion')} 
                      aria-label="Canal Preferido"
                    />
                  </div>
                  <div>
                    <Label>Horario Preferido</Label>
                    <Input 
                      value={editForm!.preferencias_comunicacion.horario_preferido} 
                      onChange={e => handleEditChange('horario_preferido', e.target.value, 'preferencias_comunicacion')} 
                      aria-label="Horario Preferido"
                    />
                  </div>
                </div>
              </div>

              {/* Metadata personalizada */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold mb-2">Metadata Personalizada</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Profesión</Label>
                    <Input 
                      value={editForm!.metadata_personalizada.profesion} 
                      onChange={e => handleEditChange('profesion', e.target.value, 'metadata_personalizada')} 
                      aria-label="Profesión"
                    />
                  </div>
                  <div>
                    <Label>Referido Por</Label>
                    <Input 
                      value={editForm!.metadata_personalizada.referido_por} 
                      onChange={e => handleEditChange('referido_por', e.target.value, 'metadata_personalizada')} 
                      aria-label="Referido Por"
                    />
                  </div>
                  <div>
                    <Label>Empresa Laboral</Label>
                    <Input 
                      value={editForm!.metadata_personalizada.empresa_laboral} 
                      onChange={e => handleEditChange('empresa_laboral', e.target.value, 'metadata_personalizada')} 
                      aria-label="Empresa Laboral"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} disabled={editLoading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 