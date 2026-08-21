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
  const { data: page, error: pageError } = await supabaseAdmin
    .from('pages')
    .select('id')
    .eq('slug', '/')
    .eq('status', 'published')
    .maybeSingle();

  if (pageError || !page) {
    return {};
  }

  const { data: section, error: sectionError } = await supabaseAdmin
    .from('page_sections')
    .select('content, is_visible')
    .eq('page_id', page.id)
    .eq('section_key', 'hero')
    .maybeSingle();

  if (sectionError || !section || section.is_visible === false) {
    return {};
  }

  if (
    !section.content ||
    typeof section.content !== 'object' ||
    Array.isArray(section.content)
  ) {
    return {};
  }

  return section.content as PublicHeroContent;
}
