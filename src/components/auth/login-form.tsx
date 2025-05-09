"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircleUser, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FocusRing, AriaLive } from '@/components/ui/accessibility';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from "next/image";

// URL base de la API - asegúrate que sea la URL correcta
const API_BASE_URL = 'https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod';

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log("Enviando datos de inicio de sesión:", { username, password });

    try {
      // Usamos la URL completa del API Gateway
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin, // Enviamos el origen para CORS
        },
        // Incluimos credenciales si usas cookies
       
        body: JSON.stringify({ 
          username, // o email: username si tu API espera 'email'
          password 
        })
      });

      console.log("Status de respuesta:", response.status);

      if (!response.ok) {
        let errorMessage = 'Error al iniciar sesión';
        
        try {
          const errorData = await response.json();
          console.log("Error detallado:", errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // Si no es JSON, intentamos obtener texto
          console.log("Error (texto):", e);
          const errorText = await response.text();
          console.log("Error (texto):", errorText);
        }
        
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Respuesta exitosa:", data);
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('session_token', data.session_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      debugger;
      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error de red detallado:', error);
      setError('Error de red o del servidor. Por favor, intenta de nuevo más tarde.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Columna izquierda: Branding e info */}
      <div className="hidden md:flex md:w-2/5 h-full bg-blue-700 flex flex-col justify-center items-center p-8 text-white relative overflow-hidden">
        {/* Logo y nombre de la app */}
        <div className="flex items-center space-x-3 mb-8 z-10">
          <div className="bg-white/20 p-3 rounded-full">
            <CircleUser className="h-8 w-8 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Gestor Documental</span>
        </div>
        {/* Texto principal */}
        <div className="mb-8 text-center z-10">
          <h2 className="text-3xl font-bold mb-2">Inicia sesión y gestiona todo</h2>
          <p className="text-lg opacity-90">Accede a tu cuenta para administrar documentos y equipos de forma simple y segura.</p>
        </div>
        {/* Tarjeta informativa */}
        <div className="bg-white/10 rounded-lg p-6 shadow-lg w-full max-w-xs mb-8 z-10">
          <div className="flex items-center mb-4">
            <Image src="/icons/engineer.png" alt="Engineer" width={32} height={32} className="mr-2" />
            <span className="font-semibold">Coste de gestión</span>
          </div>
          <div className="text-sm">
            <div className="flex justify-between mb-1"><span>Base anual</span><span>$100,000</span></div>
            <div className="flex justify-between mb-1"><span>Costos adicionales</span><span>$17,105.04</span></div>
            <div className="flex justify-between font-bold"><span>Total</span><span>$117,105.04</span></div>
          </div>
        </div>
        {/* Fondo decorativo */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl z-0"></div>
        
      </div>
      {/* Columna derecha: Formulario */}
      <div className="w-full md:w-3/5 h-full flex items-center justify-center bg-gray-50 bg-imageLogin">
        <div className="max-w-lg w-full space-y-8 bg-white p-12 rounded-lg shadow-xl relative z-10">
          {/* Encabezado */}
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">Bienvenido <span>👋</span></h1>
            <p className="text-gray-500 text-base">Inicia sesión para continuar</p>
          </div>
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AriaLive>
              {error && (
                <div className="rounded-md bg-red-100 p-4 border border-red-300 mb-2">
                  <p className="text-sm font-medium text-red-600">{error}</p>
                </div>
              )}
            </AriaLive>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">Usuario</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </div>
                <FocusRing>
                  <Input
                    id="username"
                    className="w-full pl-10 text-base text-gray-900 placeholder:text-gray-400 bg-gray-100 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="usuario@ejemplo.com"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </FocusRing>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <FocusRing>
                  <Input
                    id="password"
                    className="w-full pl-10 pr-10 text-base text-gray-900 placeholder:text-gray-400 bg-gray-100 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="••••••••"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FocusRing>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  aria-label="Recordarme"
                  className="h-4 w-4 rounded border-gray-400 bg-gray-100 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Recordarme
                </label>
              </div>
              <Link href="/auth/reset-password" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Ingresando..." : "Iniciar sesión"}
            </Button>
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Al continuar, aceptas nuestros{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">Términos de Servicio</Link> y{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">Política de Privacidad</Link>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}