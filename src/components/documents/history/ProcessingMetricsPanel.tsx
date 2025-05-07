export function ProcessingMetricsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div className="bg-blue-900 rounded-lg p-4 text-white">
        <div className="text-xs text-blue-200">Tiempo total de procesamiento</div>
        <div className="text-2xl font-bold">5m 00s</div>
      </div>
      <div className="bg-green-900 rounded-lg p-4 text-white">
        <div className="text-xs text-green-200">Comparativa con media</div>
        <div className="text-2xl font-bold">-10%</div>
      </div>
      <div className="bg-yellow-900 rounded-lg p-4 text-white">
        <div className="text-xs text-yellow-200">Puntos de demora</div>
        <div className="text-2xl font-bold">Verificación</div>
      </div>
      <div className="bg-purple-900 rounded-lg p-4 text-white">
        <div className="text-xs text-purple-200">Optimizaciones sugeridas</div>
        <div className="text-2xl font-bold">Automatizar validación</div>
      </div>
    </div>
  );
} 