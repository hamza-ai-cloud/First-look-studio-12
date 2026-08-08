'use client';

import Link from 'next/link';
import { Camera, Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

const footerNav = [
  {
    title: 'Services',
    links: [
      { label: 'Photography', href: '/services' },
      { label: 'Videography', href: '/services' },
      { label: 'Digital Printing', href: '/services' },
      { label: 'Flex Printing', href: '/services' },
      { label: 'Graphic Design', href: '/services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/career' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Book Appointment', href: '/booking' },
      { label: 'Shop', href: '/shop' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const branches = [
  {
    name: 'First Look Studio',
    address:
      '36 Sector 2-C-II, Butt Chowk, College Rd, Near NADRA Office, Block 2, Township Sector C-2, Lahore 54600, Pakistan',
    maps:
      'https://maps.app.goo.gl/zao6p2oXVYS8KziaA',
    phone: '+92 (321) 828-2444',
    phoneHref: 'tel:+923218282444',
    whatsappHref: 'https://wa.me/923218282444',
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
    whatsappHref: 'https://wa.me/923052288884',
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
    whatsappHref: 'https://wa.me/923222549513',
    email: 'firstlookkashif@gmail.com',
    emailHref: 'mailto:firstlookkashif@gmail.com',
    hours: 'Mon - Sat • 9:00 AM - 9:30 PM',
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Camera className="w-7 h-7 text-gold-400" strokeWidth={1.5} />
              <div className="flex flex-col leading-none">
                <span className="font-display text-base font-bold tracking-wider text-foreground">
                  FIRST LOOK
                </span>
                <span className="font-display text-[10px] tracking-[0.3em] gold-text">
                  STUDIO
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Premium photography, videography, and printing studio. We capture
              your precious moments with cinematic artistry and deliver
              world-class print products.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-gold-400 hover:border-gold-400/30 transition-colors"
                  aria-label="Social media"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {footerNav.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-foreground mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-gold-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/10">
          {branches.map((branch) => (
            <div key={branch.name} className="flex flex-col gap-3 text-sm text-muted-foreground">
              <h4 className="font-display text-sm font-semibold text-foreground">
                {branch.name}
              </h4>
              <a
                href={branch.maps}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in Google Maps"
                className="flex items-start gap-3 hover:text-gold-400 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
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
                href={branch.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-2 font-semibold text-[#25D366] shadow-[0_0_0_1px_rgba(37,211,102,0.08),0_6px_16px_rgba(37,211,102,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[#25D366]/20 hover:text-[#1DA851] hover:shadow-[0_8px_22px_rgba(37,211,102,0.2)]"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>WhatsApp</span>
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
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} First Look Studio. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Crafted with passion for visual storytelling.
          </p>
        </div>
      </div>
    </footer>
  );
}
