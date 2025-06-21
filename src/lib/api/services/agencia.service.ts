import axiosInstance from '../axios-instance';
import axios from 'axios';

// Interfaces para las respuestas de la API
export interface ChatSession {
  object_key: string;
  agent_id: string;
  document_type: string;
  created_at: string;
  bucket_name: string;
  status: string;
  total_messages: number;
  user_id: string;
  agent_alias_id: string;
  request_id: string;
  session_id: string;
  document_version: number;
  document_id: string;
  file_name: string;
  processing_method: string;
  last_message: {
    content: string;
    timestamp: string;
    message_type: string;
  };
  duration_minutes: number;
}

export interface ChatSessionsResponse {
  user_id: string;
  sessions: ChatSession[];
  total_sessions: number;
  limit: number;
  offset: number;
  status_filter: string;
}

export interface ValidateSessionResponse {
  sessions_exist: boolean;
  total_sessions: number;
  sessions: ChatSession[];
  message: string;
}

export interface ChatAutoRequest {
  session_id?: string;
  document_id: string;
  message: string;
}

export interface ChatAutoResponse {
  session_id: string;
  response?: string;
  message?: string;
  timestamp?: string;
  processing_method?: string;
  document_info?: {
    document_id: string;
    file_name: string;
    document_type: string;
    version: number;
    bucket: string;
    key: string;
  };
  message_ids?: {
    user_message: string;
    agent_response: string;
  };
}

export interface ChatAutoRequestNewSession {
  session_id: string;
  document_id: string;
  message: string;
}

export interface ChatAutoResponseNewSession {
  session_id: string;
  message: string;
  response: string;
  processing_method: string;
  document_info: {
    document_id: string;
    file_name: string;
    document_type: string;
    version: number;
    bucket: string;
    key: string;
  };
  message_ids: {
    user_message: string;
    agent_response: string;
  };
}

export interface SessionHistoryResponse {
  session_id: string;
  messages: Array<{
    content: string;
    timestamp: string;
    message_type: 'user' | 'assistant';
  }>;
  total_messages: number;
}

// Configuración para el endpoint de agencia
const agenciaAxiosInstance = axiosInstance.create({
  baseURL: 'https://8iotue2p03.execute-api.us-east-1.amazonaws.com/dev',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token Bearer automáticamente
agenciaAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('session_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas para manejar errores de autenticación
agenciaAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 (No autorizado)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const response = await axios.post(`${agenciaAxiosInstance.defaults.baseURL}/auth/refresh-token`, {
            refresh_token: refreshToken
          });

          const { session_token } = response.data;
          localStorage.setItem('session_token', session_token);

          // Actualizar el token en el header y reintentar la petición
          originalRequest.headers.Authorization = `Bearer ${session_token}`;
          return agenciaAxiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
       
        // Si falla el refresh, redirigir al login
        localStorage.removeItem('session_token');
        localStorage.removeItem('refresh_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export const agenciaService = {
  /**
   * Obtiene las sesiones de chat del usuario
   */
  getChatSessions: async (): Promise<ChatSessionsResponse> => {
    try {
      const response = await agenciaAxiosInstance.get('/chat/sessions');
      return response.data;
    } catch (error) {
      console.error('Error al obtener sesiones de chat:', error);
      throw error;
    }
  },

  /**
   * Valida si existen sesiones para un documento específico
   */
  validateSession: async (documentId: string): Promise<ValidateSessionResponse> => {
    try {
      const response = await agenciaAxiosInstance.get(`/chat/validate-session?document_id=${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error al validar sesión:', error);
      throw error;
    }
  },

  /**
   * Envía un mensaje al chat automático
   * Si session_id está vacío o no se proporciona, crea una nueva sesión
   */
  sendChatMessage: async (request: ChatAutoRequest): Promise<ChatAutoResponse | ChatAutoResponseNewSession> => {
    try {
      const response = await agenciaAxiosInstance.post('/chat/auto', request);
      return response.data;
    } catch (error) {
      console.error('Error al enviar mensaje de chat:', error);
      throw error;
    }
  },

  /**
   * Crea una nueva sesión de chat
   */
  createNewChatSession: async (documentId: string, message: string): Promise<ChatAutoResponseNewSession> => {
    try {
      const request: ChatAutoRequestNewSession = {
        session_id: '',
        document_id: documentId,
        message: message
      };
      const response = await agenciaAxiosInstance.post('/chat/auto', request);
      return response.data;
    } catch (error) {
      console.error('Error al crear nueva sesión de chat:', error);
      throw error;
    }
  },

  /**
   * Continúa una sesión de chat existente
   */
  continueChatSession: async (sessionId: string, documentId: string, message: string): Promise<ChatAutoResponse> => {
    try {
      const request: ChatAutoRequest = {
        session_id: sessionId,
        document_id: documentId,
        message: message
      };
      const response = await agenciaAxiosInstance.post('/chat/auto', request);
      return response.data;
    } catch (error) {
      console.error('Error al continuar sesión de chat:', error);
      throw error;
    }
  },

  /**
   * Elimina una sesión de chat
   */
  deleteChatSession: async (sessionId: string): Promise<void> => {
    try {
      await agenciaAxiosInstance.delete(`/chat/${sessionId}/delete`);
    } catch (error) {
      console.error('Error al eliminar sesión de chat:', error);
      throw error;
    }
  },

  /**
   * Obtiene el historial de una sesión de chat específica
   */
  getSessionHistory: async (sessionId: string): Promise<SessionHistoryResponse> => {
    try {
      const response = await agenciaAxiosInstance.get(`/chat/${sessionId}/history`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial de sesión:', error);
      throw error;
    }
  },
}; 