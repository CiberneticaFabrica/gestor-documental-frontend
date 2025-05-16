'use client';

import { useState } from 'react';
import { ClientsStatsDashboard  } from '@/components/clients/clients-stats-dashboard';
import { ClientsTable } from '@/components/clients/clients-table';
import { User360View } from '@/components/clients/user-360-view';

export default function ClientsPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
   
      <ClientsStatsDashboard />
      <ClientsTable />
  
    </div>
  );
} 