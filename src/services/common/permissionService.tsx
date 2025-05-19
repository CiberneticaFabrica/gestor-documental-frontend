import { BaseService } from '@/lib/api/base-service';
import { API_ENDPOINTS } from '@/lib/api/config';

export interface Permission {
  id_permiso: string;
  codigo_permiso: string;
  descripcion: string;
  categoria: string;
}

export interface PermissionsResponse {
  permisos: Permission[];
  categorias_disponibles: string[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

class PermissionService extends BaseService {
  async getPermissions(page: number = 1, pageSize: number = 1000): Promise<PermissionsResponse> {
    console.log('Fetching permissions with pageSize:', pageSize);
    const response = await this.get<PermissionsResponse>(API_ENDPOINTS.permissions.list, {
      page,
      page_size: pageSize,
      include_all: true
    });
    console.log('Permissions response:', response);
    return response;
  }
}

export const permissionService = new PermissionService();

export async function fetchPermissions(page: number = 1, pageSize: number = 1000): Promise<PermissionsResponse> {
  return permissionService.getPermissions(page, pageSize);
} 