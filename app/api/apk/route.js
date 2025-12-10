import { NextResponse } from 'next/server';
import { uploadApkToS3 } from '@/lib/s3';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé - Session invalide' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    if (!file.name.endsWith('.apk')) {
      return NextResponse.json({ error: 'Le fichier doit être un APK' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadApkToS3(buffer, 'mytone-app-release.apk');

    return NextResponse.json({ 
      success: true, 
      message: 'APK uploadé avec succès',
      fileName: result.fileName 
    });

  } catch (error) {
    console.error('Erreur upload APK:', error);
    return NextResponse.json({ 
      error: error.message || 'Erreur lors de l\'upload' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { getApkDownloadUrl } = await import('@/lib/s3');
    const url = await getApkDownloadUrl();
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Erreur récupération URL:', error);
    return NextResponse.json({ 
      error: 'APK non disponible' 
    }, { status: 404 });
  }
}
