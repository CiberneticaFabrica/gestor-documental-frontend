import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AuditLog {
  fecha_hora: string;
  accion: string;
  usuario?: string;
  ip?: string;
  resultado?: string;
}

interface TimelineProps {
  logs: AuditLog[];
  height?: number;
  showStats?: boolean;
  variant?: 'area' | 'line' | 'mixed';
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
}

const TimelineActivityChart: React.FC<TimelineProps> = ({
  logs,
  height = 400,
  showStats = true,
  variant = 'area',
  timeRange = 'month'
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Procesar datos de logs para la línea de tiempo
  const timelineData = useMemo(() => {
    if (!logs || logs.length === 0) return [];

    // Agrupar por fecha
    const groupedByDate: Record<string, { login: number; logout: number; total: number }> = {};
    
    logs.forEach(log => {
      const date = log.fecha_hora.slice(0, 10); // YYYY-MM-DD
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = { login: 0, logout: 0, total: 0 };
      }
      
      if (log.accion === 'login') {
        groupedByDate[date].login += 1;
      } else if (log.accion === 'logout') {
        groupedByDate[date].logout += 1;
      }
      
      groupedByDate[date].total += 1;
    });

    // Convertir a array y ordenar por fecha
    const dataArray = Object.entries(groupedByDate)
      .map(([date, counts]) => {
        const dateObj = new Date(date);
        return {
          date,
          dateObj,
          login: counts.login,
          logout: counts.logout,
          total: counts.total,
          dayName: dateObj.toLocaleDateString('es-ES', { weekday: 'short' }),
          dayNumber: dateObj.getDate(),
          month: dateObj.toLocaleDateString('es-ES', { month: 'short' }),
          formatted: dateObj.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'short' 
          })
        };
      })
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    // Filtrar por rango de tiempo
    const now = new Date();
    const filteredData = dataArray.filter(item => {
      const daysDiff = Math.floor((now.getTime() - item.dateObj.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (timeRange) {
        case 'week': return daysDiff <= 7;
        case 'month': return daysDiff <= 30;
        case 'quarter': return daysDiff <= 90;
        case 'year': return daysDiff <= 365;
        default: return true;
      }
    });

    return filteredData;
  }, [logs, timeRange]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalLogins = timelineData.reduce((sum, day) => sum + day.login, 0);
    const totalLogouts = timelineData.reduce((sum, day) => sum + day.logout, 0);
    const totalEvents = totalLogins + totalLogouts;
    const activeDays = timelineData.length;
    const avgDaily = activeDays > 0 ? (totalEvents / activeDays).toFixed(1) : 0;
    
    // Día más activo
    const mostActiveDay = timelineData.reduce((max, day) => 
      day.total > max.total ? day : max, 
      { total: 0, formatted: 'N/A' }
    );

    // Tendencia (comparar primera mitad vs segunda mitad)
    const midPoint = Math.floor(timelineData.length / 2);
    const firstHalf = timelineData.slice(0, midPoint);
    const secondHalf = timelineData.slice(midPoint);
    
    const firstHalfAvg = firstHalf.length > 0 
      ? firstHalf.reduce((sum, day) => sum + day.total, 0) / firstHalf.length 
      : 0;
    const secondHalfAvg = secondHalf.length > 0 
      ? secondHalf.reduce((sum, day) => sum + day.total, 0) / secondHalf.length 
      : 0;
    
    const trend = secondHalfAvg > firstHalfAvg ? 'up' : secondHalfAvg < firstHalfAvg ? 'down' : 'stable';

    return {
      totalLogins,
      totalLogouts,
      totalEvents,
      activeDays,
      avgDaily,
      mostActiveDay,
      trend
    };
  }, [timelineData]);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg border border-gray-700">
          <div className="font-semibold text-blue-300 mb-2">{data.formatted}</div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Logins:
              </span>
              <span className="font-bold">{data.login}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Logouts:
              </span>
              <span className="font-bold">{data.logout}</span>
            </div>
            <div className="border-t border-gray-600 pt-1 mt-2">
              <div className="flex items-center justify-between">
                <span>Total:</span>
                <span className="font-bold text-blue-300">{data.total}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Función para renderizar estadísticas
  const renderStats = () => {
    if (!showStats) return null;

    const getTrendIcon = () => {
      switch (stats.trend) {
        case 'up': return '📈';
        case 'down': return '📉';
        default: return '➡️';
      }
    };

    const getTrendColor = () => {
      switch (stats.trend) {
        case 'up': return 'text-green-600 dark:text-green-400';
        case 'down': return 'text-red-600 dark:text-red-400';
        default: return 'text-blue-600 dark:text-blue-400';
      }
    };

    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 transition-all duration-300">
                {stats.totalLogins}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Logins</div>
            </div>
            <div className="text-2xl animate-bounce">🔐</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 transition-all duration-300">
                {stats.totalLogouts}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Logouts</div>
            </div>
            <div className="text-2xl animate-pulse">🚪</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-all duration-300">
                {stats.avgDaily}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Promedio/día</div>
            </div>
            <div className="text-2xl animate-spin-slow">⚡</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-all duration-300">
                {stats.activeDays}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Días activos</div>
            </div>
            <div className="text-2xl animate-pulse">📅</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-lg font-bold ${getTrendColor()} transition-all duration-300`}>
                {getTrendIcon()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tendencia</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Día pico: {stats.mostActiveDay.formatted}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Función para renderizar el gráfico según el variant
  const renderChart = () => {
    const commonProps = {
      data: timelineData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
      animationDuration: 1500,
      animationBegin: 0,
      animationEasing: 'ease-in-out'
    };

    switch (variant) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis 
              dataKey="formatted"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#9ca3af' }}
              tickLine={{ stroke: '#9ca3af' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#9ca3af' }}
              tickLine={{ stroke: '#9ca3af' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="login"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              name="Logins"
              animationDuration={1500}
              animationBegin={0}
              animationEasing="ease-in-out"
            />
            <Line
              type="monotone"
              dataKey="logout"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              name="Logouts"
              animationDuration={1500}
              animationBegin={0}
              animationEasing="ease-in-out"
            />
          </LineChart>
        );

      case 'mixed':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="loginGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis 
              dataKey="formatted"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="login"
              stroke="#10b981"
              fill="url(#loginGradient)"
              strokeWidth={2}
              name="Logins"
              animationDuration={1500}
              animationBegin={0}
              animationEasing="ease-in-out"
            />
            <Line
              type="monotone"
              dataKey="logout"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              name="Logouts"
              animationDuration={1500}
              animationBegin={0}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        );

      default: // 'area'
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="loginArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="logoutArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis 
              dataKey="formatted"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="login"
              stackId="1"
              stroke="#10b981"
              fill="url(#loginArea)"
              strokeWidth={2}
              name="Logins"
              animationDuration={1500}
              animationBegin={0}
              animationEasing="ease-in-out"
            />
            <Area
              type="monotone"
              dataKey="logout"
              stackId="2"
              stroke="#ef4444"
              fill="url(#logoutArea)"
              strokeWidth={2}
              name="Logouts"
              animationDuration={1500}
              animationBegin={0}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        );
    }
  };

  if (!timelineData || timelineData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-4">📊</div>
          <div className="text-lg font-semibold mb-2">No hay datos disponibles</div>
          <div className="text-sm">No se encontraron eventos de login/logout para mostrar en la línea de tiempo.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg relative">
      {/* Botón de minimizar/maximizar */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        title={isMinimized ? "Maximizar" : "Minimizar"}
      >
        {isMinimized ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className={`mb-6 transform transition-all duration-300 ${isMinimized ? 'hover:scale-[1.02]' : ''}`}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Línea de Tiempo de Actividad
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Actividad de login y logout durante los últimos {timeRange === 'week' ? '7 días' : timeRange === 'month' ? '30 días' : timeRange === 'quarter' ? '3 meses' : 'año'}
        </div>
      </div>

      {!isMinimized && renderStats()}

      <div 
        style={{ height: isMinimized ? '200px' : `${height}px` }} 
        className="transition-all duration-300"
      >
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Leyenda */}
      <div className="flex justify-center items-center space-x-6 mt-4 text-sm">
        <div className="flex items-center transform transition-all duration-300 hover:scale-110">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Logins</span>
        </div>
        <div className="flex items-center transform transition-all duration-300 hover:scale-110">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Logouts</span>
        </div>
      </div>
    </div>
  );
};

export default TimelineActivityChart;