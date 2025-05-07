import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// Rutas que requieren permisos específicos
const protectedRoutes = {
  '/dashboard': ['view:dashboard'],
  '/documents': ['view:documents'],
  '/documents/create': ['create:documents'],
  '/clients': ['view:clients'],
  '/admin': ['admin:access'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  console.log('Token:', token); // Debug log

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/login') || 
                    request.nextUrl.pathname.startsWith('/auth/reset-password');

  // Permitir acceso a la página de unauthorized sin token
  if (request.nextUrl.pathname === '/unauthorized') {
    return NextResponse.next();
  }

  // Si es una página de autenticación y el usuario está autenticado, redirigir al dashboard
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Si no hay token y no es una página de autenticación, redirigir al login
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar expiración del token
  const tokenExp = token.exp as number;
  const now = Math.floor(Date.now() / 1000);
  
  if (tokenExp < now) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Verificar permisos para rutas protegidas
  for (const [route, requiredPermissions] of Object.entries(protectedRoutes)) {
    if (request.nextUrl.pathname.startsWith(route)) {
      // Asegurarse de que token.permissions existe y es un array
      const userPermissions = Array.isArray(token.permissions) ? token.permissions : [];
      console.log('Route:', route); // Debug log
      console.log('Required permissions:', requiredPermissions); // Debug log
      console.log('User permissions:', userPermissions); // Debug log
      
      const hasPermission = requiredPermissions.some(permission =>
        userPermissions.includes(permission)
      );
      console.log('Has permission:', hasPermission); // Debug log

      if (!hasPermission) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Configurar las rutas que deben ser protegidas por el middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/login',
    '/auth/reset-password',
    '/unauthorized',
  ],
}; 