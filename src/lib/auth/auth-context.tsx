'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/lib/api/services';
import type { User, LoginCredentials } from '@/lib/api/services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUserProfile();
  }, []);
  
  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('session_token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      // Verificar si el token está expirado
      const expiresAt = localStorage.getItem('expires_at');
      if (expiresAt) {
        const expirationDate = new Date(expiresAt);
        if (new Date() > expirationDate) {
          // Token expirado, limpiar localStorage y redirigir al login
          localStorage.removeItem('session_token');
          localStorage.removeItem('expires_at');
          setIsLoading(false);
          return;
        }
      }
      
      // Añadir un timeout para evitar bloqueos prolongados
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout al conectar con la API')), 5000);
      });
      
      // Intentar obtener el perfil con timeout
      try {
        const response = await Promise.race([
          authService.getProfile(),
          timeoutPromise
        ]) as { valid: boolean; user: User };
        
        if (response.valid && response.user) {
          setUser(response.user);
        }
      } catch (fetchError) {
        console.error('[Auth] Error al obtener perfil, intentando modo offline:', fetchError);
        
        // IMPORTANTE: Modo offline/fallback
        // Si no podemos conectar a la API pero tenemos un token válido,
        // permitimos continuar con la sesión
        const cachedUserData = localStorage.getItem('user_data');
        if (cachedUserData) {
          try {
            const userData = JSON.parse(cachedUserData);
            setUser(userData);
            console.log('[Auth] Usuario cargado desde caché local');
          } catch (parseError) {
            console.error('[Auth] Error al parsear datos de usuario en caché:', parseError);
          }
        }
      }
    } catch (error: any) {
      console.error('[Auth] Error loading user profile:', error);
      // En caso de error, limpiar localStorage solo si es un error de autenticación
      // (no limpiar por errores de red)
      if (error.status === 401) {
        localStorage.removeItem('session_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('user_data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      // Guardar token y datos de expiración
      localStorage.setItem('session_token', response.session_token);
      if (response.expires_at) {
        localStorage.setItem('expires_at', response.expires_at);
      }
      
      if (credentials.rememberMe) {
        // Si marca "recordarme", establecer expiración a 30 días
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + 30);
        localStorage.setItem('expires_at', expiration.toISOString());
      } else {
        // Si no se marca "recordarme", establecer expiración a 1 hora
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expires_at', expiration.toISOString());
      }
      
      // Intentar obtener el perfil completo del usuario
      let userData;
      try {
        userData = await authService.getProfile();
        userData = userData.user; // Extract the user object from the response
        
        // Guardar datos del usuario en localStorage para uso offline
        localStorage.setItem('user_data', JSON.stringify(userData));
      } catch (profileError) {
        console.error('[Auth] Error al obtener perfil completo:', profileError);
        
        // Si no podemos obtener el perfil, crear un objeto de usuario básico con la información disponible
        userData = {
          id: response.user.id || 'unknown',
          username: credentials.username,
          nombre: response.user.nombre || '',
          apellidos: response.user.apellidos || '',
          email: response.user.email || '',
          roles: response.user.roles || [],
          permissions: response.user.permissions || []
        };
        
        // Guardar este usuario básico en localStorage
        localStorage.setItem('user_data', JSON.stringify(userData));
      }
      
      setUser(userData);
      toast.success('Inicio de sesión exitoso');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('[Auth] Error en login:', error);
      toast.error('Error al iniciar sesión: ' + (error.message || 'Verifica tus credenciales'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      localStorage.removeItem('session_token');
      localStorage.removeItem('expires_at');
      setUser(null);
      toast.success('Sesión cerrada exitosamente');
      router.push('/auth/login');
    } catch (error) {
      console.error('[Auth] Error en logout:', error);
      toast.error('Error al cerrar sesión');
      // Incluso si hay error, limpiamos localStorage
      localStorage.removeItem('session_token');
      localStorage.removeItem('expires_at');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const hasPermission = (permissionCode: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permissionCode);
  };
  
  const hasRole = (roleName: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some(r => r.nombre_rol === roleName);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        hasPermission,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}