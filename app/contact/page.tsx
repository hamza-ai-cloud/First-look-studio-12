'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/sections/page-header';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Herr_Von_Muellerhoff } from 'next/font/google';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to send message.');
      }

      toast.success(data.message || 'Message sent! We will get back to you within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Have a question or want to book a session? We are here to help. Reach out through any channel below."
      />

      <section className="pb-20">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">Contact Information</h3>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: 'Call Us', value: '+92 (322) 254-9513', },
                  { icon: Mail, label: 'Email Us', value: 'First Look Studio', },
                  { icon: MapPin, label: 'Visit Us', value: '7-B, Faisal Garden, University of Management & Technology Rd, Block C2 Block C 2 Phase 1 Johar Town, Lahore, 54000, Pakistan', href: 'https://maps.app.goo.gl/keVmstewQ32KPQwx9' },
                  { icon: Clock, label: 'Working Hours', value: 'Mon - Sat: 9:00AM - 9:30PM', href: '#' },
                ].map((item, i) => (
                  <a key={i} href={item.href} className="flex items-center gap-4 glass-card p-4 rounded-xl hover:gold-border transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center group-hover:bg-gold-400/20 transition-colors">
                      <item.icon className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="text-sm font-medium text-foreground">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Quick action buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <a href="https://wa.me/+923222549513" target="_blank" rel="noopener noreferrer">
                  <Button className="inline-flex w-fit items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-2 font-semibold text-[#25D366] shadow-[0_0_0_1px_rgba(37,211,102,0.08),0_6px_16px_rgba(37,211,102,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[#25D366]/20 hover:text-[#1DA851] hover:shadow-[0_8px_22px_rgba(37,211,102,0.2)]">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
                <a href="tel:+923222549513">
                  <Button variant="outline" className="inline-flex w-fit items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-4 py-2 font-semibold text-[#C9A227] shadow-[0_0_0_1px_rgba(201,162,39,0.08),0_6px_16px_rgba(201,162,39,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[#C9A227]/20 hover:text-[#A67C00] hover:shadow-[0_8px_22px_rgba(201,162,39,0.2)]"
>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </a>
              </div>

              {/* Map placeholder */}
              <div className="mt-6 glass-card rounded-2xl overflow-hidden aspect-video relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400/10 to-transparent flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gold-400/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">123 Studio Avenue, Creative District</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50 transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-gold-500 to-gold-400 text-black hover:from-gold-400 hover:to-gold-300 font-semibold disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
