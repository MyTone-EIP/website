import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(
      'https://api-mytone.onrender.com/auth/reset-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: body.token,
          new_password: body.password,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Erreur API' },
        { status: response.status }
      );
    }

    // API retourne 204
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
