import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend, LabelList, RadialBarChart, RadialBar } from 'recharts';
import { CheckCircle, AlertCircle, Clock, Activity, FileType, Cpu } from 'lucide-react';
import { DashboardProcessingMetricsResponse } from '@/lib/api/services/dashboard.service';

// Componente para las métricas de procesamiento
export const ProcessingMetricsComponent = ({
  data,
}: { data: DashboardProcessingMetricsResponse | null }) => {
  if (!data) return <div className="p-4 text-center">Cargando métricas de procesamiento...</div>;

  // Formatear los datos de procesamiento para los gráficos
  const processingTrendData = data.processing_trend || [];
  const processingByType = data.processing_by_type || [];
  const modelVersions = data.model_versions || [];

  // Ordenar los tipos de documento por cantidad total
  const sortedProcessingByType = [...processingByType].sort((a, b) => b.count - a.count);

  // Colores para los diferentes estados de procesamiento
  const COLORS = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    processing: '#8b5cf6'
  };

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

  type CircularMetricCardProps = {
    title: string;
    value: number;
    maxValue: number;
    color: string;
    icon: React.ReactNode;
  };

  // Componente para tarjeta circular de métrica
  const CircularMetricCard = ({ title, value, maxValue, color, icon }: CircularMetricCardProps) => {
    const [percentage, setPercentage] = useState(0);
    
    useEffect(() => {
      const targetPercentage = Math.min(100, (value / maxValue) * 100);
      let startValue = 0;
      const duration = 1500;
      const interval = 10;
      const steps = duration / interval;
      const increment = targetPercentage / steps;
      
      const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= targetPercentage) {
          setPercentage(targetPercentage);
          clearInterval(timer);
        } else {
          setPercentage(startValue);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }, [value, maxValue]);
    
    // Calcular el color basado en el porcentaje
    const getColorClass = (pct: number) => {
      if (pct >= 90) return 'text-green-500';
      if (pct >= 70) return 'text-blue-500';
      if (pct >= 50) return 'text-yellow-500';
      return 'text-red-500';
    };

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center h-full"
        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="relative flex items-center justify-center">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-gray-200 dark:stroke-gray-700"
              strokeWidth="8"
              fill="transparent"
            />
            <motion.circle
              cx="56"
              cy="56"
              r={radius}
              className={`${color}`}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getColorClass(percentage)}`}>
              {value.toFixed(0)}%
            </span>
            <div className="mt-1">
              {icon}
            </div>
          </div>
        </div>
        <h3 className="mt-3 text-sm font-medium text-center dark:text-gray-200">{title}</h3>
      </motion.div>
    );
  };

  type MetricCardProps = {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
    format?: 'number' | 'decimal' | 'time';
  };

  // Componente para tarjeta de métricas simples
  const MetricCard = ({ title, value, icon, color, subtitle, format = 'number' }: MetricCardProps) => {
    const [displayValue, setDisplayValue] = useState<string | number>(0);
    
    useEffect(() => {
      // Si el formato es tiempo, no animar
      if (format === 'time') {
        setDisplayValue(value);
        return;
      }
      
      const finalValue = typeof value === 'number' ? value : parseFloat(value) || 0;
      const duration = 1000;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;
      
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = format === 'decimal' 
          ? (progress * finalValue).toFixed(2) 
          : Math.round(progress * finalValue);
        
        setDisplayValue(currentCount);
        
        if (frame === totalFrames) {
          clearInterval(counter);
          setDisplayValue(finalValue);
        }
      }, frameDuration);
      
      return () => clearInterval(counter);
    }, [value, format]);
    
    const formattedValue = () => {
      if (format === 'time') {
        return `${value.toFixed(1)} ms`;
      } else if (format === 'decimal') {
        return displayValue;
      } else {
        return displayValue;
      }
    };
    
    return (
      <motion.div 
        variants={itemVariants}
        className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700 flex flex-col h-full`}
        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex items-center mb-3">
          <div className={`p-2 rounded-full ${color}`}>
            {icon}
          </div>
          <h3 className="ml-3 text-sm font-medium dark:text-gray-200">{title}</h3>
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold mb-1 dark:text-white">{formattedValue()}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </motion.div>
    );
  };

  // Componente para mostrar la tendencia de procesamiento
  const ProcessingTrend = () => {
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 col-span-1 lg:col-span-2 h-full"
      >
        <h3 className="text-lg font-medium mb-4 dark:text-white">Tendencia de Procesamiento</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={processingTrendData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="date" 
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
              <Line
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="success"
                name="Éxitos"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2 }}
              />
              {processingTrendData.some(item => item.error > 0) && (
                <Line
                  type="monotone"
                  dataKey="error"
                  name="Errores"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  // Componente para mostrar el procesamiento por tipo de documento
  const ProcessingByType = () => {
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 col-span-1 lg:col-span-2 h-full"
      >
        <h3 className="text-lg font-medium mb-4 dark:text-white">Procesamiento por Tipo de Documento</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedProcessingByType.slice(0, 5)} // Solo mostrar los primeros 5 para mayor claridad
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 100, // Más espacio para los nombres de los tipos
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" horizontal={false} />
              <XAxis 
                type="number"
                className="text-xs text-gray-500 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                dataKey="document_type"
                type="category"
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
              <Bar 
                dataKey="count" 
                name="Total" 
                fill="#3b82f6" 
                radius={[0, 4, 4, 0]}
              />
              <Bar 
                dataKey="success_count" 
                name="Éxitos" 
                fill="#10b981" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  // Componente para mostrar las versiones de modelo utilizadas
  const ModelVersionsComponent = () => {
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 h-full"
      >
        <h3 className="text-lg font-medium mb-4 dark:text-white">Versiones de Modelo</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="20%" 
              outerRadius="80%" 
              data={modelVersions} 
              startAngle={180} 
              endAngle={0}
            >
              <RadialBar
                label={{ position: 'insideStart', fill: '#fff', fontWeight: 'bold' }}
                background={{ fill: '#d1d5db' }}
                dataKey="success_rate"
              >
                {modelVersions.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.success_rate > 80 ? '#10b981' : entry.success_rate > 50 ? '#3b82f6' : '#f59e0b'} 
                  />
                ))}
              </RadialBar>
           
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Tasa de éxito']}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  // Formatear las estadísticas de procesamiento
  const stats = data.processing_stats || {};
  const successRate = stats.success_rate || 0;
  const avgProcessingTime = stats.avg_processing_time_ms || 0;
  const totalProcessed = stats.total_processed || 0;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Procesados" 
          value={totalProcessed} 
          icon={<FileType className="h-5 w-5 text-white" />} 
          color="bg-blue-500"
          subtitle="Documentos analizados" 
        />
        <CircularMetricCard 
          title="Tasa de Éxito" 
          value={successRate} 
          maxValue={100} 
          color="stroke-green-500" 
          icon={<CheckCircle className="h-5 w-5 text-green-500" />} 
        />
        <MetricCard 
          title="Tiempo Promedio" 
          value={avgProcessingTime} 
          icon={<Clock className="h-5 w-5 text-white" />} 
          color="bg-yellow-500"
          subtitle="Milisegundos/documento" 
          format="time"
        />
        <MetricCard 
          title="Documentos con Error" 
          value={stats.error_count || 0} 
          icon={<AlertCircle className="h-5 w-5 text-white" />} 
          color="bg-red-500"
          subtitle="Requieren revisión" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProcessingTrend />
        <ModelVersionsComponent />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProcessingByType />
        
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 h-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium dark:text-white">Métricas de Rendimiento</h3>
          </div>
          <div className="space-y-6">
            {/* Rendimiento por tiempo de procesamiento */}
            <div>
              <div className="flex justify-between mb-2">
                <h4 className="text-sm font-medium dark:text-gray-300">Tiempo Promedio de Procesamiento</h4>
                <span className="text-sm font-bold text-blue-500">{avgProcessingTime.toFixed(1)} ms</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div 
                  className="bg-blue-500 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min((avgProcessingTime / (stats.max_processing_time_ms || 320)) * 100, 100)}%` 
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Mínimo: {stats.min_processing_time_ms || 0} ms</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Máximo: {stats.max_processing_time_ms || 0} ms</span>
              </div>
            </div>
            
            {/* Rendimiento por tasa de éxito */}
            <div>
              <div className="flex justify-between mb-2">
                <h4 className="text-sm font-medium dark:text-gray-300">Tasa de Éxito Global</h4>
                <span className="text-sm font-bold text-green-500">{successRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div 
                  className={`h-2.5 rounded-full ${
                    successRate >= 90 ? 'bg-green-500' : 
                    successRate >= 70 ? 'bg-blue-500' : 
                    successRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${successRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="grid grid-cols-4 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">25%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">50%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-right">100%</span>
              </div>
            </div>
            
            {/* Distribución de tipo de procesamiento */}
            <div>
              <h4 className="text-sm font-medium mb-3 dark:text-gray-300">Distribución de Tipos de Modelos</h4>
              <div className="grid grid-cols-1 gap-2">
                {modelVersions.map((model, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ 
                        backgroundColor: model.success_rate > 80 
                          ? '#10b981' 
                          : model.success_rate > 50 
                            ? '#3b82f6' 
                            : '#f59e0b' 
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium dark:text-gray-300">
                          {model.version}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {model.count} docs
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                        <motion.div 
                          className="rounded-full h-1.5"
                          style={{ 
                            backgroundColor: model.success_rate > 80 
                              ? '#10b981' 
                              : model.success_rate > 50 
                                ? '#3b82f6' 
                                : '#f59e0b' 
                          }}
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${(model.count / totalProcessed) * 100}%` 
                          }}
                          transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProcessingMetricsComponent;