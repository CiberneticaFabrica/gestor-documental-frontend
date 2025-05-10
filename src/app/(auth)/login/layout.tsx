import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Gestor Documental',
  description: 'Accede al sistema de gestión documental bancario',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 