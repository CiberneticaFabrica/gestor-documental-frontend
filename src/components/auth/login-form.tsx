"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircleUser, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from 'sonner';
import Image from 'next/image';

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rememberMe') === 'true';
    }
    return false;
  });
  const router = useRouter();
  const { login } = useAuth();

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    localStorage.setItem('rememberMe', isChecked.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ username, password, rememberMe });
    } catch (error) {
      toast.error('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Fondo dividido */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-10 text-white hidden md:flex flex-col justify-center py-16">
          <div>
            <div className="flex items-center gap-2 mb-1">
            <Image 
                src="/images/cybelexlogoblanco.png" 
                alt="CyberLex" 
                width={400} 
                height={400} 
                className="h-20 mr-2"
              />
         
            </div>
     
         
            <h2 className="text-2xl font-bold mb-2 leading-tight">Inicia sesión y gestiona tus documentos</h2>
            <p className="mb-6 text-blue-100 text-base leading-relaxed max-w-md">
              Accede a tu cuenta para administrar, cargar y consultar documentos de manera segura y eficiente.
              Con Gestor Doc puedes organizar archivos, controlar el acceso de tu equipo, gestionar vencimientos,
              generar reportes de auditoría y mantener todo centralizado, con respaldo automático y trazabilidad completa.
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

            <div className="text-xs text-blue-200 mt-10">© 2024 Gestor Doc. Todos los derechos reservados.</div>
          </div>
        </div>

        <div className="w-1/2 bg-white  hidden md:block  ">
        <svg className="pointer-events-none absolute inset-0" viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
        <g className="opacity-5 MuiBox-root muiltr-0" fill="none" stroke="currentColor" stroke-width="100">
          <circle r="234" cx="196" cy="23"></circle><circle r="234" cx="790" cy="491"></circle></g>
          </svg>
        </div>
      </div>

      {/* Contenedor del formulario centrado */}
      <div className="relative z-10 flex items-center justify-center w-full px-4 ">
 
        <div className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl p-12 w-full max-w-xl">
          <div className="mb-6 text-center">
    
            <h2 className="text-3xl font-bold text-gray-900">
              Bienvenido de nuevo  
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Usuario */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="pl-10 border border-gray-300 focus:border-blue-600 shadow-sm rounded-md text-sm bg-white text-gray-900 placeholder:text-gray-500"
                  placeholder="Usuario"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700  mb-1">
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
                  className="pl-10 pr-10 border border-gray-300 focus:border-blue-600 shadow-sm rounded-md text-sm bg-white text-gray-900 placeholder:text-gray-500"
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
                  onChange={handleRememberMeChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 "
                >
                  Recordarme
                </label>
              </div>
              <div className="text-sm text-right mt-2 sm:mt-0">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:underline">
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
               <Lock className="h-4 w-4 mr-2" />
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
             
            </Button>
          </form>

          {/* Registro 
          <div className="mt-8 text-center text-sm text-gray-500 ">
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Regístrate
            </Link>
          </div>*/}
        </div>
      </div>
    </div>
  );
}
