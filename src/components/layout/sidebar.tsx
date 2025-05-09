"use client";
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  FolderArchive,
  BarChart3,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Documentos', href: '/documents', icon: FileText },
  { name: 'Carpetas', href: '/folders', icon: FolderArchive },
  { name: 'Usuarios', href: '/users', icon: Users },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { name: 'Administración', href: '/admin', icon: Shield },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  minimized: boolean;
  setMinimized: (minimized: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen, minimized, setMinimized }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Cierra el sidebar cuando se hace clic fuera de él (para dispositivos móviles)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex flex-col overflow-y-auto bg-background border-r',
          'transition-all duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          minimized ? 'lg:w-20' : 'lg:w-64',
          'w-64 lg:translate-x-0 lg:z-0'
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!minimized && (
            <div className="flex items-center">
              <span className="text-xl font-semibold">Gestor Doc</span>
            </div>
          )}
          <div className="flex items-center">
            <button
              onClick={() => setMinimized(!minimized)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
              aria-label={minimized ? "Expandir sidebar" : "Minimizar sidebar"}
            >
              {minimized ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-1 flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="mt-5 px-2 flex-1">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary/50'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-6 w-6 flex-shrink-0',
                      minimized ? 'mx-auto' : 'mr-3',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                    )}
                  />
                  {!minimized && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {!minimized && user && (
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Función para convertir la ruta a un formato legible
  const getReadablePath = (path: string) => {
    if (path === '/dashboard') return 'Dashboard';
    return path.split('/').map(segment => {
      if (!segment) return '';
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    }).filter(Boolean);
  };
  
  const pathSegments = pathname.split('/').filter(Boolean);
  const readablePath = getReadablePath(pathname);
  
  return (
    <nav className="flex items-center" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/dashboard" className="text-sm font-medium text-primary flex items-center">
            <LayoutDashboard className="mr-1 h-4 w-4" />
            <span>Inicio</span>
          </Link>
        </li>
        {Array.isArray(readablePath) ? (
          readablePath.map((segment, index) => (
            <li key={index} className="flex items-center">
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="text-sm font-medium text-foreground">{segment}</span>
            </li>
          ))
        ) : (
          pathname !== '/dashboard' && (
            <li className="flex items-center">
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="text-sm font-medium text-foreground">{readablePath}</span>
            </li>
          )
        )}
      </ol>
    </nav>
  );
}