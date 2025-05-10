"use client";
import { useEffect, useRef, useState } from 'react';
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
  Clock,
  AlertCircle,
  Upload,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Documentos', href: '/documents', icon: FileText },
  { name: 'Carpetas', href: '/folders', icon: FolderArchive },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

const documentsSubmenu = [
  { name: 'Explorador', href: '/documents/explorer', icon: FileText },
  { name: 'Historial', href: '/documents/history', icon: Clock },
  { name: 'Rechazados', href: '/documents/rejected', icon: AlertCircle },
  { name: 'Subir', href: '/documents/upload', icon: Upload },
  { name: 'Verificación', href: '/documents/verification', icon: CheckCircle },
];

const adminSubmenu = [
  { name: 'Usuarios', href: '/admin/users', icon: Users },
  { name: 'Carpetas', href: '/admin/folders', icon: FolderArchive },
  { name: 'Roles', href: '/admin/roles', icon: Shield },
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
  const [adminOpen, setAdminOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);

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
              const isDocuments = item.name === 'Documentos';
              
              return (
                <div key={item.name}>
                  {isDocuments ? (
                    <>
                      <button
                        type="button"
                        className={cn(
                          'group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md',
                          pathname.startsWith('/documents') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary/50'
                        )}
                        onClick={() => setDocumentsOpen((open) => !open)}
                        aria-expanded={documentsOpen ? "true" : "false"}
                      >
                        <item.icon className={cn('h-6 w-6 flex-shrink-0', minimized ? 'mx-auto' : 'mr-3', pathname.startsWith('/documents') ? 'text-primary-foreground' : 'text-muted-foreground')} />
                        {!minimized && <span>{item.name}</span>}
                        {!minimized && (
                          <ChevronRight
                            className={cn('ml-auto h-4 w-4 transition-transform', documentsOpen ? 'rotate-90' : '')}
                          />
                        )}
                      </button>
                      {/* Submenú de Documentos */}
                      {documentsOpen && !minimized && (
                        <div className="ml-8 mt-1 space-y-1">
                          {documentsSubmenu.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                className={cn(
                                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                                  isSubActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-foreground hover:bg-secondary/50'
                                )}
                              >
                                <sub.icon className={cn('h-5 w-5 mr-2', isSubActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                                <span>{sub.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
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
                  )}
                </div>
              );
            })}

            {/* Submenú de Administración */}
            <div>
              <button
                type="button"
                className={cn(
                  'group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md',
                  pathname.startsWith('/admin') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary/50'
                )}
                onClick={() => setAdminOpen((open) => !open)}
                aria-expanded={!!adminOpen}
              >
                <Shield className={cn('h-6 w-6 flex-shrink-0', minimized ? 'mx-auto' : 'mr-3', pathname.startsWith('/admin') ? 'text-primary-foreground' : 'text-muted-foreground')} />
                {!minimized && <span>Administración</span>}
                {!minimized && (
                  <ChevronRight
                    className={cn('ml-auto h-4 w-4 transition-transform', adminOpen ? 'rotate-90' : '')}
                  />
                )}
              </button>
              {/* Submenú desplegable */}
              {adminOpen && !minimized && (
                <div className="ml-8 mt-1 space-y-1">
                  {adminSubmenu.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={cn(
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                          isSubActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-secondary/50'
                        )}
                      >
                        <sub.icon className={cn('h-5 w-5 mr-2', isSubActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                        <span>{sub.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
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