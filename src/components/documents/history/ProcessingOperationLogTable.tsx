import { OperationLog } from './ProcessingHistoryPage';

export function ProcessingOperationLogTable({ logs }: { logs: OperationLog[] }) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Registros de Operaciones</h3>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Timestamp</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Operación</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Sistema/Usuario</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Antes</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Después</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Confianza</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={log.timestamp + idx} className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">
              <td className="px-4 py-2 text-xs font-mono">{log.timestamp}</td>
              <td className="px-4 py-2 text-xs">{log.operation}</td>
              <td className="px-4 py-2 text-xs">{log.systemOrUser}</td>
              <td className="px-4 py-2 text-xs">{log.before}</td>
              <td className="px-4 py-2 text-xs">{log.after}</td>
              <td className="px-4 py-2 text-xs">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">{log.confidence}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 