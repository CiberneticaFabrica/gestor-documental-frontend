"use client";
import { useState } from 'react';
import type { FileWithPreview } from './types';
import { ClientAutocomplete } from './ClientAutocomplete';
import { documentService } from '@/lib/api/services/document.service';
import { DocumentUploadStatusPanel } from './DocumentUploadStatusPanel';

interface DocumentUploadProps {
  idCliente?: string;
  idDocumento?: string;
  onUploaded?: (idDocumento: string) => void;
  isNewVersion?: boolean;
}

export function DocumentUpload({ idCliente: propIdCliente, idDocumento: propIdDocumento, onUploaded, isNewVersion = false }: DocumentUploadProps) {
  const [clientId, setClientId] = useState<string | null>(propIdCliente || null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [comentario, setComentario] = useState<string>('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'progress'; text: string; progress?: number } | null>(null);

  const handleSend = async () => {
    if ((!clientId && !propIdCliente) || files.length === 0) return;
    
    setSending(true);
    setStatus({ type: 'progress', text: 'Preparando el documento...', progress: 10 });
    
    try {
      const file = files[0];
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      let idDoc = propIdDocumento;
      const finalClientId = propIdCliente || clientId;
      
      // Validación adicional
      if (!finalClientId) {
        throw new Error("ID de cliente no disponible");
      }
      
      // Actualizar progreso
      setStatus({ type: 'progress', text: 'Subiendo el documento...', progress: 30 });
      
      if (isNewVersion && propIdDocumento) {
        // Subir como nueva versión
        console.log("Subiendo nueva versión con:", {
          id_cliente: finalClientId,
          parent_document_id: propIdDocumento,
          filename: file.name,
          titulo: nameWithoutExt,
          content_type: file.type || 'application/octet-stream',
          comentario: comentario || `Nueva versión - ${new Date().toLocaleString()}`
        });
        
        const uploadResult = await documentService.uploadDocumentVersion({
          id_cliente: finalClientId,
          parent_document_id: propIdDocumento,
          filename: file.name,
          titulo: nameWithoutExt,
          file,
          content_type: file.type || 'application/octet-stream',
          comentario: comentario || `Nueva versión - ${new Date().toLocaleString()}`
        });
        
        console.log("Resultado de subir nueva versión:", uploadResult);
        idDoc = uploadResult.id_documento;
        
        setStatus({ type: 'progress', text: 'Procesando la nueva versión...', progress: 70 });
      } else {
        // CAMBIO IMPORTANTE: Incluir título directamente en la carga inicial
        // en lugar de hacer una actualización separada después
        console.log("Subiendo nuevo documento con:", {
          id_cliente: finalClientId,
          filename: file.name,
          titulo: nameWithoutExt,
          content_type: file.type || 'application/octet-stream',
        });
        
        const uploadResult = await documentService.uploadDocument({
          id_cliente: finalClientId,
          filename: file.name,
          titulo: nameWithoutExt, // Ya estamos enviando el título aquí
          file,
          content_type: file.type || 'application/octet-stream',
        });
        
        console.log("Resultado de subir nuevo documento:", uploadResult);
        idDoc = uploadResult.id_documento;
        
        setStatus({ type: 'progress', text: 'Procesando documento nuevo...', progress: 70 });
        
        // CAMBIO IMPORTANTE: Eliminar la llamada a updateDocument
        // ya que los datos ya se enviaron en la carga inicial
      }
      
      setStatus({ type: 'success', text: isNewVersion ? 'Nueva versión enviada correctamente.' : 'Documento enviado correctamente.', progress: 100 });
      setFiles([]);
      if (onUploaded && idDoc) onUploaded(idDoc);
    } catch (error: any) {
      console.error("Error al subir documento:", error);
      
      // Registro detallado del error
      if (error.response) {
        console.error("Respuesta de error:", error.response.data);
        console.error("Estado del error:", error.response.status);
      } else if (error.message) {
        console.error("Mensaje de error:", error.message);
      } else {
        console.error("Error desconocido:", error);
      }
      
      setStatus({ 
        type: 'error', 
        text: error?.response?.data?.error || error?.message || 'Error al enviar el documento.', 
        progress: 0 
      });
    } finally {
      setSending(false);
    }
  };

  // Determinar el título basado en si es una nueva versión o un nuevo documento
  const pageTitle = isNewVersion ? "Subir nueva versión" : "Carga de documentos";

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8 flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{pageTitle}</h2>
      
      {/* Solo mostrar selector de cliente si no tenemos clientId proporcionado y no es nueva versión */}
      {!propIdCliente && !isNewVersion && (
        <ClientAutocomplete
          value={clientId}
          onChange={setClientId}
          label="Selecciona un cliente"
        />
      )}
      
      {/* Campo para comentario si es nueva versión */}
      {isNewVersion && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="comentario">
            Comentario de la versión
          </label>
          <textarea
            id="comentario"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Describe los cambios realizados en esta versión"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </div>
      )}
      
      {/* Selector de archivos */}
      {(clientId || propIdCliente) && (
        <>
          <div className="mt-2">
            <Dropzone files={files} setFiles={setFiles} />
          </div>
          {files.length > 0 && (
            <div className="text-sm text-gray-700 dark:text-gray-200 mt-2">
              Documento seleccionado: <span className="font-semibold">{files[0].name}</span>
            </div>
          )}
          
          {/* Panel de estado */}
          {status && (
            <div className={`mt-2 p-3 rounded-md ${
              status.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200' : 
              status.type === 'error' ? 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200' : 
              'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {status.type === 'progress' && status.progress !== undefined && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${status.progress}%` }}></div>
                </div>
              )}
              <p className="text-sm font-medium">{status.text}</p>
            </div>
          )}
          
          <button
            className="mt-4 w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            disabled={files.length === 0 || sending}
            onClick={handleSend}
          >
            {sending ? 'Enviando...' : isNewVersion ? 'Enviar nueva versión' : 'Enviar documento'}
          </button>
        </>
      )}
    </div>
  );
}

function Dropzone({ files, setFiles }: { files: FileWithPreview[]; setFiles: (f: FileWithPreview[]) => void }) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files) as FileWithPreview[];
    if (droppedFiles.length > 0) {
      setFiles([droppedFiles[0]]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files) as FileWithPreview[];
      setFiles([selected[0]]);
    }
  };

  return (
    <div
      className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[180px] border-2 border-dashed border-blue-400 cursor-pointer hover:border-blue-600 transition"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('file-input')?.click()}
      tabIndex={0}
      role="button"
      aria-label="Adjuntar archivos"
    >
      <input
        id="file-input"
        type="file"
        multiple={false}
        className="hidden"
        onChange={handleFileInput}
        title="Seleccionar archivos"
        aria-label="Seleccionar archivos"
        autoComplete="off"
        name="file-upload-input"
      />
      <span className="text-blue-500 font-semibold mb-2">Arrastra y suelta un archivo aquí o haz click para seleccionar</span>
      {files.length > 0 && (
        <span className="text-sm text-gray-600 dark:text-gray-300 mt-2">{files[0].name}</span>
      )}
    </div>
  );
}