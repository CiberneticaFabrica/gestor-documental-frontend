"use client";
import { useEffect, useState, FormEvent } from "react";
import { fetchRoles, type Role } from "@/services/common/roleService";
import axios from "axios";
import { toast } from "sonner";

interface UserFormData {
  nombre_usuario: string;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  roles: string[];
  requiere_2fa: boolean;
}

export function UserFormModal({ 
  onClose, 
  onUserCreated 
}: { 
  onClose: () => void;
  onUserCreated: () => void;
}) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UserFormData>({
    nombre_usuario: "",
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    roles: [],
    requiere_2fa: false
  });

  useEffect(() => {
    fetchRoles()
      .then(setRoles)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("session_token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/users`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.user_id) {
        toast.success("Usuario creado exitosamente");
        onUserCreated();
        onClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Error al crear usuario";
        toast.error(errorMessage);
      } else {
        toast.error("Error al crear usuario");
      }
      console.error("Error al crear usuario:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          title="Cerrar formulario"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Nuevo Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre_usuario" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Usuario</label>
            <input 
              id="nombre_usuario" 
              className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2" 
              placeholder="jsmith"
              value={formData.nombre_usuario}
              onChange={(e) => setFormData({...formData, nombre_usuario: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="nombre" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
            <input 
              id="nombre" 
              className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2" 
              placeholder="John"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="apellidos" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Apellidos</label>
            <input 
              id="apellidos" 
              className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2" 
              placeholder="Smith"
              value={formData.apellidos}
              onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input 
              id="email" 
              type="email" 
              className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2" 
              placeholder="john.smith@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
            <input 
              id="password" 
              type="password" 
              className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2" 
              placeholder="contrasena123"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="rol" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Rol</label>
            <select 
              id="rol" 
              className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2"
              disabled={loading}
              value={formData.roles[0] || ""}
              onChange={(e) => setFormData({...formData, roles: [e.target.value]})}
            >
              <option value="">Seleccione un rol</option>
              {roles.map((role) => (
                <option key={role.id_rol} value={role.id_rol}>
                  {role.nombre_rol}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="requiere_2fa" 
              checked={formData.requiere_2fa}
              onChange={(e) => setFormData({...formData, requiere_2fa: e.target.checked})}
            />
            <label htmlFor="requiere_2fa" className="text-sm text-gray-700 dark:text-gray-300">Requiere autenticación de dos factores</label>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Guardar</button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
} 