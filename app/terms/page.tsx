'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/sections/page-header';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing and using the First Look Studio website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access the website or use our services. Your continued use of the website constitutes acceptance of any updates or modifications to these terms.',
  },
  {
    title: '2. Services Description',
    body: 'First Look Studio provides photography, videography, digital printing, flex printing, graphic design, and related creative services. Specific service details, pricing, and availability are listed on our website and may change without notice. All services are subject to availability and scheduling constraints. We reserve the right to refuse service to anyone for any lawful reason.',
  },
  {
    title: '3. Booking and Appointments',
    body: 'When booking a session, you agree to provide accurate information and arrive on time. A 30% advance payment is required to secure your booking, which is non-refundable but may be applied to a rescheduled session with at least 48 hours notice. Cancellations made less than 48 hours before the appointment will forfeit the advance payment. No-shows will be charged the full session fee.',
  },
  {
    title: '4. Payment Terms',
    body: 'All payments are processed securely through Stripe. Full payment is due upon completion of services unless otherwise agreed in writing. For packages, the balance must be paid before delivery of final products. Prices are listed in USD and are subject to applicable taxes. We reserve the right to change pricing at any time, but booked services will be honored at the rate confirmed at booking.',
  },
  {
    title: '5. Intellectual Property',
    body: 'All photographs, videos, designs, and creative work produced by First Look Studio remain our intellectual property until full payment is received. Upon payment, clients receive a personal-use license for their commissioned work. Commercial use, resale, or redistribution requires a separate commercial license. We retain the right to display work in our portfolio and marketing materials unless a privacy agreement is signed.',
  },
  {
    title: '6. Client Responsibilities',
    body: 'Clients are responsible for providing accurate information, obtaining necessary permits for shoot locations, ensuring subjects have given consent, and providing a safe working environment. For wedding and event photography, clients must inform us of any venue restrictions regarding photography. Any delays caused by client negligence may result in additional charges.',
  },
  {
    title: '7. Delivery Timeline',
    body: 'Standard delivery time for edited photos is 7-14 business days from the shoot date. Video projects require 14-30 business days depending on complexity. Rush delivery is available for an additional 50% fee with a guaranteed 48-hour turnaround for photos and 7-day turnaround for videos. Printed products are delivered within 5-10 business days after design approval.',
  },
  {
    title: '8. Revisions and Refunds',
    body: 'Each package includes a specified number of revision rounds. Additional revisions are billed at $50 per round. Refunds are evaluated on a case-by-case basis. If you are unsatisfied with the service, contact us within 7 days of delivery. We will work to resolve concerns through re-edits or partial refunds. Advance payments are non-refundable except in cases where we cancel the booking.',
  },
  {
    title: '9. Shop Products',
    body: 'Products purchased from our online shop are subject to quality inspection before shipping. Damaged or defective items may be returned within 14 days for a full replacement or refund. Custom-printed items (mugs, t-shirts, personalized gifts) are non-returnable unless defective. Shipping costs are non-refundable. Coupon codes are valid for the specified period and cannot be combined.',
  },
  {
    title: '10. Limitation of Liability',
    body: 'First Look Studio is not liable for indirect, incidental, or consequential damages arising from the use of our services. Our total liability for any claim is limited to the amount paid for the specific service giving rise to the claim. We are not responsible for lost data, equipment failure, or circumstances beyond our reasonable control including weather, venue restrictions, or third-party actions.',
  },
  {
    title: '11. Governing Law',
    body: 'These Terms are governed by the laws of the jurisdiction in which First Look Studio is registered. Any disputes arising from these terms or our services shall be resolved through good-faith negotiation first, and if unresolved, through binding arbitration. Class action lawsuits are waived to the fullest extent permitted by law.',
  },
  {
    title: '12. Changes to Terms',
    body: 'We reserve the right to modify these Terms at any time. Changes are effective immediately upon posting to the website. Your continued use of our services after changes constitutes acceptance of the updated Terms. We encourage you to review this page periodically. The "Last updated" date reflects the most recent revision.',
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our website and services."
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
