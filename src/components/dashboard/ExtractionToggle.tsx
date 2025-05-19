// src/components/dashboard/ExtractionToggle.tsx
import { useState } from 'react';
import { BarChart3, FileSearch } from 'lucide-react';
import { ProcessingMetricsComponent } from './metric-procesamiento';
import ExtractionMetricsComponent from './metric-extraccion';

interface ExtractionToggleProps {
  processingMetrics: any;
  extractionMetrics: any;
  loading?: boolean;
}

export function ExtractionToggle({ processingMetrics, extractionMetrics, loading }: ExtractionToggleProps) {
  const [showProcessing, setShowProcessing] = useState(true);

  return (
    <div>
      <button
        className="mb-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
        onClick={() => setShowProcessing((prev) => !prev)}
        title={showProcessing ? 'Ver Extracción' : 'Ver Procesamiento'}
      >
        {showProcessing ? <FileSearch className="w-6 h-6" /> : <BarChart3 className="w-6 h-6" />}
      </button>
      {loading ? (
        <div>Cargando métricas...</div>
      ) : showProcessing ? (
        <ProcessingMetricsComponent data={processingMetrics} />
      ) : (
        <ExtractionMetricsComponent data={extractionMetrics} />
      )}
    </div>
  );
}