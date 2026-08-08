'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PageHeader from '@/components/sections/page-header';
import { blogPosts } from '@/lib/data';
import { blogImages } from '@/lib/pexels-data';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';

const categories = ['All', 'Wedding', 'Photography', 'Videography', 'Printing', 'Design', 'Lifestyle'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = blogPosts.filter((post) => {
    const matchCat = activeCategory === 'All' || post.category === activeCategory;
    const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Stories & Insights"
        subtitle="Expert tips, behind-the-scenes content, and stories from the world of photography and design."
      />

      <section className="pb-8">
        <div className="container-luxury">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black'
                      : 'glass text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass min-w-[200px]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-luxury">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No articles found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="group glass-card overflow-hidden hover:gold-border transition-all h-full">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={blogImages[i % blogImages.length].src.large}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-xs font-medium text-gold-200">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-gold-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.excerpt}</p>
                        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gold-400 group-hover:text-gold-300">
                          Read More
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
