"use client";

import { useState } from 'react';
import { DocumentFilters } from './DocumentFilters';
import { DocumentTable } from './DocumentTable';
import { DocumentPreviewModal } from './DocumentPreviewModal';

interface Document {
  id: string;
  thumbnail: string;
  type: string;
  typeIcon: string;
  client: string;
  uploadDate: string;
  status: string;
  confidence: number;
  expiry: string;
}

// Mock de documentos
const mockDocuments: Document[] = [
  {
    id: 'DOC-001',
    thumbnail: '/thumbnails/doc1.jpg',
    type: 'DNI',
    typeIcon: 'id-card',
    client: 'Juan Pérez',
    uploadDate: '2024-03-15',
    status: 'Procesado',
    confidence: 95,
    expiry: '2025-03-15'
  },
  {
    id: 'DOC-002',
    thumbnail: '/thumbnails/doc2.jpg',
    type: 'Comprobante Domicilio',
    typeIcon: 'home',
    client: 'María García',
    uploadDate: '2024-03-14',
    status: 'Pendiente',
    confidence: 75,
    expiry: '2025-03-14'
  }
];

export function DocumentExplorerPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-2">Explorador de documentos</h1>
      <DocumentFilters />
      <DocumentTable documents={mockDocuments} onSelect={setSelectedDocument} />
      {selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
} 