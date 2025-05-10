"use client";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Permission {
  id_permiso: string;
  codigo_permiso: string;
  descripcion: string;
  categoria: string;
}

export function PermissionsByModulePanel() {
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem("session_token");
        if (!token) {
          throw new Error("No hay token de sesión");
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod";
        const response = await fetch(
          `${baseUrl}/permissions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Permisos recibidos:', data); // Para debug
        
        // Agrupar permisos por categoría
        const groupedPermissions = data.reduce((acc: Record<string, Permission[]>, perm: Permission) => {
          if (!acc[perm.categoria]) {
            acc[perm.categoria] = [];
          }
          acc[perm.categoria].push(perm);
          return acc;
        }, {});
        
        console.log('Permisos agrupados:', groupedPermissions); // Para debug
        setPermissions(groupedPermissions);
      } catch (error) {
        console.error("Error al cargar los permisos:", error);
        toast.error(error instanceof Error ? error.message : "Error al cargar los permisos");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 mt-4">
        <h3 className="text-white font-semibold mb-2">Cargando permisos...</h3>
      </div>
    );
  }

  if (Object.keys(permissions).length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 mt-4">
        <h3 className="text-white font-semibold mb-2">No hay permisos disponibles</h3>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-4">
      <h3 className="text-white font-semibold mb-2">Permisos por Módulo</h3>
      <div className="flex flex-wrap gap-4">
        {Object.entries(permissions).map(([category, perms]) => (
          <div key={category} className="flex-1 min-w-[180px]">
            <h4 className="text-blue-400 font-semibold mb-1 capitalize">{category}</h4>
            <ul className="text-xs text-gray-300 list-disc ml-4">
              {perms.map((perm) => (
                <li key={perm.id_permiso} title={perm.codigo_permiso}>
                  {perm.descripcion}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 