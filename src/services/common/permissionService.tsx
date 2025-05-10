import axios from "axios";

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

export async function fetchPermissions(): Promise<PermissionsResponse> {
  const token = localStorage.getItem("session_token");
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/permissions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
} 