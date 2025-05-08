import React from 'react';
import Link from 'next/link';
import { SkipLink, FocusRing } from '@/components/ui/accessibility';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip Link para navegación por teclado */}
      <SkipLink>Saltar al contenido principal</SkipLink>

      {/* Header con navegación principal */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <nav className="flex items-center space-x-4 lg:space-x-6" role="navigation" aria-label="Navegación principal">
            <FocusRing>
              <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </Link>
            </FocusRing>
            <FocusRing>
              <Link href="/documents" className="text-sm font-medium transition-colors hover:text-primary">
                Documentos
              </Link>
            </FocusRing>
            <FocusRing>
              <Link href="/users" className="text-sm font-medium transition-colors hover:text-primary">
                Usuarios
              </Link>
            </FocusRing>
          </nav>
        </div>
      </header>

      {/* Contenido principal con estructura semántica */}
      <main id="main-content" className={cn("container py-6", className)}>
        {children}
      </main>

      {/* Footer con información accesible */}
      <footer className="border-t py-6" role="contentinfo">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 Gestor Documental. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
} 