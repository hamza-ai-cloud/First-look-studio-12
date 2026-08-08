import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import ScrollProgress from '@/components/layout/scroll-progress';
import BackToTop from '@/components/layout/back-to-top';
import LoadingScreen from '@/components/layout/loading-screen';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://firstlookstudio.com'),
  title: {
    default: 'First Look Studio | Premium Photography, Videography & Printing',
    template: '%s | First Look Studio',
  },
  description:
    'First Look Studio offers luxury photography, videography, digital & flex printing, wedding photography, passport photos, graphic design, mug & t-shirt printing, and large format printing.',
  keywords: [
    'photography',
    'videography',
    'wedding photography',
    'passport photos',
    'digital printing',
    'flex printing',
    'graphic design',
    'mug printing',
    't-shirt printing',
    'large format printing',
    'photo frames',
    'business cards',
    'invitation cards',
  ],
  authors: [{ name: 'First Look Studio' }],
  creator: 'First Look Studio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://firstlookstudio.com',
    siteName: 'First Look Studio',
    title: 'First Look Studio | Premium Photography, Videography & Printing',
    description:
      'Luxury photography, videography, and printing services. Capturing your precious moments with cinematic artistry.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'First Look Studio | Premium Photography & Printing',
    description:
      'Luxury photography, videography, and printing services. Capturing your precious moments with cinematic artistry.',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingScreen />
          <ScrollProgress />
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <BackToTop />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
