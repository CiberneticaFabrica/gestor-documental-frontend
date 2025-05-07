import { ProcessingStage } from './ProcessingHistoryPage';

export function ProcessingTimeline({ stages }: { stages: ProcessingStage[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Timeline de Procesamiento</h3>
      <ol className="relative border-l border-gray-300 dark:border-gray-600">
        {stages.map((stage, idx) => (
          <li key={stage.name + idx} className="mb-8 ml-6">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full ring-8 ring-white dark:ring-gray-900 text-white">
              {idx + 1}
            </span>
            <div className="flex flex-col md:flex-row md:items-center md:gap-6">
              <div className="font-semibold text-blue-700 dark:text-blue-300">{stage.name}</div>
              <div className="text-xs text-gray-500">{stage.start} - {stage.end}</div>
              <div className="text-xs text-gray-500">Usuario: {stage.user}</div>
              {stage.changes && <div className="text-xs text-gray-400">Cambios: {stage.changes}</div>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
} 