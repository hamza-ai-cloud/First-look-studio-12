'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { services as defaultServices } from '@/lib/data';

type ServiceItem = {
  slug: string;
  title: string;
  description: string;
  price?: string;
  icon: string;
};

interface ServicesSliderProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  services?: ServiceItem[];
}

export default function ServicesSlider({
  eyebrow = 'What We Do',
  title = 'Our Premium Services',
  description = 'From lens to print, we offer a complete creative suite for all your visual needs.',
  services = defaultServices.slice(0, 8),
}: ServicesSliderProps) {
  return (
    <section className="relative section-padding-y overflow-hidden">
      <div className="container-luxury">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => {
            const Icon =
              (
                Icons as unknown as Record<
                  string,
                  React.ComponentType<{ className?: string }>
                >
              )[service.icon] || Icons.Camera;

            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <Link href={`/services#${service.slug}`}>
                  <div className="group relative h-full glass-card p-6 hover:gold-border transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-400/0 to-gold-400/0 group-hover:from-gold-400/5 group-hover:to-transparent transition-all duration-500" />

                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center mb-4 group-hover:bg-gold-400/20 transition-colors">
                        <Icon className="w-6 h-6 text-gold-400" />
                      </div>

                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                        {service.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {service.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-medium gold-text">
                          {service.price}
                        </span>

                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/services">
            <button className="inline-flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors group">
              View All Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={center ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}
    >
      <span className="inline-block text-xs font-semibold tracking-[0.2em] gold-text uppercase mb-3">
        {eyebrow}
      </span>

      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
