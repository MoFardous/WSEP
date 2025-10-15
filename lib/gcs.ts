import { Storage } from '@google-cloud/storage';

// Lazy initialization - only create storage client when first needed
let storage: Storage | null = null;
let bucket: any = null;
let initialized = false;

function initializeGCS() {
  if (initialized) {
    return;
  }

  const bucketName = process.env.GCS_BUCKET_NAME;
  const projectId = process.env.GCS_PROJECT_ID;
  const clientEmail = process.env.GCS_CLIENT_EMAIL;
  const privateKey = process.env.GCS_PRIVATE_KEY;

  console.log('🔧 Initializing GCS with:', {
    bucketName: bucketName ? '✓' : '✗',
    projectId: projectId ? '✓' : '✗',
    clientEmail: clientEmail ? '✓' : '✗',
    privateKey: privateKey ? '✓' : '✗',
  });

  if (!bucketName || !projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Google Cloud Storage is not configured. Please set GCS_BUCKET_NAME, GCS_PROJECT_ID, GCS_CLIENT_EMAIL, and GCS_PRIVATE_KEY environment variables.'
    );
  }

  storage = new Storage({
    projectId: projectId,
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
  });

  bucket = storage.bucket(bucketName);
  initialized = true;
  console.log('✅ GCS initialized successfully for bucket:', bucketName);
}

function getBucket() {
  initializeGCS();
  return bucket!;
}

/**
 * Upload a file to Google Cloud Storage
 * @param fileBuffer - File buffer to upload
 * @param filename - Destination filename in GCS
 * @returns Public URL of uploaded file
 */
export async function uploadFile(fileBuffer: Buffer, filename: string): Promise<string> {
  const currentBucket = getBucket();
  const blob = currentBucket.file(filename);

  await blob.save(fileBuffer, {
    resumable: false,
    metadata: {
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });

  // Make file publicly readable
  await blob.makePublic();

  return `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${filename}`;
}

/**
 * Download a file from Google Cloud Storage
 * @param filename - File to download
 * @returns File buffer
 */
export async function downloadFile(filename: string): Promise<Buffer> {
  const currentBucket = getBucket();
  const file = currentBucket.file(filename);
  const [contents] = await file.download();
  return contents;
}

/**
 * List all files in bucket
 * @returns List of files with metadata
 */
export async function listFiles() {
  const currentBucket = getBucket();
  const [files] = await currentBucket.getFiles();
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
  const currentBucket = getBucket();
  await currentBucket.file(filename).delete();
}

/**
 * Check if a file exists in Google Cloud Storage
 * @param filename - File to check
 * @returns True if file exists
 */
export async function fileExists(filename: string): Promise<boolean> {
  const currentBucket = getBucket();
  const file = currentBucket.file(filename);
  const [exists] = await file.exists();
  return exists;
}
