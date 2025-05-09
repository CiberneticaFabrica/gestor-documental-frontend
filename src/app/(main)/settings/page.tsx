'use client';

import { useAuth } from '@/lib/auth/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Configura tus preferencias del sistema
        </p>
      </div>

      <div className="grid gap-4">
        {/* Aquí irá la configuración */}
        <div className="rounded-lg border p-4">
          <p className="text-center text-muted-foreground">
            Configuración en desarrollo
          </p>
        </div>
      </div>
    </div>
  );
} 