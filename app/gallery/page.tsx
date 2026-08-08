'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/sections/page-header';
import { galleryImages, portfolioImages } from '@/lib/pexels-data';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const allGalleryImages = [...galleryImages, ...portfolioImages];

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Visual Collection"
        title="3D Gallery Wall"
        subtitle="Explore our complete gallery — a visual journey through our best photography and creative work."
      />

      <section className="pb-20">
        <div className="container-luxury">
          {/* Masonry grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {allGalleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
                className="group relative break-inside-avoid rounded-2xl overflow-hidden glass-card cursor-pointer"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={img.src.large}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                  <p className="text-sm text-white">{img.alt}</p>
                </div>
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4 text-gold-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-gold-400 transition-colors"
              onClick={() => setLightboxIndex(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={allGalleryImages[lightboxIndex].src.large}
              alt={allGalleryImages[lightboxIndex].alt}
              className="max-w-4xl w-full max-h-[85vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
