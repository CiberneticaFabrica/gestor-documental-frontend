import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Aquí iría la lógica de autenticación real
    // Por ahora, simulamos una autenticación exitosa
    if (username === 'testuser' && password === 'password123') {
      return NextResponse.json({
        user: {
          id: '1',
          name: 'Usuario Test',
          email: 'test@example.com',
          roles: ['user'],
          permissions: ['read:documents'],
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
    }

    return new NextResponse(null, { status: 401 });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
