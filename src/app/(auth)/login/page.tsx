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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <LoginForm />
    </div>
  );
}
