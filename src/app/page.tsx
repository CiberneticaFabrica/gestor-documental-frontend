'use client';

import { useAuth } from "@/lib/auth/auth-context";
import LoginForm from '@/components/auth/login-form';

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bienvenido al Gestor Documental</h1>
          <p className="text-gray-600">Por favor, inicia sesión para continuar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Bienvenido, {user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-full border border-solid flex items-center justify-center bg-primary text-white gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto hover:bg-primarylight"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Roles</h2>
            <div className="flex flex-wrap gap-2">
              {user?.roles.map((role) => (
                <span key={role.id_rol} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {role.nombre_rol}
                </span>
              ))}
            </div>
          </div>

      
        </div>
      </div>
    </div>
  );
}