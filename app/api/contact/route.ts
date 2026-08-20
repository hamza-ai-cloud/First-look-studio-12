import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendEmail, sendAdminNotification } from '@/lib/email';
import { isValidEmail, normalizeText } from '@/lib/validators';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_LENGTHS = {
  name: 120,
  email: 254,
  subject: 200,
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
      return errorResponse('Invalid contact request.');
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

    const subject = limit(
      normalizeText(payload.subject),
      MAX_LENGTHS.subject
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

    if (subject.length < 3) {
      return errorResponse('Please provide a subject.');
    }

    if (message.length < 10) {
      return errorResponse(
        'Please include a more detailed message.'
      );
    }

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .insert({
        name,
        email,
        subject,
        message,
        status: 'new',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Contact database error:', error);

      return errorResponse(
        'Unable to submit your message right now. Please try again later.',
        500
      );
    }

    try {
      await sendAdminNotification({
        subject: `New contact: ${subject} — ${name}`,
        text: [
          `New contact message from ${name} (${email}).`,
          `Subject: ${subject}`,
          '',
          message,
        ].join('\n'),
      });

      await sendEmail({
        to: email,
        subject: 'Thanks for contacting First Look Studio',
        text: [
          `Hi ${name},`,
          '',
          'Thanks for your message. We will get back to you within 24 hours.',
          '',
          '— First Look Studio',
        ].join('\n'),
      });
    } catch (notificationError) {
      // The contact message is already saved.
      // Email failure must not make the submission fail.
      console.error(
        'Contact notification error:',
        notificationError
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'Message submitted successfully. We will get back to you within 24 hours.',
        data: {
          id: data.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact submission exception:', error);

    return errorResponse(
      'Unable to submit your message right now. Please try again later.',
      500
    );
  }
}
