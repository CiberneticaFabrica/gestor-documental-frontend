import axiosInstance from '../axios-instance';

export interface Client {
  id_cliente: string;
  nombre_razon_social: string;
}

export interface ClientsResponse {
  clientes: Client[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export const clientService = {
  getClients: async () => {
    const { data } = await axiosInstance.get<ClientsResponse>('/clients?page_size=1000');
    return data;
  }
}; 