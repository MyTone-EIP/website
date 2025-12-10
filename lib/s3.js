import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configuration du client S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-central-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const APK_KEY = 'mytone-app-release.apk'; // Nom du fichier dans S3

// Upload APK vers S3
export async function uploadApkToS3(fileBuffer, fileName = APK_KEY) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: 'application/vnd.android.package-archive',
    });

    await s3Client.send(command);
    return { success: true, fileName };
  } catch (error) {
    console.error('Erreur upload S3:', error);
    throw new Error(`Échec de l'upload vers S3: ${error.message}`);
  }
}

// Obtenir l'URL de téléchargement de l'APK
export async function getApkDownloadUrl() {
  try {
    // Génère une URL signée valide pendant 1 heure
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: APK_KEY,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error('Erreur récupération URL S3:', error);
    throw new Error('Échec de la génération de l\'URL de téléchargement');
  }
}

// Obtenir l'URL publique (si ACL public-read est défini)
export function getPublicApkUrl() {
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${APK_KEY}`;
}
