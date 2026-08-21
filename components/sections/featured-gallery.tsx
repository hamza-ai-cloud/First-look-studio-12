'use client';

import { motion } from 'framer-motion';
import { galleryImages } from '@/lib/pexels-data';
import type { PublicGalleryItem } from '@/lib/cms/public';

interface FeaturedGalleryProps {
  items?: PublicGalleryItem[];
}

export default function FeaturedGallery({
  items = [],
}: FeaturedGalleryProps) {
  const images =
    items.length > 0
      ? items.map((item) => ({
          src: {
            large: item.image_url,
          },
          alt: item.title,
        }))
      : galleryImages;

  return (
    <section className="relative section-padding-y overflow-hidden">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] gold-text uppercase mb-3">
            Our Work
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Featured Gallery
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl glass-card ${
                i === 0 || i === 5 ? 'row-span-2 aspect-[1/2]' : 'aspect-square'
              }`}
            >
              <img
                src={img.src.large}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-sm font-medium text-white">{img.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
