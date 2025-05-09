'use client';

import { useAuth } from '@/lib/auth/auth-context';

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Administración</h1>
        <p className="text-muted-foreground">
          Configuración y administración del sistema
        </p>
      </div>

      <div className="grid gap-4">
        {/* Aquí irá el panel de administración */}
        <div className="rounded-lg border p-4">
          <p className="text-center text-muted-foreground">
            Panel de administración en desarrollo
          </p>
        </div>
      </div>
    </div>
  );
} 