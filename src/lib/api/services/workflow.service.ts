import axiosInstance from '../axios-instance';

// Types for the workflow service
export interface Notification {
  id_notificacion: string;
  id_instancia_flujo: string;
  tipo_notificacion: string;
  titulo: string;
  mensaje: string;
  fecha_creacion: string;
  leida: number;
  urgencia: string;
  datos_contextuales: {
    id_cliente: string;
    id_documento: string;
    codigo_cliente: string;
    nombre_cliente: string;
    titulo_documento: string;
  };
  id_documento: string;
  id_cliente: string;
  estado_documento: string;
  documento_titulo: string;
  codigo_documento: string;
  nombre_razon_social: string;
  codigo_cliente: string;
}

export interface NotificationsResponse {
  notificaciones: Notification[];
  resumen: {
    total: number;
    no_leidas: string;
    urgentes: string;
  };
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface PendingDocument {
  id_instancia: string;
  id_documento: string;
  id_cliente: string;
  estado_actual: string;
  prioridad: string;
  fecha_inicio: string;
  titulo: string;
  codigo_documento: string;
  estado_documento: string;
  confianza_extraccion: string;
  validado_manualmente: number;
  tipo_documento: string;
  nombre_razon_social: string;
  codigo_cliente: string;
  tipo_cliente: string;
  nivel_riesgo: string;
  segmento_bancario: string;
  dias_pendiente: number;
}

export interface PendingDocumentsResponse {
  documentos_pendientes: PendingDocument[];
  resumen_prioridad: Array<{
    prioridad: string;
    count: number;
  }>;
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface DocumentReview {
  documento: {
    id_instancia: string;
    id_documento: string;
    id_cliente: string;
    estado_actual: string;
    prioridad: string;
    fecha_inicio: string;
    titulo: string;
    codigo_documento: string;
    descripcion: string;
    estado_documento: string;
    confianza_extraccion: string;
    validado_manualmente: number;
    fecha_validacion: string | null;
    datos_extraidos_ia: {
      genero: string | null;
      nombre: string;
      apellidos: string;
      nacionalidad: string | null;
      pais_emision: string;
      fecha_emision: string;
      texto_completo: string;
      nombre_completo: string;
      fecha_expiracion: string;
      fecha_nacimiento: string;
      lugar_nacimiento: string;
      autoridad_emision: string | null;
      tipo_identificacion: string;
      numero_identificacion: string;
    };
    metadatos: any;
    id_tipo_documento: string;
    tipo_documento: string;
    nombre_razon_social: string;
    codigo_cliente: string;
    tipo_cliente: string;
    nivel_riesgo: string;
    segmento_bancario: string;
    estado_documental: string;
    gestor_nombre: string;
  };
  datos_especializados: {
    documento_identificacion: {
      tipo_documento: string;
      numero_documento: string;
      fecha_emision: string;
      fecha_expiracion: string;
      genero: string | null;
      nombre_completo: string;
      pais_emision: string;
      lugar_nacimiento: string;
    };
  };
  analisis_ia: {
    tipo_documento: string;
    confianza_clasificacion: string;
    entidades_detectadas: Record<string, {
      answer: string;
      question: string;
      confidence: number;
    }>;
    estado_analisis: string;
    fecha_analisis: string;
    texto_extraido: string;
  };
}

export interface ClientReview {
  cliente: {
    id_cliente: string;
    codigo_cliente: string;
    nombre_razon_social: string;
    tipo_cliente: string;
    documento_identificacion: string;
    fecha_alta: string;
    estado: string;
    segmento: string;
    segmento_bancario: string;
    nivel_riesgo: string;
    estado_documental: string;
    fecha_ultima_revision_kyc: string;
    proxima_revision_kyc: string;
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
    anotaciones_especiales: string | null;
    id_instancia: string;
    estado_flujo: string;
    documentos_requeridos: number;
    documentos_validados: number;
    porcentaje_completitud: string;
    fecha_inicio_flujo: string;
    gestor_principal_nombre: string;
    gestor_kyc_nombre: string | null;
  };
  documentos: Array<{
    id_documento: string;
    codigo_documento: string;
    titulo: string;
    descripcion: string;
    estado: string;
    confianza_extraccion: string;
    validado_manualmente: number;
    fecha_creacion: string;
    fecha_modificacion: string;
    fecha_validacion: string | null;
    tipo_documento: string;
    instancia_flujo_documento: string;
    estado_flujo_documento: string;
    prioridad: string;
    fecha_inicio_flujo_documento: string;
    asignado_a: string;
    asignado_a_nombre: string;
    asignado_a_mi: number;
  }>;
  estadisticas_documentos: {
    total_documentos: number;
    documentos_aprobados: string;
    documentos_rechazados: string;
    documentos_pendientes_revision: string;
    documentos_asignados_a_mi: string;
  };
  actividad_reciente: Array<{
    fecha_hora: string;
    accion: string;
    entidad_afectada: string;
    detalles: Record<string, any>;
    usuario_nombre: string;
  }>;
}

export interface ApproveDocumentRequest {
  comentario: string;
}

export interface ApproveDocumentResponse {
  message: string;
  id_documento: string;
  client_ready_for_supervisor: boolean;
}

export interface RejectDocumentRequest {
  comentario: string;
  motivo_rechazo: string;
}

export interface RejectDocumentResponse {
  message: string;
  id_documento: string;
}

export interface SendToSupervisorRequest {
  comentario: string;
}

export interface SendToSupervisorResponse {
  error?: string;
  message?: string;
}

export interface KycClient {
  id_cliente: string;
  codigo_cliente: string;
  nombre_razon_social: string;
  tipo_cliente: string;
  nivel_riesgo: string;
  estado_documental: string;
  fecha_alta: string;
  fecha_ultima_actividad: string | null;
  gestor_principal_id: string;
  gestor_principal_nombre: string;
  gestor_kyc_id: string | null;
  gestor_kyc_nombre: string | null;
  id_instancia: string;
  estado_flujo: string;
  documentos_requeridos: number;
  documentos_validados: number;
  porcentaje_completitud: string;
  fecha_inicio_flujo: string;
  dias_en_flujo: number;
  solicitudes_pendientes: number;
  docs_por_vencer: number;
  estado_flujo_descripcion: string;
  prioridad: string;
}

export interface KycClientsResponse {
  clientes: KycClient[];
  resumen_estados: Record<string, number>;
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

class WorkflowService {
  // Get notifications
  async getNotifications(params?: {
    unread?: boolean;
    page?: number;
    limit?: number;
  }): Promise<NotificationsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.unread !== undefined) {
      queryParams.append('unread', params.unread.toString());
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const response = await axiosInstance.get(`/kyc/notifications?${queryParams.toString()}`);
    return response.data;
  }

  // Get pending documents
  async getPendingDocuments(params?: {
    page?: number;
    limit?: number;
    urgencia?: string;
  }): Promise<PendingDocumentsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.urgencia) {
      queryParams.append('urgencia', params.urgencia);
    }

    const response = await axiosInstance.get(`/kyc/documents/pending?${queryParams.toString()}`);
    return response.data;
  }

  // Get document review details
  async getDocumentReview(documentId: string): Promise<DocumentReview> {
    const response = await axiosInstance.get(`/kyc/documents/${documentId}/review`);
    return response.data;
  }

  // Get client review details
  async getClientReview(clientId: string): Promise<ClientReview> {
    const response = await axiosInstance.get(`/kyc/clients/${clientId}/review`);
    return response.data;
  }

  // Approve document
  async approveDocument(documentId: string, data: ApproveDocumentRequest): Promise<ApproveDocumentResponse> {
    const response = await axiosInstance.post(`/kyc/documents/${documentId}/approve`, data);
    return response.data;
  }

  // Reject document
  async rejectDocument(documentId: string, data: RejectDocumentRequest): Promise<RejectDocumentResponse> {
    const response = await axiosInstance.post(`/kyc/documents/${documentId}/reject`, data);
    return response.data;
  }

  // Send client to supervisor
  async sendToSupervisor(clientId: string, data: SendToSupervisorRequest): Promise<SendToSupervisorResponse> {
    const response = await axiosInstance.post(`/kyc/clients/${clientId}/send-supervisor`, data);
    return response.data;
  }

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await axiosInstance.put(`/kyc/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Get KYC clients
  async getKycClients(params?: {
    page?: number;
    limit?: number;
    estado?: string;
    prioridad?: string;
  }): Promise<KycClientsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.estado) queryParams.append('estado', params.estado);
    if (params?.prioridad) queryParams.append('prioridad', params.prioridad);

    const response = await axiosInstance.get(`/kyc/clients?${queryParams.toString()}`);
    return response.data;
  }

  // Approve client by supervisor
  async approveClientBySupervisor(clientId: string, comentario: string): Promise<{
    message: string;
    id_cliente: string;
    estado_anterior: string;
    estado_nuevo: string;
    proxima_revision_kyc: string;
  }> {
    const response = await axiosInstance.post(`/kyc/supervisor/${clientId}/approve`, {
      comentario
    });
    return response.data;
  }
}

export const workflowService = new WorkflowService(); 