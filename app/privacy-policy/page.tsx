'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/sections/page-header';

const sections = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide directly to us, such as when you create an account, book a session, make a purchase, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, billing address, and payment information. We also automatically collect certain data when you visit our website, including IP address, browser type, device information, and usage data through cookies and similar technologies.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use your information to provide and improve our services, process bookings and transactions, send confirmation and notification emails, respond to your inquiries, personalize your experience, send marketing communications (with your consent), analyze website traffic and usage patterns, and comply with legal obligations. We never sell your personal data to third parties.',
  },
  {
    title: '3. Information Sharing',
    body: 'We may share your information with trusted service providers who help us operate our business, such as payment processors (Stripe), email service providers, and analytics platforms. These providers are contractually obligated to protect your data and only use it to provide services to us. We may also disclose information when required by law or to protect our rights and property.',
  },
  {
    title: '4. Data Security',
    body: 'We implement industry-standard security measures to protect your personal information, including SSL encryption for data transmission, secure password hashing, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security of your data.',
  },
  {
    title: '5. Cookies Policy',
    body: 'We use cookies to enhance your browsing experience, remember your preferences, analyze traffic, and serve personalized content. You can control cookies through your browser settings, but disabling them may affect website functionality. Essential cookies are necessary for the site to function, while optional cookies can be disabled without impact on core features.',
  },
  {
    title: '6. Your Rights',
    body: 'You have the right to access, correct, or delete your personal information, opt out of marketing communications, request a copy of your data, and lodge a complaint with a data protection authority. To exercise these rights, contact us at privacy@firstlookstudio.com. We will respond to your request within 30 days.',
  },
  {
    title: '7. Data Retention',
    body: 'We retain your personal information for as long as your account is active or as necessary to provide our services. We may retain certain data after account closure to comply with legal obligations, resolve disputes, and enforce our agreements. Payment records are retained for 7 years as required by tax law.',
  },
  {
    title: '8. Children\'s Privacy',
    body: 'Our services are not directed to individuals under 16 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately, and we will take steps to delete such information.',
  },
  {
    title: '9. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this page periodically to stay informed about how we protect your information.',
  },
  {
    title: '10. Contact Us',
    body: 'If you have questions or concerns about this Privacy Policy or our data practices, please contact us at privacy@firstlookstudio.com or by mail at: First Look Studio, 123 Studio Avenue, Creative District. We are committed to addressing your privacy concerns promptly and transparently.',
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Your privacy is important to us. This policy explains how we collect, use, and protect your personal information."
      />
      <section className="pb-20">
        <div className="container-luxury max-w-3xl">
          <p className="text-sm text-muted-foreground mb-8">Last updated: August 2026</p>
          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <h2 className="font-display text-lg font-semibold text-foreground mb-3">{s.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
