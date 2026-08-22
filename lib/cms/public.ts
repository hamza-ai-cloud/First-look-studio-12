import { supabaseAdmin } from '@/lib/supabaseAdmin';

export type PublicSiteSettings = {
  identity: {
    name?: string;
    tagline?: string;
    logo_url?: string;
  };

  contact: {
    email?: string;
    hours?: string;
    phone?: string;
    address?: string;
  };

  social: {
    tiktok?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
  };

  footer: {
    copyright?: string;
    description?: string;
  };

  general: {
    maintenance_mode?: boolean;
    show_cookie_notice?: boolean;
  };
};

const defaultSettings: PublicSiteSettings = {
  identity: {},
  contact: {},
  social: {},
  footer: {},
  general: {},
};

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('setting_key, setting_value')
    .eq('is_public', true);

  if (error) {
    console.error(
      '[CMS] Failed to load public site settings:',
      error.message
    );

    return defaultSettings;
  }

  const settings: PublicSiteSettings = {
    identity: {},
    contact: {},
    social: {},
    footer: {},
    general: {},
  };

  for (const row of data || []) {
    const value =
      row.setting_value &&
      typeof row.setting_value === 'object' &&
      !Array.isArray(row.setting_value)
        ? row.setting_value as Record<string, unknown>
        : {};

    switch (row.setting_key) {
      case 'site_identity':
        settings.identity = {
          name:
            typeof value.name === 'string'
              ? value.name
              : undefined,
          tagline:
            typeof value.tagline === 'string'
              ? value.tagline
              : undefined,
          logo_url:
            typeof value.logo_url === 'string'
              ? value.logo_url
              : undefined,
        };
        break;

      case 'contact_information':
        settings.contact = {
          email:
            typeof value.email === 'string'
              ? value.email
              : undefined,
          hours:
            typeof value.hours === 'string'
              ? value.hours
              : undefined,
          phone:
            typeof value.phone === 'string'
              ? value.phone
              : undefined,
          address:
            typeof value.address === 'string'
              ? value.address
              : undefined,
        };
        break;

      case 'social_links':
        settings.social = {
          tiktok:
            typeof value.tiktok === 'string'
              ? value.tiktok
              : undefined,
          youtube:
            typeof value.youtube === 'string'
              ? value.youtube
              : undefined,
          facebook:
            typeof value.facebook === 'string'
              ? value.facebook
              : undefined,
          instagram:
            typeof value.instagram === 'string'
              ? value.instagram
              : undefined,
        };
        break;

      case 'footer_settings':
        settings.footer = {
          copyright:
            typeof value.copyright === 'string'
              ? value.copyright
              : undefined,
          description:
            typeof value.description === 'string'
              ? value.description
              : undefined,
        };
        break;

      case 'general_settings':
        settings.general = {
          maintenance_mode:
            typeof value.maintenance_mode === 'boolean'
              ? value.maintenance_mode
              : undefined,
          show_cookie_notice:
            typeof value.show_cookie_notice === 'boolean'
              ? value.show_cookie_notice
              : undefined,
        };
        break;
    }
  }

  return settings;
}

export type PublicThemeSettings = {
  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color?: string | null;
  background_color?: string | null;
  surface_color?: string | null;
  text_color?: string | null;
  muted_text_color?: string | null;
  border_color?: string | null;
  heading_font?: string | null;
  body_font?: string | null;
  button_radius?: number | null;
  card_radius?: number | null;
  custom_css?: string | null;
};

export async function getPublicTheme(): Promise<PublicThemeSettings> {
  const { data, error } = await supabaseAdmin
    .from('theme_settings')
    .select(
      [
        'primary_color',
        'secondary_color',
        'accent_color',
        'background_color',
        'surface_color',
        'text_color',
        'muted_text_color',
        'border_color',
        'heading_font',
        'body_font',
        'button_radius',
        'card_radius',
        'custom_css',
      ].join(', ')
    )
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      '[CMS] Failed to load public theme:',
      error.message
    );

    return {};
  }

  if (!data || typeof data !== 'object') {
    return {};
  }

  return data as PublicThemeSettings;
}


export type PublicHomeSection = {
  id: string;
  section_key: string;
  section_type: string;
  title?: string | null;
  content: Record<string, unknown>;
  sort_order: number;
  is_visible: boolean;
};

export async function getPublicHomeSections(): Promise<PublicHomeSection[]> {
  const { data: page, error: pageError } = await supabaseAdmin
    .from('pages')
    .select('id')
    .eq('slug', 'home')
    .eq('status', 'published')
    .maybeSingle();

  if (pageError || !page) {
    console.error(
      '[CMS] Failed to load public Home page:',
      pageError?.message
    );
    return [];
  }

  const { data: sections, error: sectionsError } = await supabaseAdmin
    .from('page_sections')
    .select(
      'id, section_key, section_type, title, content, sort_order, is_visible'
    )
    .eq('page_id', page.id)
    .eq('is_visible', true)
    .order('sort_order', { ascending: true });

  if (sectionsError) {
    console.error(
      '[CMS] Failed to load public Home sections:',
      sectionsError.message
    );
    return [];
  }

  return (sections || [])
    .filter(
      (section) =>
        section &&
        typeof section.content === 'object' &&
        section.content !== null &&
        !Array.isArray(section.content)
    )
    .map((section) => ({
      id: String(section.id),
      section_key: String(section.section_key),
      section_type: String(section.section_type),
      title:
        typeof section.title === 'string'
          ? section.title
          : null,
      content:
        section.content as Record<string, unknown>,
      sort_order: Number(section.sort_order ?? 0),
      is_visible: section.is_visible !== false,
    }));
}

export type PublicHeroContent = {
  eyebrow?: string;
  heading?: string;
  heading_highlight?: string;
  description?: string;
  primary_button_text?: string;
  primary_button_url?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
  stats?: {
    value: string;
    label: string;
  }[];
  show_stats?: boolean;
  show_scroll_indicator?: boolean;
};

export async function getPublicHero(): Promise<PublicHeroContent> {
  const defaultHero: PublicHeroContent = {
    eyebrow: "PREMIUM PHOTOGRAPHY STUDIO",
    heading: "Capturing Moments",
    heading_highlight: "Worth Remembering",
    description:
      "From cinematic wedding films to premium printing and custom gifts — First Look Studio brings your vision to life with artistry and precision.",
    primary_button_text: "Book a Session",
    primary_button_url: "/booking",
    secondary_button_text: "View Portfolio",
    secondary_button_url: "/portfolio",
    stats: [
      {
        value: "500+",
        label: "Events Covered",
      },
      {
        value: "12K+",
        label: "Happy Clients",
      },
      {
        value: "15+",
        label: "Years Experience",
      },
      {
        value: "50K+",
        label: "Photos Delivered",
      },
    ],
    show_stats: true,
    show_scroll_indicator: true,
  };

  // The public website always has a safe/default Hero.
  // CMS content overrides it only when valid published content exists.
  const { data: page, error: pageError } = await supabaseAdmin
    .from("pages")
    .select("id")
    .in("slug", ["home", "/"])
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (pageError || !page) {
    if (pageError) {
      console.error(
        "[CMS] Failed to load public Home page:",
        pageError.message
      );
    }

    return defaultHero;
  }

  const { data: section, error: sectionError } = await supabaseAdmin
    .from("page_sections")
    .select("content, is_visible")
    .eq("page_id", page.id)
    .eq("section_key", "hero")
    .maybeSingle();

  // If CMS has no Hero yet, keep the original website Hero.
  if (sectionError || !section) {
    return defaultHero;
  }

  // Admin can intentionally hide the Hero.
  if (section.is_visible === false) {
    return {};
  }

  if (
    !section.content ||
    typeof section.content !== "object" ||
    Array.isArray(section.content)
  ) {
    return defaultHero;
  }

  // CMS values override defaults, while missing fields retain
  // the original production content.
  const content = section.content as Record<string, unknown>;

  return {
    ...defaultHero,
    ...content,
    stats:
      Array.isArray(content.stats)
        ? content.stats
            .filter(
              (item): item is { value: string; label: string } =>
                !!item &&
                typeof item === "object" &&
                typeof (item as Record<string, unknown>).value === "string" &&
                typeof (item as Record<string, unknown>).label === "string"
            )
        : defaultHero.stats,
  };
}



export type PublicAboutContent = {
  eyebrow?: string;
  heading?: string;
  heading_highlight?: string;
  paragraphs?: string[];
  stats?: {
    value: string;
    label: string;
  }[];
  image_urls?: string[];
  years_experience?: string;
};

export async function getPublicAboutContent(): Promise<PublicAboutContent> {
  const fallback: PublicAboutContent = {
    eyebrow: "About First Look",
    heading: "Where Art Meets",
    heading_highlight: "Precision",
    paragraphs: [
      "For over 15 years, First Look Studio has been a beacon of visual excellence. From breathtaking wedding cinematography to museum-quality printing, we blend artistic vision with technical mastery to deliver results that exceed expectations.",
      "Our team of award-winning photographers, videographers, and designers work under one roof — ensuring every project, from a passport photo to a luxury wedding film, receives the same obsessive attention to detail.",
    ],
    stats: [
      { value: "25+", label: "Award-Winning Team" },
      { value: "5,000 sqft", label: "Studio Space" },
      { value: "99%", label: "Client Satisfaction" },
      { value: "8,000+", label: "Projects Completed" },
    ],
    years_experience: "15+",
  };

  const { data: page } = await supabaseAdmin
    .from("pages")
    .select("id")
    .in("slug", ["home", "/"])
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!page) return fallback;

  const { data: section } = await supabaseAdmin
    .from("page_sections")
    .select("content, is_visible")
    .eq("page_id", page.id)
    .eq("section_key", "about")
    .maybeSingle();

  if (!section || section.is_visible === false) return fallback;

  if (
    !section.content ||
    typeof section.content !== "object" ||
    Array.isArray(section.content)
  ) {
    return fallback;
  }

  const content = section.content as Record<string, unknown>;

  return {
    ...fallback,
    ...(content as PublicAboutContent),
  };
}

export type PublicGalleryItem = {
  id?: string;
  title: string;
  image_url: string;
  category?: string;
  aspect_ratio?: string | null;
  description?: string | null;
};

export async function getPublicGallery(): Promise<PublicGalleryItem[]> {
  const { data, error } = await supabaseAdmin
    .from("gallery")
    .select(
      "id, title, image_url, category, aspect_ratio, description"
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(100);

  if (error) {
    console.error(
      "[CMS] Failed to load public gallery:",
      error.message
    );
    return [];
  }

  return (data || []) as PublicGalleryItem[];
}

export async function getPublicPortfolio(): Promise<PublicGalleryItem[]> {
  const { data, error } = await supabaseAdmin
    .from("portfolio")
    .select(
      "id, title, image_url, category, aspect_ratio, description, is_featured"
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(100);

  if (error) {
    console.error(
      "[CMS] Failed to load public portfolio:",
      error.message
    );
    return [];
  }

  return (data || []) as PublicGalleryItem[];
}

export async function getPublicFeaturedGallery(): Promise<PublicGalleryItem[]> {
  const { data, error } = await supabaseAdmin
    .from("gallery")
    .select(
      "id, title, image_url, category, aspect_ratio, description"
    )
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(12);

  if (error) {
    console.error(
      "[CMS] Failed to load public featured gallery:",
      error.message
    );
    return [];
  }

  return (data || []) as PublicGalleryItem[];
}

export async function getPublicServices() {
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(50);

  if (error) {
    console.error(
      "[CMS] Failed to load public services:",
      error.message
    );
    return [];
  }

  return data || [];
}

export type PublicTestimonial = {
  id?: string;
  name: string;
  role?: string | null;
  content: string;
  rating: number;
};

export type PublicBlogPreviewPost = {
  slug: string;
  title: string;
  category?: string;
  date?: string;
  readTime?: string;
  excerpt?: string;
  image_url?: string;
};

export type PublicBlogPreviewContent = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  post_limit?: number;
  view_all_text?: string;
  view_all_url?: string;
  posts?: PublicBlogPreviewPost[];
};

export type PublicNewsletterContent = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  input_placeholder?: string;
  button_text?: string;
  success_text?: string;
};

export type PublicCTAContent = {
  eyebrow?: string;
  heading?: string;
  heading_highlight?: string;
  description?: string;
  primary_button_text?: string;
  primary_button_url?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
};

export type PublicNavigationItem = {
  id: string;
  location: string;
  label: string;
  href: string;
  icon?: string | null;
  parent_id?: string | null;
  sort_order: number;
  is_visible: boolean;
  open_new_tab: boolean;
};

export async function getPublicNavigation(
  location: "header" | "footer" | "mobile"
): Promise<PublicNavigationItem[]> {
  const { data, error } = await supabaseAdmin
    .from("navigation_items")
    .select(
      "id, location, label, href, icon, parent_id, sort_order, is_visible, open_new_tab"
    )
    .eq("location", location)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(
      `[CMS] Failed to load ${location} navigation:`,
      error.message
    );
    return [];
  }

  return (data || []) as PublicNavigationItem[];
}
