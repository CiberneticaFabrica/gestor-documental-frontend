import { useState } from 'react';
import DocumentCard from '@/components/audits/DocumentCard';

export default function ClientCard({ cliente }: { cliente: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-4 border rounded shadow bg-gray-50">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div>
          <span className="font-bold text-lg">👤 {cliente.nombre_razon_social} ({cliente.codigo_cliente})</span>
          <span className="ml-4 text-sm">Estado: <span className="text-green-600 font-semibold">Activo</span></span>
          <span className="ml-4 text-sm">Total Documentos: <span className="font-semibold">{cliente.total_documentos}</span></span>
        </div>
        <button className="text-blue-600">{expanded ? '▲ Ocultar' : '▼ Ver documentos'}</button>
      </div>
      {expanded && (
        <div className="p-4 bg-white">
          {cliente.documentos.map((doc: any) => (
            <DocumentCard key={doc.id_documento} documento={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
