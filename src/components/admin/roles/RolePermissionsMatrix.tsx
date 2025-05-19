import { Role, roleService } from '@/services/common/roleService';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { fetchPermissions, type Permission } from '@/services/common/permissionService';
import type { RolePermissionsResponse } from '@/services/common/roleService';

export function RolePermissionsMatrix({ role, onClose }: { role: Role; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [formData, setFormData] = useState({
    nombre_rol: role.nombre_rol,
    descripcion: role.descripcion || ''
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    const loadAllPermissions = async () => {
      try {
        setLoadingPermissions(true);
        const response = await fetchPermissions();
        let allPermissions = [...response.permisos];
        if (response.pagination.total_pages > 1) {
          for (let page = 2; page <= response.pagination.total_pages; page++) {
            const nextPage = await fetchPermissions(page, 1000);
            allPermissions.push(...nextPage.permisos);
          }
        }
        const groupedPermissions = allPermissions.reduce((acc: Record<string, Permission[]>, perm: Permission) => {
          if (!acc[perm.categoria]) {
            acc[perm.categoria] = [];
          }
          acc[perm.categoria].push(perm);
          return acc;
        }, {});
        setPermissions(groupedPermissions);
        // Set first category as active
        const categories = Object.keys(groupedPermissions);
        if (categories.length > 0) setActiveCategory(categories[0]);
        // Precargar permisos actuales del rol
        const rolePermsResp = await roleService.getRolePermissions(role.id_rol);
        const currentPerms = rolePermsResp.permisos || [];
        setSelectedPermissions(currentPerms.map(p => p.id_permiso));
      } catch (error) {
        console.error("Error al cargar los permisos:", error);
        toast.error(error instanceof Error ? error.message : "Error al cargar los permisos");
      } finally {
        setLoadingPermissions(false);
      }
    };
    loadAllPermissions();
  }, [role.id_rol]);

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await roleService.updateRole(role.id_rol, formData);
      await roleService.updateRolePermissions(role.id_rol, selectedPermissions);
      toast.success("Rol actualizado exitosamente");
      onClose();
    } catch (error: any) {
      console.error("Error al actualizar el rol:", error);
      toast.error(error.response?.data?.error || "Error al actualizar el rol");
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
              <div className="space-y-6">
                {/* Tabs de categorías */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-2">
                  <nav className="flex space-x-4" aria-label="Tabs">
                    {Object.keys(permissions).map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 py-2 text-sm font-medium rounded-t-lg ${
                          activeCategory === category
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </nav>
                </div>
                {/* Contenido de la categoría activa */}
                {activeCategory && permissions[activeCategory] && (
                  <div className="border dark:border-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions[activeCategory].map((permission) => (
                        <label key={permission.id_permiso} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id_permiso)}
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
                )}
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