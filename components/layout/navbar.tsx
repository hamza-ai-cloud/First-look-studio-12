'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Menu, X, Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { PublicNavigationItem } from '@/lib/cms/public';

const mainNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Pricing', href: '/pricing' },
];

const moreNav = [
  { label: 'Booking', href: '/booking' },
  { label: 'Shop', href: '/shop' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Blog', href: '/blog' },
  { label: 'Career', href: '/career' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
];

const allLinks = [...mainNav, ...moreNav];

interface NavbarProps {
  siteName?: string;
  tagline?: string;
  logoUrl?: string;
  navigation?: PublicNavigationItem[];
  mobileNavigation?: PublicNavigationItem[];
}

export default function Navbar({
  siteName = 'First Look Studio',
  tagline = 'STUDIO',
  logoUrl,
  navigation = [],
  mobileNavigation = [],
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const cmsNavigation =
    navigation.length > 0 ? navigation : allLinks.map((link, index) => ({
      id: `fallback-${index}`,
      location: 'header',
      label: link.label,
      href: link.href,
      icon: null,
      parent_id: null,
      sort_order: index,
      is_visible: true,
      open_new_tab: false,
    }));

  const cmsMobileNavigation =
    mobileNavigation.length > 0
      ? mobileNavigation
      : cmsNavigation;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass-dark shadow-lg shadow-black/5 py-2'
            : 'bg-transparent py-4'
        )}
      >
        <nav className="container-luxury flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-9 w-auto object-contain"
                />
              ) : (
                <>
                  <Camera
                    className="w-7 h-7 text-gold-400 group-hover:rotate-12 transition-transform"
                    strokeWidth={1.5}
                  />
                  <div className="absolute inset-0 blur-md opacity-50">
                    <Camera
                      className="w-7 h-7 text-gold-400"
                      strokeWidth={1.5}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-bold tracking-wider text-foreground">
                {siteName}
              </span>

              {tagline && (
                <span className="font-display text-[10px] tracking-[0.3em] gold-text">
                  {tagline}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {cmsNavigation.slice(0, 6).map((link) => (
              <NavLink
                key={link.id}
                href={link.href}
                active={pathname === link.href}
                openNewTab={link.open_new_tab}
              >
                {link.label}
              </NavLink>
            ))}

            {cmsNavigation.length > 6 && (
              <div
                className="relative"
                onMouseEnter={() => setMoreOpen(true)}
                onMouseLeave={() => setMoreOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  More
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      moreOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 pt-2"
                    >
                      <div className="glass-dark rounded-xl p-2 min-w-[180px] shadow-xl">
                        {cmsNavigation.slice(6).map((link) => (
                          <Link
                            key={link.id}
                            href={link.href}
                            target={link.open_new_tab ? "_blank" : undefined}
                            rel={
                              link.open_new_tab
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className={cn(
                              "block px-4 py-2 text-sm rounded-lg transition-colors",
                              pathname === link.href
                                ? "text-gold-400 bg-gold-400/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-foreground hover:text-gold-400 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            <Link href="/admin/signin" className="hidden sm:block">
              <Button
                size="sm"
                variant="outline"
                className="glass gold-border text-foreground hover:bg-gold-400/10"
              >
                Admin
              </Button>
            </Link>
            <Link href="/booking" className="hidden sm:block">
              <Button
                size="sm"
                className="bg-gradient-to-r from-gold-500 to-gold-400 text-black hover:from-gold-400 hover:to-gold-300 font-semibold"
              >
                Book Now
              </Button>
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-full glass flex items-center justify-center text-foreground"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm glass-dark border-l border-white/10 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-lg gold-text">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 rounded-full glass flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {cmsMobileNavigation.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      target={link.open_new_tab ? '_blank' : undefined}
                      rel={link.open_new_tab ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                        pathname === link.href
                          ? 'text-gold-400 bg-gold-400/10'
                          : 'text-foreground hover:bg-white/5'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <Link href="/admin/signin" className="mt-3 block">
                <Button
                  variant="outline"
                  className="w-full glass gold-border text-foreground hover:bg-gold-400/10"
                >
                  Admin
                </Button>
              </Link>
              <Link href="/booking" className="mt-6 block">
                <Button className="w-full bg-gradient-to-r from-gold-500 to-gold-400 text-black hover:from-gold-400 hover:to-gold-300">
                  Book Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  href,
  active,
  openNewTab,
  children,
}: {
  href: string;
  active: boolean;
  openNewTab?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target={openNewTab ? '_blank' : undefined}
      rel={openNewTab ? 'noopener noreferrer' : undefined}
      className={cn(
        'relative px-4 py-2 text-sm font-medium transition-colors',
        active ? 'text-gold-400' : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
      {active && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-gold-400 to-gold-200"
        />
      )}
    </Link>
  );
}
