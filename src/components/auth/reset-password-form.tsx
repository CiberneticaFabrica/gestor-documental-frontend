'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import Image from 'next/image';

const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      await requestPasswordReset();
      setIsSubmitted(true);
      toast.success('Se ha enviado un correo con las instrucciones para restablecer tu contraseña');
    } catch (error) {
      console.error('Error al solicitar el restablecimiento:', error);
      toast.error(error instanceof Error ? error.message : 'Error al solicitar el restablecimiento de contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4  bg-white ">
        
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
          {/* Background curve effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl z-0"></div>
          
          <div className="relative z-10 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/10">
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">
              Correo Enviado
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Hemos enviado un correo electrónico con las instrucciones para restablecer tu contraseña.
              Por favor, revisa tu bandeja de entrada y sigue los pasos indicados.
            </p>
            <div className="mt-6">
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-blue-800">
        <svg className="pointer-events-none absolute inset-0" viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
        <g className="opacity-5 MuiBox-root muiltr-0" fill="none" stroke="currentColor" stroke-width="100">
          <circle r="234" cx="196" cy="23"></circle><circle r="234" cx="790" cy="491"></circle></g>
          </svg>
      <div className="max-w-md w-full space-y-8   p-8 rounded-lg shadow-lg relative overflow-hidden bg-white" >
        {/* Background curve effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl z-0"></div>
        
        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            
            <Image 
                src="/images/cyberlexlogo.png" 
                alt="CyberLex" 
                width={400} 
                height={400} 
                className="m-0 p-0"
              />
          </div>
          
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Recuperar Contraseña</h1>
            <p className="text-gray-600">
              Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña
            </p>
          </div>
        </div>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                <Mail size={18} />
              </div>
              <input
                type="email"
                {...register('email')}
                className="w-full rounded-md border border-gray-700 bg-white px-4 py-3 pl-10 text-base text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="usuario@ejemplo.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center rounded-md font-medium transition-colors h-12 px-6 text-lg bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
            ) : (
              'Enviar Instrucciones'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              ¿Recordaste tu contraseña?{' '}
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                Volver al inicio de sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
