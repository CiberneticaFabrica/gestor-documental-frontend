"use client";
import { useState } from 'react';
import { RoleListTable } from './RoleListTable';
import { RoleFormModal } from './RoleFormModal';
import { RolePermissionsMatrix } from './RolePermissionsMatrix';
import { PermissionsByModulePanel } from './PermissionsByModulePanel';
import { RolePermissionsPanel } from './RolePermissionsPanel';
import { useRoles } from '@/hooks/useRoles';
import { toast } from 'sonner';
import { Role as APIRole } from '@/services/common/roleService';

export interface Role extends APIRole {
  permissions: string[];
}

export default function RolesAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [viewingPermissionsRoleId, setViewingPermissionsRoleId] = useState<string | null>(null);
  const { roles, loading, error, refresh } = useRoles();

  const handleRoleCreated = () => {
    setShowForm(false);
    refresh();
  };

  const handleRoleDeleted = () => {
    refresh();
  };

  const handleRoleUpdated = () => {
    setSelectedRole(null);
    refresh();
  };

  if (error) {
    toast.error("Error al cargar los roles");
  }

  return (
    <div className="flex flex-col gap-6 min-h-[80vh]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestión de Roles</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setShowForm(true)}>Nuevo rol</button>
      </div>
      {loading ? (
        <div className="text-white">Cargando roles...</div>
      ) : (
        <RoleListTable 
          roles={roles} 
          onSelect={setSelectedRole} 
          onDelete={handleRoleDeleted}
          onViewPermissions={setViewingPermissionsRoleId}
        />
      )}
      {showForm && <RoleFormModal onClose={() => setShowForm(false)} onRoleCreated={handleRoleCreated} />}
      {selectedRole && <RolePermissionsMatrix role={selectedRole} onClose={handleRoleUpdated} />}
      {viewingPermissionsRoleId && (
        <RolePermissionsPanel 
          roleId={viewingPermissionsRoleId} 
          onClose={() => setViewingPermissionsRoleId(null)} 
        />
      )}
      <PermissionsByModulePanel />
    </div>
  );
} 