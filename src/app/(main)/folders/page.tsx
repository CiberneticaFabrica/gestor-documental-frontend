// Update your FoldersPage component to use the foldersService
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { FolderExplorer } from '@/components/folders/FolderExplorer';
import { foldersService, Folder } from '@/lib/api/services/folders.service';

export default function FoldersPage() {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        const data = await foldersService.getFoldersWithDocuments();
        setFolders(data);
      } catch (err: any) {
        // More specific error messages based on the error
        if (err.message?.includes('401')) {
          setError('Sesión expirada. Por favor inicie sesión nuevamente.');
        } else if (err.message?.includes('403')) {
          setError('No tiene permisos para acceder a las carpetas.');
        } else {
          setError(`Error al cargar las carpetas: ${err.message || 'Error desconocido'}`);
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFolders();
  }, []);

  if (loading) return <div>Cargando carpetas...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Carpetas</h1>
        <p className="text-muted-foreground">
          Organiza tus documentos en carpetas
        </p>
      </div>
      <div className="grid gap-4">
        <div className="rounded-lg border p-4">
          <FolderExplorer folders={folders} />
        </div>
      </div>
    </div>
  );
}