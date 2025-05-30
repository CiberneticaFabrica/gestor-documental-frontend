import axiosInstance from '../axios-instance';

// Interfaces para las respuestas
export interface AuditLog {
  id_registro: number;
  fecha_hora: string;
  usuario_id: string;
  nombre_usuario: string | null;
  direccion_ip: string;
  accion: string;
  entidad_afectada: string;
  id_entidad_afectada: string | null;
  detalles: {
    tipo?: string;
    days?: number;
    grouping?: string;
    filtros?: {
      accion?: string;
      entidad?: string;
      end_date?: string;
      resultado?: string;
      start_date?: string;
      usuario_id?: string;
    };
    formato?: string;
    registros_exportados?: number;
    filename?: string;
    id_cliente?: string;
    content_type?: string;
    is_new_version?: boolean;
    nombre_cliente?: string;
    user_agent?: string;
    key?: string;
    size?: number;
    bucket?: string;
    document_type?: string;
    preliminary_classification?: {
      scores: {
        dni: number;
        nomina: number;
        contrato: number;
        extracto: number;
        impuesto: number;
        domicilio: number;
        pasaporte: number;
        formulario_kyc: number;
      };
      doc_type: string;
      confidence: number;
      doc_type_id: string;
      requires_textract: boolean;
    };
    titulo?: string;
    carpeta?: string | null;
    tipo_documento?: string;
    [key: string]: any;
  };
  resultado: 'exito' | 'fallo';
}

export interface RelatedEvent {
  id_registro: number;
  fecha_hora: string;
  accion: string;
  resultado: 'exito' | 'fallo';
}

export interface DetailedAuditLog extends AuditLog {
  nombre: string;
  apellidos: string;
  eventos_relacionados: RelatedEvent[];
}

export interface DocumentInfo {
  id: string;
  codigo: string;
  titulo: string;
  tipo_documento: string;
  version_actual: number;
}

export interface DocumentVersion {
  id_version: string;
  numero_version: number;
  fecha_creacion: string;
  creado_por: string;
  creado_por_nombre: string;
  comentario_version: string;
  tamano_bytes: number;
  hash_contenido: string;
}

export interface DocumentAuditLogsResponse {
  documento: DocumentInfo;
  actividad: AuditLog[];
  versiones: DocumentVersion[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface UserInfo {
  id_usuario: string;
  nombre_usuario: string;
  nombre: string;
  apellidos: string;
  email: string;
  estado: 'activo' | 'inactivo';
  ultimo_acceso: string;
}

export interface ActionStats {
  accion: string;
  count: number;
  primera_accion: string;
  ultima_accion: string;
}

export interface EntityStats {
  entidad_afectada: string;
  count: number;
}

export interface UserStats {
  por_accion: ActionStats[];
  por_entidad: EntityStats[];
}

export interface UserSession {
  id_sesion: string;
  fecha_inicio: string;
  fecha_expiracion: string;
  direccion_ip: string;
  user_agent: string;
  activa: number;
}

export interface UserAuditLogsResponse {
  usuario: UserInfo;
  actividad: AuditLog[];
  estadisticas: UserStats;
  sesiones_recientes: UserSession[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
  filtros_disponibles: {
    acciones: string[];
    entidades: string[];
    resultados: string[];
  };
}

export interface ExportAuditLogsRequest {
  formato: 'json' | 'csv' | 'pdf';
  filtros: {
    start_date?: string;
    end_date?: string;
    usuario_id?: string;
    accion?: string;
    entidad?: string;
    resultado?: 'exito' | 'fallo';
  };
  incluir_detalles: boolean;
}

export interface ClientsDocumentsActivityResponse {
  clientes: {
    id_cliente: string;
    codigo_cliente: string;
    tipo_cliente: string;
    nombre_razon_social: string;
    documento_identificacion: string;
    estado: string;
    segmento: string;
    segmento_bancario: string;
    nivel_riesgo: string;
    estado_documental: string;
    fecha_alta: string;
    gestor_principal: string;
    documentos: {
      id_documento: string;
      codigo_documento: string;
      titulo: string;
      descripcion: string;
      version_actual: number;
      fecha_creacion: string;
      estado: string;
      tipo_documento: string;
      fecha_asignacion: string;
      actividades: {
        id_registro: number;
        fecha_hora: string;
        usuario_id: string;
        nombre_usuario: string;
        direccion_ip: string;
        accion: string;
        detalles: Record<string, any>;
        resultado: string;
      }[];
      total_actividades: number;
      mostrando_actividades: number;
    }[];
    total_documentos: number;
  }[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
  summary: {
    total_clientes: number;
    clientes_en_pagina: number;
    limite_actividades_por_documento: number;
  };
}

export const auditoriaService = {
  // Obtener todos los logs de auditoría
  async getAuditLogs(
    page: number = 1,
    filters: { [key: string]: any } = {},
    limit: number = 10
  ): Promise<AuditLogsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...Object.fromEntries(
        Object.entries(filters)
          .filter(([_, v]) => v !== undefined && v !== null && v !== '')
          .map(([k, v]) => [k === 'startDate' ? 'start_date' : k === 'endDate' ? 'end_date' : k, v])
      )
    });
    const { data } = await axiosInstance.get<AuditLogsResponse>(`/audit-logs?${params.toString()}`);
    return data;
  },

  // Obtener un log de auditoría específico
  async getAuditLogById(id: string): Promise<DetailedAuditLog> {
    const { data } = await axiosInstance.get<DetailedAuditLog>(`/audit-logs/${id}`);
    return data;
  },

  // Obtener logs de auditoría por usuario
  async getAuditLogsByUser(userId: string, page: number = 1, limit: number = 10): Promise<UserAuditLogsResponse> {
    const { data } = await axiosInstance.get<UserAuditLogsResponse>(`/audit-logs/users/${userId}?page=${page}&limit=${limit}`);
    return data;
  },

  // Obtener logs de auditoría por documento
  async getAuditLogsByDocument(documentId: string): Promise<DocumentAuditLogsResponse> {
    const { data } = await axiosInstance.get<DocumentAuditLogsResponse>(`/audit-logs/documents/${documentId}`);
    return data;
  },

  // Exportar logs de auditoría
  async exportAuditLogs(exportRequest: ExportAuditLogsRequest): Promise<AuditLog[]> {
    const { data } = await axiosInstance.post<AuditLog[]>('/audit-logs/export', exportRequest);
    return data;
  },

  // Obtener eventos de seguridad
  async getSecurityEvents(
    page: number = 1,
    limit: number = 50,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (startDate) params['start_date'] = startDate;
    if (endDate) params['end_date'] = endDate;
    const query = new URLSearchParams(params).toString();
    const { data } = await axiosInstance.get(`/audit-logs/security?${query}`);
    return data;
  },

  async getClientsDocumentsActivity(params?: Record<string, any>): Promise<ClientsDocumentsActivityResponse> {
    const { data } = await axiosInstance.get<ClientsDocumentsActivityResponse>('/clients-documents-activity', { params });
    return data;
  }
}; 