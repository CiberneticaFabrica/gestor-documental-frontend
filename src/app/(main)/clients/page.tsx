'use client';

import { useState } from 'react';
import { UserStatsDashboard } from '@/components/clients/user-stats-dashboard';
import { UserTable } from '@/components/clients/user-table';
import { User360View } from '@/components/clients/user-360-view';

export default function ClientsPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">
          Gestiona los clientes del sistema
        </p>
      </div>
      <UserStatsDashboard />
      <UserTable />
     
    </div>
  );
} 