import { Permission } from './permissionService';
import { BaseService } from '../../lib/api/base-service';
import { API_ENDPOINTS } from '../../lib/api/config';

export interface Role {
  id_rol: string;
  nombre_rol: string;
  descripcion: string;
}

export interface RoleResponse {
  roles: Role[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface RolePermissionsResponse {
  permissions: Permission[];
  permissions_by_category: Record<string, Permission[]>;
}

export class RoleService extends BaseService {
  public async getRoles(page: number = 1, pageSize: number = 10): Promise<RoleResponse> {
    return super.get(API_ENDPOINTS.roles.list, {
      page,
      page_size: pageSize
    });
  }

  public async getRoleById(id: string): Promise<Role> {
    return super.get(API_ENDPOINTS.roles.detail(id));
  }

  public async getRolePermissions(id: string): Promise<RolePermissionsResponse> {
    return super.get(API_ENDPOINTS.roles.permissions(id));
  }

  public async createRole(role: Omit<Role, 'id_rol'>): Promise<Role> {
    return super.post(API_ENDPOINTS.roles.list, role);
  }

  public async updateRole(id: string, role: Partial<Role>): Promise<Role> {
    return super.put(API_ENDPOINTS.roles.detail(id), role);
  }

  public async deleteRole(id: string): Promise<void> {
    return super.delete(API_ENDPOINTS.roles.detail(id));
  }

  public async updateRolePermissions(id: string, permissions: string[]): Promise<Role> {
    return super.put(API_ENDPOINTS.roles.permissions(id), { permissions });
  }
}

const roleService = new RoleService();
export { roleService };
