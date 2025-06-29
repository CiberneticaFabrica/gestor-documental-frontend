'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Activity,
  Bell,
  Shield,
  BarChart3
} from 'lucide-react';
import { workflowService, PendingDocument, Notification } from '@/lib/api/services/workflow.service';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function KYCDashboardPage() {
  const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPending: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    totalNotifications: 0,
    unreadNotifications: 0,
    urgentNotifications: 0
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending documents
      const documentsResponse = await workflowService.getPendingDocuments({ limit: 5 });
      setPendingDocuments(documentsResponse.documentos_pendientes);
      
      // Fetch notifications
      const notificationsResponse = await workflowService.getNotifications({ limit: 5 });
      setNotifications(notificationsResponse.notificaciones);
      
      // Calculate stats
      setStats({
        totalPending: documentsResponse.documentos_pendientes.length,
        highPriority: documentsResponse.documentos_pendientes.filter(d => d.prioridad === 'alta').length,
        mediumPriority: documentsResponse.documentos_pendientes.filter(d => d.prioridad === 'media').length,
        lowPriority: documentsResponse.documentos_pendientes.filter(d => d.prioridad === 'baja').length,
        totalNotifications: notificationsResponse.notificaciones.length,
        unreadNotifications: notificationsResponse.notificaciones.filter(n => n.leida === 0).length,
        urgentNotifications: notificationsResponse.notificaciones.filter(n => n.urgencia === 'alta').length
      });
    } catch (error) {
      toast.error('Error al cargar datos del dashboard');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad.toLowerCase()) {
      case 'alta': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard KYC</h1>
          <p className="text-muted-foreground">
            Resumen general del proceso de Conoce a tu Cliente
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchDashboardData}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPending}</div>
            <p className="text-xs text-muted-foreground">
              Requieren revisión inmediata
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridad</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención urgente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotifications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.unreadNotifications} no leídas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgentNotifications}</div>
            <p className="text-xs text-muted-foreground">
              Notificaciones urgentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Priority Breakdown */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              Alta Prioridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.highPriority}</div>
            <p className="text-sm text-muted-foreground">Documentos críticos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-500" />
              Media Prioridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.mediumPriority}</div>
            <p className="text-sm text-muted-foreground">Revisión estándar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Baja Prioridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.lowPriority}</div>
            <p className="text-sm text-muted-foreground">Rutinarios</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Pending Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documentos Pendientes Recientes
              </span>
              <Button asChild variant="outline" size="sm">
                <Link href="/kyc/pending-documents">
                  Ver Todos
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay documentos pendientes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingDocuments.map((doc) => (
                  <div key={doc.id_documento} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">{doc.titulo}</h4>
                        <Badge className={getPriorityColor(doc.prioridad)}>
                          {doc.prioridad}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{doc.nombre_razon_social}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(doc.fecha_inicio)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button asChild size="sm">
                        <Link href={`/kyc/documents/${doc.id_documento}/review`}>
                          Revisar
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notificaciones Recientes
              </span>
              <Button asChild variant="outline" size="sm">
                <Link href="/kyc/notifications">
                  Ver Todas
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay notificaciones</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id_notificacion} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.titulo}</h4>
                          {notification.leida === 0 && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              Nueva
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.mensaje}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(notification.fecha_creacion)}</p>
                      </div>
                      <div className="flex space-x-2">
                        {notification.id_documento && (
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/kyc/documents/${notification.id_documento}/review`}>
                              Ver Doc
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-auto p-4 flex flex-col items-center space-y-2">
              <Link href="/kyc/pending-documents">
                <FileText className="h-6 w-6" />
                <span>Revisar Documentos</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Link href="/kyc/notifications">
                <Bell className="h-6 w-6" />
                <span>Ver Notificaciones</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Link href="/kyc/reports">
                <BarChart3 className="h-6 w-6" />
                <span>Reportes KYC</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Link href="/kyc/clients">
                <User className="h-6 w-6" />
                <span>Gestionar Clientes</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 