export function RejectedStatsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div className="bg-red-900 rounded-lg p-4 text-white">
        <div className="text-xs text-red-200">Rechazos totales</div>
        <div className="text-2xl font-bold">8</div>
      </div>
      <div className="bg-yellow-900 rounded-lg p-4 text-white">
        <div className="text-xs text-yellow-200">Por tipo de documento</div>
        <div className="text-2xl font-bold">DNI: 4</div>
      </div>
      <div className="bg-blue-900 rounded-lg p-4 text-white">
        <div className="text-xs text-blue-200">Por motivo</div>
        <div className="text-2xl font-bold">Ilegible: 3</div>
      </div>
      <div className="bg-purple-900 rounded-lg p-4 text-white">
        <div className="text-xs text-purple-200">Tendencia semanal</div>
        <div className="text-2xl font-bold">+12%</div>
      </div>
    </div>
  );
} 