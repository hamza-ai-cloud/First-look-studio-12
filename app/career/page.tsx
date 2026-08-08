'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/sections/page-header';
import { Button } from '@/components/ui/button';
import { Briefcase, Heart, Zap, Users, TrendingUp, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const openPositions = [
  { title: 'Senior Wedding Photographer', type: 'Full-Time', location: 'On-Site', dept: 'Photography' },
  { title: 'Cinematic Videographer', type: 'Full-Time', location: 'On-Site', dept: 'Videography' },
  { title: 'Graphic Designer', type: 'Full-Time', location: 'Hybrid', dept: 'Design' },
  { title: 'Print Production Specialist', type: 'Full-Time', location: 'On-Site', dept: 'Printing' },
  { title: 'Social Media Manager', type: 'Part-Time', location: 'Remote', dept: 'Marketing' },
  { title: 'Studio Assistant', type: 'Part-Time', location: 'On-Site', dept: 'Operations' },
];

const benefits = [
  { icon: Heart, title: 'Health & Wellness', desc: 'Full medical, dental, and vision coverage' },
  { icon: Zap, title: 'Creative Freedom', desc: 'Express your artistry with premium equipment' },
  { icon: TrendingUp, title: 'Growth Path', desc: 'Mentorship and career advancement opportunities' },
  { icon: Users, title: 'Great Team', desc: 'Work alongside award-winning creatives' },
];

export default function CareerPage() {
  const [form, setForm] = useState({ name: '', email: '', position: '', portfolio: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to submit application.');
      }

      toast.success(data.message || 'Application submitted! We will review and get back to you soon.');
      setForm({ name: '', email: '', position: '', portfolio: '', message: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to submit application.');
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Join Our Creative Team"
        subtitle="We are always looking for passionate, talented individuals to join our award-winning studio."
      />

      {/* Benefits */}
      <section className="pb-12">
        <div className="container-luxury">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-6 hover:gold-border transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center mb-4">
                  <b.icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="pb-12">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <h2 className="font-display text-3xl font-bold text-foreground">Open Positions</h2>
            <p className="mt-3 text-muted-foreground">Find the role that matches your passion and skills.</p>
          </motion.div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {openPositions.map((pos, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:gold-border transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{pos.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{pos.dept}</span>
                      <span>•</span>
                      <span>{pos.type}</span>
                      <span>•</span>
                      <span>{pos.location}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setForm({ ...form, position: pos.title })}
                  className="px-5 py-2.5 rounded-xl glass gold-border text-sm font-medium text-gold-400 hover:bg-gold-400/10 transition-colors whitespace-nowrap"
                >
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="pb-20">
        <div className="container-luxury max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">Submit Your Application</h3>
            <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Position Applying For"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50"
              />
              <input
                type="url"
                placeholder="Portfolio URL (optional)"
                value={form.portfolio}
                onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50"
              />
              <textarea
                rows={4}
                placeholder="Tell us about yourself and why you would be a great fit..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50 resize-none"
              />
              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-gold-500 to-gold-400 text-black hover:from-gold-400 hover:to-gold-300 font-semibold">
                <Send className="w-4 h-4 mr-2" />
                Submit Application
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}
