"use client";
import { useState } from 'react';
import { UserListTable } from './UserListTable';
import { UserFormModal } from './UserFormModal';
import { UserDetailDrawer } from './UserDetailDrawer';
import { UserGroupsPanel } from './UserGroupsPanel';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'activo' | 'inactivo';
  group: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan@banco.com', role: 'Administrador', status: 'activo', group: 'Oficina Central' },
  { id: '2', name: 'María García', email: 'maria@banco.com', role: 'Validador', status: 'inactivo', group: 'Sucursal Norte' },
];

export default function UsersAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="flex flex-col gap-6 min-h-[80vh]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setShowForm(true)}>Nuevo usuario</button>
      </div>
      <UserListTable users={mockUsers} onSelect={setSelectedUser} />
      {showForm && <UserFormModal onClose={() => setShowForm(false)} />}
      {selectedUser && <UserDetailDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />}
      <UserGroupsPanel />
    </div>
  );
} 