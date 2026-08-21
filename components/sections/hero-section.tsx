'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('@/components/three/hero-scene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-gold-400/30 border-t-gold-400 animate-spin" />
    </div>
  ),
});

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sparkles } from 'lucide-react';
import type { PublicHeroContent } from '@/lib/cms/public';

export default function HeroSection({
  content,
}: {
  content: PublicHeroContent;
}) {
  const eyebrow =
    content.eyebrow || 'PREMIUM PHOTOGRAPHY STUDIO';

  const heading =
    content.heading || 'Capturing Moments';

  const headingHighlight =
    content.heading_highlight || 'Worth Remembering';

  const description =
    content.description ||
    'From cinematic wedding films to premium printing and custom gifts — First Look Studio brings your vision to life with artistry and precision.';

  const primaryButtonText =
    content.primary_button_text || 'Book a Session';

  const primaryButtonUrl =
    content.primary_button_url || '/booking';

  const secondaryButtonText =
    content.secondary_button_text || 'View Portfolio';

  const secondaryButtonUrl =
    content.secondary_button_url || '/portfolio';

  const stats =
    content.stats?.length
      ? content.stats
      : [
          { value: '500+', label: 'Events Covered' },
          { value: '12K+', label: 'Happy Clients' },
          { value: '15+', label: 'Years Experience' },
          { value: '50K+', label: 'Photos Delivered' },
        ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/80 z-[1] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container-luxury text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass gold-border mb-6"
        >
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className="text-xs font-medium tracking-wider text-gold-200">
            {eyebrow}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-balance"
        >
          <span className="block text-foreground">{heading}</span>
          <span className="block gold-gradient-animated mt-2">{headingHighlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href={primaryButtonUrl}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-gold-500 to-gold-400 text-black hover:from-gold-400 hover:to-gold-300 font-semibold text-base px-8 h-14 group"
            >
              {primaryButtonText}
              <ChevronDown className="w-5 h-5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <Link href={secondaryButtonUrl}>
            <Button
              size="lg"
              variant="outline"
              className="glass gold-border text-foreground hover:bg-gold-400/10 text-base px-8 h-14"
            >
              {secondaryButtonText}
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        {content.show_stats !== false && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold gold-text">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      {content.show_scroll_indicator !== false && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs tracking-widest">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold-400 to-transparent" />
        </motion.div>
      </motion.div>
      )}
    </section>
  );
}
