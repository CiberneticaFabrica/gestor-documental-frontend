"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircleUser, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from 'sonner';

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ username, password, rememberMe });
      router.push('/dashboard');
    } catch (error) {
      toast.error('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex">
      {/* Panel izquierdo */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white md:w-1/3 p-8 lg:p-10 relative min-h-screen">
        <div className="flex flex-col justify-center flex-1 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-white rounded-full p-2">
                <CircleUser className="h-6 w-6 text-blue-900" />
              </span>
              <span className="text-2xl font-bold tracking-tight">Gestor Doc</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 leading-tight">Inicia sesión y gestiona tus documentos</h2>
            <p className="mb-6 text-blue-100 text-base leading-snug">
              Accede a tu cuenta para administrar, cargar y consultar documentos de manera segura y eficiente.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-blue-800 rounded-full p-1.5">
                  <Lock className="h-4 w-4 text-white" />
                </span>
                <span className="text-sm">Seguridad bancaria</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-800 rounded-full p-1.5">
                  <Mail className="h-4 w-4 text-white" />
                </span>
                <span className="text-sm">Soporte 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-800 rounded-full p-1.5">
                  <CircleUser className="h-4 w-4 text-white" />
                </span>
                <span className="text-sm">Gestión de usuarios y permisos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fondo decorativo */}
        <div className="absolute bottom-0 right-0 opacity-40">
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="120" cy="120" r="120" fill="#1E3A8A" />
          <circle cx="120" cy="120" r="100" fill="#1E40AF" />
          <circle cx="120" cy="120" r="80" fill="#2563EB" />
        </svg>
      </div>

        <div className="text-xs text-blue-200 mt-6">© 2024 Gestor Doc. Todos los derechos reservados.</div>
      </div>

      {/* Panel derecho */}
      <div className="flex flex-col justify-center w-full md:w-2/3 px-6 py-12 bg-white dark:bg-gray-900 min-h-screen bg-glass-background">
         

        <div className="w-full max-w-lg mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bienvenido de nuevo <span role="img" aria-label="saludo">👋</span>
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Usuario */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CircleUser className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 border border-gray-300 focus:border-blue-600 focus:ring-blue-600 shadow-sm rounded-md text-sm"
                  placeholder="Usuario"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border border-gray-300 focus:border-blue-600 focus:ring-blue-600 shadow-sm rounded-md text-sm"
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Recordarme / Link */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  Recordarme
                </label>
              </div>
              <div className="text-sm text-right mt-2 sm:mt-0">
                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Botón de login */}
            <Button
              type="submit"
              className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          {/* Registro */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Regístrate
            </Link>
          </div>
        </div>
         
      </div>
    </div>
  );
}
