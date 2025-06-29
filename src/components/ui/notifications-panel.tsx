"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertCircle, Clock, CheckCircle, X, RefreshCw } from 'lucide-react';
import { workflowService } from '@/lib/api/services/workflow.service';
import { useNotifications } from '@/hooks/use-notifications';
import { toast } from 'react-hot-toast';

interface Notification {
  id_notificacion: string;
  titulo: string;
  mensaje: string;
  tipo_notificacion: string;
  urgencia: string;
  leida: number;
  fecha_creacion: string;
  fecha_lectura?: string;
  id_documento: string;
  id_cliente: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { unreadCount, markAsRead, markAllAsRead, fetchUnreadCount } = useNotifications();
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await workflowService.getNotifications({
        unread: true,
        limit: 5,
        page: 1
      });
      // Filtrar solo las notificaciones no leídas
      const unreadNotifications = response.notificaciones.filter(notif => notif.leida === 0);
      setNotifications(unreadNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      // Actualizar el estado local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id_notificacion === notificationId 
            ? { ...notif, leida: 1, fecha_lectura: new Date().toISOString() }
            : notif
        )
      );
      // Refrescar el contador global
      await fetchUnreadCount();
      toast.success('Notificación marcada como leída');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Error al marcar como leída');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, leida: 1, fecha_lectura: new Date().toISOString() }))
      );
      // Refrescar el contador global
      await fetchUnreadCount();
      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Error al marcar todas como leídas');
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Marcar como leída primero
      await handleMarkAsRead(notification.id_notificacion);
      
      // Refrescar el contador global después de marcar como leída
      await fetchUnreadCount();
      
      // Cerrar el panel
      onClose();
      
      // Navegar a la página de revisión del documento
      if (notification.id_documento) {
        router.push(`/kyc/documents/${notification.id_documento}/review`);
      } else {
        toast.error('No se puede navegar a este documento');
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      toast.error('Error al procesar la notificación');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Actualizar notificaciones cada 30 segundos cuando el panel está abierto
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount(); // También actualizar el conteo global
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [isOpen, fetchUnreadCount]);

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'tarea_asignada': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'documento_recibido': return <Clock className="h-4 w-4 text-green-500" />;
      case 'revision_completada': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUrgencyColor = (urgencia: string) => {
    switch (urgencia.toLowerCase()) {
      case 'alta': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Panel de notificaciones */}
      <div className="fixed right-4 top-20 w-96 max-h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Notificaciones
            </h3>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchNotifications}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs h-8"
              >
                Marcar todas
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[500px] overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No hay notificaciones
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Estás al día con todas las notificaciones
              </p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id_notificacion} 
                  className={`mb-2 cursor-pointer transition-all hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    notification.leida === 0 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                      : 'bg-white dark:bg-gray-800'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.tipo_notificacion)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                            {notification.titulo}
                          </h4>
                          <Badge className={`ml-2 text-xs ${getUrgencyColor(notification.urgencia)}`}>
                            {notification.urgencia}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {notification.mensaje}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(notification.fecha_creacion)}
                          </span>
                          {notification.leida === 0 && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Clic para revisar documento →
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              onClick={() => {
                // Aquí podrías navegar a la página completa de notificaciones
                onClose();
                router.push('/kyc/notifications');
              }}
            >
              Ver todas las notificaciones
            </Button>
          </div>
        )}
      </div>
    </>
  );
} 