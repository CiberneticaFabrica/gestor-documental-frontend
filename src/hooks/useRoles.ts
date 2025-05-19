// src/hooks/useRoles.ts
import { useState, useEffect } from 'react';
import { roleService, type Role } from '@/services/common/roleService';
import { toast } from 'sonner';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    page_size: 10,
    total_pages: 1
  });

  const fetchRoles = async (page: number = 1, pageSize: number = 10) => {
    try {
    setLoading(true);
      setError(null);
      const response = await roleService.getRoles(page, pageSize);
      setRoles(response.roles);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los roles');
      toast.error(err.message || 'Error al cargar los roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const refresh = () => {
    fetchRoles(pagination.page, pagination.page_size);
  };

  return {
    roles,
    loading,
    error,
    refresh,
    pagination,
    fetchRoles
  };
}