"use client";
import { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { fetchPermissions, type Permission } from '@/services/common/permissionService';

interface RoleFormData {
  nombre_rol: string;
  descripcion: string;
  permisos: string[];
}

interface RoleFormModalProps {
  onClose: () => void;
  onRoleCreated: () => void;
}

export function RoleFormModal({ onClose, onRoleCreated }: RoleFormModalProps) {
  const [formData, setFormData] = useState<RoleFormData>({
    nombre_rol: '',
    descripcion: '',
    permisos: []
  });
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  useEffect(() => {
    fetchPermissions()
      .then(response => {
        setPermissions(response.permisos);
      })
      .catch(error => {
        console.error("Error al cargar permisos:", error);
        toast.error("Error al cargar los permisos");
      })
      .finally(() => {
        setLoadingPermissions(false);
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("session_token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/roles`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.id_rol) {
        toast.success("Rol creado exitosamente");
        onRoleCreated();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Error al crear el rol";
        toast.error(errorMessage);
      } else {
        toast.error("Error al crear el rol");
      }
      console.error("Error al crear el rol:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permisos: prev.permisos.includes(permissionId)
        ? prev.permisos.filter(id => id !== permissionId)
        : [...prev.permisos, permissionId]
    }));
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.categoria]) {
      acc[permission.categoria] = [];
    }
    acc[permission.categoria].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl relative p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          title="Cerrar formulario"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Nuevo Rol</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre_rol" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Nombre del rol</label>
            <input 
              id="nombre_rol" 
              className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2" 
              placeholder="Nombre del rol"
              value={formData.nombre_rol}
              onChange={(e) => setFormData({...formData, nombre_rol: e.target.value})}
              required
            />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
            <input 
              id="descripcion" 
              className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2" 
              placeholder="Descripción del rol"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-3 text-gray-900 dark:text-white">Permisos</h3>
            {loadingPermissions ? (
              <div className="text-gray-500">Cargando permisos...</div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, perms]) => (
                  <div key={category} className="border dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-gray-900 dark:text-white capitalize">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {perms.map((permission) => (
                        <label key={permission.id_permiso} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={formData.permisos.includes(permission.id_permiso)}
                            onChange={() => handlePermissionChange(permission.id_permiso)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {permission.descripcion}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading || loadingPermissions}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 