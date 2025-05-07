import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Simulación de autenticación exitosa
    if (username === 'testuser' && password === 'password123') {
      return NextResponse.json({
        userId: '1',
        name: 'Test User',
        email: 'test@example.com',
        roles: ['user'],
        permissions: [
          'view:dashboard',
          'read:documents',
          'view:documents',
          'create:documents',
          'view:clients'
        ],
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
