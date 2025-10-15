import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage only if credentials are available
const bucketName = process.env.GCS_BUCKET_NAME;
let storage: Storage | null = null;
let bucket: any = null;

// Only initialize if all required env vars are present
if (
  bucketName &&
  process.env.GCS_PROJECT_ID &&
  process.env.GCS_CLIENT_EMAIL &&
  process.env.GCS_PRIVATE_KEY
) {
  storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    credentials: {
      client_email: process.env.GCS_CLIENT_EMAIL,
      private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
  });
  bucket = storage.bucket(bucketName);
}

function checkGCSConfigured(): void {
  if (!storage || !bucket) {
    throw new Error(
      'Google Cloud Storage is not configured. Please set GCS_BUCKET_NAME, GCS_PROJECT_ID, GCS_CLIENT_EMAIL, and GCS_PRIVATE_KEY environment variables.'
    );
  }
}

/**
 * Upload a file to Google Cloud Storage
 * @param fileBuffer - File buffer to upload
 * @param filename - Destination filename in GCS
 * @returns Public URL of uploaded file
 */
export async function uploadFile(fileBuffer: Buffer, filename: string): Promise<string> {
  checkGCSConfigured();
  const blob = bucket!.file(filename);

  await blob.save(fileBuffer, {
    resumable: false,
    metadata: {
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });

  // Make file publicly readable
  await blob.makePublic();

  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

/**
 * Download a file from Google Cloud Storage
 * @param filename - File to download
 * @returns File buffer
 */
export async function downloadFile(filename: string): Promise<Buffer> {
  checkGCSConfigured();
  const file = bucket!.file(filename);
  const [contents] = await file.download();
  return contents;
}

/**
 * List all files in bucket
 * @returns List of files with metadata
 */
export async function listFiles() {
  checkGCSConfigured();
  const [files] = await bucket!.getFiles();
  return files.map((file: any) => ({
    name: file.name,
    size: file.metadata.size,
    updated: file.metadata.updated,
  }));
}

/**
 * Delete a file from Google Cloud Storage
 * @param filename - File to delete
 */
export async function deleteFile(filename: string): Promise<void> {
  checkGCSConfigured();
  await bucket!.file(filename).delete();
}

/**
 * Check if a file exists in Google Cloud Storage
 * @param filename - File to check
 * @returns True if file exists
 */
export async function fileExists(filename: string): Promise<boolean> {
  checkGCSConfigured();
  const file = bucket!.file(filename);
  const [exists] = await file.exists();
  return exists;
}
