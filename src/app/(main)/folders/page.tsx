'use client';

import { useAuth } from '@/lib/auth/auth-context';

export default function FoldersPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Carpetas</h1>
        <p className="text-muted-foreground">
          Organiza tus documentos en carpetas
        </p>
      </div>

      <div className="grid gap-4">
        {/* Aquí irá la lista de carpetas */}
        <div className="rounded-lg border p-4">
          <p className="text-center text-muted-foreground">
            No hay carpetas disponibles
          </p>
        </div>
      </div>
    </div>
  );
} 