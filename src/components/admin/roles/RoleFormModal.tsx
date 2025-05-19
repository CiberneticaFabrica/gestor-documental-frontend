"use client";
import { useState, FormEvent, useEffect } from 'react';
import { toast } from 'sonner';
import { fetchPermissions, type Permission } from '@/services/common/permissionService';
import { roleService, type Role } from '@/services/common/roleService';

interface RoleFormData {
  nombre_rol: string;
  descripcion: string;
  permissions: string[];
}

interface RoleFormModalProps {
  onClose: () => void;
  onRoleCreated: () => void;
}

export function RoleFormModal({ onClose, onRoleCreated }: RoleFormModalProps) {
  const [formData, setFormData] = useState<RoleFormData>({
    nombre_rol: '',
    descripcion: '',
    permissions: []
  });
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    const loadAllPermissions = async () => {
      try {
        setLoadingPermissions(true);
        const response = await fetchPermissions();
        console.log('Respuesta completa de permisos:', response);
        console.log('Categorías disponibles:', response.categorias_disponibles);
        console.log('Total de permisos:', response.permisos.length);
        
        // Si hay más páginas, las cargamos
        if (response.pagination.total_pages > 1) {
          const allPermissions = [...response.permisos];
          for (let page = 2; page <= response.pagination.total_pages; page++) {
            const nextPageResponse = await fetchPermissions(page, 1000);
            allPermissions.push(...nextPageResponse.permisos);
          }
          console.log('Total de permisos después de cargar todas las páginas:', allPermissions.length);
          setPermissions(allPermissions);
          // Establecer la primera categoría como activa por defecto
          if (response.categorias_disponibles.length > 0) {
            setActiveCategory(response.categorias_disponibles[0]);
          }
        } else {
        setPermissions(response.permisos);
          if (response.categorias_disponibles.length > 0) {
            setActiveCategory(response.categorias_disponibles[0]);
          }
        }
      } catch (error) {
        console.error("Error al cargar permisos:", error);
        toast.error("Error al cargar los permisos");
      } finally {
        setLoadingPermissions(false);
      }
    };

    loadAllPermissions();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await roleService.createRole(formData);
        toast.success("Rol creado exitosamente");
        onRoleCreated();
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Error al crear el rol";
        toast.error(errorMessage);
      console.error("Error al crear el rol:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.categoria]) {
      acc[permission.categoria] = [];
    }
    acc[permission.categoria].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const categories = Object.keys(groupedPermissions);

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
            <label htmlFor="name" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Nombre del rol</label>
            <input 
              id="name" 
              className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2" 
              placeholder="Nombre del rol"
              value={formData.nombre_rol}
              onChange={(e) => setFormData({...formData, nombre_rol: e.target.value})}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
            <input 
              id="description" 
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
                {/* Tabs de categorías */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-4" aria-label="Tabs">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveCategory(category);
                        }}
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
                {activeCategory && groupedPermissions[activeCategory] && (
                  <div className="border dark:border-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {groupedPermissions[activeCategory].map((permission) => (
                        <label key={permission.id_permiso} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission.id_permiso)}
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