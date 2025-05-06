"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircleUser, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
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

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales inválidas. Por favor, verifica tu usuario y contraseña.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <div className="max-w-md w-full space-y-8 bg-gray-850 p-8 rounded-lg shadow-lg relative overflow-hidden">
        {/* Background curve effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl z-0"></div>
        
        {/* Logo and Header */}
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-blue-500 p-2 rounded-full">
              <CircleUser className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-medium text-white">Gestor Documental</h2>
          </div>
          
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold text-white">Bienvenido</h1>
 
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <div className="rounded-md bg-red-500/10 p-4">
              <p className="text-sm font-medium text-red-500">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Usuario</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-3 pl-10 text-base text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="usuario@ejemplo.com"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Contraseña</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-3 pl-10 pr-10 text-base text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="••••••••"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                aria-label="Recordarme"
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="text-sm font-medium text-gray-300 cursor-pointer">
                Recordarme
              </label>
            </div>
            
            <Link href="/auth/reset-password" className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center rounded-md font-medium transition-colors h-12 px-6 text-lg bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              Al continuar, aceptas nuestros{" "}
              <a href="#" className="text-blue-500 hover:text-blue-400">Términos de Servicio</a> y{" "}
              <a href="#" className="text-blue-500 hover:text-blue-400">Política de Privacidad</a>.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}