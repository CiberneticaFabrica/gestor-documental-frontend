import axiosInstance from './axios-instance';
import { API_ENDPOINTS } from './config';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class BaseService {
  protected endpoints = API_ENDPOINTS;

  protected async get<T>(url: string, params?: any): Promise<T> {
    try {
      const response = await axiosInstance.get<T>(url, { params });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await axiosInstance.post<T>(url, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await axiosInstance.put<T>(url, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async delete<T>(url: string): Promise<T> {
    try {
      const response = await axiosInstance.delete<T>(url);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async patch<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await axiosInstance.patch<T>(url, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected buildQueryString(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(`${key}[]`, item));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  protected handleError(error: any): never {
    console.error('API Error:', error);
    
    // Si el error ya fue procesado por el interceptor
    if (error.message && error.originalError) {
      throw error;
    }

    // Si es un error de red
    if (error.code === 'ERR_NETWORK') {
      throw {
        message: 'Error de conexión. Por favor, verifica tu conexión a internet y que la API esté disponible.',
        originalError: error
      };
    }

    // Para otros errores
    throw {
      message: error.response?.data?.message || error.message || 'Ha ocurrido un error',
      status: error.response?.status,
      originalError: error
    };
  }
} 