import axiosInstance from '../axios-instance';

export interface Client {
  id_cliente: string;
  codigo_cliente: string;
  tipo_cliente: string;
  nombre_razon_social: string;
  documento_identificacion: string;
  fecha_alta: string;
  estado: string;
  segmento: string;
  segmento_bancario: string;
  nivel_riesgo: string;
  estado_documental: string;
  fecha_ultima_revision_kyc: string;
  proxima_revision_kyc: string;
  fecha_ultima_actividad: string | null;
  gestor_principal_id: string;
  gestor_principal_nombre: string;
  gestor_kyc_id: string | null;
  gestor_kyc_nombre: string | null;
  datos_contacto: {
    email: string;
    telefono: string;
    direccion: string;
  };
  preferencias_comunicacion: {
    idioma: string;
    canal_preferido: string;
    horario_preferido: string;
  };
  metadata_personalizada: {
    profesion: string;
    referido_por: string;
    empresa_laboral: string;
  };
  documentos_pendientes: Array<{
    cantidad: number;
    fecha_solicitud: string;
  }>;
}

export interface ClientRequest {
  tipo_cliente: string;
  nombre_razon_social: string;
  documento_identificacion: string;
  estado: string;
  segmento: string;
  segmento_bancario: string;
  nivel_riesgo: string;
  gestor_principal_id: string | null;
  gestor_kyc_id: string | null;
  datos_contacto: {
    email: string;
    telefono: string;
    direccion: string;
  };
  preferencias_comunicacion: {
    idioma: string;
    canal_preferido: string;
    horario_preferido: string;
  };
  metadata_personalizada: {
    profesion: string;
    referido_por: string;
    empresa_laboral: string;
  };
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

export interface ClientDetailResponse {
  cliente: Client;
  estadisticas: {
    documentos_count: number;
    solicitudes: {
      total_requests: number;
      pending_requests: string;
      reminder_sent: string;
      received_requests: string;
      overdue_requests: string;
    };
    documentos_por_vencer: any[];
  };
  actividad_reciente: Array<{
    fecha_hora: string;
    accion: string;
    entidad_afectada: string;
    detalles: Record<string, any>;
    resultado: string;
  }>;
  vista_cache: {
    ultima_actualizacion: string;
    resumen_actividad: {
      fecha: string;
      usuario: string;
      ultima_actividad: string;
    };
    kpis_cliente: {
      documentos_completos: number;
      documentos_pendientes: number;
      dias_hasta_proxima_revision: number;
    };
  };
}

export interface DocumentRequest {
  id_solicitud: string;
  id_cliente: string;
  id_tipo_documento: string;
  fecha_solicitud: string;
  solicitado_por: string;
  solicitado_por_nombre: string;
  fecha_limite: string;
  estado: 'pendiente' | 'recibido' | 'cancelado' | 'vencido';
  id_documento_recibido: string | null;
  notas: string;
  tipo_documento_nombre: string;
  dias_restantes: number;
  vencido: number;
}

export interface DocumentRequestsResponse {
  cliente: {
    id: string;
    codigo: string;
    nombre: string;
  };
  solicitudes: DocumentRequest[];
  estadisticas: {
    total_solicitudes: number;
    pendientes: string;
    recordatorios: string;
    recibidos: string;
    cancelados: string;
    vencidos: string;
    promedio_dias_respuesta: string;
  };
  tendencia_temporal: Array<{
    mes: string;
    total_solicitudes: number;
    completadas: string;
    vencidas: string;
  }>;
}

export const clientService = {
   
  getClients: async (page: number = 1, pageSize: number = 10) => {
    const { data } = await axiosInstance.get<ClientsResponse>(`/clients?page=${page}&page_size=${pageSize}`);
    return data;
  },

  async getClientDetail(id: string): Promise<ClientDetailResponse> {
    const { data } = await axiosInstance.get<ClientDetailResponse>(`/clients/${id}`);
    return data;
  },

  async createClient(clientData: ClientRequest): Promise<{ id_cliente: string; codigo_cliente: string }> {
    try {
      const { data } = await axiosInstance.post<{ id_cliente: string; codigo_cliente: string }>('/clients', clientData);
      return data;
    } catch (error) {
      console.error('Error in createClient:', error);
      throw error;
    }
  },

  async getClientDocumentRequests(clientId: string): Promise<DocumentRequestsResponse> {
    const { data } = await axiosInstance.get<DocumentRequestsResponse>(`/clients/${clientId}/documents/requests`);
    return data;
  }
}; 