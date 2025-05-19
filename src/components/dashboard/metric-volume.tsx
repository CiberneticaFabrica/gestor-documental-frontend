import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, AreaChart, Area, Legend, ComposedChart } from 'recharts';
import { TrendingUp, FileType, Calendar, Activity, ClipboardList, ArrowUp, ArrowDown } from 'lucide-react';
import { DashboardVolumeMetricsResponse } from '@/lib/api/services/dashboard.service';

type StatCardProps = {
  title: string;
  value: string | number;
  prevValue: string | number | null;
  icon: React.ReactNode;
  color: string;
};

interface WeekDay {
  date: string;
  count: number;
  dayOfWeek: number;
  formattedDate: string;
}

// Componente para las métricas de volumen
export const VolumeMetricsComponent = ({ data }: { data: DashboardVolumeMetricsResponse | null }) => {
  if (!data) return <div className="p-4 text-center">Cargando métricas de volumen...</div>;

  // Obtener datos de tendencia de volumen
  const volumeTrendData = data.volume_trend || [];
  const typeDistribution = data.type_distribution_by_period || [];
  
  // Animación para los elementos que aparecen
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Componente para tarjeta de estadísticas con comparación con período anterior
  const StatCard = ({ title, value, prevValue, icon, color }: StatCardProps) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      let start = 0;
      const end = parseInt(String(value), 10) || 0;
      const duration = 1000;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;
      
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(progress * end);
        
        setDisplayValue(currentCount);
        
        if (frame === totalFrames) {
          clearInterval(counter);
          setDisplayValue(end);
        }
      }, frameDuration);
      
      return () => clearInterval(counter);
    }, [value]);
    
    // Calcular diferencia porcentual
    const calcChange = () => {
      if (!prevValue || parseInt(String(prevValue), 10) === 0) return 0;
      return ((parseInt(String(value), 10) / parseInt(String(prevValue), 10)) - 1) * 100;
    };
    
    const change = calcChange();
    const isIncreasing = change > 0;
    
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700 flex flex-col h-full"
        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex items-center mb-3">
          <div className={`p-2 rounded-full ${color}`}>
            {icon}
          </div>
          <h3 className="ml-3 text-sm font-medium dark:text-gray-200">{title}</h3>
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold mb-1 dark:text-white">{displayValue}</p>
          {change !== 0 && (
            <div className={`flex items-center text-xs ${isIncreasing ? 'text-green-500' : 'text-red-500'}`}>
              {isIncreasing ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              <span className="font-medium">{Math.abs(change).toFixed(1)}%</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">vs período anterior</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Componente para la tendencia de volumen a lo largo del tiempo
  const VolumeTrendChart = () => {
    // Calcular el total mensual y la media diaria
    const totalDocuments = volumeTrendData.reduce((sum, item) => sum + item.document_count, 0);
    const averagePerDay = data?.overall_stats?.average_per_period || 0;
    
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 col-span-1 lg:col-span-2 h-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium dark:text-white">Tendencia de Volumen</h3>
          <div className="flex space-x-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-lg font-bold text-blue-500">{totalDocuments}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Promedio/día</p>
              <p className="text-lg font-bold text-green-500">{averagePerDay.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={volumeTrendData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="period" 
                className="text-xs text-gray-500 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs text-gray-500 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: '#374151' }}
              />
              <Area 
                type="monotone" 
                dataKey="document_count" 
                name="Documentos"
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorVolume)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  // Componente para la distribución de tipos por período
  const TypeDistributionChart = () => {
    // Colores para los tipos de documentos
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444'];
    
    // Transformar datos para la gráfica apilada
    const stackedData = volumeTrendData.map(period => {
      // Encontrar la distribución para este período
      const distribution = typeDistribution.find(item => item.period === period.period);
      
      if (!distribution) return { period: period.period, total: period.document_count };
      
      // Construir el objeto con los datos de tipos
      const result: { period: string; total: number; [key: string]: any } = { 
        period: period.period, 
        total: period.document_count 
      };
      distribution.types.forEach((type: { document_type: string; count: number }) => {
        result[type.document_type] = type.count;
      });
      
      return result;
    });
    
    // Obtener todos los tipos únicos para las barras
    const allTypes = new Set();
    typeDistribution.forEach(period => {
      period.types.forEach((type: { document_type: string; count: number }) => {
        allTypes.add(type.document_type);
      });
    });
    
    const typeArray = Array.from(allTypes) as string[];
    
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 h-full"
      >
        <h3 className="text-lg font-medium mb-4 dark:text-white">Distribución de Tipos por Período</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stackedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="period" 
                className="text-xs text-gray-500 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs text-gray-500 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: '#374151' }}
              />
              <Legend />
              {typeArray.map((type, index) => (
                <Bar 
                  key={type}
                  dataKey={type} 
                  name={type} 
                  stackId="a" 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  // Componente para mostrar métricas de volumen en forma de calendario
  const VolumeCalendarView = () => {
    // Organizar los datos para la visualización del calendario
    const calendarData = [];
    const lastThreeMonths = volumeTrendData.slice(-90); // Últimos 90 días si disponible
    
    // Agrupar por semana
    let currentWeek: WeekDay[] = [];
    let currentWeekNumber: number | null = null;
    
    lastThreeMonths.forEach(day => {
      const date = new Date(day.period);
      const weekNumber = getWeekNumber(date);
      
      if (currentWeekNumber === null) {
        currentWeekNumber = weekNumber;
      }
      
      if (weekNumber !== currentWeekNumber) {
        calendarData.push([...currentWeek]);
        currentWeek = [];
        currentWeekNumber = weekNumber;
      }
      
      currentWeek.push({
        date: day.period,
        count: day.document_count,
        dayOfWeek: date.getDay(),
        formattedDate: formatDate(date)
      });
    });
    
    if (currentWeek.length > 0) {
      calendarData.push([...currentWeek]);
    }
    
    // Función para obtener el número de semana
    function getWeekNumber(date: Date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 4 - (d.getDay() || 7));
      const yearStart = new Date(d.getFullYear(), 0, 1);
      return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }
    
    // Función para formatear la fecha
    function formatDate(date: Date) {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }
    
    // Determinar el color de la celda según la cantidad
    const getCellColor = (count: number) => {
      if (!count) return 'bg-gray-100 dark:bg-gray-800';
      const maxCount = Math.max(...volumeTrendData.map(d => d.document_count));
      const intensity = Math.min(count / maxCount, 1);
      
      if (intensity < 0.2) return 'bg-blue-100 dark:bg-blue-900/30';
      if (intensity < 0.4) return 'bg-blue-200 dark:bg-blue-800/40';
      if (intensity < 0.6) return 'bg-blue-300 dark:bg-blue-700/50';
      if (intensity < 0.8) return 'bg-blue-400 dark:bg-blue-600/60';
      return 'bg-blue-500 dark:bg-blue-500/70';
    };
    
    const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 h-full"
      >
        <h3 className="text-lg font-medium mb-4 dark:text-white">Visualización de Actividad</h3>
        
        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded mr-1"></span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Sin datos</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="inline-block w-3 h-3 bg-blue-100 dark:bg-blue-900/30 rounded"></span>
            <span className="inline-block w-3 h-3 bg-blue-200 dark:bg-blue-800/40 rounded"></span>
            <span className="inline-block w-3 h-3 bg-blue-300 dark:bg-blue-700/50 rounded"></span>
            <span className="inline-block w-3 h-3 bg-blue-400 dark:bg-blue-600/60 rounded"></span>
            <span className="inline-block w-3 h-3 bg-blue-500 dark:bg-blue-500/70 rounded"></span>
            <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">Más actividad</span>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mt-4">
          {/* Cabecera de días */}
          {dayLabels.map((day, index) => (
            <div key={index} className="text-center text-xs text-gray-500 dark:text-gray-400 font-medium py-1">
              {day}
            </div>
          ))}
          
          {/* Cuadrícula del calendario */}
          {calendarData.map((week, weekIndex) => {
            // Rellenar los días que faltan al principio de la semana
            const fillerDays = [];
            if (week.length > 0 && week[0].dayOfWeek !== 0) {
              for (let i = 0; i < week[0].dayOfWeek; i++) {
                fillerDays.push(
                  <div key={`filler-${weekIndex}-${i}`} className="aspect-square bg-gray-50 dark:bg-gray-800/50 rounded"></div>
                );
              }
            }
            
            return (
              <React.Fragment key={`week-${weekIndex}`}>
                {fillerDays}
                {week.map((day, dayIndex) => (
                  <div 
                    key={`day-${weekIndex}-${dayIndex}`} 
                    className={`aspect-square ${getCellColor(day.count)} rounded flex flex-col items-center justify-center transition-all duration-300 hover:scale-105`}
                    title={`${day.formattedDate}: ${day.count} documentos`}
                  >
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{day.formattedDate.split('/')[0]}</span>
                    {day.count > 0 && (
                      <span className="text-xs font-bold text-gray-800 dark:text-white">{day.count}</span>
                    )}
                  </div>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>
    );
  };

  // Obtener estadísticas globales
  const overallStats = data.overall_stats || {};
  const timeRange = data.time_range || {};
  
  // Para calcular valores comparativos, dividimos el período en dos mitades
  const middleIndex = Math.floor(volumeTrendData.length / 2);
  const currentPeriodData = volumeTrendData.slice(middleIndex);
  const previousPeriodData = volumeTrendData.slice(0, middleIndex);
  
  const currentTotal = currentPeriodData.reduce((sum, item) => sum + item.document_count, 0);
  const previousTotal = previousPeriodData.reduce((sum, item) => sum + item.document_count, 0);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Documentos" 
          value={overallStats.total_documents || 0} 
          prevValue={previousTotal}
          icon={<FileType className="h-5 w-5 text-white" />} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Promedio Diario" 
          value={overallStats.average_per_period?.toFixed(0) || 0} 
          prevValue={(previousTotal / previousPeriodData.length).toFixed(0)}
          icon={<Calendar className="h-5 w-5 text-white" />} 
          color="bg-green-500"
        />
        <StatCard 
          title="Total en Período" 
          value={currentTotal} 
          prevValue={previousTotal}
          icon={<Activity className="h-5 w-5 text-white" />} 
          color="bg-purple-500"
        />
        <StatCard 
          title="Tipos de Documentos" 
          value={new Set(typeDistribution.flatMap(period => period.types.map((t: { document_type: string; count: number }) => t.document_type))).size || 0} 
          prevValue={null}
          icon={<ClipboardList className="h-5 w-5 text-white" />} 
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VolumeTrendChart />
        <VolumeCalendarView />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <TypeDistributionChart />
      </div>
      
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-medium mb-4 dark:text-white">Información del Período</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Días Analizados</h4>
            <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">{timeRange.days || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha Inicio</h4>
            <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">{timeRange.start_date || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha Fin</h4>
            <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">{timeRange.end_date || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Agrupación</h4>
            <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">{timeRange.grouping || 'N/A'}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VolumeMetricsComponent;