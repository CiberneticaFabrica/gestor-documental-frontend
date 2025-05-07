'use client';

import { Clock, Activity, FileText, Download, Share2, MessageSquare, Bell, Calendar, BarChart2, Users } from 'lucide-react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

// Datos mock para la línea de tiempo
const timelineData = [
  {
    date: '2024-04-01',
    type: 'Carga',
    document: 'DNI',
    status: 'Completado',
    details: 'Documento cargado y validado automáticamente',
    color: 'green'
  },
  {
    date: '2024-03-28',
    type: 'Renovación',
    document: 'Estado Financiero',
    status: 'Completado',
    details: 'Documento actualizado por el cliente',
    color: 'blue'
  },
  {
    date: '2024-03-25',
    type: 'Solicitud',
    document: 'Comprobante de Domicilio',
    status: 'Pendiente',
    details: 'Solicitud enviada al cliente',
    color: 'yellow'
  },
  {
    date: '2024-03-20',
    type: 'Validación',
    document: 'Contrato Marco',
    status: 'Completado',
    details: 'Validación manual realizada',
    color: 'green'
  },
  {
    date: '2024-03-15',
    type: 'Comunicación',
    document: 'Recordatorio',
    status: 'Enviado',
    details: 'Recordatorio de vencimiento enviado',
    color: 'blue'
  }
];

// Datos mock para estadísticas
const activityStats = {
  updateFrequency: {
    daily: 2.5,
    weekly: 8,
    monthly: 25
  },
  responseTime: {
    average: '24h',
    trend: 'Mejora'
  },
  mostUpdated: [
    { name: 'DNI', updates: 12 },
    { name: 'Estado Financiero', updates: 8 },
    { name: 'Contrato Marco', updates: 6 }
  ],
  segmentComparison: [
    { name: 'Cliente', value: 25 },
    { name: 'Segmento', value: 20 }
  ]
};

// Datos mock para transacciones
const transactions = [
  {
    date: '2024-04-01 10:15',
    type: 'Acceso',
    document: 'DNI',
    user: 'Cliente',
    details: 'Visualización del documento'
  },
  {
    date: '2024-03-28 15:30',
    type: 'Descarga',
    document: 'Estado Financiero',
    user: 'Cliente',
    details: 'Descarga del documento'
  },
  {
    date: '2024-03-25 09:45',
    type: 'Compartir',
    document: 'Contrato Marco',
    user: 'Gestor',
    details: 'Compartido con departamento legal'
  },
  {
    date: '2024-03-20 14:20',
    type: 'Modificación',
    document: 'DNI',
    user: 'Sistema',
    details: 'Actualización de metadatos'
  }
];

// Datos mock para comunicaciones
const communications = [
  {
    date: '2024-04-01',
    type: 'Notificación',
    subject: 'Documento validado',
    status: 'Leído',
    details: 'DNI validado automáticamente'
  },
  {
    date: '2024-03-28',
    type: 'Recordatorio',
    subject: 'Vencimiento próximo',
    status: 'Pendiente',
    details: 'Estado Financiero vence en 15 días'
  },
  {
    date: '2024-03-25',
    type: 'Solicitud',
    subject: 'Documento requerido',
    status: 'Enviado',
    details: 'Solicitud de Comprobante de Domicilio'
  },
  {
    date: '2024-03-20',
    type: 'Notificación',
    subject: 'Actualización requerida',
    status: 'Leído',
    details: 'Contrato Marco requiere actualización'
  }
];

export function UserDocumentActivityTab() {
  return (
    <div className="space-y-8">
      {/* Timeline de actividad */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500" /> Timeline de Actividad
        </div>
        <div className="relative">
          {timelineData.map((item, index) => (
            <div key={index} className="flex gap-4 mb-4 last:mb-0">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                {index !== timelineData.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">{item.document}</span>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold bg-${item.color}-100 text-${item.color}-700 dark:bg-${item.color}-900/60 dark:text-${item.color}-300`}>
                    {item.type}
                  </span>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    item.status === 'Completado' ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300' :
                    item.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas de actividad */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" /> Frecuencia de Actualizaciones
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Diaria</span>
              <span className="font-semibold">{activityStats.updateFrequency.daily}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Semanal</span>
              <span className="font-semibold">{activityStats.updateFrequency.weekly}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Mensual</span>
              <span className="font-semibold">{activityStats.updateFrequency.monthly}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" /> Tiempo de Respuesta
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activityStats.responseTime.average}</span>
            <span className="text-xs text-gray-400">Promedio</span>
            <span className="text-xs text-green-500 mt-1">{activityStats.responseTime.trend}</span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" /> Documentos más Actualizados
          </div>
          <div className="space-y-2">
            {activityStats.mostUpdated.map((doc, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{doc.name}</span>
                <span className="font-semibold">{doc.updates} actualizaciones</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" /> Comparativa Segmento
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={activityStats.segmentComparison}>
              <XAxis dataKey="name" stroke="#8884d8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" radius={[8,8,8,8]} fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Registro de transacciones */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-blue-500" /> Registro de Transacciones
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 font-medium">Fecha</th>
                <th className="py-2 font-medium">Tipo</th>
                <th className="py-2 font-medium">Documento</th>
                <th className="py-2 font-medium">Usuario</th>
                <th className="py-2 font-medium">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((t, i) => (
                <tr key={i} className="text-gray-700 dark:text-gray-300">
                  <td className="py-2">{t.date}</td>
                  <td className="py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                      t.type === 'Acceso' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' :
                      t.type === 'Descarga' ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300' :
                      t.type === 'Compartir' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300'
                    }`}>
                      {t.type === 'Acceso' ? <FileText className="h-3 w-3" /> :
                       t.type === 'Descarga' ? <Download className="h-3 w-3" /> :
                       t.type === 'Compartir' ? <Share2 className="h-3 w-3" /> :
                       <FileText className="h-3 w-3" />}
                      {t.type}
                    </span>
                  </td>
                  <td className="py-2 font-semibold">{t.document}</td>
                  <td className="py-2">{t.user}</td>
                  <td className="py-2">{t.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comunicaciones */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-500" /> Comunicaciones
        </div>
        <div className="space-y-4">
          {communications.map((comm, i) => (
            <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-white dark:bg-gray-700/50 shadow-sm">
              <div className={`p-2 rounded-full ${
                comm.type === 'Notificación' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300' :
                comm.type === 'Recordatorio' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/60 dark:text-yellow-300' :
                'bg-green-100 text-green-600 dark:bg-green-900/60 dark:text-green-300'
              }`}>
                {comm.type === 'Notificación' ? <Bell className="h-4 w-4" /> :
                 comm.type === 'Recordatorio' ? <Calendar className="h-4 w-4" /> :
                 <MessageSquare className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{comm.subject}</span>
                  <span className="text-xs text-gray-500">{comm.date}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{comm.details}</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    comm.status === 'Leído' ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300' :
                    comm.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                  }`}>
                    {comm.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 