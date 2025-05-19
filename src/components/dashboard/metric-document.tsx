import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Sector, Legend } from 'recharts';
import { FileText, File, Archive, Clock, HardDrive, Download, Users, Activity } from 'lucide-react';
import { DashboardDocumentsMetricsResponse } from '@/lib/api/services/dashboard.service';

type MetricCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
};

// Componente para las métricas de documentos
export const DocumentMetricsComponent = ({ data }: { data: DashboardDocumentsMetricsResponse | null }) => {
  if (!data) return <div className="p-4 text-center">Cargando métricas de documentos...</div>;

  // Formatear los datos del documento para el gráfico de tendencia
  const documentTrendData = data.document_trend || [];
  const documentsByType = data.documents_by_type || [];

  // Colores para los tipos de documentos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];

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

  // Componente para la tarjeta de métrica
  const MetricCard = ({ title, value, icon, color, subtitle }: MetricCardProps) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      const finalValue = typeof value === 'number' ? value : parseInt(value) || 0;
      const duration = 1000;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;
      
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(progress * finalValue);
        
        setCount(currentCount);
        
        if (frame === totalFrames) {
          clearInterval(counter);
          setCount(finalValue);
        }
      }, frameDuration);
      
      return () => clearInterval(counter);
    }, [value]);
    
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
          <p className="text-2xl font-bold mb-1 dark:text-white">{count}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </motion.div>
    );
  };

  // Componente para la distribución de tipos de documentos
  const DocumentTypeDistribution = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_: unknown, index: number) => {
      setActiveIndex(index);
    };

    const renderActiveShape = (props: any) => {
      const RADIAN = Math.PI / 180;
      const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value } = props;
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const sx = cx + (outerRadius + 10) * cos;
      const sy = cy + (outerRadius + 10) * sin;
      const mx = cx + (outerRadius + 30) * cos;
      const my = cy + (outerRadius + 30) * sin;
      const ex = mx + (cos >= 0 ? 1 : -1) * 22;
      const ey = my;
      const textAnchor = cos >= 0 ? 'start' : 'end';

      return (
        <g>
          <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm">
            {payload.type}
          </text>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
          <Sector
            cx={cx}
            cy={cy}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={outerRadius + 6}
            outerRadius={outerRadius + 10}
            fill={fill}
          />
          <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
          <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
          <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs">
            {`${value} documentos`}
          </text>
          <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
            {`(${(percent * 100).toFixed(2)}%)`}
          </text>
        </g>
      );
    };

    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700 h-full flex flex-col items-center justify-center"
      >
        <h3 className="text-base font-medium mb-2 dark:text-white w-full text-center">Distribución por Tipo de Documento</h3>
        <div className="w-full flex justify-center">
          <div className="max-w-xs w-full">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={documentsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="type"
                  onMouseEnter={onPieEnter}
                >
                  {documentsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Métricas principales en una sola fila */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard 
          title="Total Documentos" 
          value={data.document_counts?.total || 0} 
          icon={<FileText className="h-5 w-5 text-white" />} 
          color="bg-blue-500"
          subtitle="Documentos registrados" 
        />
        <MetricCard 
          title="Documentos Publicados" 
          value={data.document_counts?.published || 0} 
          icon={<File className="h-5 w-5 text-white" />} 
          color="bg-green-500"
          subtitle="Documentos activos" 
        />
        <MetricCard 
          title="Almacenamiento" 
          value={((data.storage_metrics?.total_bytes || 0) / 1024 / 1024).toFixed(2)} 
          icon={<HardDrive className="h-5 w-5 text-white" />} 
          color="bg-purple-500"
          subtitle="MB utilizados" 
        />
        <MetricCard 
          title="Documentos Pendientes" 
          value={data.pending_documents?.total_pending || 0} 
          icon={<Clock className="h-5 w-5 text-white" />} 
          color="bg-yellow-500"
          subtitle="Requieren acción" 
        />
      </div>

      {/* Primera fila: Distribución, Accesos por hora, Usuarios activos en una sola línea incluso en md */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <DocumentTypeDistribution />
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700 h-full flex flex-col min-h-[260px]"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium dark:text-white">Acceso de Documentos por Hora</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.document_access_by_hour || []}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="hour" 
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
                  formatter={(value) => [`${value} accesos`, 'Cantidad']}
                  labelFormatter={(value) => `Hora ${value}:00`}
                />
                <Bar dataKey="count" name="Accesos" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {(data.document_access_by_hour || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`#3b82f6`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700 h-full flex flex-col min-h-[260px]"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium dark:text-white">Usuarios Más Activos</h3>
          </div>
          <div className="space-y-2">
            {(data.top_active_users || []).slice(0, 4).map((user, index) => (
              <motion.div 
                key={user.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-medium dark:text-white text-sm">{user.username}</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 mt-1">
                    <motion.div 
                      className="bg-blue-500 h-1 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((user.activity_count / (data.top_active_users[0]?.activity_count || 1)) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{user.activity_count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Segunda fila: Tendencia de Documentos a lo ancho */}
      <div className="w-full">
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700 w-full flex flex-col"
        >
          <h3 className="text-base font-medium mb-2 dark:text-white">Tendencia de Documentos</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={documentTrendData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
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
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Documentos"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};