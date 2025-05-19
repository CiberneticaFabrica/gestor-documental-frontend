import axios from 'axios';
import { API_CONFIG } from './config';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
  withCredentials: false,
});

// Interceptor de solicitudes
axiosInstance.interceptors.request.use(
  async (config) => {
    // Verificar si hay conexión a internet
    if (!navigator.onLine) {
      return Promise.reject({
        message: 'Sin conexión a internet. Por favor, verifica tu conexión.',
        code: 'OFFLINE'
      });
    }
    
    // Agregar el token si existe
    const token = localStorage.getItem('session_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es de red
    if (error.code === 'ERR_NETWORK') {
     // console.error('Network error:', error);
      return Promise.reject({
        message: 'Error de conexión. Por favor, verifica tu conexión a internet y que la API esté disponible.',
        originalError: error
      });
    }

    // Si el error es 401 (No autorizado)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Redirigir al login
      localStorage.removeItem('session_token');
      localStorage.removeItem('expires_at');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      
      return Promise.reject({
        message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        originalError: error
      });
    }

    // Para otros errores, devolver un mensaje más amigable
    const errorMessage = error.response?.data?.message || error.message || 'Ha ocurrido un error';
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      originalError: error
    });
  }
);

// Interceptor de respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es de red
    if (error.code === 'ERR_NETWORK') {
      //console.error('Network error:', error);
      return Promise.reject({
        message: 'Error de conexión. Por favor, verifica tu conexión a internet y que la API esté disponible.',
        originalError: error
      });
    }

    // Si el error es 401 (No autorizado)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
            refresh_token: refreshToken
          });

          const { session_token } = response.data;
          localStorage.setItem('session_token', session_token);

          // Actualizar el token en el header y reintentar la petición
          originalRequest.headers.Authorization = `Bearer ${session_token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
       
        // Si falla el refresh, redirigir al login
        localStorage.removeItem('session_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
      }
    }

    // Para otros errores, devolver un mensaje más amigable
    const errorMessage = error.response?.data?.message || error.message || 'Ha ocurrido un error';
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      originalError: error
    });
  }
);

export default axiosInstance; 