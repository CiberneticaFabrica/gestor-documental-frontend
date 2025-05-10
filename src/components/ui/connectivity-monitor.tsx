'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ConnectivityMonitor() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Conexión a internet restablecida');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Sin conexión a internet. Algunas funciones pueden no estar disponibles.', {
        duration: 5000,
      });
    };

    // Verificar conexión inicial
    setIsOnline(navigator.onLine);

    // Agregar event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Este componente no renderiza nada visible, solo monitorea
  return null;
}