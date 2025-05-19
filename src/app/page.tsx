'use client';

import { useAuth } from "@/lib/auth/auth-context";
import LoginForm from '@/components/auth/login-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
   
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return null; // No se mostrará nada mientras se redirige
}