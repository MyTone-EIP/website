import { neon } from '@neondatabase/serverless';

// Login to Neon
export const sql = neon(process.env.DATABASE_URL);

// Function to retrieve user by email or username (for normal users)
export async function getUserByEmailOrUsername(identifier) {
  const result = await sql`
    SELECT id, name, surname, email, username, password, created_at, 'user' as role 
    FROM "USERS" 
    WHERE email = ${identifier} OR username = ${identifier}
    LIMIT 1
  `;
  return result[0];
}

// Function to retrieve an admin by username (table ADMIN)
export async function getAdminByUsername(username) {
  const result = await sql`
    SELECT id, username, password, 'admin' as role
    FROM "ADMIN" 
    WHERE username = ${username} 
    LIMIT 1
  `;
  return result[0];
}

// Function to retrieve all news
export async function getAllNews() {
  const result = await sql`
    SELECT * FROM "NEWS" ORDER BY created_at DESC
  `;
  return result;
}

// Function to create a news entry
export async function createNews(newsData) {
  const result = await sql`
    INSERT INTO "NEWS" (
      news_title_en, news_description_en,
      news_title_fr, news_description_fr,
      news_title_es, news_description_es,
      news_title_it, news_description_it,
      news_title_de, news_description_de,
      news_title_zh, news_description_zh,
      created_at
    )
    VALUES (
      ${newsData.title_en}, ${newsData.description_en},
      ${newsData.title_fr}, ${newsData.description_fr},
      ${newsData.title_es}, ${newsData.description_es},
      ${newsData.title_it}, ${newsData.description_it},
      ${newsData.title_de}, ${newsData.description_de},
      ${newsData.title_zh}, ${newsData.description_zh},
      NOW()
    )
    RETURNING *
  `;
  return result[0];
}

