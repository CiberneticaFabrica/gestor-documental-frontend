export function AppealModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          title="Cerrar apelación"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Apelación/Reconsideración</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="justificacion" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Justificación</label>
            <textarea id="justificacion" className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2" rows={3} placeholder="Describe el motivo de la apelación" />
          </div>
          <div>
            <label htmlFor="evidencia" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Adjuntar evidencia adicional</label>
            <input id="evidencia" type="file" className="w-full bg-gray-100 dark:bg-gray-800 rounded px-3 py-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Enviar apelación</button>
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Solicitar segunda opinión</button>
          </div>
        </form>
      </div>
    </div>
  );
} 