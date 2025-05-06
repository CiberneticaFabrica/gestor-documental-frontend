import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-red-500/10 p-3 rounded-full">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Acceso Denegado
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            No tienes los permisos necesarios para acceder a esta página.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link
            href="/dashboard"
            className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Volver al Dashboard
          </Link>
          <Link
            href="/login"
            className="flex w-full justify-center rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Volver al Login
          </Link>
        </div>
      </div>
    </div>
  );
} 