import axios from "axios";

export interface Role {
  id_rol: string;
  nombre_rol: string;
  descripcion?: string;
}

export async function fetchRoles(): Promise<Role[]> {
  const token = localStorage.getItem("session_token");
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/roles`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.roles;
}