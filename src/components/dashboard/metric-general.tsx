import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  Calendar, ChevronDown, ChevronUp, Users, FileText, FileCheck, AlertTriangle,
  Activity, Clipboard, Database, Award, Clock, User, UserCheck, UserPlus,
  Folder, Filter, RefreshCw, Check, AlertCircle, ShieldAlert, Eye, Download, 
  Upload, BarChart2, PieChart as PieChartIcon, TrendingUp, FileBox, Clock8
} from 'lucide-react';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { motion } from 'framer-motion';

// Types from your props
type DashboardMetricsResponse = any;
type DashboardDocumentsMetricsResponse = any;
type DashboardUsersMetricsResponse = any;
type DashboardActivityMetricsResponse = any;
type DashboardClassificationMetricsResponse = any;
type DashboardVolumeMetricsResponse = any;
type DashboardProcessingMetricsResponse = any;

type VistaGeneralProps = {
  metrics: DashboardMetricsResponse | null;
  documentsMetrics: DashboardDocumentsMetricsResponse | null;
  userMetrics: DashboardUsersMetricsResponse | null;
  volumeTrend: DashboardVolumeMetricsResponse | null;
  processingStats: DashboardProcessingMetricsResponse | null;
  loading: boolean;
  error?: string | null;
};

// Custom color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
const DOCUMENT_TYPES_COLORS = {
  'DNI': '#0088FE',
  'Contrato cuenta': '#00C49F',
  'Pasaporte': '#FFBB28',
  'Documento': '#FF8042',
  'contrato': '#8884d8',
  'contrato_tarjeta': '#82ca9d',
  'contrato_cuenta': '#ffc658'
};

// Card component for consistent styling
type CardProps = {
  title: React.ReactNode;
  icon: React.ElementType;
  value?: React.ReactNode;
  secondaryValue?: React.ReactNode;
  trend?: number;
  children?: React.ReactNode;
  className?: string;
  trendLabel?: string;
};
const Card: React.FC<CardProps> = ({ title, icon, value, secondaryValue, trend, children, className = '', trendLabel = '' }) => {
  const Icon = icon;
  const trendUp = typeof trend === 'number' && trend > 0;
  const trendDown = typeof trend === 'number' && trend < 0;
  
  return (
    <div className={`bg-white rounded-xl shadow-sms p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 font-medium text-lg flex items-center">
          {icon && <Icon className="w-5 h-5 mr-2 text-blue-500" />}
          {title}
        </h3>
        {trend !== undefined && (
          <div className={`flex items-center ${trendUp ? 'text-green-500' : ''} ${trendDown ? 'text-red-500' : ''}`}>
            {trendUp && <ChevronUp className="w-4 h-4" />}
            {trendDown && <ChevronDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{Math.abs(trend)}% {trendLabel}</span>
          </div>
        )}
      </div>
      
      {value !== undefined && (
        <div className="mb-3">
          <div className="text-3xl font-bold text-gray-800">{value}</div>
          {secondaryValue && (
            <div className="text-sm text-gray-500 mt-1">{secondaryValue}</div>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
};

// Format numbers with comma separators
const formatNumber = (num: number | string) => {
  if (typeof num === 'number') {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  if (typeof num === 'string' && !isNaN(Number(num))) {
    return Number(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return '0';
};

// Format dates to a more readable format
const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Format size in bytes to human-readable format
const formatBytes = (bytes: number, decimals: number = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Gradient for charts
const gradientOffset = (data: Array<{ count?: number; document_count?: number }>) => {
  const dataMax = Math.max(...data.map((i: { count?: number; document_count?: number }) => i.count || i.document_count || 0));
  const dataMin = Math.min(...data.map((i: { count?: number; document_count?: number }) => i.count || i.document_count || 0));
  if (dataMax <= 0) return 0;
  return dataMin / dataMax;
};

const VistaGeneral: React.FC<VistaGeneralProps> = ({
  metrics,
  documentsMetrics,
  userMetrics,
  volumeTrend,
  processingStats,
  loading,
  error
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (loading || !documentsMetrics || !userMetrics || !volumeTrend || !processingStats) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-16 h-16">
          <RefreshCw className="w-16 h-16 text-blue-500 animate-spin" />
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertTriangle className="w-16 h-16 text-red-500" />
        <p className="mt-4 text-lg font-medium text-gray-700">{error || 'Error al cargar los datos. Intente nuevamente.'}</p>
      </div>
    );
  }
  
  // Extract data for charts and metrics
  const documentTrend = documentsMetrics.document_trend || [];
  const documentTypes = documentsMetrics.documents_by_type || [];
  const topUsers = userMetrics.most_active_users || [];
  const activityByHour = documentsMetrics.document_access_by_hour || [];
  const processingTrend = processingStats.processing_trend || [];
  const processingByType = processingStats.processing_by_type || [];
  
  // Dashboard with SVG background pattern
  return (
    <motion.div
      className="relative z-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* SVG Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="url(#smallGrid)" />
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Overview Tab */}
      <div className="mt-6 space-y-6 ">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            title="Documentos Totales" 
            icon={FileText} 
            value={formatNumber(documentsMetrics.document_counts.total)}
            secondaryValue={`${formatNumber(documentsMetrics.document_counts.new_in_period)} nuevos en el periodo`}
          />
          <Card 
            title="Usuarios Activos" 
            icon={Users} 
            value={formatNumber(userMetrics.user_counts?.active ?? 0)}
            secondaryValue={`${formatNumber(userMetrics.user_counts?.new_in_period ?? 0)} usuarios nuevos`}
          />
          <Card 
            title="Tasa de Procesamiento" 
            icon={Activity} 
            value={`${processingStats.processing_stats.success_rate.toFixed(1)}%`}
            secondaryValue={`${formatNumber(processingStats.processing_stats.total_processed)} documentos procesados`}
          />
          <Card 
            title="Espacio Almacenamiento" 
            icon={Database} 
            value={formatBytes(documentsMetrics.storage_metrics.total_bytes)}
            secondaryValue={`${formatNumber(documentsMetrics.storage_metrics.total_versions)} versiones`}
          />
        </div>
        {/* Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Trend */}
          <Card title="Evolución de Documentos" icon={TrendingUp} className="col-span-1  ">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={documentTrend}>
                <defs>
                  <linearGradient id="colorDocuments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip 
                  formatter={(value: number | string) => [formatNumber(Number(value)), "Documentos"]}
                  labelFormatter={(date) => formatDate(date)}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#0088FE" 
                  fillOpacity={1} 
                  fill="url(#colorDocuments)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          {/* Document Type Distribution */}
          <Card title="Tipos de Documentos" icon={PieChartIcon} className="col-span-1">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={documentTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="type"
                    animationDuration={1500}
                  >
                    {documentTypes.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number | string) => [formatNumber(Number(value)), "Documentos"]}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Users */}
          <Card title="Usuarios Más Activos" icon={Award} className="col-span-1">
            <div className="space-y-4">
              {topUsers.slice(0, 4).map((user: any, index: number) => (
                <div key={user.user_id} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${index === 0 ? 'bg-yellow-100 text-yellow-600' : 
                      index === 1 ? 'bg-gray-100 text-gray-600' : 
                      index === 2 ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 flex items-center">
                      <User className="w-4 h-4 mr-1 text-gray-400" />
                      {user.name || user.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatNumber(user.action_count || user.activity_count)} acciones
                    </div>
                  </div>
                  <div className="bg-blue-50 text-blue-700 rounded-full px-2.5 py-0.5 text-xs font-medium">
                    {user.active_days ? `${user.active_days} días activo` : ''}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {/* Activity by Hour */}
          <Card title="Actividad por Hora" icon={Clock} className="col-span-1">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={activityByHour} barSize={12}>
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number | string) => [formatNumber(Number(value)), "Acciones"]}
                  labelFormatter={(value: number | string) => `Hora ${value}:00`}
                />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} animationDuration={1500}>
                  {activityByHour.map((item: any, index: number) => (
                    <Cell key={`cell-${item.hour}`} fill={`rgba(136, 132, 216, ${0.4 + (item.count / Math.max(...activityByHour.map((i: any) => i.count))) * 0.6})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          {/* Processing Stats */}
          <Card title="Métricas de Procesamiento" icon={FileCheck} className="col-span-1">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tasa de éxito:</span>
                <span className="font-medium">{processingStats.processing_stats.success_rate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${processingStats.processing_stats.success_rate}%` }}></div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tiempo medio:</span>
                <span className="font-medium">{processingStats.processing_stats.avg_processing_time_ms.toFixed(1)} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Procesados:</span>
                <span className="font-medium">{formatNumber(processingStats.processing_stats.total_processed)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Errores:</span>
                <span className="font-medium">{formatNumber(processingStats.processing_stats.error_count)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default VistaGeneral;