'use client';

import { useAuth } from '@/lib/auth/auth-context';

export default function DocumentsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Documentos</h1>
        <p className="text-muted-foreground">
          Gestiona tus documentos aquí
        </p>
      </div>

      <div className="grid gap-4">
        {/* Aquí irá la lista de documentos */}
        <div className="rounded-lg border p-4">
          <p className="text-center text-muted-foreground">
            No hay documentos disponibles
          </p>
        </div>
      </div>
    </div>
  );
} 