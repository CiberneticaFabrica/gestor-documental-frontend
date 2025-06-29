import { useState, useEffect } from 'react';
import { workflowService, Notification } from '@/lib/api/services/workflow.service';

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = async () => {
    try {
      setLoading(true);
      const response = await workflowService.getNotifications({
        unread: true,
        limit: 5, // Usar el mismo limit que el endpoint
        page: 1
      });
      // Contar solo las notificaciones con leida: 0
      const unreadNotifications = response.notificaciones.filter(notif => notif.leida === 0);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar el conteo inicial
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  // Actualizar cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      await workflowService.markNotificationAsRead(notificationId);
      // Actualizar el conteo local
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      // Obtener todas las notificaciones no leídas
      const response = await workflowService.getNotifications({
        unread: true,
        limit: 100, // Obtener todas
        page: 1
      });
      
      // Filtrar solo las no leídas
      const unreadNotifications = response.notificaciones.filter(notif => notif.leida === 0);
      
      // Marcar todas como leídas
      await Promise.all(
        unreadNotifications.map((notif: Notification) => 
          workflowService.markNotificationAsRead(notif.id_notificacion)
        )
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  return {
    unreadCount,
    loading,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead
  };
} 