"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  FolderArchive,
  BarChart3,
  Shield,
  Clock,
  AlertCircle,
  Upload,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  Activity,
  Cog,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { clientService } from '@/lib/api/services/client.service';

type MenuItem = {
  name: string;
  href: string;
  icon: any;
  soon?: boolean;
};

const mainMenu: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Carpetas', href: '/folders', icon: FolderArchive },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { name: 'Due Diligence', href: '#', icon: Shield, soon: true },
];

const documentsSubmenu: MenuItem[] = [
  { name: 'Explorador', href: '/documents/explorer', icon: FileText },
  { name: 'Subir', href: '/documents/upload', icon: Upload },
   
];

const kycSubmenu: MenuItem[] = [
  { name: 'Dashboard KYC', href: '/kyc/dashboard', icon: LayoutDashboard },
  { name: 'Clientes', href: '/kyc/clients', icon: Users },
  { name: 'Documentos Pendientes', href: '/kyc/pending-documents', icon: FileText },
  { name: 'Notificaciones', href: '/kyc/notifications', icon: AlertCircle },
 
];

const adminMenu: MenuItem[] = [
  { name: 'Usuarios', href: '/admin/users', icon: Users },
  { name: 'Carpetas', href: '/admin/folders', icon: FolderArchive },
  { name: 'Roles', href: '/admin/roles', icon: Shield },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

const auditMenu: MenuItem[] = [
  { name: 'Auditoría Clientes', href: '/audits/documentos', icon: FileText },
  { name: 'Auditoría Seguridad', href: '/audits/seguridad', icon: Shield },
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
  const { theme } = useTheme();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);

  // Variables CSS para colores según el tema
  const textColorSecondary = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';

  useEffect(() => {
    // Aplicar variables CSS dinámicamente
    document.documentElement.style.setProperty('--text-color-secondary', textColorSecondary);
  }, [theme, textColorSecondary]);

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
        <div className="flex flex-col h-full">
          {/* Logo y título */}
          <div className="flex items-center h-16 px-4 border-b">
            <div className={minimized ? "flex-1 flex justify-center" : "flex items-center"}>
              {!minimized ? (
                <div className="flex items-center gap-3">
                  {/* Logo SVG compuesto */}
                  <svg width="40" height="40" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Elipse grande */}
                    <ellipse cx="110" cy="110" rx="90" ry="90" stroke="currentColor" strokeWidth="4" fill="none"/>
                    {/* Círculo superior */}
                    <circle cx="110" cy="30" r="24" fill="currentColor"/>
                    {/* Círculo izquierdo */}
                    <circle cx="40" cy="150" r="24" fill="currentColor"/>
                    {/* Círculo derecho */}
                    <circle cx="180" cy="150" r="24" fill="currentColor"/>
                  </svg>
                  <div className="flex flex-col">
                    <span style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'currentColor',
                      letterSpacing: '0.05em',
                      lineHeight: 1
                    }}>
                      DocFlow AI
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-color-secondary)',
                      fontWeight: 400,
                      marginTop: 1,
                      marginLeft: 2
                    }}>
                      by Cibernética
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  {/* Logo SVG compuesto (versión minimizada) */}
                  <svg width="32" height="32" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Elipse grande */}
                    <ellipse cx="110" cy="110" rx="90" ry="90" stroke="currentColor" strokeWidth="4" fill="none"/>
                    {/* Círculo superior */}
                    <circle cx="110" cy="30" r="24" fill="currentColor"/>
                    {/* Círculo izquierdo */}
                    <circle cx="40" cy="150" r="24" fill="currentColor"/>
                    {/* Círculo derecho */}
                    <circle cx="180" cy="150" r="24" fill="currentColor"/>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Botón de minimizar */}
          <button
            onClick={() => setMinimized(!minimized)}
            className="absolute right-0 top-16 w-4 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-700 border-l hidden lg:flex"
            aria-label={minimized ? 'Expandir sidebar' : 'Minimizar sidebar'}
          >
            {minimized ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          <nav className="flex-1 px-2 py-4 space-y-6">
            {/* MENÚ PRINCIPAL */}
            <div>
              <div className="px-2 text-xs font-semibold text-gray-400 mb-2 tracking-widest">
                {minimized ? <span className="text-lg">…</span> : "MENÚ"}
              </div>
              <div className="space-y-1">
                {mainMenu.map((item) => (
                  <SidebarLink
                    key={item.name}
                    icon={item.icon}
                    href={item.href}
                    label={item.name}
                    active={item.name === 'Clientes' ? pathname.startsWith('/clients') : pathname === item.href}
                    minimized={minimized}
                    soon={item.soon}
                  />
                ))}
              </div>
            </div>

            {/* DOCUMENTACIÓN */}
            <div>
              <div className="px-2 text-xs font-semibold text-gray-400 mb-2 tracking-widest">
                {minimized ? <span className="text-lg">…</span> : "DOCUMENTACIÓN"}
              </div>
              <div>
                <button
                  type="button"
                  className={cn(
                    'group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md',
                    pathname.startsWith('/documents') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary/50',
                    minimized ? 'justify-center' : ''
                  )}
                  onClick={() => {
                    setMinimized(false);
                    setDocumentsOpen((open) => !open);
                  }}
                  aria-expanded="false"
                  title={minimized ? "Documentos" : undefined}
                >
                  <FileText className={cn('h-6 w-6 flex-shrink-0', minimized ? '' : 'mr-3', pathname.startsWith('/documents') ? 'text-primary-foreground' : ' text-gray-400')} />
                  {!minimized && <span>Documentos</span>}
                  {!minimized && (
                    <svg className={cn('ml-auto h-4 w-4 transition-transform', documentsOpen ? 'rotate-90' : '')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
                {documentsOpen && !minimized && (
                  <div className="ml-8 mt-1 space-y-1 relative">
                    {/* Línea vertical */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-100 text-sm" />
                    {documentsSubmenu.map((sub) => (
                      <SidebarLink
                        key={sub.name}
                        icon={sub.icon}
                        href={sub.href}
                        label={sub.name}
                        active={pathname === sub.href}
                        small
                        showDot={pathname === sub.href}
                        minimized={minimized}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* KYC */}
            <div>
              <div className="px-2 text-xs font-semibold text-gray-400 mb-2 tracking-widest">
                {minimized ? <span className="text-lg">…</span> : "KYC"}
              </div>
              <div>
                <button
                  type="button"
                  className={cn(
                    'group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md',
                    pathname.startsWith('/kyc') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary/50',
                    minimized ? 'justify-center' : ''
                  )}
                  onClick={() => {
                    setMinimized(false);
                    setKycOpen((open) => !open);
                  }}
                  aria-expanded="false"
                  title={minimized ? "KYC" : undefined}
                >
                  <Shield className={cn('h-6 w-6 flex-shrink-0', minimized ? '' : 'mr-3', pathname.startsWith('/kyc') ? 'text-primary-foreground' : ' text-gray-400')} />
                  {!minimized && <span>KYC & Compliance</span>}
                  {!minimized && (
                    <svg className={cn('ml-auto h-4 w-4 transition-transform', kycOpen ? 'rotate-90' : '')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
                {kycOpen && !minimized && (
                  <div className="ml-8 mt-1 space-y-1 relative">
                    {/* Línea vertical */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-100 text-sm" />
                    {kycSubmenu.map((sub) => (
                      <SidebarLink
                        key={sub.name}
                        icon={sub.icon}
                        href={sub.href}
                        label={sub.name}
                        active={pathname === sub.href}
                        small
                        showDot={pathname === sub.href}
                        minimized={minimized}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ADMINISTRACIÓN */}
            <div>
              <div className="px-2 text-xs font-semibold text-gray-400 mb-2 tracking-widest">
                {minimized ? <span className="text-lg">…</span> : "ADMINISTRACIÓN"}
              </div>
              <div className="space-y-1 ">
                {adminMenu.map((item) => (
                  <SidebarLink
                    key={item.name}
                    icon={item.icon}
                    href={item.href}
                    label={item.name}
                    active={pathname === item.href}
                    minimized={minimized}
                    soon={item.soon}
                  />
                ))}
              </div>
            </div>

            {/* AUDITORÍA */}
            <div>
              <div className="px-2 text-xs font-semibold text-gray-400 mb-2 tracking-widest">
                {minimized ? <span className="text-lg">…</span> : "AUDITORÍA"}
              </div>
              <div>
                <button
                  type="button"
                  className={cn(
                    'group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md',
                    pathname.startsWith('/audit') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary/50',
                    minimized ? 'justify-center' : ''
                  )}
                  onClick={() => {
                    setMinimized(false);
                    setAuditOpen((open) => !open);
                  }}
                  aria-expanded="false"
                  title={minimized ? "Auditoría" : undefined}
                >
                  <Shield className={cn('h-6 w-6 flex-shrink-0', minimized ? '' : 'mr-3', pathname.startsWith('/audit') ? 'text-primary-foreground' : ' text-gray-400')} />
                  {!minimized && <span>Auditoría</span>}
                  {!minimized && (
                    <svg className={cn('ml-auto h-4 w-4 transition-transform', auditOpen ? 'rotate-90' : '')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
                {auditOpen && !minimized && (
                  <div className="ml-8 mt-1 space-y-1 relative">
                    {/* Línea vertical */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-100 text-sm" />
                    {auditMenu.map((sub) => (
                      <SidebarLink
                        key={sub.name}
                        icon={sub.icon}
                        href={sub.href}
                        label={sub.name}
                        active={pathname === sub.href}
                        small
                        showDot={pathname === sub.href}
                        minimized={minimized}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>

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
  const [clientName, setClientName] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchClientName = async () => {
      const segments = pathname.split('/');
      const clientId = segments[segments.length - 1];
      
      if (segments.includes('clients') && clientId && clientId !== 'clients') {
        try {
          const data = await clientService.getClientDetail(clientId);
          setClientName(data.cliente.nombre_razon_social);
        } catch (error) {
          console.error('Error fetching client name:', error);
        }
      } else {
        // Limpiar el nombre del cliente cuando no estamos en una página de detalle
        setClientName(null);
      }
    };

    fetchClientName();
  }, [pathname]);

  // Construir los items del breadcrumb
  const items = pathname.split('/').filter(Boolean).map((segment, index, array) => {
    const href = '/' + array.slice(0, index + 1).join('/');
    let label = segment;

    // Formatear labels específicos
    if (segment === 'clients') {
      label = 'Clientes';
    } else if (segment === 'documents') {
      label = 'Documentos';
    } else if (segment === 'users') {
      label = 'Usuarios';
    } else if (segment === 'settings') {
      label = 'Configuración';
    } else if (segment === 'dashboard') {
      label = 'Dashboard';
    }

    // Si es el último segmento y tenemos el nombre del cliente, usarlo
    if (index === array.length - 1 && clientName && segment === array[array.length - 1]) {
      label = clientName;
    }

    return {
      label,
      href,
    };
  });

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link
        href="/"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <Link
            href={item.href}
            className={cn(
              'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              index === items.length - 1 && 'font-medium text-gray-900 dark:text-gray-100'
            )}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}

function SidebarLink({
  icon: Icon,
  href,
  label,
  active = false,
  small = false,
  showDot = false,
  minimized = false,
  soon = false,
}: {
  icon: any,
  href: string,
  label: string,
  active?: boolean,
  small?: boolean,
  showDot?: boolean,
  minimized?: boolean,
  soon?: boolean,
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center px-2 py-2 rounded group relative transition-colors ',
        active
          ? 'bg-primary font-semibold text-primary-foreground'
          : 'text-foreground hover:bg-gray-100',
        small ? 'text-sm pl-7' : ''
      )}
    >
      {/* Punto azul para el submenú activo */}
      {showDot && (
        <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
      )}
      <Icon
        className={cn(
          minimized ? 'mx-auto' : 'mr-3',
          'h-5 w-5',
          active ? 'text-primary-foreground' : 'text-gray-400 group-hover:text-primary'
        )}
      />
      <span
        className={cn(
          'text-sm font-medium',
          active ? 'text-primary-foreground' : '',
          small ? 'text-xs' : '',
          minimized ? 'hidden' : ''
        )}
      >
        {label}
      </span>
      {soon && (
        <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">Soon</span>
      )}
    </Link>
  );
}