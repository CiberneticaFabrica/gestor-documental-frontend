import { FileText, Eye, Download, Send, Archive } from 'lucide-react';

type Document = {
  id: string;
  thumbnail: string;
  type: string;
  typeIcon: string;
  client: string;
  uploadDate: string;
  status: string;
  confidence: number;
  expiry: string;
};

interface DocumentTableProps {
  documents: Document[];
  onSelect: (doc: Document) => void;
}

export function DocumentTable({ documents, onSelect }: DocumentTableProps) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">ID</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Miniatura</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Tipo</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Cliente</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Fecha de carga</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Estado</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Confianza</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Vencimiento</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => onSelect(doc)}>
              <td className="px-4 py-2 text-xs font-mono">{doc.id}</td>
              <td className="px-4 py-2"><img src={doc.thumbnail} alt="thumb" className="h-8 w-8 rounded object-cover" /></td>
              <td className="px-4 py-2 flex items-center gap-2"><FileText className="h-4 w-4 text-blue-500" />{doc.type}</td>
              <td className="px-4 py-2 text-xs">{doc.client}</td>
              <td className="px-4 py-2 text-xs">{doc.uploadDate}</td>
              <td className="px-4 py-2">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${doc.status === 'Procesado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{doc.status}</span>
              </td>
              <td className="px-4 py-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${doc.confidence}%` }} />
                </div>
                <span className="text-xs ml-2">{doc.confidence}%</span>
              </td>
              <td className="px-4 py-2 text-xs">{doc.expiry}</td>
              <td className="px-4 py-2 flex gap-2">
                <button className="text-blue-500 hover:text-blue-700" title="Ver"><Eye className="h-4 w-4" /></button>
                <button className="text-green-500 hover:text-green-700" title="Descargar"><Download className="h-4 w-4" /></button>
                <button className="text-yellow-500 hover:text-yellow-700" title="Enviar"><Send className="h-4 w-4" /></button>
                <button className="text-gray-500 hover:text-gray-700" title="Archivar"><Archive className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 