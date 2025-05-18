// src/services/common/userService.ts
import { BaseService } from '@/lib/api/base-service';
import { API_ENDPOINTS } from '@/lib/api/config';

export interface User {
  id_usuario: string;
  nombre_usuario: string;
  nombre: string;
  apellidos: string;
  email: string;
  estado: string;
  fecha_creacion: string;
  ultimo_acceso: string | null;
  requiere_2fa: number;
  roles: { id_rol: string; nombre_rol: string }[];
}

export interface CreateUserPayload {
  nombre_usuario: string;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  roles: string[];
  requiere_2fa: boolean;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

class UserService extends BaseService {
  async getUsers(page: number = 1, pageSize: number = 10): Promise<UsersResponse> {
    return this.get(API_ENDPOINTS.users.list, {
      page,
      page_size: pageSize
    });
  }

  async createUser(payload: CreateUserPayload): Promise<{ user_id: string }> {
    return this.post(API_ENDPOINTS.users.list, payload);
  }

  async updateUser(id: string, payload: Partial<CreateUserPayload>): Promise<User> {
    return this.put(API_ENDPOINTS.users.detail(id), payload);
  }

  async deleteUser(id: string): Promise<void> {
    return this.delete(API_ENDPOINTS.users.detail(id));
  }

  async toggleUserStatus(id: string, estado: string): Promise<User> {
    return this.patch(`${API_ENDPOINTS.users.detail(id)}/status`, { estado });
  }
}

export const userService = new UserService();