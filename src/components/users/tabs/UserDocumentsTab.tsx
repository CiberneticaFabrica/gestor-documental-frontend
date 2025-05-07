import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, FileText, Users, Clock, CheckCircle2, Loader2, UploadCloud } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E42', '#EF4444'];
const completenessData = [
  { name: 'Identificación', value: 95 },
  { name: 'Contratos', value: 85 },
  { name: 'Financieros', value: 70 },
  { name: 'Otros', value: 60 },
];
const trendData = [
  { date: 'Ene', value: 60 },
  { date: 'Feb', value: 70 },
  { date: 'Mar', value: 80 },
  { date: 'Abr', value: 92 },
];
const validDocs = [
  { cat: 'Identificación', name: 'DNI', carga: '2024-03-01', valid: '2024-03-01', vence: '2029-03-01', confianza: 99, validacion: 'Automática' },
  { cat: 'Contratos', name: 'Contrato Marco', carga: '2023-12-10', valid: '2023-12-10', vence: '2025-12-10', confianza: 97, validacion: 'Manual' },
  { cat: 'Financieros', name: 'Estado Financiero', carga: '2024-01-15', valid: '2024-01-16', vence: '2024-12-31', confianza: 95, validacion: 'Automática' },
];
const pendingDocs = [
  { name: 'Comprobante de Domicilio', solicitud: '2024-04-01', plazo: '2024-04-10', estado: 'Enviada' },
  { name: 'Declaración Fiscal', solicitud: '2024-03-20', plazo: '2024-04-05', estado: 'Recordatorio' },
];
const expiringDocs = [
  { name: 'DNI', vence: '2024-04-15', criticidad: 'Alta', recordatorios: 2, accion: 'Renovar' },
  { name: 'Estado Financiero', vence: '2024-05-01', criticidad: 'Media', recordatorios: 1, accion: 'Actualizar' },
];
const user = { docPercent: 92 };

export function UserDocumentsTab() {
  return (
    <div className="space-y-8">
      {/* Tablero de completitud */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col items-center">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2"><PieChartIcon className="h-4 w-4" /> Completitud por Categoría</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={completenessData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={55} label>
                {completenessData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {completenessData.map((cat, idx) => (
              <span key={cat.name} className="text-xs flex items-center gap-1"><span className={`inline-block w-3 h-3 rounded-full`} style={{background: COLORS[idx % COLORS.length]}} />{cat.name}</span>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col items-center">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2"><FileText className="h-4 w-4" /> Progreso Global</div>
          <div className="w-full mt-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-blue-500" style={{ width: user.docPercent + '%' }} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-blue-600 dark:text-blue-400">{user.docPercent}%</span>
              <span className="text-gray-400">Completado</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col items-center">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2"><Users className="h-4 w-4" /> Comparativa Segmento</div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={[{ name: 'Cliente', value: user.docPercent }, { name: 'Segmento', value: 80 }] }>
              <XAxis dataKey="name" stroke="#8884d8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" radius={[8,8,8,8]} fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col items-center">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2"><Clock className="h-4 w-4" /> Tendencia de Completitud</div>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#8884d8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Documentos válidos */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Documentos Válidos</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 font-medium">Categoría</th>
                <th className="py-2 font-medium">Documento</th>
                <th className="py-2 font-medium">Carga</th>
                <th className="py-2 font-medium">Validación</th>
                <th className="py-2 font-medium">Vencimiento</th>
                <th className="py-2 font-medium">Confianza</th>
                <th className="py-2 font-medium">Validación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {validDocs.map((doc, i) => (
                <tr key={i} className="text-gray-700 dark:text-gray-300">
                  <td className="py-2">{doc.cat}</td>
                  <td className="py-2 font-semibold">{doc.name}</td>
                  <td className="py-2">{doc.carga}</td>
                  <td className="py-2">{doc.valid}</td>
                  <td className="py-2">{doc.vence}</td>
                  <td className="py-2">{doc.confianza}%</td>
                  <td className="py-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${doc.validacion === 'Automática' ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300'}`}>{doc.validacion}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Documentos pendientes */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2"><Loader2 className="h-4 w-4 text-yellow-500 animate-spin" /> Documentos Pendientes</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 font-medium">Documento</th>
                <th className="py-2 font-medium">Solicitud</th>
                <th className="py-2 font-medium">Plazo</th>
                <th className="py-2 font-medium">Estado</th>
                <th className="py-2 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {pendingDocs.map((doc, i) => (
                <tr key={i} className="text-gray-700 dark:text-gray-300">
                  <td className="py-2 font-semibold">{doc.name}</td>
                  <td className="py-2">{doc.solicitud}</td>
                  <td className="py-2">{doc.plazo}</td>
                  <td className="py-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${doc.estado === 'Enviada' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300'}`}>{doc.estado}</span>
                  </td>
                  <td className="py-2">
                    <button className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500 text-white text-xs hover:bg-blue-600 transition"><UploadCloud className="h-4 w-4" /> Cargar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Documentos por vencer */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2"><Clock className="h-4 w-4 text-red-500" /> Documentos por Vencer</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 font-medium">Documento</th>
                <th className="py-2 font-medium">Vence</th>
                <th className="py-2 font-medium">Criticidad</th>
                <th className="py-2 font-medium">Recordatorios</th>
                <th className="py-2 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {expiringDocs.map((doc, i) => (
                <tr key={i} className="text-gray-700 dark:text-gray-300">
                  <td className="py-2 font-semibold">{doc.name}</td>
                  <td className="py-2">{doc.vence}</td>
                  <td className="py-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${doc.criticidad === 'Alta' ? 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300'}`}>{doc.criticidad}</span>
                  </td>
                  <td className="py-2">{doc.recordatorios}</td>
                  <td className="py-2">
                    <button className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500 text-white text-xs hover:bg-blue-600 transition">{doc.accion}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 