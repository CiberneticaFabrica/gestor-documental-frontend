'use client';

import { UserStatsDashboard } from '@/components/users/user-stats-dashboard';
import { UserTable } from '@/components/users/user-table';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Gestión de Usuarios</h1>
      </div>

      <UserStatsDashboard />
      <UserTable />
    </div>
  );
} 