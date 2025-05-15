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
import { RoleFiltersBar } from './RoleFiltersBar';
import { RoleListCards } from './RoleListCards';

export interface Role extends APIRole {
  permissions?: string[];
}

export default function RolesAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [viewingPermissionsRoleId, setViewingPermissionsRoleId] = useState<string | null>(null);
  const { roles, loading, error, refresh } = useRoles();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filtrar roles por búsqueda antes de paginar
  const filteredRoles = roles.filter(role =>
    role.nombre_rol.toLowerCase().includes(search.toLowerCase()) ||
    (role.descripcion?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const total = filteredRoles.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginatedRoles = filteredRoles.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (p: number) => {
    setPage(p);
  };

  const handleRoleCreated = () => {
    setShowForm(false);
    refresh();
    setPage(1);
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
        onSearchChange={v => { setSearch(v); setPage(1); }}
        onAddRole={() => setShowForm(true)}
        onExport={handleExport}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      {loading ? (
        <div className="text-white">Cargando roles...</div>
      ) : viewMode === 'table' ? (
        <RoleListTable 
          roles={paginatedRoles} 
          onSelect={setSelectedRole} 
          onDelete={handleRoleDeleted}
          onViewPermissions={setViewingPermissionsRoleId}
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : (
        <RoleListCards
          roles={paginatedRoles}
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