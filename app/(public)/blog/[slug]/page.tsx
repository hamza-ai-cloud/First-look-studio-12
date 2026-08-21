'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { blogPosts } from '@/lib/data';
import { blogImages } from '@/lib/pexels-data';
import { Calendar, Clock, ArrowRight, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return notFound();
  const postIndex = blogPosts.indexOf(post);
  const img = blogImages[postIndex % blogImages.length];
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const share = () => toast.success('Link copied to clipboard!');

  return (
    <article>
      {/* Hero image */}
      <div className="relative h-[50vh] min-h-[300px] overflow-hidden">
        <img src={img.src.large} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full glass text-xs font-medium text-gold-200 mb-3">
                {post.category}
              </span>
              <h1 className="font-display text-2xl md:text-4xl font-bold text-white max-w-3xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 mt-4 text-sm text-white/70">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="container-luxury max-w-3xl py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="prose prose-invert max-w-none"
        >
          <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              At First Look Studio, we believe every project tells a story. Whether it is a wedding,
              a corporate event, or a personal portrait session, the key to exceptional results lies
              in preparation, communication, and a deep understanding of the craft.
            </p>
            <p>
              Our team approaches each project with a blend of technical expertise and artistic vision.
              From selecting the right equipment and lighting setup to choosing the perfect angles and
              composition, every decision is made with the final result in mind. We do not just capture
              moments — we create visual narratives that resonate.
            </p>
            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">The Process</h2>
            <p>
              Every great project begins with a consultation. We take the time to understand your vision,
              your style, and your expectations. This allows us to tailor our approach and deliver results
              that align perfectly with what you imagine — and often exceed it.
            </p>
            <p>
              During the shoot, our photographers and videographers work seamlessly together, coordinating
              angles, lighting, and timing to ensure no moment is missed. Post-production is where the
              magic truly happens — our editors apply careful color grading, retouching, and sound design
              to bring your story to life.
            </p>
            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Why It Matters</h2>
            <p>
              In a world where everyone has a camera in their pocket, professional quality is what sets
              a studio apart. The difference between a snapshot and a masterpiece is not just the equipment —
              it is the eye behind the lens, the experience in the editing room, and the commitment to
              excellence that defines everything we do at First Look Studio.
            </p>
          </div>
        </motion.div>

        {/* Share */}
        <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
          <Link href="/blog">
            <Button variant="outline" className="glass gold-border text-foreground hover:bg-gold-400/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Articles
            </Button>
          </Link>
          <button onClick={share} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold-400 transition-colors">
            <Share2 className="w-4 h-4" />
            Share Article
          </button>
        </div>
      </div>

      {/* Related posts */}
      <section className="pb-20">
        <div className="container-luxury">
          <h3 className="font-display text-xl font-semibold text-foreground mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((rp, i) => (
              <Link key={rp.slug} href={`/blog/${rp.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group glass-card overflow-hidden hover:gold-border transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={blogImages[(postIndex + i + 1) % blogImages.length].src.large} alt={rp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gold-400 mb-1">{rp.category}</div>
                    <h4 className="font-medium text-foreground text-sm line-clamp-2">{rp.title}</h4>
                    <div className="mt-2 flex items-center gap-1 text-sm text-gold-400">
                      Read More <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
