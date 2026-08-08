'use client';

import { motion } from 'framer-motion';
import { aboutImages } from '@/lib/pexels-data';

export default function AboutPreview() {
  return (
    <section className="relative section-padding-y overflow-hidden">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Images */}
          <div className="relative grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden glass-card">
                <img
                  src={aboutImages[0].src.large}
                  alt={aboutImages[0].alt}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden glass-card">
                <img
                  src={aboutImages[2].src.large}
                  alt={aboutImages[2].alt}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-4 pt-12"
            >
              <div className="aspect-square rounded-2xl overflow-hidden glass-card">
                <img
                  src={aboutImages[1].src.large}
                  alt={aboutImages[1].alt}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden glass-card relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="font-display text-4xl font-bold gold-text">15+</div>
                  <div className="text-sm text-muted-foreground mt-1">Years of Excellence</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold tracking-[0.2em] gold-text uppercase mb-3">
              About First Look
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Where Art Meets <span className="gold-text">Precision</span>
            </h2>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              For over 15 years, First Look Studio has been a beacon of visual
              excellence. From breathtaking wedding cinematography to
              museum-quality printing, we blend artistic vision with technical
              mastery to deliver results that exceed expectations.
            </p>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Our team of award-winning photographers, videographers, and
              designers work under one roof — ensuring every project, from a
              passport photo to a luxury wedding film, receives the same
              obsessive attention to detail.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: 'Award-Winning Team', value: '25+' },
                { label: 'Studio Space', value: '5,000 sqft' },
                { label: 'Client Satisfaction', value: '99%' },
                { label: 'Projects Completed', value: '8,000+' },
              ].map((item, i) => (
                <div key={i} className="glass-card p-4">
                  <div className="font-display text-2xl font-bold gold-text">
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
