import { Role } from './RolesAdminPage';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Permission {
  id_permiso: string;
  codigo_permiso: string;
  descripcion: string;
  categoria: string;
}

export function RolePermissionsMatrix({ role, onClose }: { role: Role; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [formData, setFormData] = useState({
    nombre_rol: role.nombre_rol,
    descripcion: role.descripcion || ''
  });

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
        setLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("session_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/roles/${role.id_rol}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error('Error al actualizar el rol');
      
      toast.success("Rol actualizado exitosamente");
      onClose();
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
      toast.error("Error al actualizar el rol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          title="Cerrar matriz"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Editar Rol</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="nombre_rol" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre del Rol
              </label>
              <input
                type="text"
                id="nombre_rol"
                value={formData.nombre_rol}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre_rol: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descripción
              </label>
              <textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-3 text-gray-900 dark:text-white">Permisos del Rol</h3>
            {loadingPermissions ? (
              <div className="text-gray-500 dark:text-gray-400">Cargando permisos...</div>
            ) : (
              <div className="space-y-4">
                {Object.entries(permissions).map(([category, perms]) => (
                  <div key={category} className="border dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-gray-900 dark:text-white capitalize">{category}</h4>
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
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
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