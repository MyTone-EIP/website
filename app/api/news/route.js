import { NextResponse } from 'next/server';
import { getAllNews, createNews } from '@/lib/db';

// GET : Récupérer toutes les news (public)
export async function GET() {
  try {
    const news = await getAllNews();
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des news' },
      { status: 500 }
    );
  }
}

// POST : Créer une news (public pour l'instant)
export async function POST(request) {
  try {
    const data = await request.json();

    // Vérifier qu'au moins le titre et la description en anglais sont fournis
    if (!data.title_en || !data.description_en) {
      return NextResponse.json(
        { error: 'Titre et description en anglais requis' },
        { status: 400 }
      );
    }

    const newsData = {
      title_en: data.title_en || '',
      description_en: data.description_en || '',
      title_fr: data.title_fr || '',
      description_fr: data.description_fr || '',
      title_es: data.title_es || '',
      description_es: data.description_es || '',
      title_it: data.title_it || '',
      description_it: data.description_it || '',
      title_de: data.title_de || '',
      description_de: data.description_de || '',
      title_zh: data.title_zh || '',
      description_zh: data.description_zh || ''
    };

    const news = await createNews(newsData);

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la news' },
      { status: 500 }
    );
  }
}
