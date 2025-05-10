 // Autenticación
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  PROFILE: '/auth/validate',
  CHANGE_PASSWORD: '/auth/change-password',
  SETUP_2FA: '/auth/setup-2fa',
  VERIFY_2FA: '/auth/verify-2fa',
  REGISTER_DEVICE: '/auth/register-device',
  RESET_PASSWORD: '/auth/reset-password',
  RESET_PASSWORD_CONFIRM: '/auth/reset-password/confirm',
};

// Usuarios y Grupos
export const USER_ENDPOINTS = {
    USERS: '/users',
    GROUPS: '/groups',
    USER_DETAIL: (id: string) => `/users/${id}`,
    GROUP_DETAIL: (id: string) => `/groups/${id}`,
    GROUP_USERS: (id: string) => `/groups/${id}/users`,
  };
  
  // Documentos
  export const DOCUMENT_ENDPOINTS = {
    DOCUMENTS: '/documents',
    DOCUMENT_DETAIL: (id: string) => `/documents/${id}`,
    DOCUMENT_VERSIONS: (id: string) => `/documents/${id}/versions`,
    DOCUMENT_VERSION_DETAIL: (id: string, versionId: string) => 
      `/documents/${id}/versions/${versionId}`,
    DOCUMENT_HISTORY: (id: string) => `/documents/${id}/history`,
    DOCUMENT_CONTENT: (id: string) => `/documents/${id}/content`,
    DOCUMENT_PREVIEW: (id: string) => `/documents/${id}/preview`,
    DOCUMENT_DOWNLOAD: (id: string) => `/documents/${id}/download`,
    DOCUMENT_SEARCH: '/documents/search',
  };
  
  // Carpetas
  export const FOLDER_ENDPOINTS = {
    FOLDERS: '/folders',
    FOLDER_DETAIL: (id: string) => `/folders/${id}`,
    FOLDER_DOCUMENTS: (id: string) => `/folders/${id}/documents`,
    FOLDER_PERMISSIONS: (id: string) => `/folders/${id}/permissions`,
  };
  
  // Subida de archivos
  export const UPLOAD_ENDPOINTS = {
    UPLOAD_URL: '/upload/url',
    UPLOAD_STATUS: (uploadId: string) => `/upload/status/${uploadId}`,
    UPLOAD_COMPLETE: (uploadId: string) => `/upload/complete/${uploadId}`,
    UPLOAD_CANCEL: (uploadId: string) => `/upload/cancel/${uploadId}`,
    UPLOAD_DIRECT: '/upload/direct',
  };
  
  // Clientes
  export const CLIENT_ENDPOINTS = {
    CLIENTS: '/clients',
    CLIENT_DETAIL: (id: string) => `/clients/${id}`,
    CLIENT_VIEW: (id: string) => `/clients/${id}/view`,
    CLIENT_DOCUMENTS: (id: string) => `/clients/${id}/documents`,
    CLIENT_COMPLETENESS: (id: string) => `/clients/${id}/completeness`,
    CLIENT_RISK: (id: string) => `/clients/${id}/risk`,
    CLIENT_ACTIVITY: (id: string) => `/clients/${id}/activity`,
    CLIENT_KPIS: (id: string) => `/clients/${id}/kpis`,
    CLIENT_DOCUMENTS_STATUS: (id: string) => `/clients/${id}/documents/status`,
    CLIENT_DOCUMENTS_PENDING: (id: string) => `/clients/${id}/documents/pending`,
    CLIENT_DOCUMENTS_EXPIRING: (id: string) => `/clients/${id}/documents/expiring`,
    CLIENT_DOCUMENTS_REQUEST: (id: string) => `/clients/${id}/documents/request`,
  };
  
  // Dashboard y Métricas
  export const DASHBOARD_ENDPOINTS = {
    METRICS: '/dashboard/metrics',
    PROCESSING_METRICS: '/dashboard/metrics/processing',
    CLASSIFICATION_METRICS: '/dashboard/metrics/classification',
    EXTRACTION_METRICS: '/dashboard/metrics/extraction',
    VOLUME_METRICS: '/dashboard/metrics/volume',
    COMPLIANCE_METRICS: '/dashboard/metrics/compliance',
  };
  
  // Notificaciones y Alertas
  export const NOTIFICATION_ENDPOINTS = {
    NOTIFICATIONS: '/notifications',
    NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
    NOTIFICATION_DELETE: (id: string) => `/notifications/${id}`,
    NOTIFICATION_PREFERENCES: '/notifications/preferences',
    NOTIFICATION_TEST: '/notifications/test',
    ALERTS: '/alerts',
    ALERTS_EXPIRING: '/alerts/expiring',
    ALERTS_INCOMPLETE: '/alerts/incomplete',
    ALERTS_THRESHOLDS: '/alerts/thresholds',
    ALERTS_RUN: '/alerts/run',
    ALERTS_STATUS: '/alerts/status',
  };
  
  // Informes
  export const REPORT_ENDPOINTS = {
    REPORT_TYPES: '/reports/types',
    GENERATE_REPORT: '/reports/generate',
    REPORT_STATUS: (reportId: string) => `/reports/status/${reportId}`,
    REPORT_DOWNLOAD: (reportId: string) => `/reports/download/${reportId}`,
    REPORT_SCHEDULE: '/reports/schedule',
    SCHEDULED_REPORTS: '/reports/scheduled',
    COMPLIANCE_REPORTS: '/reports/compliance',
  };
  
  // Auditoría
  export const AUDIT_ENDPOINTS = {
    AUDIT_LOGS: '/audit-logs',
    AUDIT_LOG_DETAIL: (id: string) => `/audit-logs/${id}`,
    AUDIT_LOGS_EXPORT: '/audit-logs/export',
    USER_ACTIVITY: (userId: string) => `/audit-logs/users/${userId}`,
    DOCUMENT_ACTIVITY: (documentId: string) => `/audit-logs/documents/${documentId}`,
    SECURITY_EVENTS: '/audit-logs/security',
  };
  
  // Configuración del sistema
  export const SYSTEM_ENDPOINTS = {
    SYSTEM_CONFIG: '/system/config',
    SYSTEM_STATUS: '/system/status',
    CLEAR_CACHE: '/system/cache/clear',
    BACKUP_CONFIG: '/system/config/backup',
    RESTORE_CONFIG: '/system/config/restore',
  };