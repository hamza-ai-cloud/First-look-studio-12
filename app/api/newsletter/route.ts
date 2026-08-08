import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { normalizeText, isValidEmail } from '@/lib/validators';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const email = normalizeText(body.email).toLowerCase();

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const existing = await db.collection('newsletter_subscribers').findOne({ email });
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to our newsletter.',
      });
    }

    await db.collection('newsletter_subscribers').insertOne({
      email,
      createdAt: new Date(),
      status: 'active',
    });

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully. Welcome to the First Look family.',
    });
  } catch (error) {
    console.error('Newsletter submission error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to subscribe right now. Please try again later.',
      },
      { status: 500 },
    );
  }
}
