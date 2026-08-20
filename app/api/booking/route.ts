import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendEmail, sendAdminNotification } from '@/lib/email';
import {
  isValidEmail,
  isValidPhone,
  normalizeText,
} from '@/lib/validators';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_LENGTHS = {
  service: 100,
  package: 100,
  date: 50,
  time: 50,
  photographer: 100,
  name: 120,
  email: 254,
  phone: 40,
  notes: 2000,
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
      return errorResponse('Invalid booking request.');
    }

    const payload = body as Record<string, unknown>;

    const service = limit(
      normalizeText(payload.service),
      MAX_LENGTHS.service
    );

    const packageName = limit(
      normalizeText(payload.package),
      MAX_LENGTHS.package
    );

    const date = limit(
      normalizeText(payload.date),
      MAX_LENGTHS.date
    );

    const time = limit(
      normalizeText(payload.time),
      MAX_LENGTHS.time
    );

    const photographer = limit(
      normalizeText(payload.photographer),
      MAX_LENGTHS.photographer
    );

    const name = limit(
      normalizeText(payload.name),
      MAX_LENGTHS.name
    );

    const email = limit(
      normalizeText(payload.email).toLowerCase(),
      MAX_LENGTHS.email
    );

    const phone = limit(
      normalizeText(payload.phone),
      MAX_LENGTHS.phone
    );

    const notes = limit(
      normalizeText(payload.notes),
      MAX_LENGTHS.notes
    );

    if (!service) {
      return errorResponse('Please select a service.');
    }

    if (!packageName) {
      return errorResponse('Please select a package.');
    }

    if (!date) {
      return errorResponse('Please select a booking date.');
    }

    if (!time) {
      return errorResponse('Please select a time slot.');
    }

    if (!photographer) {
      return errorResponse('Please choose a photographer.');
    }

    if (name.length < 2) {
      return errorResponse('Please enter your full name.');
    }

    if (!isValidEmail(email)) {
      return errorResponse('Please enter a valid email address.');
    }

    if (!isValidPhone(phone)) {
      return errorResponse('Please enter a valid phone number.');
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        service,
        package: packageName,
        date,
        time,
        photographer,
        name,
        email,
        phone,
        notes: notes || null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Booking database error:', error);

      return errorResponse(
        'Unable to submit your booking right now. Please try again later.',
        500
      );
    }

    try {
      await sendAdminNotification({
        subject: `New booking: ${service} - ${name}`,
        text: [
          `New booking received from ${name} (${email}).`,
          `Service: ${service}`,
          `Package: ${packageName}`,
          `Date: ${date}`,
          `Time: ${time}`,
          `Photographer: ${photographer}`,
          `Phone: ${phone}`,
        ].join('\n'),
      });

      await sendEmail({
        to: email,
        subject: 'Booking received — First Look Studio',
        text: `Thanks ${name}, we received your booking for ${service} on ${date} at ${time}. We'll contact you to confirm.`,
      });
    } catch (notificationError) {
      // Booking has already been saved successfully.
      // Email failure must not make the booking appear unsuccessful.
      console.error(
        'Booking notification error:',
        notificationError
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'Booking request submitted successfully. We will contact you to confirm your session.',
        data: {
          id: data.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking submission exception:', error);

    return errorResponse(
      'Unable to submit your booking right now. Please try again later.',
      500
    );
  }
}
