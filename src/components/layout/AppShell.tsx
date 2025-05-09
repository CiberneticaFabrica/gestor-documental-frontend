"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Breadcrumbs } from './sidebar'; // Importación corregida
import { Sidebar } from './sidebar';
import { Menu, Bell, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  // Cierra el sidebar cuando se redimensiona la pantalla a un tamaño más grande
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // 1024px corresponde a 'lg' en Tailwind
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcula el padding-left según el estado minimizado
  const mainPadding = minimized ? 'lg:pl-20' : 'lg:pl-64';

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar (mobile y desktop) */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        minimized={minimized}
        setMinimized={setMinimized}
      />

      {/* Main content - Ahora con flex-1 para ocupar todo el espacio disponible */}
      <div className={`flex-1 flex flex-col ${mainPadding} transition-all duration-300 ease-in-out overflow-hidden`}>
        <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-background border-b">
          <button
            type="button"
            title="Abrir menú"
            className="px-4 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1 items-center">
              <Breadcrumbs />
            </div>
            <div className="ml-4 flex items-center md:ml-6 gap-2">
              <button
                type="button"
                className="rounded-full bg-secondary p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Cambiar tema"
              >
                {theme === 'dark' ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </button>
              <button
                type="button"
                title="Notificaciones"
                className="rounded-full bg-secondary p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Bell className="h-6 w-6" />
              </button>
              <div className="relative ml-3">
                <button
                  type="button"
                  title="Cerrar sesión"
                  onClick={logout}
                  className="flex items-center rounded-full bg-secondary p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Área de contenido principal - Con overflow-auto para permitir scroll y w-full para ancho completo */}
        <main className="flex-1 overflow-auto w-full">
          <div className="p-4 md:p-6 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}