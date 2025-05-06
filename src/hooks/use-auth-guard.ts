import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { usePermissions } from './use-permissions';

interface AuthGuardOptions {
  requiredPermissions?: string[];
  requiredRoles?: string[];
  redirectTo?: string;
  requireAllPermissions?: boolean;
  requireAllRoles?: boolean;
}

export function useAuthGuard({
  requiredPermissions = [],
  requiredRoles = [],
  redirectTo = '/unauthorized',
  requireAllPermissions = true,
  requireAllRoles = true,
}: AuthGuardOptions = {}) {
  const { isAuthenticated, isLoading } = useAuth();
  const { checkPermissions, checkAnyPermission, checkRoles, checkAnyRole } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const hasRequiredPermissions = requireAllPermissions
      ? checkPermissions(requiredPermissions)
      : checkAnyPermission(requiredPermissions);

    const hasRequiredRoles = requireAllRoles
      ? checkRoles(requiredRoles)
      : checkAnyRole(requiredRoles);

    if (!hasRequiredPermissions || !hasRequiredRoles) {
      router.push(redirectTo);
    }
  }, [
    isAuthenticated,
    isLoading,
    requiredPermissions,
    requiredRoles,
    redirectTo,
    requireAllPermissions,
    requireAllRoles,
    router,
    checkPermissions,
    checkAnyPermission,
    checkRoles,
    checkAnyRole,
  ]);

  return {
    isAuthorized: isAuthenticated && !isLoading,
    isLoading,
  };
} 