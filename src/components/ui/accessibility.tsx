import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Componente para ocultar visualmente contenido que debe ser accesible para lectores de pantalla
 * Útil para texto descriptivo que no necesita ser visible pero debe ser leído por tecnologías de asistencia
 */
interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function VisuallyHidden({ children, className, ...props }: VisuallyHiddenProps) {
  return (
    <span
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Componente para permitir a usuarios de teclado saltar directamente al contenido principal
 * Aparece solo cuando se recibe el foco, mejorando la navegación por teclado
 */
interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

export function SkipLink({ children = "Skip to content", className, ...props }: SkipLinkProps) {
  return (
    <a
      href="#main-content"
      className={cn(
        "fixed top-0 left-0 z-50 p-4 m-4 -translate-y-full bg-primary-600 text-white rounded-md focus:translate-y-0 transition-transform",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Componente que agrega un anillo de foco visible alrededor de su contenido
 * Mejora la visibilidad del foco para usuarios de teclado
 */
interface FocusRingProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function FocusRing({ children, className, ...props }: FocusRingProps) {
  return (
    <div
      className={cn(
        "focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 rounded-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Componente para anunciar cambios dinámicos a usuarios de lectores de pantalla
 * Útil para notificaciones, actualizaciones de estado o mensajes de error
 */
interface AriaLiveProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
}

export function AriaLive({ children, className, ...props }: Omit<AriaLiveProps, 'politeness'>) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("sr-only", className)}
      {...props}
    >
      {children}
    </div>
  );
} 