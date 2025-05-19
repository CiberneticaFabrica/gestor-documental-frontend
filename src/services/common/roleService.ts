import { BaseService } from '@/lib/api/base-service';
import { API_ENDPOINTS } from '@/lib/api/config';
import { Permission } from './permissionService';

interface Role {
  id_rol: string;
  nombre_rol: string;
  descripcion: string;
}

interface RoleResponse {
  roles: Role[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

interface RolePermissionsResponse {
  id_rol: string;
  nombre_rol: string;
  permisos: Permission[];
  permisos_por_categoria: Record<string, Permission[]>;
}

class RoleService extends BaseService {
  async getRoles(page: number = 1, pageSize: number = 10): Promise<RoleResponse> {
    return this.get(API_ENDPOINTS.roles.list, {
      page,
      page_size: pageSize
    });
  }

  async getRoleById(id: string): Promise<Role> {
    return this.get(API_ENDPOINTS.roles.detail(id));
  }

  async getRolePermissions(id: string): Promise<RolePermissionsResponse> {
    return this.get(API_ENDPOINTS.roles.permissions(id));
  }

  async createRole(role: Omit<Role, 'id_rol'>): Promise<Role> {
    return this.post(API_ENDPOINTS.roles.list, role);
  }

  async updateRole(id: string, role: Partial<Role>): Promise<Role> {
    return this.put(API_ENDPOINTS.roles.detail(id), role);
  }

  async deleteRole(id: string): Promise<void> {
    return this.delete(API_ENDPOINTS.roles.detail(id));
  }

  async updateRolePermissions(id: string, permissions: string[]): Promise<Role> {
    return this.put(API_ENDPOINTS.roles.permissions(id), { permissions });
  }
}

const roleService = new RoleService();
export { roleService };
export type { Role, RoleResponse, RolePermissionsResponse }; 