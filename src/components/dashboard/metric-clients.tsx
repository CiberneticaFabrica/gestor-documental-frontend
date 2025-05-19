import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend, RadialBarChart, RadialBar } from 'recharts';
import { Users, UserCheck, UserX, Clock, AlertTriangle, ShieldCheck, Briefcase, User, CheckCircle, Layers, UserCircle2, BadgeCheck, FileWarning } from 'lucide-react';

// Definición del tipo para los datos recibidos
interface ClientsMetricsData {
  conteos_basicos?: {
    total_clientes: number;
    clientes_activos: string;
    clientes_inactivos: string;
    clientes_prospecto: string;
  };
  distribucion_tipo_cliente?: Array<{
    tipo_cliente: string;
    count: number;
  }>;
  distribucion_segmento_bancario?: Array<{
    segmento_bancario: string;
    count: number;
  }>;
  distribucion_nivel_riesgo?: Array<{
    nivel_riesgo: string;
    count: number;
  }>;
  estado_documental?: Array<{
    estado_documental: string;
    count: number;
  }>;
  metricas_actividad?: {
    total_con_actividad: number;
    ultima_actividad: string;
    activos_ultimos_30_dias: string;
    activos_ultimos_90_dias: string;
  };
  metricas_kyc?: {
    total_con_revision: number;
    revisiones_vencidas: string;
    revisiones_proximos_30_dias: string;
  };
}

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  percentage?: number;
};

export const ClientsMetricsComponent = ({ data }: { data: ClientsMetricsData | null }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data === null) {
      setError('No se pudieron cargar los datos de clientes');
    } else {
      setError(null);
    }
  }, [data]);

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p>Cargando métricas de clientes...</p>
      </div>
    );
  }

  // Validar que los datos necesarios estén presentes
  if (!data.conteos_basicos || !data.distribucion_tipo_cliente || !data.distribucion_segmento_bancario) {
    return (
      <div className="p-4 text-center text-yellow-500">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
        <p>Los datos de clientes están incompletos</p>
      </div>
    );
  }

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

  // Componente para tarjeta de estadísticas con animación de conteo
  const StatCard = ({ title, value, subtitle, icon, color, percentage }: StatCardProps) => {
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
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {percentage !== undefined && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className={`${color} h-2 rounded-full`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Componente para gráfico de distribución de tipo de cliente
  const ClientTypeDistribution = () => {
    const COLORS = ['#3b82f6', '#93c5fd', '#60a5fa', '#2563eb'];
    const typeData = data.distribucion_tipo_cliente || [];

    // Transformar los datos para mostrar nombres más amigables
    const formattedData = typeData.map((item: { tipo_cliente: string; count: number }) => ({
      name: item.tipo_cliente === 'persona_fisica' ? 'Persona Física' : 'Empresa',
      value: item.count
    }));

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: {
      cx: number;
      cy: number;
      midAngle: number;
      innerRadius: number;
      outerRadius: number;
      percent: number;
      index: number;
    }) => {
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
      return (
        <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          className="text-sm font-medium"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 h-full"
      >
        <h3 className="text-lg font-medium mb-4 dark:text-white">Distribución por Tipo de Cliente</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient key={`gradient-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                    <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1500}
                animationBegin={300}
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#colorGradient-${index})`} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} clientes`, 'Cantidad']} />
              <Legend formatter={(value) => <span className="text-sm">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {formattedData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-4 h-4 rounded mr-2" 
                style={{ background: `url(#colorGradient-${index})`, backgroundColor: COLORS[index] }}
              ></div>
              <div>
                <p className="text-sm font-medium dark:text-gray-200">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.value} clientes</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Componente para gráfico de distribución de segmento bancario
  const BankingSegmentDistribution = () => {
    const COLORS = ['#3b82f6', '#93c5fd', '#60a5fa', '#2563eb', '#1d4ed8'];
    const segmentData: { segmento_bancario: string; count: number }[] = data.distribucion_segmento_bancario || [];

    // Transformar los datos para mostrar nombres más amigables
    const formattedData = segmentData.map((item) => ({
      name: item.segmento_bancario.charAt(0).toUpperCase() + item.segmento_bancario.slice(1),
      value: item.count
    }));

    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 h-full"
      >
        <h3 className="text-lg font-medium mb-4 dark:text-white">Distribución por Segmento Bancario</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                type="number"
                className="text-xs text-gray-500 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                dataKey="name" 
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
                formatter={(value) => [`${value} clientes`, 'Cantidad']}
              />
              <defs>
                {formattedData.map((entry, index) => (
                  <linearGradient
                    key={`gradient-bar-${index}`}
                    id={`colorGradientBar-${index}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={COLORS[(index + 1) % COLORS.length]} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <Bar 
                dataKey="value" 
                fill="#8884d8" 
                radius={[0, 4, 4, 0]}
                barSize={30}
                animationDuration={1500}
                animationBegin={300}
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#colorGradientBar-${index})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  // Componente para métricas de actividad
  const ActivityMetrics = () => {
    const activityData = data.metricas_actividad;
    
    if (!activityData) return null;
    
    // Crear datos para una gráfica de línea de actividad (simulada)
    const activityTrendData = [
      { name: '90 días', activos: parseInt(activityData.activos_ultimos_90_dias || '0') },
      { name: '60 días', activos: Math.round(parseInt(activityData.activos_ultimos_90_dias || '0') * 0.8) },
      { name: '30 días', activos: parseInt(activityData.activos_ultimos_30_dias || '0') },
      { name: 'Hoy', activos: activityData.total_con_actividad }
    ];

    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 h-full"
      >
        <h3 className="text-lg font-medium mb-4 dark:text-white">Métricas de Actividad</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Última Actividad</h4>
                <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                  {new Date(activityData.ultima_actividad).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total con Actividad</h4>
                <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                  {activityData.total_con_actividad}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Activos en 30 días</h4>
                <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                  {activityData.activos_ultimos_30_dias}
                </p>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activityTrendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="name" 
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
                  formatter={(value) => [`${value} clientes`, 'Activos']}
                />
                <Line 
                  type="monotone" 
                  dataKey="activos" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#3b82f6' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    );
  };

  // Componente para estado documental
  const DocumentalStatus = () => {
    const estadoDocumental = data.estado_documental || [];
    
    // Transformar los datos para mostrar nombres más amigables
    const formattedData = estadoDocumental.map(item => ({
      name: item.estado_documental.charAt(0).toUpperCase() + item.estado_documental.slice(1),
      value: item.count
    }));

    // Calcular el total para los porcentajes
    const totalClientes = data.conteos_basicos?.total_clientes || 0;
    
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 h-full"
      >
        <h3 className="text-lg font-medium mb-4 dark:text-white">Estado Documental</h3>
        <div className="grid grid-cols-1 gap-4">
          {formattedData.map((item, index) => {
            const percentage = totalClientes > 0 ? (item.value / totalClientes) * 100 : 0;
            let statusColor = 'bg-green-500';
            
            if (item.name.toLowerCase() === 'incompleto') {
              statusColor = 'bg-yellow-500';
            } else if (item.name.toLowerCase() === 'vencido') {
              statusColor = 'bg-red-500';
            }
            
            return (
              <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.name}</h4>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.value} clientes</p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <motion.div 
                    className={`${statusColor} h-2.5 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1 }}
                  ></motion.div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percentage.toFixed(1)}% del total</p>
              </div>
            );
          })}
          {formattedData.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">No hay datos de estado documental disponibles</p>
          )}
        </div>
      </motion.div>
    );
  };

  // Obtener datos de los conteos básicos
  const basicCounts = data.conteos_basicos || {};
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Clientes" 
          value={basicCounts.total_clientes || 0} 
          icon={<Users className="h-5 w-5 text-white" />} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Clientes Activos" 
          value={basicCounts.clientes_activos || 0} 
          subtitle={`${((parseInt(basicCounts.clientes_activos || '0') / (basicCounts.total_clientes || 1)) * 100).toFixed(1)}% del total`}
          icon={<UserCheck className="h-5 w-5 text-white" />} 
          color="bg-green-500"
          percentage={(parseInt(basicCounts.clientes_activos || '0') / (basicCounts.total_clientes || 1)) * 100}
        />
        <StatCard 
          title="Clientes Inactivos" 
          value={basicCounts.clientes_inactivos || 0} 
          subtitle={`${((parseInt(basicCounts.clientes_inactivos || '0') / (basicCounts.total_clientes || 1)) * 100).toFixed(1)}% del total`}
          icon={<UserX className="h-5 w-5 text-white" />} 
          color="bg-red-500"
          percentage={(parseInt(basicCounts.clientes_inactivos || '0') / (basicCounts.total_clientes || 1)) * 100}
        />
        <StatCard 
          title="Clientes Prospecto" 
          value={basicCounts.clientes_prospecto || 0} 
          subtitle={`${((parseInt(basicCounts.clientes_prospecto || '0') / (basicCounts.total_clientes || 1)) * 100).toFixed(1)}% del total`}
          icon={<Clock className="h-5 w-5 text-white" />} 
          color="bg-yellow-500"
          percentage={(parseInt(basicCounts.clientes_prospecto || '0') / (basicCounts.total_clientes || 1)) * 100}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ClientTypeDistribution />
        <BankingSegmentDistribution />
        <ActivityMetrics />
      </div>
      <DocumentalStatus />
    </motion.div>
  );
};