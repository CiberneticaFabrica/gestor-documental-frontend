'use client';

import { ShieldCheck, Activity, Users, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

const riskFactors = [
  { label: 'Documento vencido', color: 'red' },
  { label: 'Extracción baja', color: 'yellow' },
  { label: 'Segmento alto riesgo', color: 'orange' },
];

const riskHistory = [
  { date: 'Ene', value: 2 },
  { date: 'Feb', value: 3 },
  { date: 'Mar', value: 2 },
  { date: 'Abr', value: 1 },
];

const riskComparative = [
  { name: 'Cliente', value: 1 },
  { name: 'Segmento', value: 2 },
];

const compliance = [
  { label: 'KYC', status: 'Aprobado', date: '2023-12-10', color: 'green' },
  { label: 'PBC', status: 'En revisión', date: '2024-01-15', color: 'yellow' },
  { label: 'FATCA/CRS', status: 'No aplica', date: '', color: 'gray' },
  { label: 'Auditoría', status: 'Sin incidencias', date: '2024-02-20', color: 'green' },
];

const biometrics = {
  status: 'Verificado',
  match: '98%',
  date: '2024-03-10',
  confidence: 98,
};

const incidents = [
  { tipo: 'Rechazo', fecha: '2024-01-10', estado: 'Resuelto', resolucion: 'Documento actualizado' },
  { tipo: 'Vencimiento', fecha: '2024-02-05', estado: 'Pendiente', resolucion: '-' },
  { tipo: 'Inconsistencia', fecha: '2024-03-01', estado: 'Resuelto', resolucion: 'Validación manual' },
];

export function UserRiskAnalysisTab() {
  return (
    <div className="space-y-8">
      {/* Perfil de riesgo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col items-center">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-500" /> Calificación de Riesgo
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">Bajo</span>
            <span className="text-xs text-gray-400">General</span>
          </div>
          <div className="mt-4 w-full">
            <div className="font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">Factores de riesgo</div>
            <div className="flex flex-wrap gap-2">
              {riskFactors.map((f, i) => (
                <span
                  key={i}
                  className={`inline-block px-2 py-0.5 rounded text-xs font-semibold bg-${f.color}-100 text-${f.color}-700 dark:bg-${f.color}-900/60 dark:text-${f.color}-300`}
                >
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col items-center">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" /> Evolución Histórica
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={riskHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#8884d8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col items-center">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" /> Comparativa Segmento
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={riskComparative}>
              <XAxis dataKey="name" stroke="#8884d8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="value" radius={[8,8,8,8]} fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col items-center">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" /> Estado KYC
          </div>
          <div className="flex flex-col items-center">
            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300">
              Aprobado
            </span>
            <span className="text-xs text-gray-400">Desde: 2023-12-10</span>
          </div>
          <div className="mt-4 w-full">
            <div className="font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">Cumplimiento normativo</div>
            <div className="flex flex-wrap gap-2">
              {compliance.map((c, i) => (
                <span
                  key={i}
                  className={`inline-block px-2 py-0.5 rounded text-xs font-semibold bg-${c.color}-100 text-${c.color}-700 dark:bg-${c.color}-900/60 dark:text-${c.color}-300`}
                >
                  {c.label}: {c.status}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Validación biométrica y Historial de incidencias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col items-center">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-blue-500" /> Validación Biométrica
          </div>
          <div className="flex flex-col items-center">
            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300">
              {biometrics.status}
            </span>
            <span className="text-xs text-gray-400">
              Coincidencia facial: <span className="font-semibold text-blue-500">{biometrics.match}</span>
            </span>
            <span className="text-xs text-gray-400">Última validación: {biometrics.date}</span>
            <span className="text-xs text-gray-400">
              Confianza: <span className="font-semibold text-blue-500">{biometrics.confidence}%</span>
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" /> Historial de Incidencias
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 font-medium">Tipo</th>
                  <th className="py-2 font-medium">Fecha</th>
                  <th className="py-2 font-medium">Estado</th>
                  <th className="py-2 font-medium">Resolución</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {incidents.map((inc, i) => (
                  <tr key={i} className="text-gray-700 dark:text-gray-300">
                    <td className="py-2 font-semibold">{inc.tipo}</td>
                    <td className="py-2">{inc.fecha}</td>
                    <td className="py-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          inc.estado === 'Resuelto'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300'
                        }`}
                      >
                        {inc.estado}
                      </span>
                    </td>
                    <td className="py-2">{inc.resolucion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 