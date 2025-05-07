"use client";
import { ProcessingMetricsPanel } from './ProcessingMetricsPanel';
import { ProcessingTimeline } from './ProcessingTimeline';
import { ProcessingOperationLogTable } from './ProcessingOperationLogTable';
import { ProcessingAuditExportPanel } from './ProcessingAuditExportPanel';

export interface ProcessingStage {
  name: string;
  start: string;
  end: string;
  user: string;
  changes?: string;
}

export interface OperationLog {
  timestamp: string;
  operation: string;
  systemOrUser: string;
  before: string;
  after: string;
  confidence: number;
}

const mockStages: ProcessingStage[] = [
  { name: 'Carga', start: '2024-03-10T10:00', end: '2024-03-10T10:01', user: 'Cliente', changes: '-' },
  { name: 'Clasificación', start: '2024-03-10T10:01', end: '2024-03-10T10:02', user: 'Sistema', changes: 'Tipo detectado' },
  { name: 'Extracción', start: '2024-03-10T10:02', end: '2024-03-10T10:03', user: 'Sistema', changes: 'Datos extraídos' },
  { name: 'Verificación', start: '2024-03-10T10:03', end: '2024-03-10T10:05', user: 'Validador', changes: 'Corrección de nombre' },
];

const mockLogs: OperationLog[] = [
  { timestamp: '2024-03-10T10:01', operation: 'Clasificación', systemOrUser: 'Sistema', before: '-', after: 'DNI', confidence: 98 },
  { timestamp: '2024-03-10T10:02', operation: 'Extracción', systemOrUser: 'Sistema', before: '-', after: 'Nombre: Juan', confidence: 95 },
  { timestamp: '2024-03-10T10:05', operation: 'Verificación', systemOrUser: 'Validador', before: 'Juan', after: 'Juan Pérez', confidence: 99 },
];

export default function ProcessingHistoryPage() {
  return (
    <div className="flex flex-col gap-6 min-h-[80vh]">
      <ProcessingMetricsPanel />
      <ProcessingTimeline stages={mockStages} />
      <ProcessingOperationLogTable logs={mockLogs} />
      <ProcessingAuditExportPanel />
    </div>
  );
} 