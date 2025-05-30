export interface Document {
  id_documento: string;
  codigo_documento: string;
  titulo: string;
  descripcion: string;
  id_tipo_documento: string;
  tipo_documento: string;
  version_actual: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  id_carpeta: string | null;
  nombre_carpeta: string | null;
  estado: string;
  tags: string[] | null;
  creado_por_usuario: string;
  modificado_por_usuario: string;
  id_cliente: string;
  cliente_nombre: string;
}

export interface DocumentData {
  nombre_completo: string;
  numero_documento: string;
  fecha_emision: string;
  fecha_expiracion: string;
  lugar_nacimiento: string;
  genero: string;
  pais_emision: string;
  tipo_documento: string;
  autoridad_emision: string;
  nacionalidad: string;
  codigo_pais: string;
}

export interface DocumentsResponse {
  documentos: Document[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface DocumentPreview {
  url_documento: string;
  mime_type: string;
  nombre_archivo: string;
  tamano_bytes: number;
  expiracion_url: number;
  url_miniatura: string;
  miniatura_mime_type: string;
  miniatura_nombre: string;
  tiene_miniatura: boolean;
  miniatura_es_icono: boolean;
}

export interface DocumentStatusResponse {
  message: string;
  id_documento: string;
}

export async function fetchDocuments(page: number = 1, pageSize: number = 1000): Promise<DocumentsResponse> {
  const token = localStorage.getItem("session_token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/documents?page=${page}&page_size=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error al cargar documentos');
  }

  return response.json();
}

export async function fetchDocumentContent(documentId: string): Promise<DocumentPreview> {
  const token = localStorage.getItem("session_token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/documents/${documentId}/preview`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    if (errorData?.message?.includes('NoSuchKey')) {
      throw new Error('El documento no se encuentra disponible en este momento');
    }
    throw new Error('Error al cargar el contenido del documento');
  }

  const data = await response.json();
  if (!data.url_documento) {
    throw new Error('No se pudo obtener la URL del documento');
  }
  return data as DocumentPreview;
}

export async function fetchDocumentDownload(documentId: string): Promise<Blob> {
  const token = localStorage.getItem("session_token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/documents/${documentId}/download`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error al descargar el documento');
  }

  return response.blob();
}

export async function fetchDocumentData(documentId: string, data: DocumentData): Promise<void> {
  const token = localStorage.getItem("session_token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/documents/${documentId}/data`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Error al actualizar los datos del documento');
  }
}

export async function fetchDocumentStatus(documentId: string, estado: string): Promise<DocumentStatusResponse> {
  const token = localStorage.getItem("session_token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/documents/${documentId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado }),
    }
  );

  if (!response.ok) {
    throw new Error('Error al actualizar el estado del documento');
  }

  return response.json();
} 