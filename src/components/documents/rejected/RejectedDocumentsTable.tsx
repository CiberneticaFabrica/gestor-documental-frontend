import { RejectedDocument } from './RejectedDocumentsPage';

export function RejectedDocumentsTable({ documents, onSelect }: { documents: RejectedDocument[]; onSelect: (doc: RejectedDocument) => void }) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Documento</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Cliente</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Fecha de rechazo</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Motivo</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Usuario</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Intentos</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Acción</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-red-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => onSelect(doc)}>
              <td className="px-4 py-2 text-xs">{doc.type}</td>
              <td className="px-4 py-2 text-xs">{doc.client}</td>
              <td className="px-4 py-2 text-xs">{doc.rejectionDate}</td>
              <td className="px-4 py-2 text-xs">{doc.rejectionReason}</td>
              <td className="px-4 py-2 text-xs">{doc.rejectedBy}</td>
              <td className="px-4 py-2 text-xs">{doc.attempts}</td>
              <td className="px-4 py-2">
                <button className="text-red-500 hover:text-red-700 font-semibold">Gestionar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 