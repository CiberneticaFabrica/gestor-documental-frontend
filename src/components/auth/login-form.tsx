"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircleUser, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FocusRing, AriaLive } from '@/components/ui/accessibility';
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
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Ingresa tus credenciales para acceder
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="sr-only">
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
                className="pl-10"
                placeholder="Usuario"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
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
                className="pl-10"
                placeholder="Contraseña"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
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

          <div className="text-sm">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-primary hover:text-primary/80"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </form>
    </div>
  );
}