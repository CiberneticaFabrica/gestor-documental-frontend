import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth/auth-context';

export function useRefreshToken() {
  const { refreshToken, isAuthenticated } = useAuth();
  const refreshInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!isAuthenticated) {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
      return;
    }

    // Configurar el intervalo de refresh (cada 4 minutos)
    refreshInterval.current = setInterval(() => {
      refreshToken().catch(error => {
        console.error('Error al refrescar el token:', error);
      });
    }, 4 * 60 * 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [isAuthenticated, refreshToken]);

  return {
    refreshToken,
  };
} 