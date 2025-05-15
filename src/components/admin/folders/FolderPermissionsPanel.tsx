"use client";
import { useState } from 'react';
import { Folder } from './FoldersAdminPage';

interface Permission {
  id: string;
  name: string;
  description: string;
  inherited: boolean;
}

interface Group {
  id: string;
  name: string;
  permissions: string[];
}

const mockPermissions: Permission[] = [
  {
    id: 'read',
    name: 'Lectura',
    description: 'Permite ver los documentos en la carpeta',
    inherited: false
  },
  {
    id: 'write',
    name: 'Escritura',
    description: 'Permite subir y modificar documentos',
    inherited: false
  },
  {
    id: 'delete',
    name: 'Eliminación',
    description: 'Permite eliminar documentos',
    inherited: false
  },
  {
    id: 'manage',
    name: 'Administración',
    description: 'Permite gestionar permisos y configuración',
    inherited: false
  }
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Administradores',
    permissions: ['read', 'write', 'delete', 'manage']
  },
  {
    id: '2',
    name: 'Revisores',
    permissions: ['read', 'write']
  },
  {
    id: '3',
    name: 'Usuarios',
    permissions: ['read']
  }
];

interface FolderPermissionsPanelProps {
  folder: Folder;
}

export function FolderPermissionsPanel({ folder }: FolderPermissionsPanelProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groupPermissions, setGroupPermissions] = useState<Record<string, string[]>>(
    Object.fromEntries(mockGroups.map(group => [group.id, group.permissions]))
  );

  const handlePermissionToggle = (groupId: string, permissionId: string) => {
    setGroupPermissions(prev => {
      const currentPermissions = prev[groupId] || [];
      const newPermissions = currentPermissions.includes(permissionId)
        ? currentPermissions.filter(id => id !== permissionId)
        : [...currentPermissions, permissionId];
      
      return {
        ...prev,
        [groupId]: newPermissions
      };
    });
  };

  const handleInheritanceToggle = (permissionId: string) => {
    // TODO: Implement inheritance toggle
    console.log('Toggle inheritance for permission:', permissionId);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          Permisos de Carpeta - {folder.nombre_carpeta}
        </h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          onClick={() => {
            // TODO: Implement save functionality
            console.log('Saving permissions:', groupPermissions);
          }}
        >
          Guardar cambios
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grupos */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">Grupos</h3>
          <div className="space-y-2">
            {mockGroups.map(group => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedGroup === group.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>

        {/* Permisos */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">Permisos</h3>
          {selectedGroup ? (
            <div className="space-y-4">
              {mockPermissions.map(permission => (
                <div
                  key={permission.id}
                  className="bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-medium">{permission.name}</h4>
                        {permission.inherited && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Heredado
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{permission.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {permission.inherited && (
                        <button
                          onClick={() => handleInheritanceToggle(permission.id)}
                          className="text-gray-400 hover:text-white transition-colors"
                          aria-label={`Cambiar herencia de ${permission.name}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </button>
                      )}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <span className="sr-only">
                          {`${permission.name} para ${mockGroups.find(g => g.id === selectedGroup)?.name}`}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={groupPermissions[selectedGroup]?.includes(permission.id)}
                          onChange={() => handlePermissionToggle(selectedGroup, permission.id)}
                          disabled={permission.inherited}
                          aria-label={`${permission.name} para ${mockGroups.find(g => g.id === selectedGroup)?.name}`}
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-700 rounded-lg p-4 text-center text-gray-300">
              Seleccione un grupo para gestionar sus permisos
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 