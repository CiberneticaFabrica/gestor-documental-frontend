// src/hooks/useRoles.ts
import { useState, useEffect, useCallback } from "react";
import { fetchRoles, type Role } from "@/services/common/roleService";

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRolesData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRoles();
      setRoles(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRolesData();
  }, [fetchRolesData]);

  return { roles, loading, error, refresh: fetchRolesData };
}