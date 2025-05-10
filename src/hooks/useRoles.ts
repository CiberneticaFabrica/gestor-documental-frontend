// src/hooks/useRoles.ts
import { useState, useEffect } from "react";
import { fetchRoles, type Role } from "@/services/common/roleService";

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchRoles()
      .then(setRoles)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { roles, loading, error };
}