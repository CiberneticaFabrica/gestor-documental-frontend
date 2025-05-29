import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDocumentStatus } from '@/services/common/documentService';
import { CheckCircle, XCircle } from 'lucide-react';

const tiposDocumento = [
  { value: '', label: 'Todos' },
  { value: 'DNI', label: 'DNI' },
  { value: 'Pasaporte', label: 'Pasaporte' },
  { value: 'Contrato cuenta', label: 'Contrato cuenta' },
  // ...otros tipos
];

const resultados = [
  { value: '', label: 'Todos' },
  { value: 'exito', label: 'Éxito' },
  { value: 'fallo', label: 'Error' },
];

export default function ActivitySidebarFilters({ filters, setFilters, onRefresh }: { filters: any, setFilters: any, onRefresh?: () => void }) {
  const [cliente, setCliente] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [resultado, setResultado] = useState('');
  const [accion, setAccion] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const handleApprove = async (documentId: string) => {
    try {
      const response = await fetchDocumentStatus(documentId, 'publicado');
      toast.success(`Documento aprobado - ID: ${response.id_documento}`);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Error al aprobar el documento');
    }
  };

  const handleReject = async (documentId: string) => {
    try {
      const response = await fetchDocumentStatus(documentId, 'rechazado');
      toast.error(`Documento rechazado - ID: ${response.id_documento}`);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Error al rechazar el documento');
    }
  };

  const handleApply = () => {
    setFilters({
      ...filters,
      cliente,
      tipo_documento: tipoDocumento,
      start_date: fechaInicio,
      end_date: fechaFin,
      resultado,
      accion,
    });
  };

  const handleReset = () => {
    setCliente('');
    setTipoDocumento('');
    setFechaInicio('');
    setFechaFin('');
    setResultado('');
    setAccion('');
    setFilters({});
  };

  return (
    <aside className="w-80 bg-white border-r p-4">
      <h2 className="font-semibold mb-4">Filtros</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cliente</label>
          <input
            type="text"
            value={cliente}
            onChange={e => setCliente(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="Nombre o código"
            aria-label="Cliente"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de documento</label>
          <select
            value={tipoDocumento}
            onChange={e => setTipoDocumento(e.target.value)}
            className="w-full border rounded px-2 py-1"
            aria-label="Tipo de documento"
          >
            {tiposDocumento.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rango de fechas</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              className="border rounded px-2 py-1 w-1/2"
              aria-label="Fecha de inicio"
            />
            <input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              className="border rounded px-2 py-1 w-1/2"
              aria-label="Fecha de fin"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Resultado</label>
          <select
            value={resultado}
            onChange={e => setResultado(e.target.value)}
            className="w-full border rounded px-2 py-1"
            aria-label="Resultado"
          >
            {resultados.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Acción</label>
          <input
            type="text"
            value={accion}
            onChange={e => setAccion(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="Acción específica"
            aria-label="Acción"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleApply} className="flex-1 bg-blue-600 text-white py-2 rounded">Aplicar</button>
          <button onClick={handleReset} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded">Limpiar</button>
        </div>

        {selectedDocument && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-3">Acciones del Documento</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleApprove(selectedDocument.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Aprobar Documento
              </button>
              <button
                onClick={() => handleReject(selectedDocument.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Rechazar Documento
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}