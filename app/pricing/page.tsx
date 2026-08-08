'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PageHeader from '@/components/sections/page-header';
import { pricingPlans } from '@/lib/data';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Transparent Pricing"
        subtitle="Choose from our carefully crafted packages. No hidden fees, no surprises — just premium quality at fair prices."
      />

      <section className="pb-12">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative glass-card p-8 rounded-3xl flex flex-col ${
                  plan.popular ? 'gold-border ring-1 ring-gold-400/30' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-black text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black" />
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-2xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold gold-text">${plan.price}</span>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-gold-400/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-gold-400" />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/booking" className="mt-8">
                  <Button
                    className={`w-full h-12 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black hover:from-gold-400 hover:to-gold-300'
                        : 'glass gold-border text-foreground hover:bg-gold-400/10'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons table */}
      <section className="pb-20">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h3 className="font-display text-2xl font-bold text-foreground text-center mb-8">
              Add-Ons & Extras
            </h3>
            <div className="glass-card rounded-2xl overflow-hidden">
              {[
                { item: 'Extra Edited Photos', price: '$15/photo' },
                { item: 'Rush Delivery (24h)', price: '+50%' },
                { item: 'Additional Photographer', price: '$299/day' },
                { item: 'Drone Coverage', price: '$499' },
                { item: 'Premium Photo Album (40pg)', price: '$149' },
                { item: 'Canvas Print (16x20)', price: '$79' },
                { item: 'Custom Photo Mug', price: '$18' },
                { item: 'Custom T-Shirt', price: '$24' },
              ].map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i !== 0 ? 'border-t border-white/10' : ''
                  }`}
                >
                  <span className="text-sm text-muted-foreground">{row.item}</span>
                  <span className="text-sm font-medium gold-text">{row.price}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Need a custom package? <Link href="/contact" className="text-gold-400 hover:text-gold-300">Contact us</Link> for a personalized quote.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
