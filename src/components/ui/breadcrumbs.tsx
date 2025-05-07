'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  // Si estamos en el dashboard, solo mostramos Inicio
  if (pathname === '/dashboard') {
    breadcrumbs.push({
      label: 'Inicio',
      href: '/dashboard',
      icon: <Home className="h-4 w-4" />,
    });
  } else {
    // Si no estamos en el dashboard, agregamos Inicio y las demás rutas
    breadcrumbs.push({
      label: 'Inicio',
      href: '/dashboard',
      icon: <Home className="h-4 w-4" />,
    });

    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      if (segment !== 'dashboard') {
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: currentPath,
        });
      }
    });
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={`${breadcrumb.href}-${index}`} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            )}
            <Link
              href={breadcrumb.href}
              className={`flex items-center text-sm font-medium ${
                index === breadcrumbs.length - 1
                  ? 'text-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {breadcrumb.icon && (
                <span className="mr-2">{breadcrumb.icon}</span>
              )}
              {breadcrumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
} 