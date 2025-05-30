import axiosInstance from '../axios-instance';

export interface DocumentVersion {
  id_version: string;
  numero_version: number;
  fecha_creacion: string;
  creado_por: string;
  creado_por_usuario: string;
  comentario_version: string;
  tamano_bytes: number;
  nombre_original: string;
  extension: string;
  mime_type: string;
  estado_ocr: string;
  ubicacion_almacenamiento_tipo: string;
  ubicacion_almacenamiento_ruta: string;
}

export interface DocumentVersionsResponse {
  document_id: string;
  title: string;
  versions: DocumentVersion[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface DocumentVersionPreview {
  url_documento: string;
  mime_type: string;
  nombre_archivo: string;
  tamano_bytes: number;
  numero_version: number;
  id_version: string;
  expiracion_url: number;
  tiene_miniatura: boolean;
  url_miniatura: string | null;
}

export interface DocumentDetailsResponse {
  documento: {
    id: string;
    codigo: string;
    titulo: string;
    descripcion: string;
    estado: string;
    fechas: {
      creacion: string;
      modificacion: string;
      validacion: string | null;
    };
    tags: any;
    metadatos: any;
    estadisticas: any;
  };
  tipo_documento: {
    id: string;
    nombre: string;
  };
  version_actual: {
    numero: number;
    id: string;
    ruta: string;
    tipo_almacenamiento: string;
    mime_type: string;
    tamano_bytes: number;
    nombre_original: string;
    extension: string;
  };
  cliente: {
    id: string;
    nombre: string;
    codigo: string;
    tipo: string;
    documento_identificacion: {
      tipo_documento: string;
      numero_documento: string;
      fecha_emision: string;
      fecha_expiracion: string;
      genero: string;
      nombre_completo: string;
      pais_emision: string;
    };
    segmento_bancario: string;
    nivel_riesgo: string;
    estado_documental: string;
    gestor: {
      id: string;
      nombre: string;
    };
  };
  documento_especializado: {
    documento_identificacion: {
      tipo_documento: string;
      numero_documento: string;
      fecha_emision: string;
      fecha_expiracion: string;
      genero: string;
      nombre_completo: string;
      pais_emision: string;
    };
  };
  analisis_ia?: {
    id_analisis: string;
    tipo_documento: string;
    confianza_clasificacion: string;
    estado_analisis: string;
    fecha_analisis: string;
    verificado: number;
    verificado_por: string | null;
    texto_extraido: string;
    entidades_detectadas: {
      phone: string[];
      amounts: string[];
    };
  };
}

export const documentService = {
  getVersions: async (documentId: string) => {
    const { data } = await axiosInstance.get<DocumentVersionsResponse>(`/documents/${documentId}/versions`);
    return data;
  },
  /**
   * Flujo completo: obtiene la URL prefirmada y sube el archivo a S3
   */
  uploadDocument: async ({ id_cliente, filename, titulo, file, content_type }: { id_cliente: string; filename: string; titulo: string; file: File; content_type?: string }) => {
    // Paso 1: Obtener la URL prefirmada
    const { data } = await axiosInstance.post('/documents', {
      id_cliente,
      filename,
      titulo,
      content_type: content_type || file.type || 'application/octet-stream',
    });

    // Paso 2: Subir el archivo a S3
    const formData = new FormData();
    Object.entries(data.upload_fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('file', file);

    const uploadResponse = await fetch(data.upload_url, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Error al subir archivo a S3: ${uploadResponse.status}`);
    }

    return {
      id_documento: data.id_documento,
      success: true,
      message: 'Documento subido correctamente',
      metadata: data.metadata
    };
  },
  /**
   * Sube una nueva versión de un documento existente
   */
  uploadDocumentVersion: async ({ id_cliente, parent_document_id, filename, titulo, file, content_type, comentario }: 
    { id_cliente: string; parent_document_id: string; filename: string; titulo?: string; file: File; content_type?: string; comentario?: string }) => {
    // Paso 1: Obtener la URL prefirmada para la nueva versión
    
    const { data } = await axiosInstance.post('/documents', {
      id_cliente,
      filename,
      titulo: titulo || filename,
      content_type: content_type || file.type || 'application/octet-stream',
      parent_document_id, // Este es el campo clave para identificar que es una nueva versión
      comentario_version: comentario || `Nueva versión - ${new Date().toLocaleString()}`
    });

    // Paso 2: Subir el archivo a S3
    const formData = new FormData();
    Object.entries(data.upload_fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('file', file);

    const uploadResponse = await fetch(data.upload_url, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Error al subir nueva versión a S3: ${uploadResponse.status}`);
    }

    return {
      id_documento: data.id_documento,
      success: true,
      message: 'Nueva versión subida correctamente',
      metadata: data.metadata
    };
  },
  getDocumentContentUrl: async (id_documento: string) => {
    const { data } = await axiosInstance.get(`/documents/${id_documento}/content`);
    return data; // { url, mime_type, ... }
  },
  searchDocuments: async (filters: any) => {
    const { data } = await axiosInstance.post('/documents/search', filters);
    return data; // { documentos, pagination, ... }
  },
  updateDocument: async (id_documento: string, data: any) => {
    const { data: response } = await axiosInstance.put(`/documents/${id_documento}`, data);
    return response;
  },
  /**
   * Mueve un documento a otra carpeta
   */
  moveDocument: async (id_documento: string, id_carpeta_destino: string) => {
    const { data } = await axiosInstance.post(`/documents/${id_documento}/move`, {
      id_carpeta_destino
    });
    return data; // { message, id_documento }
  },
  getVersionPreview: async (documentId: string, versionId: string) => {
    const { data } = await axiosInstance.get<DocumentVersionPreview>(`/documents/${documentId}/preview-version/${versionId}`);
    return data;
  },
  getDocumentDetails: async (documentId: string): Promise<DocumentDetailsResponse> => {
    const { data } = await axiosInstance.get<DocumentDetailsResponse>(`/documents/${documentId}`);
    return data;
  },
};