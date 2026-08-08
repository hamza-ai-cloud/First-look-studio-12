'use client';

import { motion } from 'framer-motion';

export default function PageHeader({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gold-400/5 blur-[150px] pointer-events-none" />
      <div className="container-luxury relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {eyebrow && (
            <span className="inline-block text-xs font-semibold tracking-[0.2em] gold-text uppercase mb-3">
              {eyebrow}
            </span>
          )}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
