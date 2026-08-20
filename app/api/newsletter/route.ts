import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { normalizeText, isValidEmail } from '@/lib/validators';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_EMAIL_LENGTH = 254;

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
      return errorResponse('Invalid newsletter request.');
    }

    const payload = body as Record<string, unknown>;

    const email = normalizeText(payload.email)
      .toLowerCase()
      .slice(0, MAX_EMAIL_LENGTH);

    if (!isValidEmail(email)) {
      return errorResponse(
        'Please enter a valid email address.'
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from('newsletter_subscribers')
        .select('id, status')
        .eq('email', email)
        .maybeSingle();

    if (existingError) {
      console.error(
        'Newsletter lookup error:',
        existingError
      );

      return errorResponse(
        'Unable to process your subscription right now. Please try again later.',
        500
      );
    }

    if (existing) {
      // If previously unsubscribed, reactivate the subscription.
      if (existing.status !== 'active') {
        const { error: reactivateError } =
          await supabaseAdmin
            .from('newsletter_subscribers')
            .update({
              status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

        if (reactivateError) {
          console.error(
            'Newsletter reactivation error:',
            reactivateError
          );

          return errorResponse(
            'Unable to reactivate your subscription right now.',
            500
          );
        }

        return NextResponse.json({
          success: true,
          message:
            'Your newsletter subscription has been reactivated. Welcome back to the First Look family.',
        });
      }

      return NextResponse.json({
        success: true,
        message:
          'You are already subscribed to our newsletter.',
      });
    }

    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert({
        email,
        status: 'active',
      })
      .select('id')
      .single();

    if (error) {
      console.error(
        'Newsletter database error:',
        error
      );

      // Unique constraint race-condition protection.
      if (error.code === '23505') {
        return NextResponse.json({
          success: true,
          message:
            'You are already subscribed to our newsletter.',
        });
      }

      return errorResponse(
        'Unable to subscribe right now. Please try again later.',
        500
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'Subscribed successfully. Welcome to the First Look family.',
        data: {
          id: data.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      'Newsletter submission exception:',
      error
    );

    return errorResponse(
      'Unable to subscribe right now. Please try again later.',
      500
    );
  }
}
