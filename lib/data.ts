export type Service = {
  slug: string;
  title: string;
  category: 'Photography' | 'Videography' | 'Printing' | 'Graphic Design';
  description: string;
  icon: string;
  features: string[];
  price?: string;
};

export const services: Service[] = [
  {
    slug: 'wedding-photography',
    title: 'Wedding Photography',
    category: 'Photography',
    description: 'Cinematic wedding coverage capturing every precious moment of your special day.',
    icon: 'Heart',
    features: ['Full-day coverage', 'Cinematic editing', 'Drone shots', 'Photo album included'],
    
  },
  {
    slug: 'event-photography',
    title: 'Event Photography',
    category: 'Photography',
    description: 'Professional coverage for corporate events, parties, and celebrations.',
    icon: 'PartyPopper',
    features: ['Up to 8 hours', 'Same-day previews', '300+ edited photos', 'Online gallery'],
    
  },
  {
    slug: 'portrait-photography',
    title: 'Portrait Photography',
    category: 'Photography',
    description: 'Studio and outdoor portraits that reveal personality and elegance.',
    icon: 'User',
    features: ['1-hour session', 'Multiple outfits', '20 edited photos', 'Print rights'],
    
  },
  {
    slug: 'passport-photos',
    title: 'Passport Photos',
    category: 'Photography',
    description: 'Government-compliant passport and ID photos in minutes.',
    icon: 'CreditCard',
    features: ['All sizes available', 'Instant printing', 'Compliance guaranteed', 'Digital copy'],
    
  },
  {
    slug: 'drone-photography',
    title: 'Drone Photography',
    category: 'Photography',
    description: 'Stunning aerial photography and videography for any occasion.',
    icon: 'Plane',
    features: ['4K aerial video', '50+ aerial photos', 'Licensed pilot', 'Same-day delivery'],
    
  },
  {
    slug: 'videography',
    title: 'Cinematic Videography',
    category: 'Videography',
    description: 'Story-driven cinematic films for weddings, events, and brands.',
    icon: 'Video',
    features: ['4K cinema cameras', 'Professional editing', 'Color grading', 'Highlight reel'],
    
  },
  {
    slug: 'digital-printing',
    title: 'Digital Printing',
    category: 'Printing',
    description: 'High-quality digital printing for documents, photos, and marketing materials.',
    icon: 'Printer',
    features: ['Up to 12x18 size', 'Premium paper stocks', 'Fast turnaround', 'Bulk discounts'],
    
  },
  {
    slug: 'flex-printing',
    title: 'Flex Printing',
    category: 'Printing',
    description: 'Large format flex printing for banners, hoardings, and signage.',
    icon: 'Maximize',
    features: ['Any size available', 'UV-resistant ink', 'Indoor & outdoor', 'Installation service'],
  
  },
  {
    slug: 'business-cards',
    title: 'Business Cards',
    category: 'Printing',
    description: 'Premium business cards that make a lasting impression.',
    icon: 'Contact',
    features: ['Foil stamping', 'Embossing', 'Spot UV', '300gsm stock'],
    
  },
  {
    slug: 'invitation-cards',
    title: 'Invitation Cards',
    category: 'Printing',
    description: 'Custom-designed invitation cards for weddings and special events.',
    icon: 'Mail',
    features: ['Custom design', 'Premium finishes', 'Envelope included', 'Any quantity'],

  },
  {
    slug: 'mug-printing',
    title: 'Mug Printing',
    category: 'Printing',
    description: 'Personalized photo mugs — perfect gifts for any occasion.',
    icon: 'Coffee',
    features: ['Dishwasher safe', 'Full-color print', '11oz & 15oz', 'Bulk orders available'],
  
  },
  {
    slug: 'tshirt-printing',
    title: 'T-Shirt Printing',
    category: 'Printing',
    description: 'Custom t-shirt printing with your designs, logos, or photos.',
    icon: 'Shirt',
    features: ['Screen & DTF printing', 'Any fabric color', 'Bulk discounts', 'Wash-resistant'],
  
  },
  {
    slug: 'canvas-printing',
    title: 'Canvas Printing',
    category: 'Printing',
    description: 'Gallery-quality canvas prints that turn photos into art.',
    icon: 'Image',
    features: ['Museum-grade canvas', 'Custom sizes', 'Stretched & framed', '75-year warranty'],
  
  },
  {
    slug: 'photo-frames',
    title: 'Photo Frames',
    category: 'Printing',
    description: 'Handcrafted premium frames in wood, metal, and acrylic.',
    icon: 'Frame',
    features: ['Custom sizing', 'Premium materials', 'Acid-free matting', 'Wall-ready'],
  
  },
  {
    slug: 'logo-design',
    title: 'Logo Design',
    category: 'Graphic Design',
    description: 'Distinctive logo design that defines your brand identity.',
    icon: 'PenTool',
    features: ['3 concepts', 'Unlimited revisions', 'All file formats', 'Brand guidelines'],
    
  },
  {
    slug: 'social-media-design',
    title: 'Social Media Design',
    category: 'Graphic Design',
    description: 'Eye-catching social media graphics that grow your audience.',
    icon: 'Share2',
    features: ['Monthly packages', 'All platforms', 'Custom templates', 'Content calendar'],
    
  },
  {
    slug: 'brand-identity',
    title: 'Brand Identity',
    category: 'Graphic Design',
    description: 'Complete brand identity systems from concept to execution.',
    icon: 'Palette',
    features: ['Logo suite', 'Color palette', 'Typography guide', 'Brand book'],
    
  },
];

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 199,
    period: 'session',
    description: 'Perfect for portraits and small projects',
    features: [
      '1-hour photo session',
      '20 professionally edited photos',
      'Online gallery access',
      'Print rights included',
      'Same-day digital delivery',
    ],
    cta: 'Book Starter',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 599,
    period: 'session',
    description: 'Ideal for events and special occasions',
    popular: true,
    features: [
      '4-hour coverage',
      '150+ edited photos',
      'Cinematic highlight reel',
      'Premium online gallery',
      '10 printed photos included',
      'Drone shots (where allowed)',
      'Next-day delivery',
    ],
    cta: 'Book Professional',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2499,
    period: 'package',
    description: 'Complete wedding and large event coverage',
    features: [
      'Full-day coverage (up to 12 hours)',
      '500+ edited photos',
      'Cinematic wedding film (4K)',
      'Drone aerial coverage',
      'Premium photo album (40 pages)',
      'Two photographers',
      'Engagement session included',
      'Online gallery for 1 year',
    ],
    cta: 'Book Premium',
  },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  badge?: string;
  description: string;
};

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Premium Photo Frame Set',
    category: 'Frames',
    price: 49,
    oldPrice: 69,
    image: '',
    rating: 5,
    badge: 'Sale',
    description: 'Handcrafted wooden photo frames in three sizes with acid-free matting.',
  },
  {
    id: 'p2',
    name: 'Luxury Wedding Album',
    category: 'Albums',
    price: 149,
    image: '',
    rating: 5,
    badge: 'Best Seller',
    description: '40-page premium leather-bound album with thick archival pages.',
  },
  {
    id: 'p3',
    name: 'Personalized Photo Mug',
    category: 'Mugs',
    price: 18,
    oldPrice: 25,
    image: '',
    rating: 4,
    badge: 'Sale',
    description: '11oz ceramic mug with full-color photo print. Dishwasher safe.',
  },
  {
    id: 'p4',
    name: 'Custom T-Shirt Print',
    category: 'T-Shirts',
    price: 24,
    image: '',
    rating: 5,
    description: 'Premium cotton t-shirt with your custom design. All sizes available.',
  },
  {
    id: 'p5',
    name: 'Canvas Wall Art Print',
    category: 'Canvas',
    price: 79,
    oldPrice: 99,
    image: '',
    rating: 5,
    badge: 'Sale',
    description: 'Museum-grade canvas print, stretched and ready to hang. Custom sizes.',
  },
  {
    id: 'p6',
    name: 'Photo Gift Box',
    category: 'Gifts',
    price: 59,
    image: '',
    rating: 5,
    badge: 'New',
    description: 'Curated gift box with mini album, frame, and personalized mug.',
  },
  {
    id: 'p7',
    name: 'Acrylic Photo Block',
    category: 'Frames',
    price: 89,
    image: '',
    rating: 5,
    description: 'Modern acrylic photo block with crystal-clear finish. Desk or shelf display.',
  },
  {
    id: 'p8',
    name: 'Custom Calendar',
    category: 'Gifts',
    price: 29,
    image: '',
    rating: 4,
    badge: 'New',
    description: '12-month personalized calendar with your favorite photos.',
  },
];

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
};

export const portfolioItems: PortfolioItem[] = [
  { id: 'pf1', title: 'Eternal Vows', category: 'Wedding', image: '', description: 'A grand wedding celebration captured in cinematic detail.' },
  { id: 'pf2', title: 'Urban Elegance', category: 'Portrait', image: '', description: 'Fashion portrait session with dramatic studio lighting.' },
  { id: 'pf3', title: 'Concert Lights', category: 'Event', image: '', description: 'Live concert photography with dynamic stage lighting.' },
  { id: 'pf4', title: 'Golden Hour Bride', category: 'Wedding', image: '', description: 'Outdoor wedding portraits during golden hour.' },
  { id: 'pf5', title: 'Brand Identity', category: 'Design', image: '', description: 'Complete brand identity system for a luxury brand.' },
  { id: 'pf6', title: 'Custom Prints', category: 'Printing', image: '', description: 'Premium business cards with gold foil stamping.' },
  { id: 'pf7', title: 'Fashion Story', category: 'Portrait', image: '', description: 'Editorial fashion shoot for a designer collection.' },
  { id: 'pf8', title: 'Festival Night', category: 'Event', image: '', description: 'Music festival coverage with crowd and stage shots.' },
  { id: 'pf9', title: 'Studio Session', category: 'Portrait', image: '', description: 'Minimal studio portrait with dramatic lighting.' },
  { id: 'pf10', title: 'Intimate Ceremony', category: 'Wedding', image: '', description: 'Small wedding ceremony with emotional candid moments.' },
  { id: 'pf11', title: 'Product Launch', category: 'Event', image: '', description: 'Corporate product launch event photography.' },
  { id: 'pf12', title: 'Custom Merch', category: 'Printing', image: '', description: 'Branded t-shirt and mug printing for a startup.' },
];

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
};

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah & Michael Chen',
    role: 'Wedding Couple',
    content:
      'First Look Studio captured our wedding day perfectly. Every photo tells a story — the emotions, the details, the joy. The cinematic film brought tears to our eyes. Worth every penny.',
    rating: 5,
    avatar: '',
  },
  {
    id: '2',
    name: 'David Okonkwo',
    role: 'Corporate Client',
    content:
      'We hired them for our annual corporate gala. Professional from start to finish, delivered stunning photos within 48 hours, and the large format prints were gallery quality.',
    rating: 5,
    avatar: '',
  },
  {
    id: '3',
    name: 'Priya Sharma',
    role: 'Portrait Client',
    content:
      'The portrait session was an incredible experience. They made me feel so comfortable and the results were breathtaking. I have never looked better in photos!',
    rating: 5,
    avatar: '',
  },
  {
    id: '4',
    name: 'James Whitfield',
    role: 'Business Owner',
    content:
      'Got my business cards and brand identity designed here. The gold foil cards are stunning — clients always comment on them. Truly premium quality.',
    rating: 5,
    avatar: '',
  },
  {
    id: '5',
    name: 'Maria Rodriguez',
    role: 'Event Planner',
    content:
      'As an event planner, I have worked with many studios. First Look is in a league of their own. Reliable, creative, and the photos always exceed expectations.',
    rating: 5,
    avatar: '',
  },
  {
    id: '6',
    name: 'Ahmed Hassan',
    role: 'Printing Client',
    content:
      'The flex printing quality for our store signage was outstanding. Vibrant colors, perfect finish, and delivered on time. My go-to printing studio now.',
    rating: 5,
    avatar: '',
  },
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: '10-wedding-photography-tips',
    title: '10 Essential Wedding Photography Tips for Couples',
    excerpt:
      'From choosing the right photographer to timing your golden hour shots — everything you need to know for stunning wedding photos.',
    category: 'Wedding',
    date: 'Aug 2, 2026',
    readTime: '5 min read',
    image: '',
  },
  {
    slug: 'choosing-right-print-service',
    title: 'How to Choose the Right Printing Service for Your Needs',
    excerpt:
      'Digital, flex, canvas, or offset? A complete guide to understanding printing technologies and picking the best option for your project.',
    category: 'Printing',
    date: 'Jul 28, 2026',
    readTime: '7 min read',
    image: '',
  },
  {
    slug: 'cinematic-videography-guide',
    title: 'The Art of Cinematic Videography: A Complete Guide',
    excerpt:
      'Learn how we craft story-driven films — from camera movements and lighting to color grading and sound design.',
    category: 'Videography',
    date: 'Jul 20, 2026',
    readTime: '8 min read',
    image: '',
  },
  {
    slug: 'brand-identity-design',
    title: 'Building a Brand Identity That Stands Out',
    excerpt:
      'Your brand is more than a logo. Discover the elements that create a memorable brand identity in a crowded market.',
    category: 'Design',
    date: 'Jul 12, 2026',
    readTime: '6 min read',
    image: '',
  },
  {
    slug: 'drone-photography-essentials',
    title: 'Drone Photography: Capturing the World from Above',
    excerpt:
      'Aerial photography opens up new creative possibilities. Here is what you need to know before booking a drone session.',
    category: 'Photography',
    date: 'Jul 5, 2026',
    readTime: '4 min read',
    image: '',
  },
  {
    slug: 'custom-gifts-ideas',
    title: '10 Custom Photo Gift Ideas for Every Occasion',
    excerpt:
      'From personalized mugs to canvas prints, explore unique photo gift ideas that your loved ones will cherish forever.',
    category: 'Lifestyle',
    date: 'Jun 28, 2026',
    readTime: '5 min read',
    image: '',
  },
];

export type FAQItem = {
  question: string;
  answer: string;
};

export const faqs: FAQItem[] = [
  {
    question: 'How do I book a photography session?',
    answer:
      'You can book directly through our Booking page. Choose your service, select a date and time, pick your preferred photographer, and complete the advance payment to confirm your appointment.',
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'Cancellations made 48 hours before the appointment receive a full refund. Within 48 hours, 50% of the advance payment is retained. You can cancel anytime from your customer dashboard.',
  },
  {
    question: 'How long does it take to receive my photos?',
    answer:
      'Portrait sessions are delivered within 3-5 business days. Events and weddings take 2-3 weeks for full editing. Passport photos are ready instantly. Rush delivery is available for an additional fee.',
  },
  {
    question: 'Do you offer printing services alongside photography?',
    answer:
      'Yes! We offer digital printing, flex printing, canvas prints, photo frames, mug printing, t-shirt printing, business cards, and invitation cards — all produced in-house with premium materials.',
  },
  {
    question: 'Can I order custom printed products online?',
    answer:
      'Absolutely. Visit our Shop to browse frames, albums, mugs, t-shirts, canvas prints, and photo gifts. Add items to your cart, apply coupons, and checkout securely with Stripe.',
  },
  {
    question: 'Do you travel for destination weddings?',
    answer:
      'Yes, we cover destination weddings worldwide. Travel and accommodation costs are additional and quoted based on location. Contact us for a custom destination package.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards through Stripe, including Visa, Mastercard, and American Express. Advance payment is required to confirm bookings.',
  },
  {
    question: 'Can I get a custom quote for my project?',
    answer:
      'Of course! Contact us through our Contact page with your project details, and we will provide a tailored quote within 24 hours.',
  },
];
