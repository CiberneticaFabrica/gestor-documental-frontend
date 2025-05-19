import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';
import { CheckSquare, FileSearch, BadgeCheck, AlertTriangle, BarChart as BarChartIcon, Target } from 'lucide-react';

// Componente para las métricas de extracción
export const ExtractionMetricsComponent = ({ data }: { data: any }) => {
  if (!data) return <div className="p-4 text-center">Cargando métricas de extracción...</div>;

  // Formatear los datos de extracción para los gráficos
  const extractionByType = data.extraction_by_type || [];
  
  // Ordenar tipos de documentos por tasa de validación
  const sortedExtractionByType = [...extractionByType].sort((a, b) => b.validation_rate - a.validation_rate);

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

  // Componente para los medidores circulares 
  const ConfidenceGauge = ({ title, value, category }: { title: string; value: string; category: string }) => {
    const [percentage, setPercentage] = useState(0);
    
    useEffect(() => {
      let start = 0;
      const end = parseFloat(value) || 0;
      const duration = 1500;
      const interval = 10;
      const steps = duration / interval;
      const increment = end / steps;
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setPercentage(end);
          clearInterval(timer);
        } else {
          setPercentage(start);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }, [value]);
    
    // Determinar color y mensaje basado en la categoría/nivel
    const getConfig = (cat: string) => {
      switch(cat) {
        case 'high':
          return { 
            color: 'text-green-500 dark:text-green-400', 
            bgColor: 'bg-green-500',
            message: 'Alta confianza'
          };
        case 'medium':
          return { 
            color: 'text-blue-500 dark:text-blue-400', 
            bgColor: 'bg-blue-500',
            message: 'Confianza media'
          };
        case 'low':
          return { 
            color: 'text-yellow-500 dark:text-yellow-400', 
            bgColor: 'bg-yellow-500',
            message: 'Baja confianza'
          };
        default:
          return { 
            color: 'text-blue-500 dark:text-blue-400', 
            bgColor: 'bg-blue-500',
            message: 'General'
          };
      }
    };
    
    const config = getConfig(category);
    const percentageValue = percentage || 0;
    
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center h-full"
        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      >
        <h3 className="text-lg font-medium mb-4 text-center dark:text-white">{title}</h3>
        <div className="relative">
          <svg className="w-32 h-32">
            {/* Fondo del gauge */}
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              strokeWidth="12"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            {/* Arco del valor */}
            <motion.path
              d={`
                M 16 64
                A 48 48 0 ${percentageValue > 50 ? 1 : 0} 1 ${
                  64 + 48 * Math.cos((percentageValue / 100) * Math.PI)
                } ${
                  64 - 48 * Math.sin((percentageValue / 100) * Math.PI)
                }
              `}
              fill="none"
              strokeWidth="12"
              strokeLinecap="round"
              className={config.bgColor}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: percentageValue / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            {/* Línea indicadora */}
            <motion.line
              x1="64"
              y1="64"
              x2="64"
              y2="16"
              strokeWidth="3"
              strokeLinecap="round"
              className="stroke-gray-800 dark:stroke-white"
              initial={{ transform: 'rotate(0deg)', transformOrigin: 'center' }}
              animate={{ 
                transform: `rotate(${(percentageValue / 100) * 180}deg)`,
                transformOrigin: 'center' 
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            {/* Punto central */}
            <circle
              cx="64"
              cy="64"
              r="6"
              className="fill-gray-800 dark:fill-white"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${config.color}`}>
              {percentageValue.toFixed(1)}%
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{config.message}</p>
      </motion.div>
    );
  };

  // Componente para tarjeta de métricas con cifras animadas
  const MetricCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
    valueType = "number",
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
    valueType?: "number" | "percent";
  }) => {
    const [displayValue, setDisplayValue] = useState<string | number>(0);
    
    useEffect(() => {
      // Preparar el valor final
      let finalValue = 0;
      if (valueType === "percent") {
        finalValue = parseFloat(String(value)) || 0;
      } else {
        finalValue = parseInt(String(value), 10) || 0;
      }
      
      const duration = 1000;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;
      
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = valueType === "percent" 
          ? (progress * finalValue).toFixed(1) 
          : Math.round(progress * finalValue);
        
        setDisplayValue(currentCount);
        
        if (frame === totalFrames) {
          clearInterval(counter);
          setDisplayValue(finalValue);
        }
      }, frameDuration);
      
      return () => clearInterval(counter);
    }, [value, valueType]);
    
    const formattedValue = () => {
      if (valueType === "percent") {
        return `${displayValue}%`;
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

  // Distribución de Confianza de Extracción
  const ConfidenceDistribution = () => {
    // Crear los datos para la distribución de confianza
    const confidenceData = [
      {
        name: "Alta Confianza",
        value: parseFloat(data.extraction_stats?.high_confidence_percent) || 0,
        fill: "#10b981"
      },
      {
        name: "Confianza Media",
        value: (parseFloat(data.extraction_stats?.medium_confidence_count) / parseFloat(data.extraction_stats?.total_documents)) * 100 || 0,
        fill: "#3b82f6"
      },
      {
        name: "Baja Confianza",
        value: (parseFloat(data.extraction_stats?.low_confidence_count) / parseFloat(data.extraction_stats?.total_documents)) * 100 || 0,
        fill: "#f59e0b"
      }
    ];
    
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 h-full"
      >
        <h3 className="text-lg font-medium mb-4 dark:text-white">Distribución de Confianza</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={confidenceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {confidenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Porcentaje']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  // Validación por Tipo de Documento
  const ValidationByTypeChart = () => {
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 h-full"
      >
        <h3 className="text-lg font-medium mb-4 dark:text-white">Validación por Tipo de Documento</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedExtractionByType}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 120,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" horizontal={false} />
              <XAxis 
                type="number"
                className="text-xs text-gray-500 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                dataKey="document_type"
                type="category"
                className="text-xs text-gray-500 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip
                formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Tasa de Validación']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar 
                dataKey="validation_rate" 
                name="Tasa de Validación" 
                radius={[0, 4, 4, 0]}
              >
                {sortedExtractionByType.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={Number(entry.validation_rate) > 80 
                      ? '#10b981' 
                      : Number(entry.validation_rate) > 50 
                        ? '#3b82f6' 
                        : '#f59e0b'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  // Confianza por Tipo de Documento
  const ConfidenceByTypeChart = () => {
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 h-full"
      >
        <h3 className="text-lg font-medium mb-4 dark:text-white">Confianza por Tipo de Documento</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedExtractionByType}
              margin={{
                top: 5,
                right: 30,
                left: 30,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="document_type"
                className="text-xs text-gray-500 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                className="text-xs text-gray-500 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip
                formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Nivel de Confianza']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar 
                dataKey="avg_confidence" 
                name="Confianza Promedio"
                radius={[4, 4, 0, 0]}
              >
                {sortedExtractionByType.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={Number(entry.avg_confidence) > 0.8 
                      ? '#10b981' 
                      : Number(entry.avg_confidence) > 0.5 
                        ? '#3b82f6' 
                        : '#f59e0b'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  // Obtener estadísticas de los datos
  const stats = data.extraction_stats || {};
  const avgConfidence = parseFloat(stats.avg_confidence) || 0;
  const validationRate = parseFloat(stats.validation_rate) || 0;
  const totalDocuments = parseInt(stats.total_documents, 10) || 0;
  const validatedCount = parseInt(stats.manually_validated_count, 10) || 0;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Documentos Procesados" 
          value={totalDocuments} 
          icon={<FileSearch className="h-5 w-5 text-white" />} 
          color="bg-blue-500"
          subtitle="Total extracciones" 
        />
        <MetricCard 
          title="Documentos Validados" 
          value={validatedCount} 
          icon={<CheckSquare className="h-5 w-5 text-white" />} 
          color="bg-green-500"
          subtitle="Revisión manual completada" 
        />
        <MetricCard 
          title="Tasa de Validación" 
          value={String(validationRate)} 
          icon={<BadgeCheck className="h-5 w-5 text-white" />} 
          color="bg-purple-500"
          subtitle="% documentos validados" 
          valueType="percent"
        />
        <MetricCard 
          title="Documentos por Validar" 
          value={totalDocuments - validatedCount} 
          icon={<AlertTriangle className="h-5 w-5 text-white" />} 
          color="bg-yellow-500"
          subtitle="Requieren revisión" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ConfidenceGauge 
          title="Confianza Promedio Global" 
          value={(avgConfidence * 100).toFixed(1)} 
          category={
            avgConfidence > 0.8 ? 'high' : 
            avgConfidence > 0.5 ? 'medium' : 'low'
          } 
        />
        <ConfidenceGauge 
          title="Alta Confianza" 
          value={stats.high_confidence_percent} 
          category="high" 
        />
        <ConfidenceGauge 
          title="Tasa de Validación" 
          value={String(validationRate)} 
          category={
            validationRate > 80 ? 'high' : 
            validationRate > 50 ? 'medium' : 'low'
          } 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ValidationByTypeChart />
        <ConfidenceByTypeChart />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfidenceDistribution />
        
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 h-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium dark:text-white">Detalles de Extracción</h3>
          </div>
          <div className="space-y-6">
            {/* Resumen de Extracción */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm font-medium dark:text-gray-300">Total documentos</span>
                </div>
                <span className="text-sm font-bold text-blue-500">{totalDocuments}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm font-medium dark:text-gray-300">Documentos validados</span>
                </div>
                <span className="text-sm font-bold text-green-500">{validatedCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm font-medium dark:text-gray-300">Alta confianza</span>
                </div>
                <span className="text-sm font-bold text-yellow-500">{stats.high_confidence_count || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-sm font-medium dark:text-gray-300">Confianza media</span>
                </div>
                <span className="text-sm font-bold text-purple-500">{stats.medium_confidence_count || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm font-medium dark:text-gray-300">Baja confianza</span>
                </div>
                <span className="text-sm font-bold text-red-500">{stats.low_confidence_count || 0}</span>
              </div>
            </div>
            
            {/* Campos extraídos */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3 dark:text-gray-300">Campos Extraídos</h4>
              <div className="space-y-2">
                {(data.extracted_fields || []).map((field: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm dark:text-gray-300">{field.field_name}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-bold mr-2 text-blue-500">{field.count}</span>
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <motion.div 
                          className="bg-blue-500 h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${Math.min((field.count / totalDocuments) * 100, 100)}%` 
                          }}
                          transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendario desde-hasta */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3 dark:text-gray-300">Período de Análisis</h4>
              <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Desde</span>
                  <p className="text-sm font-medium dark:text-white">{data.time_range?.start_date || 'N/A'}</p>
                </div>
                <div className="border-r border-gray-300 dark:border-gray-600 h-10"></div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Hasta</span>
                  <p className="text-sm font-medium dark:text-white">{data.time_range?.end_date || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExtractionMetricsComponent;