'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { PublicNewsletterContent } from '@/lib/cms/public';

interface NewsletterSectionProps {
  content?: PublicNewsletterContent;
}

export default function NewsletterSection({
  content,
}: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const eyebrow =
    content?.eyebrow || 'NEWSLETTER';

  const heading =
    content?.heading || 'Stay in the Frame';

  const description =
    content?.description ||
    '{description}';

  const inputPlaceholder =
    content?.input_placeholder || 'your@email.com';

  const buttonText =
    content?.button_text || 'Subscribe';

  const successText =
    content?.success_text ||
    'Subscribed! Welcome to the First Look family.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitted(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to subscribe.');
      }

      toast.success(data.message || successText);
      setEmail('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to subscribe.');
    } finally {
      setTimeout(() => setSubmitted(false), 2500);
    }
  };

  return (
    <section className="relative pb-20 md:pb-28">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass gold-border mb-6">
            <Mail className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-medium tracking-wider text-gold-200">
              {eyebrow}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {heading}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {description}
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={inputPlaceholder}
              required
              className="flex-1 px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold hover:from-gold-400 hover:to-gold-300 transition-all flex items-center justify-center gap-2"
            >
              {submitted ? (
                <>
                  <Check className="w-4 h-4" />
                  Done
                </>
              ) : (
                buttonText
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
