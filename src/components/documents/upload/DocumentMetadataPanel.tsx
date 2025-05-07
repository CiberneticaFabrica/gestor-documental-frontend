interface Metadata {
  type?: string;
  client?: string;
  description?: string;
  folder?: string;
}

export function DocumentMetadataPanel({ metadata, setMetadata }: { metadata: Metadata; setMetadata: (m: Metadata) => void }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-4">Metadatos del Documento</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="docType" className="block text-sm text-gray-400 mb-1">Tipo de Documento</label>
          <input
            id="docType"
            type="text"
            placeholder="Ingrese el tipo de documento"
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
            value={metadata.type || ''}
            onChange={(e) => setMetadata({ ...metadata, type: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="client" className="block text-sm text-gray-400 mb-1">Cliente</label>
          <input
            id="client"
            type="text"
            placeholder="Ingrese el nombre del cliente"
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
            value={metadata.client || ''}
            onChange={(e) => setMetadata({ ...metadata, client: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
} 