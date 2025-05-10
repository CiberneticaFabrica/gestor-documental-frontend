import { useAuth } from '@/lib/auth/auth-context';

export function usePermissions() {
  const { user, hasPermission, hasRole } = useAuth();

  const checkPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.every(permission => hasPermission(permission));
  };

  const checkAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => hasPermission(permission));
  };

  const checkRoles = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.every(role => hasRole(role));
  };

  const checkAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.some(role => hasRole(role));
  };

  return {
    checkPermissions,
    checkAnyPermission,
    checkRoles,
    checkAnyRole,
    userPermissions: user?.permissions || [],
    userRoles: user?.roles ? [user.roles] : [],
  };
}