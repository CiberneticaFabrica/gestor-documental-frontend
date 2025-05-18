'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { User360View } from '@/components/clients/user-360-view';
import { clientService, type ClientDetailResponse } from '@/lib/api/services/client.service';

export default function UserProfilePage() {
  const params = useParams();
  const [clientData, setClientData] = useState<ClientDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const data = await clientService.getClientDetail(params.id as string);
        setClientData(data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchClientData();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cliente no encontrado</h2>
          <p className="text-gray-500 dark:text-gray-400">El cliente que buscas no existe o no tienes permisos para verlo.</p>
        </div>
      </div>
    );
  }

  return <User360View clientData={clientData} />;
} 