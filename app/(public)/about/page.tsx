'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/sections/page-header';
import { aboutImages } from '@/lib/pexels-data';
import { Award, Users, Camera, Printer, Check } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="About First Look Studio"
        subtitle="Fifteen years of capturing stories, crafting prints, and creating visual legacies for clients worldwide."
      />

      {/* Story section */}
      <section className="section-padding-y">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden glass-card">
                <img src={aboutImages[0].src.large} alt={aboutImages[0].alt} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden glass-card">
                  <img src={aboutImages[1].src.large} alt={aboutImages[1].alt} className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden glass-card">
                  <img src={aboutImages[2].src.large} alt={aboutImages[2].alt} className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Legacy of <span className="gold-text">Visual Excellence</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2010, First Look Studio began as a small photography
                  studio with a big vision — to redefine how moments are
                  captured and preserved. What started with a single camera and
                  a passion for storytelling has grown into a full-service
                  creative studio.
                </p>
                <p>
                  Today, our 5,000-square-foot studio houses state-of-the-art
                  photography equipment, professional printing facilities, and
                  a team of 25+ creatives who share one obsession: perfection.
                  From intimate passport photos to grand wedding films, from
                  custom t-shirts to large format flex printing — we do it all
                  under one roof.
                </p>
                <p>
                  Our work has been featured in international publications, and
                  our clients include Fortune 500 companies, luxury brands, and
                  thousands of happy couples. But our proudest achievement
                  remains the same — the smile on a client's face when they see
                  their photos for the first time.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding-y bg-black/20">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Camera, title: 'Artistry', desc: 'Every shot is composed with intention and creative vision.' },
              { icon: Award, title: 'Quality', desc: 'Museum-grade equipment and premium materials in everything we do.' },
              { icon: Users, title: 'Client-First', desc: 'Your vision drives our work. We listen, then we create.' },
              { icon: Printer, title: 'Full-Service', desc: 'From lens to print — one studio, one standard of excellence.' },
            ].map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-6 hover:gold-border transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center mb-4">
                  <val.icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{val.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding-y">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="inline-block text-xs font-semibold tracking-[0.2em] gold-text uppercase mb-3">
              The Team
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Meet Our Creatives
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: 'Kashif', role: 'Lead Photographer', },
              { name: 'Mubashir', role: 'Animator', },
              { name: 'Ali', role: 'Head of Design', },
              { name: 'Vicky', role: 'Print Specialist',  },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-6 text-center hover:gold-border transition-all group"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 mx-auto mb-4 flex items-center justify-center text-black font-display text-2xl font-bold group-hover:scale-110 transition-transform">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-gold-400 mt-1">{member.role}</p>
                
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-10 md:p-14 text-center rounded-3xl"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Let's Create Something <span className="gold-text">Extraordinary</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Join thousands of satisfied clients who trusted us with their most precious moments.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {['500+ Events', '12K+ Happy Clients', '99% Satisfaction', '15+ Years'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-gold-400" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
