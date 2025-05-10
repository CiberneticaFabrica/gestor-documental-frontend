"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserListTable } from './UserListTable';
import { UserFormModal } from './UserFormModal';
import { UserDetailDrawer } from './UserDetailDrawer';
import { UserGroupsPanel } from './UserGroupsPanel';
import { fetchUsers } from './fetchUsers';

export interface User {
  id_usuario: string;
  nombre_usuario: string;
  nombre: string;
  apellidos: string;
  email: string;
  estado: string;
  fecha_creacion: string;
  ultimo_acceso: string | null;
  requiere_2fa: number;
  roles: { id_rol: string; nombre_rol: string }[];
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (user: User) => {
    // Implementar lógica de edición
    console.log('Editar usuario:', user);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        const token = localStorage.getItem("session_token");
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/users/${user.id_usuario}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        loadUsers(); // Recargar lista
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const token = localStorage.getItem("session_token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/users/${user.id_usuario}/status`,
        {
          estado: user.estado === 'activo' ? 'inactivo' : 'activo'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      loadUsers(); // Recargar lista
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };


  return (
    <div className="flex flex-col gap-6 min-h-[80vh]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-300 uppercase">Gestión de Usuarios</h1>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
          onClick={() => setShowForm(true)}
        >
          Nuevo usuario
        </button>
      </div>
      {loading ? (
        <div className="text-center text-gray-400">Cargando usuarios...</div>
      ) : (
        <UserListTable 
          users={users} 
          onSelect={setSelectedUser}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}
      {showForm && (
        <UserFormModal 
          onClose={() => setShowForm(false)} 
          onUserCreated={loadUsers}
        />
      )}
      {selectedUser && (
        <UserDetailDrawer 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
     {/* <UserGroupsPanel /> */}
    </div>
  );
} 