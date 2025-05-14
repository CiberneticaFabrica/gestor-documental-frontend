import { ClientAutocomplete } from './ClientAutocomplete';

interface Metadata {
  client?: string;
}

export function DocumentMetadataPanel({ metadata, setMetadata }: { metadata: Metadata; setMetadata: (m: Metadata) => void }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Asignar Cliente</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Selecciona el cliente al que pertenecerán los documentos que vas a subir.</p>
      <ClientAutocomplete
        value={metadata.client || null}
        onChange={id => setMetadata({ ...metadata, client: id || undefined })}
        label="Cliente"
      />
      {metadata.client && (
        <div className="mt-2 text-xs text-green-600 dark:text-green-400">Cliente seleccionado correctamente.</div>
      )}
    </div>
  );
} 