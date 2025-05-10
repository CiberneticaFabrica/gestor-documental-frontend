import { BaseService } from '../base-service';

export interface Role {
  id_rol: string;
  nombre_rol: string;
}

export interface User {
  id: string;
  username: string;
  nombre: string;
  apellidos: string;
  email: string;
  roles: Role[];
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  message: string;
  session_token: string;
  expires_at: string;
  user: User;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export class AuthService extends BaseService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.post<AuthResponse>(this.endpoints.auth.login, credentials);
      localStorage.setItem('session_token', response.session_token);
      if (credentials.rememberMe) {
        localStorage.setItem('expires_at', response.expires_at);
      }
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.post(this.endpoints.auth.logout);
      localStorage.removeItem('session_token');
      localStorage.removeItem('expires_at');
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getProfile(): Promise<User> {
    try {
      return await this.get<User>(this.endpoints.auth.profile);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      return await this.put<User>(this.endpoints.auth.profile, userData);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await this.post(this.endpoints.auth.changePassword, {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      await this.post(this.endpoints.auth.resetPassword, { email });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    try {
      await this.post(`${this.endpoints.auth.resetPassword}/confirm`, {
        token,
        newPassword,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async setup2FA(): Promise<{ secret: string; qrCode: string }> {
    try {
      return await this.post(this.endpoints.auth.setup2FA);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async verify2FA(code: string): Promise<void> {
    try {
      await this.post(this.endpoints.auth.verify2FA, { code });
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const authService = new AuthService(); 