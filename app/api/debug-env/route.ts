import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env_check: {
      GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME ? 'SET' : 'MISSING',
      GCS_PROJECT_ID: process.env.GCS_PROJECT_ID ? 'SET' : 'MISSING',
      GCS_CLIENT_EMAIL: process.env.GCS_CLIENT_EMAIL ? 'SET' : 'MISSING',
      GCS_PRIVATE_KEY: process.env.GCS_PRIVATE_KEY ? 'SET (length: ' + process.env.GCS_PRIVATE_KEY.length + ')' : 'MISSING',
    },
    all_env_keys: Object.keys(process.env).filter(key => key.startsWith('GCS')),
  });
}
