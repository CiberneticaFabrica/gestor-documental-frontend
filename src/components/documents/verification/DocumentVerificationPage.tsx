"use client";

import { useState } from 'react';
import { VerificationMetricsPanel } from './VerificationMetricsPanel';
import { VerificationDocumentTable } from './VerificationDocumentTable';
import { VerificationModal } from './VerificationModal';

export interface VerificationDocument {
  id: string;
  priority: 'alta' | 'media' | 'baja';
  urgency: number;
  type: string;
  client: string;
  uploadDate: string;
  status: string;
  verificationType: string;
}

const mockDocuments: VerificationDocument[] = [
  {
    id: 'VER-001',
    priority: 'alta',
    urgency: 95,
    type: 'DNI',
    client: 'Juan Pérez',
    uploadDate: '2024-03-15',
    status: 'Pendiente',
    verificationType: 'Validación manual',
  },
  {
    id: 'VER-002',
    priority: 'media',
    urgency: 70,
    type: 'Comprobante Domicilio',
    client: 'María García',
    uploadDate: '2024-03-14',
    status: 'Pendiente',
    verificationType: 'Validación visual',
  },
];

export default function DocumentVerificationPage() {
  const [selectedDoc, setSelectedDoc] = useState<VerificationDocument | null>(null);

  return (
    <div className="flex flex-col gap-6 min-h-[80vh]">
      <VerificationMetricsPanel />
      <VerificationDocumentTable documents={mockDocuments} onSelect={setSelectedDoc} />
      {selectedDoc && (
        <VerificationModal document={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}
    </div>
  );
} 