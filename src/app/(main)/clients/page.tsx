'use client';

import { useAuth } from '@/lib/auth/auth-context';
 
export default function UsersPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestiona los usuarios del sistema
        </p>
      </div>

      <div className="grid gap-4">
        {/* Aquí irá la lista de usuarios */}
        <div className="rounded-lg border p-4">
          <p className="text-center text-muted-foreground">
          
          </p>
        </div>
      </div>
    </div>
  );
} 