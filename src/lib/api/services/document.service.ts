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
  getDocumentContentUrl: async (id_documento: string) => {
    const { data } = await axiosInstance.get(`/documents/${id_documento}/content`);
    return data; // { url, mime_type, ... }
  }
}; 