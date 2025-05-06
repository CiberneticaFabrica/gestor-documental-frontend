export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
    name: string;
    email: string;
  }
  
  export interface UserProfile {
    id: string;
    username: string;
    email: string;
    name: string;
    lastName: string;
    role: string;
    permissions: string[];
    groups: string[];
    isActive: boolean;
    lastLogin?: string;
    hasTwoFactorEnabled: boolean;
  }
  
  export interface RefreshTokenRequest {
    refreshToken: string;
  }
  
  export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string;
  }
  
  export interface ResetPasswordRequest {
    email: string;
  }
  
  export interface ResetPasswordConfirmRequest {
    token: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface TwoFactorSetupResponse {
    qrCodeUrl: string;
    secretKey: string;
  }
  
  export interface TwoFactorVerifyRequest {
    code: string;
  }