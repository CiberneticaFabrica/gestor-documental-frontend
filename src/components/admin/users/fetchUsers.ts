import { BaseService } from '@/lib/api/base-service';
import { API_ENDPOINTS } from '@/lib/api/config';

export interface User {
  id_usuario: string;
  nombre_usuario: string;
  nombre: string;
  apellidos: string;
  email: string;
  estado: string;
  roles: Array<{ id_rol: string; nombre_rol: string }>;
  ultimo_acceso: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface FetchUsersResult {
  users: User[];
  pagination: Pagination;
}

class UserService extends BaseService {
  async getUsers(page = 1, pageSize = 10): Promise<FetchUsersResult> {
    return this.get<FetchUsersResult>(API_ENDPOINTS.users.list, {
      page,
      page_size: pageSize
    });
  }
}

const userService = new UserService();

export async function fetchUsers(page = 1, pageSize = 10): Promise<FetchUsersResult> {
  return userService.getUsers(page, pageSize);
}

export interface UserResponse {
  id_usuario: string;
  nombre_usuario: string;
  nombre: string;
  apellidos: string;
  email: string;
  estado: string;
  roles: Array<{ id_rol: string; nombre_rol: string }>;
  ultimo_acceso: string | null;
}