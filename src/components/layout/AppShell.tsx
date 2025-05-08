"use client";
import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Sidebar } from './sidebar';
import { Menu, Bell, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark theme-transition">
      {/* Sidebar (mobile y desktop) */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} minimized={minimized} setMinimized={setMinimized} />

      {/* Main content */}
      <div className={minimized ? "lg:pl-20" : "lg:pl-64"}>
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-neutral-800 shadow theme-transition">
          <button
            type="button"
            title="Abrir menú"
            className="px-4 text-neutral-500 dark:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white lg:hidden"
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
                className="rounded-full bg-neutral-100 dark:bg-neutral-800 p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-white theme-transition"
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
                className="rounded-full bg-neutral-100 dark:bg-neutral-800 p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-white theme-transition"
              >
                <Bell className="h-6 w-6" />
              </button>
              <div className="relative ml-3">
                <button
                  type="button"
                  title="Cerrar sesión"
                  onClick={logout}
                  className="flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-white theme-transition"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 