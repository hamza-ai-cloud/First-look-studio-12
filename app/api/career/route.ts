import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { isValidEmail, normalizeText } from '@/lib/validators';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const name = normalizeText(body.name);
    const email = normalizeText(body.email).toLowerCase();
    const position = normalizeText(body.position);
    const portfolio = normalizeText(body.portfolio);
    const message = normalizeText(body.message);

    if (name.length < 2) {
      return NextResponse.json({ success: false, message: 'Please enter your full name.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!position) {
      return NextResponse.json({ success: false, message: 'Please select the position you are applying for.' }, { status: 400 });
    }

    if (message.length < 15) {
      return NextResponse.json({ success: false, message: 'Please provide a brief summary of your experience.' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    await db.collection('careers').insertOne({
      name,
      email,
      position,
      portfolio: portfolio || null,
      message,
      status: 'new',
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully. Our team will review it shortly.',
    });
  } catch (error) {
    console.error('Career submission error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to submit your application right now. Please try again later.',
      },
      { status: 500 },
    );
  }
}
