"use client";
import { useState } from 'react';
import type { FileWithPreview } from './types';
import { DocumentMetadataPanel } from './DocumentMetadataPanel';
import { DocumentProcessingConfig } from './DocumentProcessingConfig';
import { DocumentValidationResults } from './DocumentValidationResults';
import { DocumentUploadStatusPanel } from './DocumentUploadStatusPanel';
import { DocumentDropzone } from './DocumentDropzone';

export default function DocumentUploadPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [metadata, setMetadata] = useState({});
  const [processing, setProcessing] = useState({});
  const [validation] = useState({});
  const [uploadStatus] = useState({});

  return (
    <div className="flex flex-col h-full min-h-[80vh]">
      <h1 className="text-2xl font-bold text-white mb-4">Carga de documentos</h1>
      <div className="flex flex-1 gap-6">
        {/* Panel lateral: Dropzone */}
        <div className="w-full max-w-xs">
          <DocumentDropzone files={files} setFiles={setFiles} />
        </div>
        {/* Panel central: Metadatos y configuración */}
        <div className="flex-1 flex flex-col gap-6">
          <DocumentMetadataPanel metadata={metadata} setMetadata={setMetadata} />
          <DocumentProcessingConfig processing={processing} setProcessing={setProcessing} />
        </div>
      </div>
      {/* Panel inferior: Validación y estado de carga */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <DocumentValidationResults validation={validation} />
        <DocumentUploadStatusPanel status={uploadStatus} />
      </div>
    </div>
  );
} 