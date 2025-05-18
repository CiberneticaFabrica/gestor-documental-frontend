import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, FileText, Users, Clock, CheckCircle2, Loader2, UploadCloud, AlertCircle } from 'lucide-react';
import { clientService, type DocumentRequestsResponse } from '@/lib/api/services/client.service';
import { useParams } from 'next/navigation';

const COLORS = ['#3B82F6', '#10B981', '#F59E42', '#EF4444'];

export function UserDocumentsTab() {
  const params = useParams();
  const [data, setData] = useState<DocumentRequestsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await clientService.getClientDocumentRequests(params.id as string);
        setData(response);
      } catch (err) {
        setError('Error al cargar los documentos del cliente');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="h-8 w-8 mr-2" />
        {error || 'No se pudieron cargar los documentos'}
      </div>
    );
  }

  const { solicitudes, estadisticas, tendencia_temporal } = data;

  // Preparar datos para el gráfico de estado
  const estadoData = [
    { name: 'Pendientes', value: parseInt(estadisticas.pendientes) },
    { name: 'Recibidos', value: parseInt(estadisticas.recibidos) },
    { name: 'Vencidos', value: parseInt(estadisticas.vencidos) },
    { name: 'Cancelados', value: parseInt(estadisticas.cancelados) },
  ];

  return (
    <div className="space-y-8">
      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Solicitudes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{estadisticas.total_solicitudes}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-500">{estadisticas.pendientes}</p>
            </div>
            <Loader2 className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recibidos</p>
              <p className="text-2xl font-bold text-green-500">{estadisticas.recibidos}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Vencidos</p>
              <p className="text-2xl font-bold text-red-500">{estadisticas.vencidos}</p>
            </div>
            <Clock className="h-8 w-8 text-red-500" />
          </div>
        </div>
   
      </div>

      {/* Gráfico de estado */}
      <div className="flex gap-8">
        {/* Columna de tablas (80%) */}
        <div className="w-[70%] space-y-8">
          {/* Documentos pendientes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Loader2 className="h-5 w-5 text-yellow-500" />
              Documentos Pendientes
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 font-medium text-left">Documento</th>
                    <th className="py-3 font-medium text-left">Solicitado</th>
                    <th className="py-3 font-medium text-left">Fecha Límite</th>
                    <th className="py-3 font-medium text-left">Días Restantes</th>
                    <th className="py-3 font-medium text-left">Notas</th>
                    <th className="py-3 font-medium text-left">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {solicitudes
                    .filter(doc => doc.estado === 'pendiente')
                    .map((doc) => (
                      <tr key={doc.id_solicitud} className="text-gray-700 dark:text-gray-300">
                        <td className="py-3 font-medium">{doc.tipo_documento_nombre}</td>
                        <td className="py-3">{new Date(doc.fecha_solicitud).toLocaleDateString()}</td>
                        <td className="py-3">{new Date(doc.fecha_limite).toLocaleDateString()}</td>
                        <td className="py-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            doc.dias_restantes <= 7 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300'
                              : doc.dias_restantes <= 30
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300'
                          }`}>
                            {doc.dias_restantes} días
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{doc.notas}</td>
                        <td className="py-3">
                          <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-blue-500 text-white text-sm hover:bg-blue-600 transition">
                            <UploadCloud className="h-4 w-4" />
                            Cargar
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Documentos recibidos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Documentos Recibidos
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 font-medium text-left">Documento</th>
                    <th className="py-3 font-medium text-left">Fecha Recepción</th>
                    <th className="py-3 font-medium text-left">Vencimiento</th>
                    <th className="py-3 font-medium text-left">Días Restantes</th>
                    <th className="py-3 font-medium text-left">Notas</th>
                    <th className="py-3 font-medium text-left">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {solicitudes
                    .filter(doc => doc.estado === 'recibido')
                    .map((doc) => (
                      <tr key={doc.id_solicitud} className="text-gray-700 dark:text-gray-300">
                        <td className="py-3 font-medium">{doc.tipo_documento_nombre}</td>
                        <td className="py-3">{new Date(doc.fecha_solicitud).toLocaleDateString()}</td>
                        <td className="py-3">{new Date(doc.fecha_limite).toLocaleDateString()}</td>
                        <td className="py-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            doc.dias_restantes <= 30 
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300'
                          }`}>
                            {doc.dias_restantes} días
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{doc.notas}</td>
                        <td className="py-3">
                          <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Columna de gráfico (20%) */}
        <div className="w-[30%]">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estado de Documentos</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <div>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {estadoData.map((entry, index) => (
                      <div key={`legend-${index}`} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{backgroundColor: COLORS[index % COLORS.length]}}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {entry.name} ({(entry.value * 10).toFixed(0)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
                  </div>
                </div>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 