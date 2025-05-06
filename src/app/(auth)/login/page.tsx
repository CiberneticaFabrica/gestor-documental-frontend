import { Metadata } from 'next';
import LoginForm from '@/components/auth/login-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Gestor Documental',
  description: 'Accede al sistema de gestión documental bancario',
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Gestor Documental
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Gestión Documental Bancario
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
