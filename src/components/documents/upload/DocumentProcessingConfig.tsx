interface ProcessingConfig {
  priority?: 'high' | 'medium' | 'low';
  useOCR?: boolean;
  notifyOnComplete?: boolean;
}

export function DocumentProcessingConfig({ processing, setProcessing }: { processing: ProcessingConfig; setProcessing: (p: ProcessingConfig) => void }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-4">Configuración de Procesamiento</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Prioridad</label>
          <select
            aria-label="Seleccionar prioridad de procesamiento"
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
            value={processing.priority || 'medium'}
            onChange={(e) => setProcessing({ ...processing, priority: e.target.value as ProcessingConfig['priority'] })}
          >
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useOCR"
            checked={processing.useOCR || false}
            onChange={(e) => setProcessing({ ...processing, useOCR: e.target.checked })}
            className="rounded bg-gray-700"
          />
          <label htmlFor="useOCR" className="text-sm text-gray-400">Usar OCR</label>
        </div>
      </div>
    </div>
  );
} 