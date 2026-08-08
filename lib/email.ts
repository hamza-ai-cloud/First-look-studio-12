import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;
const sender = process.env.SENDER_EMAIL;

if (apiKey) {
  sgMail.setApiKey(apiKey);
}

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string }) {
  if (!apiKey || !sender) {
    // Email not configured; skip sending silently.
    console.warn('SendGrid not configured - skipping email send');
    return;
  }

  const msg = {
    to,
    from: sender,
    subject,
    text: text ?? html ?? '',
    html: html ?? text ?? '',
  } as any;

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('sendEmail error:', error);
  }
}

export async function sendAdminNotification({ subject, text, html }: { subject: string; text?: string; html?: string }) {
  const admin = process.env.ADMIN_EMAIL;
  if (!admin) return;
  await sendEmail({ to: admin, subject, text, html });
}
