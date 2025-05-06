'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';

const twoFactorSchema = z.object({
  code: z.string().length(6, 'El código debe tener 6 dígitos'),
});

type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

interface TwoFactorFormProps {
  qrCodeUrl: string;
  secretKey: string;
  onVerify: (code: string) => Promise<void>;
}

export function TwoFactorForm({ qrCodeUrl, secretKey, onVerify }: TwoFactorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
  });

  const onSubmit = async (data: TwoFactorFormValues) => {
    setIsLoading(true);

    try {
      await onVerify(data.code);
      toast.success('Autenticación de dos factores configurada exitosamente');
    } catch (error) {
      console.error('Error al verificar el código:', error);
      toast.error(error instanceof Error ? error.message : 'Error al verificar el código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Configurar 2FA</h1>
        <p className="mt-2 text-gray-600">Escanea el código QR con tu aplicación de autenticación</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-48 h-48">
          <Image
            src={qrCodeUrl}
            alt="Código QR para 2FA"
            fill
            className="object-contain"
          />
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Clave Secreta
            </label>
            <button
              type="button"
              onClick={() => setShowSecretKey(!showSecretKey)}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              {showSecretKey ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            <code className="text-sm font-mono">
              {showSecretKey ? secretKey : '••••••••••••••••'}
            </code>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Código de Verificación
          </label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            {...register('code')}
            className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ingresa el código de 6 dígitos"
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </span>
            ) : (
              'Verificar y Activar 2FA'
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda?{' '}
            <a
              href="#"
              className="font-medium text-primary-600 hover:text-primary-500"
              onClick={(e) => {
                e.preventDefault();
                toast.info('Contacta al soporte técnico para obtener ayuda con la configuración de 2FA');
              }}
            >
              Obtener ayuda
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
