import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const email = await request.json();

    const response = await fetch(
      'https://api-mytone.onrender.com/auth/forgot-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Erreur API' },
        { status: response.status }
      );
    }

    // 204 No Content
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}