'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PageHeader from '@/components/sections/page-header';
import { services } from '@/lib/data';
import * as Icons from 'lucide-react';
import { Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const categories = ['All', 'Photography', 'Videography', 'Printing', 'Graphic Design'] as const;

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All');

  const filtered = activeCategory === 'All'
    ? services
    : services.filter((s) => s.category === activeCategory);

  return (
    <>
      <PageHeader
        eyebrow="What We Offer"
        title="Our Premium Services"
        subtitle="A complete creative suite — from cinematic photography and videography to premium printing and brand design."
      />

      {/* Category filter */}
      <section className="pb-8">
        <div className="container-luxury">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black'
                    : 'glass text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="pb-20">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((service, i) => {
              const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[service.icon] || Icons.Camera;
              return (
                <motion.div
                  key={service.slug}
                  id={service.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="glass-card p-6 hover:gold-border transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center group-hover:bg-gold-400/20 transition-colors">
                      <Icon className="w-6 h-6 text-gold-400" />
                    </div>
                    <span className="px-3 py-1 rounded-full glass text-xs font-medium text-gold-200">
                      {service.category}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-5">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-gold-400 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <span className="text-xs text-muted-foreground">Starting from</span>
                      <div className="font-display text-xl font-bold gold-text">{service.price}</div>
                    </div>
                    <Link href="/booking">
                      <button className="inline-flex items-center gap-1 text-sm font-medium text-gold-400 hover:text-gold-300 group/btn">
                        Book
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
