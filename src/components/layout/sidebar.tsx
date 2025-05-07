"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Upload,
  ClipboardList,
  XCircle,
  History,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
 
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Documentos', href: '/documents', icon: FileText },
  { name: 'Usuarios', href: '/users', icon: Users },
  { name: 'Administración', href: '/admin', icon: Settings },
];

const documentSubmenu = [
  { name: 'Explorador de documentos', href: '/documents/explorador', icon: FileText },
  { name: 'Carga de documentos', href: '/documents/carga', icon: Upload },
  { name: 'Documentos por verificar', href: '/documents/por-verificar', icon: ClipboardList },
  { name: 'Documentos rechazados', href: '/documents/rechazados', icon: XCircle },
  { name: 'Historial de procesamiento', href: '/documents/historial', icon: History },
];

const adminSubmenu = [
  { name: 'Gestión de Usuarios', href: '/admin/usuarios', icon: Users },
  { name: 'Gestión de Roles', href: '/admin/roles', icon: Settings },
  { name: 'Gestión de Carpetas', href: '/admin/carpetas', icon: FileText },
];

export function Sidebar({ sidebarOpen, setSidebarOpen, minimized, setMinimized }: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  minimized: boolean;
  setMinimized: (min: boolean) => void;
}) {
  const [docMenuOpen, setDocMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const pathname = usePathname();

  const isDocSubActive = documentSubmenu.some((item) => pathname.startsWith(item.href));
  const isAdminSubActive = adminSubmenu.some((item) => pathname.startsWith(item.href));

  // Glassmorphism classes
  const glass = "bg-white/90 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700/40 shadow-xl";
  const sidebarWidth = minimized ? 'w-20' : 'w-64';

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className={`fixed inset-y-0 left-0 ${sidebarWidth} ${glass} rounded-r-2xl transition-all duration-200`}>
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-500 p-2 rounded-full">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              {!minimized && <span className="text-xl font-semibold text-white">Gestor Doc</span>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMinimized(!minimized)}
                className="text-gray-400 hover:text-white"
                aria-label={minimized ? 'Expandir sidebar' : 'Minimizar sidebar'}
              >
                {minimized ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Cerrar menú"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          <nav className="mt-5 px-2">
            {navigation.map((item) => {
              if (item.name === 'Documentos') {
                return (
                  <div
                    key={item.name}
                    className="relative group"
                  >
                    <button
                      type="button"
                      onClick={() => setDocMenuOpen((v) => !v)}
                      className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isDocSubActive
                          ? 'bg-gray-100 dark:bg-gray-900 text-blue-600 dark:text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isDocSubActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                        }`}
                      />
                      {!minimized && item.name}
                      <svg className={`ml-auto h-4 w-4 transition-transform ${docMenuOpen ? 'rotate-90' : ''} ${minimized ? 'hidden' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {/* Submenu */}
                    {docMenuOpen && !minimized && (
                      <div
                        className={`pl-8 mt-1 space-y-1 rounded-md`}
                      >
                        {documentSubmenu.map((sub) => {
                          const isActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`flex items-center px-2 py-2 text-sm rounded-md transition-colors ${
                                isActive
                                  ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 font-semibold'
                                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300'
                              }`}
                            >
                              <sub.icon className={`mr-2 h-4 w-4 ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'}`} />
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              if (item.name === 'Administración') {
                return (
                  <div
                    key={item.name}
                    className="relative group"
                  >
                    <button
                      type="button"
                      onClick={() => setAdminMenuOpen((v) => !v)}
                      className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isAdminSubActive
                          ? 'bg-gray-100 dark:bg-gray-900 text-blue-600 dark:text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isAdminSubActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                        }`}
                      />
                      {!minimized && item.name}
                      <svg className={`ml-auto h-4 w-4 transition-transform ${adminMenuOpen ? 'rotate-90' : ''} ${minimized ? 'hidden' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {/* Submenu */}
                    {adminMenuOpen && !minimized && (
                      <div className={`pl-8 mt-1 space-y-1 rounded-md`}>
                        {adminSubmenu.map((sub) => {
                          const isActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`flex items-center px-2 py-2 text-sm rounded-md transition-colors ${
                                isActive
                                  ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 font-semibold'
                                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300'
                              }`}
                            >
                              <sub.icon className={`mr-2 h-4 w-4 ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'}`} />
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              // Resto de items
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-900 text-blue-600 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-500'
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                    }`}
                  />
                  {!minimized && item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex   lg:flex-col ${glass} rounded-r-2xl transition-all duration-200 ${minimized ? 'w-20' : 'w-64'}`}>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex h-16 items-center px-4 justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-500 p-2 rounded-full">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              {!minimized && <span className="text-xl font-semibold text-white">Gestor Doc</span>}
            </div>
            <button
              onClick={() => setMinimized(!minimized)}
              className="text-gray-400 hover:text-white"
              aria-label={minimized ? 'Expandir sidebar' : 'Minimizar sidebar'}
            >
              {minimized ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              if (item.name === 'Documentos') {
                return (
                  <div
                    key={item.name}
                    className="relative group"
                  >
                    <button
                      type="button"
                      onClick={() => setDocMenuOpen((v) => !v)}
                      className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isDocSubActive
                          ? 'bg-gray-100 dark:bg-gray-900 text-blue-600 dark:text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isDocSubActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                        }`}
                      />
                      {!minimized && item.name}
                      <svg className={`ml-auto h-4 w-4 transition-transform ${docMenuOpen ? 'rotate-90' : ''} ${minimized ? 'hidden' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {/* Submenu */}
                    {docMenuOpen && !minimized && (
                      <div
                        className={`pl-8 mt-1 space-y-1 rounded-md`}
                      >
                        {documentSubmenu.map((sub) => {
                          const isActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`flex items-center px-2 py-2 text-sm rounded-md transition-colors ${
                                isActive
                                  ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 font-semibold'
                                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300'
                              }`}
                            >
                              <sub.icon className={`mr-2 h-4 w-4 ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'}`} />
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              if (item.name === 'Administración') {
                return (
                  <div
                    key={item.name}
                    className="relative group"
                  >
                    <button
                      type="button"
                      onClick={() => setAdminMenuOpen((v) => !v)}
                      className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isAdminSubActive
                          ? 'bg-gray-100 dark:bg-gray-900 text-blue-600 dark:text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isAdminSubActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                        }`}
                      />
                      {!minimized && item.name}
                      <svg className={`ml-auto h-4 w-4 transition-transform ${adminMenuOpen ? 'rotate-90' : ''} ${minimized ? 'hidden' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {/* Submenu */}
                    {adminMenuOpen && !minimized && (
                      <div className={`pl-8 mt-1 space-y-1 rounded-md`}>
                        {adminSubmenu.map((sub) => {
                          const isActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`flex items-center px-2 py-2 text-sm rounded-md transition-colors ${
                                isActive
                                  ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 font-semibold'
                                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300'
                              }`}
                            >
                              <sub.icon className={`mr-2 h-4 w-4 ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'}`} />
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              // Resto de items
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-900 text-blue-600 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-500'
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                    }`}
                  />
                  {!minimized && item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
