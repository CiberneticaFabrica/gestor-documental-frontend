'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  User, 
  FileText, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Send,
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react';
import { workflowService, ClientReview } from '@/lib/api/services/workflow.service';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ClientReviewPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  
  const [clientData, setClientData] = useState<ClientReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingToSupervisor, setSendingToSupervisor] = useState(false);
  const [supervisorComment, setSupervisorComment] = useState('');
  const [approvingClient, setApprovingClient] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');

  const fetchClientReview = async () => {
    try {
      setLoading(true);
      const data = await workflowService.getClientReview(clientId);
      setClientData(data);
    } catch (error) {
      toast.error('Error al cargar detalles del cliente');
      console.error('Error fetching client review:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchClientReview();
    }
  }, [clientId]);

  const handleSendToSupervisor = async () => {
    if (!supervisorComment.trim()) {
      toast.error('Debes agregar un comentario para enviar al supervisor');
      return;
    }

    try {
      setSendingToSupervisor(true);
      await workflowService.sendToSupervisor(clientId, {
        comentario: supervisorComment
      });
      toast.success('Cliente enviado al supervisor exitosamente');
      router.push('/kyc/pending-documents');
    } catch (error: any) {
      if (error.error) {
        toast.error(error.error);
      } else {
        toast.error('Error al enviar al supervisor');
      }
      console.error('Error sending to supervisor:', error);
    } finally {
      setSendingToSupervisor(false);
    }
  };

  const handleApproveClient = async () => {
    if (!approvalComment.trim()) {
      toast.error('Debes agregar un comentario para aprobar el cliente');
      return;
    }

    try {
      setApprovingClient(true);
      const result = await workflowService.approveClientBySupervisor(clientId, approvalComment);
      toast.success(result.message);
      // Recargar los datos del cliente para mostrar el nuevo estado
      await fetchClientReview();
      setApprovalComment('');
    } catch (error: any) {
      toast.error(error.message || 'Error al aprobar el cliente');
      console.error('Error approving client:', error);
    } finally {
      setApprovingClient(false);
    }
  };

  const getRiskColor = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case 'alto': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'bajo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactivo': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'aprobado': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDocumentStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'aprobado': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rechazado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pendiente_revision': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCompletitudLimitada = (completitud: string | number) => {
    return Math.min(Number(completitud), 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Cliente no encontrado</p>
      </div>
    );
  }

  const { cliente, documentos, estadisticas_documentos, actividad_reciente } = clientData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/kyc/pending-documents">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Revisión de Cliente</h1>
            <p className="text-muted-foreground">
              {cliente.nombre_razon_social} - {cliente.codigo_cliente}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {cliente.estado_flujo === 'pendiente_supervisor' ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprobar Cliente
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Aprobar Cliente</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Comentario de Aprobación</label>
                    <Textarea
                      placeholder="Agrega un comentario sobre la aprobación del cliente..."
                      value={approvalComment}
                      onChange={(e) => setApprovalComment(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleApproveClient} 
                      disabled={approvingClient || !approvalComment.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {approvingClient ? 'Aprobando...' : 'Confirmar Aprobación'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : cliente.estado_flujo !== 'aprobado' ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar a Supervisor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enviar Cliente a Supervisor</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Comentario para el Supervisor</label>
                    <Textarea
                      placeholder="Agrega un comentario sobre la revisión del cliente..."
                      value={supervisorComment}
                      onChange={(e) => setSupervisorComment(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleSendToSupervisor} 
                      disabled={sendingToSupervisor || !supervisorComment.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {sendingToSupervisor ? 'Enviando...' : 'Confirmar Envío'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="h-4 w-4 mr-2" />
              Cliente Aprobado
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nombre/Razón Social</label>
                    <p className="text-lg font-semibold">{cliente.nombre_razon_social}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Código de Cliente</label>
                    <p className="text-sm">{cliente.codigo_cliente}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tipo de Cliente</label>
                    <Badge variant="outline">{cliente.tipo_cliente}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Documento de Identificación</label>
                    <p className="text-sm">{cliente.documento_identificacion}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Estado</label>
                    <Badge className={getStatusColor(cliente.estado)}>
                      {cliente.estado}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nivel de Riesgo</label>
                    <Badge className={getRiskColor(cliente.nivel_riesgo)}>
                      {cliente.nivel_riesgo}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Segmento</label>
                    <p className="text-sm">{cliente.segmento}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Segmento Bancario</label>
                    <p className="text-sm">{cliente.segmento_bancario}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm">{cliente.datos_contacto.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Teléfono</label>
                      <p className="text-sm">{cliente.datos_contacto.telefono}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Dirección</label>
                      <p className="text-sm">{cliente.datos_contacto.direccion}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Preferencias de Comunicación</label>
                    <p className="text-sm">
                      Idioma: {cliente.preferencias_comunicacion.idioma} | 
                      Canal: {cliente.preferencias_comunicacion.canal_preferido} | 
                      Horario: {cliente.preferencias_comunicacion.horario_preferido}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documentos ({documentos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documentos.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay documentos asociados</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Documento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Confianza IA</TableHead>
                      <TableHead>Asignado a</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentos.map((doc) => (
                      <TableRow key={doc.id_documento}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{doc.titulo}</div>
                            <div className="text-sm text-muted-foreground">{doc.codigo_documento}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.tipo_documento}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getDocumentStatusColor(doc.estado)}>
                            {doc.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${parseFloat(doc.confianza_extraccion) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{(parseFloat(doc.confianza_extraccion) * 100).toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {doc.asignado_a_nombre}
                            {doc.asignado_a_mi === 1 && (
                              <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Tú
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button asChild size="sm">
                            <Link href={`/kyc/documents/${doc.id_documento}/review`}>
                              Revisar
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actividad_reciente.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.usuario_nombre} - {activity.accion} {activity.entidad_afectada}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(activity.fecha_hora)}</p>
                      {activity.detalles && Object.keys(activity.detalles).length > 0 && (
                        <div className="mt-1 text-xs text-gray-600">
                          {Object.entries(activity.detalles).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* KYC Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Progreso KYC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completitud</span>
                  <span>{getCompletitudLimitada(cliente.porcentaje_completitud)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${getCompletitudLimitada(cliente.porcentaje_completitud)}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-gray-500">Documentos Requeridos</label>
                  <p className="font-medium">{cliente.documentos_requeridos}</p>
                </div>
                <div>
                  <label className="text-gray-500">Documentos Validados</label>
                  <p className="font-medium">{cliente.documentos_validados}</p>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="text-sm">
                  <label className="text-gray-500">Estado del Flujo</label>
                  <p className="font-medium capitalize">{cliente.estado_flujo}</p>
                  {cliente.estado_flujo === 'pendiente_supervisor' && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-xs text-yellow-800">
                        <strong>Pendiente de Aprobación del Supervisor</strong>
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        El cliente requiere aprobación final del supervisor para completar el proceso KYC.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Estadísticas de Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Documentos</span>
                <span className="font-medium">{estadisticas_documentos.total_documentos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Aprobados</span>
                <span className="font-medium text-green-600">{estadisticas_documentos.documentos_aprobados}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Rechazados</span>
                <span className="font-medium text-red-600">{estadisticas_documentos.documentos_rechazados}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pendientes</span>
                <span className="font-medium text-yellow-600">{estadisticas_documentos.documentos_pendientes_revision}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Asignados a Mí</span>
                <span className="font-medium text-blue-600">{estadisticas_documentos.documentos_asignados_a_mi}</span>
              </div>
            </CardContent>
          </Card>

          {/* KYC Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Fechas KYC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Fecha de Alta</label>
                <p className="text-sm">{formatDate(cliente.fecha_alta)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Última Revisión KYC</label>
                <p className="text-sm">{cliente.fecha_ultima_revision_kyc}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Próxima Revisión KYC</label>
                <p className="text-sm">{cliente.proxima_revision_kyc}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Inicio del Flujo</label>
                <p className="text-sm">{formatDate(cliente.fecha_inicio_flujo)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Gestors */}
          <Card>
            <CardHeader>
              <CardTitle>Gestores Asignados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Gestor Principal</label>
                <p className="text-sm font-medium">{cliente.gestor_principal_nombre}</p>
              </div>
              {cliente.gestor_kyc_nombre && (
                <div>
                  <label className="text-sm text-gray-500">Gestor KYC</label>
                  <p className="text-sm font-medium">{cliente.gestor_kyc_nombre}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 