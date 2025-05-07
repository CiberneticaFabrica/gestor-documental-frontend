import { VerificationDocument } from './DocumentVerificationPage';

export function VerificationDocumentTable({ documents, onSelect }: { documents: VerificationDocument[]; onSelect: (doc: VerificationDocument) => void }) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Prioridad</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Urgencia</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Tipo</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Cliente</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Fecha de carga</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Estado</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Verificación</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Acción</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => onSelect(doc)}>
              <td className="px-4 py-2">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${doc.priority === 'alta' ? 'bg-red-100 text-red-700' : doc.priority === 'media' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{doc.priority}</span>
              </td>
              <td className="px-4 py-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-2 rounded-full bg-red-500" style={{ width: `${doc.urgency}%` }} />
                </div>
                <span className="text-xs ml-2">{doc.urgency}%</span>
              </td>
              <td className="px-4 py-2 text-xs">{doc.type}</td>
              <td className="px-4 py-2 text-xs">{doc.client}</td>
              <td className="px-4 py-2 text-xs">{doc.uploadDate}</td>
              <td className="px-4 py-2">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${doc.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{doc.status}</span>
              </td>
              <td className="px-4 py-2 text-xs">{doc.verificationType}</td>
              <td className="px-4 py-2">
                <button className="text-blue-500 hover:text-blue-700 font-semibold">Verificar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 