// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

// URL base de tu API
const API_URL = 'https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod/auth/login';

export async function OPTIONS() {
  // Manejar solicitudes preflight OPTIONS con una respuesta válida
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token',
      'Access-Control-Max-Age': '86400'
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('Recibida solicitud de login');
    
    // Obtener el cuerpo de la solicitud
    const body = await request.json();
    console.log('Datos recibidos:', body);

    // Enviar la solicitud a la API de AWS
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Log del estado de respuesta para depuración
    console.log('Respuesta de API Gateway:', response.status);

    // Obtener la respuesta en formato JSON o texto
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Datos de respuesta:', data);
    } else {
      const text = await response.text();
      console.log('Texto de respuesta:', text);
      data = { message: text };
    }

    // Devolver la respuesta al cliente
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Error en proxy API:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
}