"use client";
import { useState } from 'react';
import type { FileWithPreview } from './types';
import { ClientAutocomplete } from './ClientAutocomplete';
import { documentService } from '@/lib/api/services/document.service';

function SimpleDocumentUpload() {
  const [clientId, setClientId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSend = async () => {
    if (!clientId || files.length === 0) return;
    setSending(true);
    setMessage(null);
    try {
      const file = files[0];
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      await documentService.uploadDocument({
        id_cliente: clientId,
        filename: file.name,
        titulo: nameWithoutExt,
        file,
        content_type: file.type || 'application/octet-stream',
      });
      setMessage({ type: 'success', text: 'Documento enviado correctamente.' });
      setFiles([]);
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.response?.data?.error || 'Error al enviar el documento.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white dark:bg-gray-800 rounded-lg shadow p-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Carga de documentos</h1>
      <ClientAutocomplete
        value={clientId}
        onChange={setClientId}
        label="Selecciona un cliente"
      />
      {clientId && (
        <>
          <div className="mt-2">
            <Dropzone files={files} setFiles={setFiles} />
          </div>
          {files.length > 0 && (
            <div className="text-sm text-gray-700 dark:text-gray-200 mt-2">
              Documento seleccionado: <span className="font-semibold">{files[0].name}</span>
            </div>
          )}
          <button
            className="mt-4 w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            disabled={files.length === 0 || sending}
            onClick={handleSend}
          >
            {sending ? 'Enviando...' : 'Enviar documento'}
          </button>
          {message && (
            <div className={`mt-3 text-center text-sm font-medium ${message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {message.text}
            </div>
          )}
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

export default SimpleDocumentUpload; 