export function VerificationMetricsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="bg-blue-900 rounded-lg p-4 text-white">
        <div className="text-xs text-blue-200">Documentos pendientes</div>
        <div className="text-2xl font-bold">12</div>
      </div>
      <div className="bg-green-900 rounded-lg p-4 text-white">
        <div className="text-xs text-green-200">Tiempo medio de verificación</div>
        <div className="text-2xl font-bold">3m 20s</div>
      </div>
      <div className="bg-purple-900 rounded-lg p-4 text-white">
        <div className="text-xs text-purple-200">Tasa de aprobación global</div>
        <div className="text-2xl font-bold">89%</div>
      </div>
    </div>
  );
} 