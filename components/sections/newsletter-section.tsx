'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

      toast.success(data.message || 'Subscribed! Welcome to the First Look family.');
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
              NEWSLETTER
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Stay in the Frame
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Subscribe for exclusive offers, photography tips, and behind-the-scenes content.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
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
                'Subscribe'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
