import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

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

    // Vérifier si l'email existe déjà
    const existingEmail = await sql`
      SELECT id FROM "USERS" WHERE email = ${email} LIMIT 1
    `;

    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Vérifier si le username existe déjà
    const existingUsername = await sql`
      SELECT id FROM "USERS" WHERE username = ${username} LIMIT 1
    `;

    if (existingUsername.length > 0) {
      return NextResponse.json(
        { error: 'Ce nom d\'utilisateur est déjà pris' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const result = await sql`
      INSERT INTO "USERS" (
        name, 
        surname, 
        email, 
        username, 
        password, 
        created_at, 
        phone_number, 
        subscription_status, 
        start_date_premium
      )
      VALUES (
        ${name},
        ${surname},
        ${email},
        ${username},
        ${hashedPassword},
        NOW(),
        NULL,
        NULL,
        NULL
      )
      RETURNING id, name, surname, email, username, created_at
    `;

    return NextResponse.json(
      { 
        message: 'Compte créé avec succès',
        user: result[0]
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
