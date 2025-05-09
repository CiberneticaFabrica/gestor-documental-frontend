'use client';

import { useAuth } from '@/lib/auth/auth-context';

export default function ReportsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground">
          Visualiza y genera reportes del sistema
        </p>
      </div>

      <div className="grid gap-4">
        {/* Aquí irán los reportes */}
        <div className="rounded-lg border p-4">
          <p className="text-center text-muted-foreground">
            No hay reportes disponibles
          </p>
        </div>
      </div>
    </div>
  );
} 