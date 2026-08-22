import { getPublicHomeSections, getPublicServices, getPublicFeaturedGallery, getPublicAboutContent } from '@/lib/cms/public';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import HeroSection from '@/components/sections/hero-section';
import ServicesSlider from '@/components/sections/services-slider';
import FeaturedGallery from '@/components/sections/featured-gallery';
import AboutPreview from '@/components/sections/about-preview';
import TestimonialsSection from '@/components/sections/testimonials-section';
import BlogPreview from '@/components/sections/blog-preview';
import CTASection from '@/components/sections/cta-section';
import NewsletterSection from '@/components/sections/newsletter-section';

export default async function HomePage() {
  const [
    sections,
    publicServices,
    publicGallery,
    publicAbout,
  ] = await Promise.all([
    getPublicHomeSections(),
    getPublicServices(),
    getPublicFeaturedGallery(),
    getPublicAboutContent(),
  ]);

  return (
    <>
      {sections.map((section) => {
        switch (section.section_key) {
          case 'hero':
            return (
              <HeroSection
                key={section.id}
                content={section.content}
              />
            );

          case 'services':
            return (
              <ServicesSlider
                key={section.id}
                services={
                  publicServices.length > 0
                    ? publicServices
                    : undefined
                }
              />
            );

          case 'gallery':
            return (
              <FeaturedGallery
                key={section.id}
                items={publicGallery}
              />
            );

          case 'about':
            return (
              <AboutPreview
                key={section.id}
                content={publicAbout}
              />
            );

          case 'testimonials':
            return <TestimonialsSection key={section.id} />;

          case 'blog':
            return <BlogPreview key={section.id} />;

          case 'cta':
            return <CTASection key={section.id} />;

          case 'newsletter':
            return <NewsletterSection key={section.id} />;

          default:
            return null;
        }
      })}
    </>
  );
}
