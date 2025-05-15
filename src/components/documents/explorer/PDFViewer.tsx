"use client";
import { useState } from 'react';
import PDFViewerModal from './PDFViewerModal';

interface PDFViewerProps {
  url: string;
  filename: string;
}

export default function PDFViewer({ url, filename }: PDFViewerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Codificar la URL para el visor de Google
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto relative">
          <iframe 
            src={googleViewerUrl}
            className="w-full h-full border-0" 
            title={filename}
            onError={() => setError('Error al cargar el PDF')}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
            Pantalla completa
          </button>
        </div>
        {error && (
          <div className="flex flex-col items-center justify-center text-red-500 p-4">
            <span className="mb-2">{error}</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
              download={filename}
            >
              Descargar PDF
            </a>
          </div>
        )}
      </div>

      <PDFViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={url}
        filename={filename}
      />
    </>
  );
} 