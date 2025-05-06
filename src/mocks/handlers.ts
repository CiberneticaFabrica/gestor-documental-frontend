import { http, HttpResponse } from 'msw';

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'Usuario Test',
    email: 'test@example.com',
    username: 'testuser',
    roles: ['user'],
    permissions: ['read:documents'],
    twoFactorEnabled: false,
  },
];

const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

export const handlers = [
  // Login
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    
    if (
      body &&
      typeof body === 'object' &&
      'username' in body &&
      'password' in body &&
      body.username === 'testuser' &&
      body.password === 'password123'
    ) {
      return HttpResponse.json({
        userId: mockUsers[0].id,
        name: mockUsers[0].name,
        email: mockUsers[0].email,
        roles: mockUsers[0].roles,
        permissions: mockUsers[0].permissions,
        twoFactorEnabled: mockUsers[0].twoFactorEnabled,
        ...mockTokens,
      });
    }

    return new HttpResponse(null, { status: 401 });
  }),

  // Register
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json();
    
    // Simular validación de email único
    if (
      body &&
      typeof body === 'object' &&
      'email' in body &&
      typeof body.email === 'string' &&
      mockUsers.some(user => user.email === body.email)
    ) {
      return new HttpResponse(null, { 
        status: 400,
        statusText: 'Email ya registrado'
      });
    }

    return HttpResponse.json({
      message: 'Usuario registrado exitosamente'
    });
  }),

  // Reset Password Request
  http.post('/api/auth/reset-password', async ({ request }) => {
    const body = await request.json();
    
    if (
      body &&
      typeof body === 'object' &&
      'email' in body &&
      typeof body.email === 'string' &&
      mockUsers.some(user => user.email === body.email)
    ) {
      return new HttpResponse(null, { 
        status: 200,
        statusText: 'Instrucciones enviadas al correo'
      });
    }
  }),

  // Change Password
  http.post('/api/users/change-password', async ({ request }) => {
    const body = await request.json();
    
    if (
      body &&
      typeof body === 'object' &&
      'currentPassword' in body &&
      typeof body.currentPassword === 'string' &&
      body.currentPassword === 'password123'
    ) {
      return HttpResponse.json({
        message: 'Contraseña actualizada exitosamente'
      });
    }

    return new HttpResponse(null, { 
      status: 400,
      statusText: 'Contraseña actual incorrecta'
    });
  }),

  // Refresh Token
  http.post('/api/auth/refresh-token', () => {
    return HttpResponse.json({
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token',
    });
  }),

  // Setup 2FA
  http.post('/api/auth/setup-2fa', () => {
    return HttpResponse.json({
      secret: 'MOCK2FASECRET',
      qrCode: 'data:image/png;base64,MOCK_QR_CODE',
    });
  }),

  // Verify 2FA
  http.post('/api/auth/verify-2fa', async ({ request }) => {
    const body = await request.json();
    
    if (
      body &&
      typeof body === 'object' &&
      'code' in body &&
      typeof body.code === 'string' &&
      body.code === '123456'
    ) {
      return HttpResponse.json({
        message: '2FA configurado exitosamente'
      });
    }

    return new HttpResponse(null, { 
      status: 400,
      statusText: 'Código inválido'
    });
  }),

  // Get User Profile
  http.get('/api/users/profile', () => {
    return HttpResponse.json(mockUsers[0]);
  }),

  // Update User Profile
  http.put('/api/users/profile', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      ...mockUsers[0],
      ...(body && typeof body === 'object' ? body : {}),
    });
  }),
]; 