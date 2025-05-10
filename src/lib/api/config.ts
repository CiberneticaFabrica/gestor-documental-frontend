export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
    profile: '/auth/profile',
    changePassword: '/auth/change-password',
    setup2FA: '/auth/setup-2fa',
    verify2FA: '/auth/verify-2fa',
    resetPassword: '/auth/reset-password',
  },
  
  // Users
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    permissions: (id: string) => `/users/${id}/permissions`,
  },
  
  // Groups
  groups: {
    list: '/groups',
    detail: (id: string) => `/groups/${id}`,
    users: (id: string) => `/groups/${id}/users`,
  },
  
  // Roles
  roles: {
    list: '/roles',
    detail: (id: string) => `/roles/${id}`,
    permissions: (id: string) => `/roles/${id}/permissions`,
  },
  
  // Documents
  documents: {
    list: '/documents',
    detail: (id: string) => `/documents/${id}`,
    versions: (id: string) => `/documents/${id}/versions`,
    history: (id: string) => `/documents/${id}/history`,
    download: (id: string) => `/documents/${id}/download`,
    preview: (id: string) => `/documents/${id}/preview`,
    search: '/documents/search',
  },
  
  // Folders
  folders: {
    list: '/folders',
    detail: (id: string) => `/folders/${id}`,
    documents: (id: string) => `/folders/${id}/documents`,
    permissions: (id: string) => `/folders/${id}/permissions`,
  },
  
  // Clients
  clients: {
    list: '/clients',
    detail: (id: string) => `/clients/${id}`,
    documents: (id: string) => `/clients/${id}/documents`,
    view: (id: string) => `/clients/${id}/view`,
    completeness: (id: string) => `/clients/${id}/completeness`,
    pending: (id: string) => `/clients/${id}/pending`,
    expiring: (id: string) => `/clients/${id}/expiring`,
  },
  
  // Reviews
  reviews: {
    pending: '/reviews/pending',
    detail: (id: string) => `/reviews/${id}`,
    stats: '/reviews/stats',
  },
  
  // Notifications
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    preferences: '/notifications/preferences',
  },
  
  // Dashboard
  dashboard: {
    metrics: '/dashboard/metrics',
  },
  
  // Reports
  reports: {
    types: '/reports/types',
    generate: '/reports/generate',
    compliance: '/reports/compliance',
  },
} as const; 