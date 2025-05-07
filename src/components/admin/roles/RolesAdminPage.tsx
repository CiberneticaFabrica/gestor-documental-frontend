"use client";
import { useState } from 'react';
import { RoleListTable } from './RoleListTable';
import { RoleFormModal } from './RoleFormModal';
import { RolePermissionsMatrix } from './RolePermissionsMatrix';
import { PermissionsByModulePanel } from './PermissionsByModulePanel';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const mockRoles: Role[] = [
  { id: '1', name: 'Administrador', description: 'Acceso total al sistema', permissions: ['dashboard', 'users', 'documents', 'admin'] },
  { id: '2', name: 'Validador', description: 'Puede verificar y aprobar documentos', permissions: ['documents', 'verify'] },
];

export default function RolesAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  return (
    <div className="flex flex-col gap-6 min-h-[80vh]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestión de Roles</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setShowForm(true)}>Nuevo rol</button>
      </div>
      <RoleListTable roles={mockRoles} onSelect={setSelectedRole} />
      {showForm && <RoleFormModal onClose={() => setShowForm(false)} />}
      {selectedRole && <RolePermissionsMatrix role={selectedRole} onClose={() => setSelectedRole(null)} />}
      <PermissionsByModulePanel />
    </div>
  );
} 