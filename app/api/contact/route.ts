import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendEmail, sendAdminNotification } from '@/lib/email';
import { isValidEmail, normalizeText } from '@/lib/validators';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const name = normalizeText(body.name);
    const email = normalizeText(body.email).toLowerCase();
    const subject = normalizeText(body.subject);
    const message = normalizeText(body.message);

    if (name.length < 2) {
      return NextResponse.json(
        { success: false, message: 'Please enter your full name.' },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 },
      );
    }

    if (subject.length < 3) {
      return NextResponse.json(
        { success: false, message: 'Please provide a subject.' },
        { status: 400 },
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Please include a more detailed message.' },
        { status: 400 },
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
  throw error;
}

    try {
      await sendAdminNotification({
        subject: `New contact: ${subject} — ${name}`,
        text: `New contact message from ${name} (${email}): ${message}`,
      });

      await sendEmail({
        to: email,
        subject: 'Thanks for contacting First Look Studio',
        text: `Hi ${name},\n\nThanks for your message. We'll get back to you within 24 hours.\n\n— First Look Studio`,
      });
    } catch (err) {
      console.error('Contact notification error:', err);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message submitted successfully. We will get back to you within 24 hours.',
        data: {
          id: data.id,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Contact submission error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to submit your message right now. Please try again later.',
      },
      { status: 500 },
    );
  }
}
