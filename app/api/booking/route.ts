import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendEmail, sendAdminNotification } from '@/lib/email';
import { isValidEmail, isValidPhone, normalizeText } from '@/lib/validators';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const service = normalizeText(body.service);
    const packageName = normalizeText(body.package);
    const date = normalizeText(body.date);
    const time = normalizeText(body.time);
    const photographer = normalizeText(body.photographer);
    const name = normalizeText(body.name);
    const email = normalizeText(body.email).toLowerCase();
    const phone = normalizeText(body.phone);
    const notes = normalizeText(body.notes);

    if (!service) {
      return NextResponse.json({ success: false, message: 'Please select a service.' }, { status: 400 });
    }

    if (!packageName) {
      return NextResponse.json({ success: false, message: 'Please select a package.' }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ success: false, message: 'Please select a booking date.' }, { status: 400 });
    }

    if (!time) {
      return NextResponse.json({ success: false, message: 'Please select a time slot.' }, { status: 400 });
    }

    if (!photographer) {
      return NextResponse.json({ success: false, message: 'Please choose a photographer.' }, { status: 400 });
    }

    if (name.length < 2) {
      return NextResponse.json({ success: false, message: 'Please enter your full name.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ success: false, message: 'Please enter a valid phone number.' }, { status: 400 });
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
    notes,
    status: 'pending',
  })
  .select('id')
  .single();

if (error) {
  throw error;
}

    // Send notifications (safe no-op if email not configured)
    try {
      await sendAdminNotification({
        subject: `New booking: ${service} - ${name}`,
        text: `New booking received from ${name} (${email}). Service: ${service} on ${date} ${time}. Phone: ${phone}`,
      });

      // Customer confirmation (optional)
      await sendEmail({
        to: email,
        subject: 'Booking received — First Look Studio',
        text: `Thanks ${name}, we received your booking for ${service} on ${date} at ${time}. We'll contact you to confirm.`,
      });
    } catch (err) {
      console.error('Notification error:', err);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Booking request submitted successfully. We will contact you to confirm your session.',
        data: {
          id: data.id,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Booking submission error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to submit your booking right now. Please try again later.',
      },
      { status: 500 },
    );
  }
}
