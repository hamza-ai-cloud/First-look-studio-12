import { NextResponse } from 'next/server';
import { connectToDatabase, getMongoErrorDetails } from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET() {
  const dbName = process.env.MONGODB_DB_NAME || 'firstlookstudio';

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });

    return NextResponse.json({
      success: true,
      database: 'connected',
      dbName,
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
