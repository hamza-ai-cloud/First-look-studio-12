'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="relative inline-block mb-8">
          <h1 className="font-display text-[120px] md:text-[180px] font-bold leading-none gold-text">
            404
          </h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-gold-400/20 animate-ping" />
          </motion.div>
        </div>

        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
          Page Not Found
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          The page you are looking for might have been moved, deleted, or never existed.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-gradient-to-r from-gold-500 to-gold-400 text-black hover:from-gold-400 hover:to-gold-300 font-semibold">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="glass gold-border text-foreground hover:bg-gold-400/10">
              <Search className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </Link>
        </div>

        <div className="mt-12">
          <Link href="/services" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold-400 transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Browse our services
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
