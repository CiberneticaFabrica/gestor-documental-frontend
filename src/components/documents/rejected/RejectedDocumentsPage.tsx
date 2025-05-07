"use client";
import { useState } from 'react';
import { RejectedStatsPanel } from './RejectedStatsPanel';
import { RejectedDocumentsTable } from './RejectedDocumentsTable';
import { RejectedManagementPanel } from './RejectedManagementPanel';
import { AppealModal } from './AppealModal';

export interface RejectedDocument {
  id: string;
  type: string;
  client: string;
  rejectionDate: string;
  rejectionReason: string;
  rejectedBy: string;
  attempts: number;
}

const mockRejectedDocuments: RejectedDocument[] = [
  {
    id: 'REJ-001',
    type: 'DNI',
    client: 'Juan Pérez',
    rejectionDate: '2024-03-20',
    rejectionReason: 'Documento ilegible',
    rejectedBy: 'Supervisor 1',
    attempts: 2,
  },
  {
    id: 'REJ-002',
    type: 'Comprobante Domicilio',
    client: 'María García',
    rejectionDate: '2024-03-19',
    rejectionReason: 'Datos inconsistentes',
    rejectedBy: 'Validador 2',
    attempts: 1,
  },
];

export default function RejectedDocumentsPage() {
  const [selectedDoc, setSelectedDoc] = useState<RejectedDocument | null>(null);
  const [showAppeal, setShowAppeal] = useState(false);

  return (
    <div className="flex flex-col gap-6 min-h-[80vh]">
      <RejectedStatsPanel />
      <RejectedDocumentsTable documents={mockRejectedDocuments} onSelect={setSelectedDoc} />
      <RejectedManagementPanel onAppeal={() => setShowAppeal(true)} />
      {showAppeal && selectedDoc && (
        <AppealModal onClose={() => setShowAppeal(false)} />
      )}
    </div>
  );
} 