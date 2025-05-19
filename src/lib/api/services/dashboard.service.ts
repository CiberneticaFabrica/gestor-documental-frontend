import axiosInstance from '../axios-instance';

// Tipos de respuesta
export interface DashboardMetricsResponse {
  document_metrics: any;
  user_metrics: any;
  folder_metrics: any;
  processing_metrics: {
    total_processed: number;
    success_rate: number;
    avg_processing_time_ms: number;
    pending_verification: number;
  };
  client_metrics: any;
  request_metrics: any;
  compliance_metrics: any;
  storage_metrics: any;
  trend_data: Array<{
    date: string;
    value: number;
  }>;
}

export interface DashboardDocumentsMetricsResponse {
  document_counts: any;
  storage_metrics: any;
  user_activity: any;
  ai_processing: any;
  client_metrics: any;
  documents_by_type: any[];
  document_trend: any[];
  pending_documents: any;
  top_active_users: any[];
  document_access_by_hour: any[];
}

export interface DashboardUsersMetricsResponse {
  user_counts: any;
  most_active_users: any[];
  action_distribution: any[];
  login_activity: any[];
  login_failures: any[];
  session_metrics: any;
  device_usage: any[];
  browser_usage: any[];
  roles_distribution: any[];
  hourly_activity: any[];
  weekday_activity: any[];
  content_contribution: any[];
  inactivity_analysis: any;
  user_registration: any[];
}

export interface DashboardActivityMetricsResponse {
  activities: any[];
  summary: any[];
  most_active_users: any[];
  trend_data: any[];
  period: any;
}

export interface DashboardProcessingMetricsResponse {
  processing_stats: any;
  processing_by_type: any[];
  processing_trend: any[];
  error_types: any[];
  model_versions: any[];
}

export interface DashboardClassificationMetricsResponse {
  classification_stats: any;
  verification_stats: any;
  accuracy_by_type: any[];
  confidence_distribution: any[];
  confidence_trend: any[];
}

export interface DashboardExtractionMetricsResponse {
  extraction_stats: any;
  extraction_by_type: any[];
  entity_extraction: any[];
  extracted_fields: any[];
  time_range: any;
}

export interface DashboardVolumeMetricsResponse {
  volume_trend: any[];
  type_distribution_by_period: any[];
  processing_trend: any[];
  overall_stats: any;
  time_range: any;
}

export interface DashboardClientsMetricsResponse {
  conteos_basicos: {
    total_clientes: number;
    clientes_activos: string;
    clientes_inactivos: string;
    clientes_prospecto: string;
  };
  distribucion_tipo_cliente: Array<{
    tipo_cliente: string;
    count: number;
  }>;
  distribucion_segmento_bancario: Array<{
    segmento_bancario: string;
    count: number;
  }>;
  distribucion_nivel_riesgo: Array<{
    nivel_riesgo: string;
    count: number;
  }>;
  estado_documental: Array<{
    estado_documental: string;
    count: number;
  }>;
  metricas_actividad: {
    total_con_actividad: number;
    ultima_actividad: string;
    activos_ultimos_30_dias: string;
    activos_ultimos_90_dias: string;
  };
  metricas_kyc: {
    total_con_revision: number;
    revisiones_vencidas: string;
    revisiones_proximos_30_dias: string;
  };
}

export const dashboardService = {
  async getMetrics() {
    const { data } = await axiosInstance.get<DashboardMetricsResponse>('/dashboard/metrics');
    return data;
  },
  async getDocumentsMetrics() {
    const { data } = await axiosInstance.get<DashboardDocumentsMetricsResponse>('/dashboard/metrics/documents');
    return data;
  },
  async getUsersMetrics() {
    const { data } = await axiosInstance.get<DashboardUsersMetricsResponse>('/dashboard/metrics/users');
    return data;
  },
  async getActivityMetrics() {
    const { data } = await axiosInstance.get<DashboardActivityMetricsResponse>('/dashboard/metrics/activity');
    return data;
  },
  async getProcessingMetrics() {
    const { data } = await axiosInstance.get<DashboardProcessingMetricsResponse>('/dashboard/metrics/processing');
    return data;
  },
  async getClassificationMetrics() {
    const { data } = await axiosInstance.get<DashboardClassificationMetricsResponse>('/dashboard/metrics/classification');
    return data;
  },
  async getExtractionMetrics() {
    const { data } = await axiosInstance.get<DashboardExtractionMetricsResponse>('/dashboard/metrics/extraction');
    return data;
  },
  async getVolumeMetrics() {
    const { data } = await axiosInstance.get<DashboardVolumeMetricsResponse>('/dashboard/metrics/volume');
    return data;
  },
  async getClientsMetrics() {
    const { data } = await axiosInstance.get<DashboardClientsMetricsResponse>('/clients/metrics');
    return data;
  },
}; 