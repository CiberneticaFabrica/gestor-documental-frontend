"use client";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { roleService } from '@/services/common/roleService';
import { Permission } from '@/services/common/permissionService';
import type { RolePermissionsResponse } from '@/services/common/roleService';

interface RolePermissions {
  id: string;
  name: string;
  permisos: Permission[];
  permisos_por_categoria: Record<string, Permission[]>;
}

interface RolePermissionsPanelProps {
  roleId: string;
  onClose: () => void;
}

export function RolePermissionsPanel({ roleId, onClose }: RolePermissionsPanelProps) {
  const [permissions, setPermissions] = useState<RolePermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const response = await roleService.getRolePermissions(roleId);
        setPermissions({
          id: response.id_rol,
          name: response.nombre_rol,
          permisos: response.permisos ?? [],
          permisos_por_categoria: response.permisos_por_categoria ?? {},
        });
      } catch (error) {
        console.error("Error al cargar los permisos:", error);
        toast.error("Error al cargar los permisos del rol");
      } finally {
        setLoading(false);
      }
    };
    loadPermissions();
  }, [roleId]);

  if (loading) {
    return (
      <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white dark:bg-gray-800 shadow-lg p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cargando permisos...</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Cerrar panel"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  if (!permissions) {
    return null;
  }

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white dark:bg-gray-800 shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Permisos de {permissions.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Cerrar panel"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(permissions.permisos_por_categoria || {}).map(([category, perms]) => (
          <div key={category} className="border dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium mb-3 text-gray-900 dark:text-white capitalize">{category}</h3>
            <div className="space-y-2">
              {perms.map((permission) => (
                <div key={permission.id_permiso} className="flex items-start space-x-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{permission.descripcion}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{permission.codigo_permiso}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 