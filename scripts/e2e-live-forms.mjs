import { chromium } from 'playwright';

const baseUrl = 'https://firstlookstudio.com';
const runId = `e2e-${Date.now()}`;

function stamp(label) {
  return `${label}-${runId}`;
}

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

const results = {
  runId,
  baseUrl,
  timestamp: new Date().toISOString(),
  health: null,
  forms: {},
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

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

async function waitForApi(path) {
  for (let i = apiLogs.length - 1; i >= 0; i -= 1) {
    if (apiLogs[i].url.includes(path)) return apiLogs[i];
  }
  return null;
}

try {
  // Health check
  const healthResponse = await page.request.get(`${baseUrl}/api/health`);
  let healthBody = null;
  try {
    healthBody = await healthResponse.json();
  } catch {
    healthBody = null;
  }
  results.health = {
    status: healthResponse.status(),
    ok: healthResponse.ok(),
    body: healthBody,
  };

  // Contact form
  await page.goto(`${baseUrl}/contact`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[placeholder="John Doe"]', payloads.contact.name);
  await page.fill('input[placeholder="john@example.com"]', payloads.contact.email);
  await page.fill('input[placeholder="How can we help?"]', payloads.contact.subject);
  await page.fill('textarea[placeholder="Tell us about your project..."]', payloads.contact.message);
  await page.click('button:has-text("Send Message")');
  await page.waitForTimeout(2000);
  results.forms.contact = {
    payload: payloads.contact,
    api: await waitForApi('/api/contact'),
  };

  // Career form
  await page.goto(`${baseUrl}/career`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[placeholder="Full Name"]', payloads.career.name);
  await page.fill('input[placeholder="Email Address"]', payloads.career.email);
  await page.fill('input[placeholder="Position Applying For"]', payloads.career.position);
  await page.fill('input[placeholder="Portfolio URL (optional)"]', payloads.career.portfolio);
  await page.fill('textarea[placeholder="Tell us about yourself and why you would be a great fit..."]', payloads.career.message);
  await page.click('button:has-text("Submit Application")');
  await page.waitForTimeout(2000);
  results.forms.career = {
    payload: payloads.career,
    api: await waitForApi('/api/career'),
  };

  // Booking form
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
  results.forms.booking = {
    payload: { ...payloads.booking, date: dateValue, time: '11:00 AM', service: 'Wedding Photography', package: 'Starter', photographer: 'Alexandra Reed' },
    api: await waitForApi('/api/booking'),
  };

  // Newsletter form on homepage
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[placeholder="your@email.com"]', payloads.newsletter.email);
  await page.click('button:has-text("Subscribe")');
  await page.waitForTimeout(2000);
  results.forms.newsletter = {
    payload: payloads.newsletter,
    api: await waitForApi('/api/newsletter'),
  };
} finally {
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
