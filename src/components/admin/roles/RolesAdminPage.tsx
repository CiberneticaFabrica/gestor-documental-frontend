"use client";
import { useState } from 'react';
import { RoleListTable } from './RoleListTable';
import { RoleFormModal } from './RoleFormModal';
import { RolePermissionsMatrix } from './RolePermissionsMatrix';
import { PermissionsByModulePanel } from './PermissionsByModulePanel';
import { RolePermissionsPanel } from './RolePermissionsPanel';
import { useRoles } from '@/hooks/useRoles';
import { toast } from 'sonner';
import { Role } from '@/services/common/roleService';
import { RoleFiltersBar } from './RoleFiltersBar';
import { RoleListCards } from './RoleListCards';

export default function RolesAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [viewingPermissionsRoleId, setViewingPermissionsRoleId] = useState<string | null>(null);
  const { roles, loading, error, refresh, pagination, fetchRoles } = useRoles();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filtrar roles por búsqueda antes de paginar
  const filteredRoles = roles.filter(role =>
    role.nombre_rol.toLowerCase().includes(search.toLowerCase()) ||
    (role.descripcion?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    fetchRoles(newPage, pagination.page_size);
  };

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

  const handleExport = () => {
    alert('Funcionalidad de exportar próximamente');
  };

  if (error) {
    toast.error("Error al cargar los roles");
  }

  return (
    <div className="flex flex-col gap-2 min-h-[80vh]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestión de Roles</h1>
      </div>
      <RoleFiltersBar
        search={search}
        onSearchChange={v => { setSearch(v); fetchRoles(1, pagination.page_size); }}
        onAddRole={() => setShowForm(true)}
        onExport={handleExport}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      {loading ? (
        <div className="text-white">Cargando roles...</div>
      ) : viewMode === 'table' ? (
        <RoleListTable 
          roles={filteredRoles} 
          onSelect={setSelectedRole} 
          onDelete={handleRoleDeleted}
          onViewPermissions={setViewingPermissionsRoleId}
          page={pagination.page}
          pageSize={pagination.page_size}
          total={pagination.total}
          totalPages={pagination.total_pages}
          onPageChange={handlePageChange}
        />
      ) : (
        <RoleListCards
          roles={filteredRoles}
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
      {/* <PermissionsByModulePanel /> */}
    </div>
  );
} 