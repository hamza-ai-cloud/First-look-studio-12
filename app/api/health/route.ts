import { NextResponse } from 'next/server';
import { connectToDatabase, getMongoErrorDetails } from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET() {
  const dbName = process.env.MONGODB_DB_NAME || 'firstlookstudio';

  const hasMongoEnv = Boolean(process.env.MONGODB_URI);
  const hasNextAuthSecret = Boolean(process.env.NEXTAUTH_SECRET);
  const hasNextAuthUrl = Boolean(process.env.NEXTAUTH_URL);
  const hasAdminEnv = Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);

  try {
    if (!hasMongoEnv) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });

    // Check whether at least one admin user exists (do not expose details)
    const adminCount = await db.collection('admins').countDocuments();

    return NextResponse.json({
      success: true,
      database: 'connected',
      dbName,
      adminExists: adminCount > 0,
      env: {
        hasMongoEnv,
        hasNextAuthSecret,
        hasNextAuthUrl,
        hasAdminEnv,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorDetails = getMongoErrorDetails(error);

    console.error('MongoDB health check failure:', {
      name: errorDetails.name,
      message: errorDetails.message,
      code: errorDetails.code,
      codeName: errorDetails.codeName,
      errorType: errorDetails.errorType,
    });

    return NextResponse.json(
      {
        success: false,
        database: 'disconnected',
        errorType: errorDetails.errorType,
        message: 'MongoDB connection failed.',
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

