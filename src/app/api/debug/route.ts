import { NextResponse } from 'next/server';

export async function GET() {
  const mongoUri = process.env.MONGODB_URI;
  return NextResponse.json({
    hasMongoUri: !!mongoUri,
    mongoUriPrefix: mongoUri ? mongoUri.substring(0, 20) + '...' : 'NOT SET',
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    nodeEnv: process.env.NODE_ENV,
  });
}
