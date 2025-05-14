import axios from "axios";
import type { User } from "./UsersAdminPage";

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

export async function fetchUsers(page = 1, pageSize = 10): Promise<FetchUsersResult> {
  const token = localStorage.getItem("session_token");
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        page_size: pageSize,
      },
    }
  );
  return {
    users: res.data.users,
    pagination: res.data.pagination,
  };
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