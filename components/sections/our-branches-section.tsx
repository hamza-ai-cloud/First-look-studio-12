'use client';

import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

const branches = [
  {
    name: 'First Look Studio',
    address:
      '36 Sector 2-C-II, Butt Chowk, College Rd, Near NADRA Office, Block 2, Township Sector C-2, Lahore 54600, Pakistan',
    maps:
      'https://maps.app.goo.gl/zao6p2oXVYS8KziaA',
    phone: '+92 (321) 828-2444',
    phoneHref: 'tel:+923218282444',
    email: 'helplinestudio@gmail.com',
    emailHref: 'mailto:helplinestudio@gmail.com',
    hours: 'Mon - Sat • 9:00 AM - 9:30 PM',
  },
  {
    name: 'First Look Studio 2',
    address:
      'Flat No.149, N, model, Model Town Extension Block N Central Flats town, Lahore, 54770, Pakistan',
    maps:
      'https://maps.app.goo.gl/2VShW3EvNppvG47k9',
    phone: '+92 (305) 228-8884',
    phoneHref: 'tel:+923052288884',
    email: 'helplinestudio@gmail.com',
    emailHref: 'mailto:helplinestudio@gmail.com',
    hours: 'Mon - Sat • 9:00 AM - 9:30 PM',
  },
  {
    name: 'First Look Studio 3',
    address:
      '7-B, Faisal Garden, University of Management & Technology Rd, Block C2 Block C 2 Phase 1 Johar Town, Lahore, 54000, Pakistan',
    maps:
      'https://maps.app.goo.gl/keVmstewQ32KPQwx9',
    phone: '+92 (322) 254-9513',
    phoneHref: 'tel:+923222549513',
    email: 'firstlookkashif@gmail.com',
    emailHref: 'mailto:firstlookkashif@gmail.com',
    hours: 'Mon - Sat • 9:00 AM - 9:30 PM',
  },
];

export default function OurBranchesSection() {
  return (
    <section className="relative section-padding-y">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] gold-text uppercase mb-3">
            Our Branches
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
            Visit Our <span className="gold-text">Studio Locations</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect with us at any of our premium studio branches for bookings,
            consultations, and unforgettable photography experiences.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {branches.map((branch, index) => (
            <motion.article
              key={branch.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-gold-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {branch.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">Studio Location</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <a
                  href={branch.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in Google Maps"
                  className="flex items-start gap-3 hover:text-gold-400 transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                  <span>{branch.address}</span>
                </a>

                <a
                  href={branch.phoneHref}
                  className="flex items-center gap-3 hover:text-gold-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{branch.phone}</span>
                </a>

                <a
                  href={branch.emailHref}
                  className="flex items-center gap-3 hover:text-gold-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{branch.email}</span>
                </a>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{branch.hours}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
