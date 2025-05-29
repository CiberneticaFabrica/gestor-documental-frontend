import { useState } from 'react';
import ActivityTable from '@/components/audits/ActivityTable';

export default function DocumentCard({ documento }: { documento: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-2 border rounded bg-gray-100">
      <div className="flex items-center justify-between p-2 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div>
          <span className="font-semibold">📄 {documento.titulo}</span>
          <span className="ml-2 text-xs">Tipo: {documento.tipo_documento}</span>
          <span className="ml-2 text-xs">Actividades: {documento.total_actividades} (mostrando: {documento.mostrando_actividades})</span>
        </div>
        <button className="text-blue-600">{expanded ? '▲ Ocultar' : '▼ Ver actividades recientes'}</button>
      </div>
      {expanded && (
        <div className="p-2">
          <ActivityTable actividades={documento.actividades} />
        </div>
      )}
    </div>
  );
}
