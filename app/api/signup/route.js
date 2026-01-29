import { NextResponse } from 'next/server';
// import { sql } from '@/lib/db';
// import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, surname, email, username, password } = await request.json();

    // Validation des champs
    if (!name || !surname || !email || !username || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    const userData = {
      name,
      surname,
      email,
      username,
      password,
      phone_number: null,
      type_client: 0,
    };

    // Call FastAPI
    const res = await fetch("https://api-mytone.onrender.com/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if(!res.ok) {
      let errorMessage = "Erreur lors de l'inscription";
      try {
        const result = await res.json();
        
        // Gérer différents formats d'erreur du backend
        if (result.detail) {
          if (Array.isArray(result.detail)) {
            errorMessage = result.detail[0]?.msg || result.detail[0] || "Erreur";
          } else if (typeof result.detail === 'string') {
            errorMessage = result.detail;
          }
        } else if (result.error) {
          errorMessage = result.error;
        }
      } catch (e) {
        // Si le parsing JSON échoue, utiliser un message générique
        console.error("Erreur lors du parsing de la réponse:", e);
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: res.status }
      );
    }

    const result = await res.json()

    // Retourner la réponse du backend
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
