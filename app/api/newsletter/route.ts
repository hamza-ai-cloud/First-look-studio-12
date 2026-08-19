import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { normalizeText, isValidEmail } from '@/lib/validators';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const email = normalizeText(body.email).toLowerCase();

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 });
    }

    const { data: existing, error: existingError } = await supabaseAdmin
  .from('newsletter_subscribers')
  .select('id')
  .eq('email', email)
  .maybeSingle();

if (existingError) {
  throw existingError;
}

if (existing) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to our newsletter.',
      });
    }

    const { error } = await supabaseAdmin
  .from('newsletter_subscribers')
  .insert({
    email,
    status: 'active',
  });

if (error) {
  throw error;
}

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
