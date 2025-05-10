import axios from "axios";
import type { User } from "./UsersAdminPage";

export async function fetchUsers(): Promise<User[]> {
  const token = localStorage.getItem("session_token");
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.users;
}

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