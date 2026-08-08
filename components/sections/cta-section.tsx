'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative section-padding-y">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl glass-card p-10 md:p-16 text-center"
        >
          {/* Gold glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gold-400/10 blur-[120px] pointer-events-none" />
          {/* Gold border accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

          <div className="relative z-10">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-2xl mx-auto text-balance">
              Ready to Capture Your <span className="gold-text">Story?</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Book your session today and let us transform your moments into
              timeless art. Limited slots available this season.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/booking">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-gold-500 to-gold-400 text-black hover:from-gold-400 hover:to-gold-300 font-semibold text-base px-8 h-14 group"
                >
                  Book Now
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
             
              <a
                href="https://wa.me/923222549513"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="h-14 px-8 text-base font-semibold text-white border border-[#25D366] bg-[#25D366] shadow-[0_8px_22px_rgba(37,211,102,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1ebc5a] hover:shadow-[0_10px_26px_rgba(37,211,102,0.34)]"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
