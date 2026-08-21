import { getPublicHero } from '@/lib/cms/public';

import HeroSection from '@/components/sections/hero-section';
import ServicesSlider from '@/components/sections/services-slider';
import FeaturedGallery from '@/components/sections/featured-gallery';
import AboutPreview from '@/components/sections/about-preview';
import TestimonialsSection from '@/components/sections/testimonials-section';
import BlogPreview from '@/components/sections/blog-preview';
import CTASection from '@/components/sections/cta-section';
import NewsletterSection from '@/components/sections/newsletter-section';

export default async function HomePage() {
  const hero = await getPublicHero();

  return (
    <>
      <HeroSection content={hero} />
      <ServicesSlider />
      <FeaturedGallery />
      <AboutPreview />
      <TestimonialsSection />
      <BlogPreview />
      <CTASection />
      <NewsletterSection />
    </>
  );
}
