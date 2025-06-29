import axios from 'axios';

export interface ThresholdResult {
  notifications_sent: number;
  renewal_requests_created: number;
  clients_updated: number;
  errors: number;
}

export interface ThresholdProcessed {
  days_threshold: number;
  target_date: string;
  documents_found: number;
  results: ThresholdResult;
}

export interface ExpiryMonitorMetrics {
  documents_processed: number;
  notifications_sent: number;
  renewal_requests_created: number;
  clients_updated: number;
  errors: number;
  thresholds_processed: ThresholdProcessed[];
}

export interface ExpiryMonitorParameters {
  notification_days: number[];
  force_execution: boolean;
}

export interface ExpiryMonitorResponse {
  message: string;
  execution_type: string;
  timestamp: string;
  metrics: ExpiryMonitorMetrics;
  parameters: ExpiryMonitorParameters;
}

export interface ExpiryMonitorRequest {
  notification_days?: number[];
  force_execution?: boolean;
}

export interface SendInformationRequestResponse {
  message: string;
  client_id: string;
  client_name: string;
  client_email: string;
  timestamp: string;
  request_details: any;
}

// Configuración específica para este servicio
const EXPIRY_MONITOR_CONFIG = {
  baseURL: 'https://a43hkqj27a.execute-api.us-east-1.amazonaws.com/Prod',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Instancia de axios específica para este servicio
const expiryMonitorAxios = axios.create(EXPIRY_MONITOR_CONFIG);

// Interceptor para agregar token de autenticación
expiryMonitorAxios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('session_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const expireDocumentService = {
  /**
   * Ejecuta el monitoreo de documentos por vencer
   */
  executeExpiryMonitor: async (params?: ExpiryMonitorRequest): Promise<ExpiryMonitorResponse> => {
    const { data } = await expiryMonitorAxios.post<ExpiryMonitorResponse>(
      '/documents/expiry-monitor',
      params || {}
    );
    return data;
  },

  /**
   * Ejecuta el monitoreo con días de notificación específicos
   */
  executeWithNotificationDays: async (notificationDays: number[]): Promise<ExpiryMonitorResponse> => {
    return expireDocumentService.executeExpiryMonitor({
      notification_days: notificationDays
    });
  },

  /**
   * Ejecuta el monitoreo forzado
   */
  executeForced: async (): Promise<ExpiryMonitorResponse> => {
    return expireDocumentService.executeExpiryMonitor({
      force_execution: true
    });
  },

  /**
   * Ejecuta el monitoreo con configuración personalizada
   */
  executeCustom: async (notificationDays: number[], forceExecution: boolean = false): Promise<ExpiryMonitorResponse> => {
    return expireDocumentService.executeExpiryMonitor({
      notification_days: notificationDays,
      force_execution: forceExecution
    });
  },

  /**
   * Envía solicitud de información al cliente
   */
  sendInformationRequest: async (clientId: string): Promise<SendInformationRequestResponse> => {
    const { data } = await expiryMonitorAxios.post<SendInformationRequestResponse>(
      `/client/send-information-request`,
      { client_id: clientId }
    );
    return data;
  }
};
