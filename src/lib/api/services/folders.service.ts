import { BaseService } from '../base-service';

export interface Document {
  id_documento: string;
  codigo_documento: string;
  titulo: string;
  id_carpeta: string;
  // ...otros campos opcionales
}

export interface Folder {
  id_carpeta: string;
  nombre_carpeta: string;
  descripcion: string;
  carpeta_padre_id: string | null;
  ruta_completa: string;
  id_propietario: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  propietario_nombre: string;
  documentos: Document[];
  subcarpetas: Folder[];
}

export class FoldersService extends BaseService {
  async getFoldersWithDocuments(): Promise<Folder[]> {
    try {
      const res = await this.get<{ carpetas: Folder[] }>('/folders?include_documents=true');
      return res.carpetas ?? [];
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const foldersService = new FoldersService(); 