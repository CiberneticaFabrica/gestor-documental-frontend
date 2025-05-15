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
  url: string;
  mime_type: string;
  nombre_archivo: string;
  tamano_bytes: number;
  expiracion_url: number;
}

export async function fetchDocuments(page: number = 1, pageSize: number = 10): Promise<DocumentsResponse> {
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
  console.log('Fetching document content for ID:', documentId);
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/documents/${documentId}/preview`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    console.error('Error response:', response.status, response.statusText);
    const errorData = await response.json().catch(() => null);
    if (errorData?.message?.includes('NoSuchKey')) {
      throw new Error('El documento no se encuentra disponible en este momento');
    }
    throw new Error('Error al cargar el contenido del documento');
  }

  const data = await response.json();
  console.log('Document content response:', data);
  
  if (!data.url) {
    throw new Error('No se pudo obtener la URL del documento');
  }
  
  return data as DocumentPreview;
} 