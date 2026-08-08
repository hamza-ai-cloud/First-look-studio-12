const { test } = require('@playwright/test');
const fs = require('fs');

const baseUrl = 'https://first-look-studio-12.vercel.app';
const runId = `e2e-${Date.now()}`;
const outPath = `/tmp/live-forms-${runId}.json`;

function stamp(label) {
  return `${label}-${runId}`;
}

test('submit live forms and capture api responses', async ({ page, request }) => {
  const payloads = {
    contact: {
      name: 'E2E Contact Tester',
      email: `${stamp('contact')}@example.com`,
      subject: `Contact Test ${runId}`,
      message: `Real UI submission test ${runId} for contact form validation.`,
    },
    career: {
      name: 'E2E Career Tester',
      email: `${stamp('career')}@example.com`,
      position: `QA Engineer ${runId}`,
      portfolio: 'https://example.com/portfolio',
      message: `Real UI submission test ${runId} for career form. This has enough detail.`,
    },
    booking: {
      name: 'E2E Booking Tester',
      email: `${stamp('booking')}@example.com`,
      phone: '+923001234567',
      notes: `Real UI booking submission ${runId}`,
    },
    newsletter: {
      email: `${stamp('newsletter')}@example.com`,
    },
  };

  const apiLogs = [];
  page.on('response', async (response) => {
    const url = response.url();
    if (!url.includes('/api/')) return;
    let body = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    apiLogs.push({
      url,
      status: response.status(),
      ok: response.ok(),
      body,
    });
  });

  const healthResponse = await request.get(`${baseUrl}/api/health`);
  let healthBody = null;
  try {
    healthBody = await healthResponse.json();
  } catch {
    healthBody = null;
  }

  await page.goto(`${baseUrl}/contact`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[placeholder="John Doe"]', payloads.contact.name);
  await page.fill('input[placeholder="john@example.com"]', payloads.contact.email);
  await page.fill('input[placeholder="How can we help?"]', payloads.contact.subject);
  await page.fill('textarea[placeholder="Tell us about your project..."]', payloads.contact.message);
  await page.click('button:has-text("Send Message")');
  await page.waitForTimeout(2000);

  await page.goto(`${baseUrl}/career`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[placeholder="Full Name"]', payloads.career.name);
  await page.fill('input[placeholder="Email Address"]', payloads.career.email);
  await page.fill('input[placeholder="Position Applying For"]', payloads.career.position);
  await page.fill('input[placeholder="Portfolio URL (optional)"]', payloads.career.portfolio);
  await page.fill('textarea[placeholder="Tell us about yourself and why you would be a great fit..."]', payloads.career.message);
  await page.click('button:has-text("Submit Application")');
  await page.waitForTimeout(2000);

  await page.goto(`${baseUrl}/booking`, { waitUntil: 'domcontentloaded' });
  await page.click('button:has-text("Wedding Photography")');
  await page.click('button:has-text("Continue")');
  await page.click('button:has-text("Starter")');
  await page.click('button:has-text("Continue")');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  const dateValue = `${yyyy}-${mm}-${dd}`;

  await page.fill('input[type="date"]', dateValue);
  await page.click('button:has-text("11:00 AM")');
  await page.click('button:has-text("Continue")');
  await page.click('button:has-text("Alexandra Reed")');
  await page.click('button:has-text("Continue")');
  await page.fill('input[placeholder="Full Name"]', payloads.booking.name);
  await page.fill('input[placeholder="Email Address"]', payloads.booking.email);
  await page.fill('input[placeholder="Phone Number"]', payloads.booking.phone);
  await page.fill('textarea[placeholder="Special requests or notes (optional)"]', payloads.booking.notes);
  await page.click('button:has-text("Pay & Confirm")');
  await page.waitForTimeout(2500);

  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[placeholder="your@email.com"]', payloads.newsletter.email);
  await page.click('button:has-text("Subscribe")');
  await page.waitForTimeout(2000);

  function latest(path) {
    for (let i = apiLogs.length - 1; i >= 0; i -= 1) {
      if (apiLogs[i].url.includes(path)) return apiLogs[i];
    }
    return null;
  }

  const output = {
    runId,
    baseUrl,
    timestamp: new Date().toISOString(),
    health: {
      status: healthResponse.status(),
      ok: healthResponse.ok(),
      body: healthBody,
    },
    forms: {
      contact: {
        payload: payloads.contact,
        api: latest('/api/contact'),
      },
      booking: {
        payload: {
          ...payloads.booking,
          date: dateValue,
          time: '11:00 AM',
          service: 'Wedding Photography',
          package: 'Starter',
          photographer: 'Alexandra Reed',
        },
        api: latest('/api/booking'),
      },
      career: {
        payload: payloads.career,
        api: latest('/api/career'),
      },
      newsletter: {
        payload: payloads.newsletter,
        api: latest('/api/newsletter'),
      },
    },
  };

  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`RESULT_FILE=${outPath}`);
});
