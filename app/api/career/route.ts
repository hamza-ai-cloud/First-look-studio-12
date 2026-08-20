import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isValidEmail, normalizeText } from '@/lib/validators';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_LENGTHS = {
  name: 120,
  email: 254,
  position: 120,
  portfolio: 500,
  message: 5000,
} as const;

function limit(value: string, max: number) {
  return value.slice(0, max);
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      return errorResponse('Invalid request format.', 415);
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return errorResponse('Invalid career application.');
    }

    const payload = body as Record<string, unknown>;

    const name = limit(
      normalizeText(payload.name),
      MAX_LENGTHS.name
    );

    const email = limit(
      normalizeText(payload.email).toLowerCase(),
      MAX_LENGTHS.email
    );

    const position = limit(
      normalizeText(payload.position),
      MAX_LENGTHS.position
    );

    const portfolio = limit(
      normalizeText(payload.portfolio),
      MAX_LENGTHS.portfolio
    );

    const message = limit(
      normalizeText(payload.message),
      MAX_LENGTHS.message
    );

    if (name.length < 2) {
      return errorResponse('Please enter your full name.');
    }

    if (!isValidEmail(email)) {
      return errorResponse('Please enter a valid email address.');
    }

    if (!position) {
      return errorResponse(
        'Please select the position you are applying for.'
      );
    }

    if (message.length < 15) {
      return errorResponse(
        'Please provide a brief summary of your experience.'
      );
    }

    const { data, error } = await supabaseAdmin
      .from('careers')
      .insert({
        name,
        email,
        position,
        portfolio: portfolio || null,
        message,
        status: 'new',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Career database error:', error);

      return errorResponse(
        'Unable to submit your application right now. Please try again later.',
        500
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'Application submitted successfully. Our team will review it shortly.',
        data: {
          id: data.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Career submission exception:', error);

    return errorResponse(
      'Unable to submit your application right now. Please try again later.',
      500
    );
  }
}
