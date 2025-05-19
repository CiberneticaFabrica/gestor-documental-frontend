'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { toast } from 'sonner';
import { useEffect } from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function DashboardPage() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const hasShownWelcome = localStorage.getItem('hasShownWelcome');
      if (!hasShownWelcome) {
        toast.success(`¡Bienvenido de nuevo, ${user.username}!`);
        localStorage.setItem('hasShownWelcome', 'true');
      }
    }
  }, [user]);

  return (
    <div className="space-y-6 w-full">
      <DashboardContainer />
    </div>
  );
}