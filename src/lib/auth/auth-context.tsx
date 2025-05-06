'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { User } from 'next-auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setup2FA: () => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setUser(session.user as User);
    } else {
      setUser(null);
    }
  }, [session]);

  const login = async (username: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Actualizar la sesión después del login exitoso
      await update();
      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      setUser(null);
      router.push('/login');
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error en logout:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: session?.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al refrescar el token');
      }

      const data = await response.json();
      await update({
        ...session,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    } catch (error) {
      console.error('Error al refrescar token:', error);
      // Si falla el refresh, forzar logout
      await logout();
    }
  };

  const setup2FA = async () => {
    try {
      const response = await fetch('/api/auth/setup-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al configurar 2FA');
      }

      const data = await response.json();
      router.push(`/setup-2fa?secret=${data.secret}`);
    } catch (error) {
      console.error('Error al configurar 2FA:', error);
      toast.error('Error al configurar la autenticación de dos factores');
    }
  };

  const verify2FA = async (code: string) => {
    try {
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Código 2FA inválido');
      }

      await update();
      toast.success('Autenticación de dos factores configurada exitosamente');
    } catch (error) {
      console.error('Error al verificar 2FA:', error);
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const value = {
    user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    login,
    logout,
    refreshToken,
    setup2FA,
    verify2FA,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
} 