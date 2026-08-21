'use client';

import {
  Check,
  Clock3,
  Globe2,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type SiteSettings = {
  id?: string;

  site_name?: string | null;
  tagline?: string | null;

  logo_url?: string | null;
  favicon_url?: string | null;

  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;

  address?: string | null;

  business_hours?: string | null;

  instagram_url?: string | null;
  facebook_url?: string | null;
  youtube_url?: string | null;
  tiktok_url?: string | null;

  currency?: string | null;

  copyright_text?: string | null;

  announcement_enabled?: boolean;
  announcement_text?: string | null;

  maintenance_mode?: boolean;
};

const DEFAULT_SETTINGS: SiteSettings = {
  site_name: '',
  tagline: '',
  logo_url: '',
  favicon_url: '',
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  business_hours: '',
  instagram_url: '',
  facebook_url: '',
  youtube_url: '',
  tiktok_url: '',
  currency: 'USD',
  copyright_text: '',
  announcement_enabled: false,
  announcement_text: '',
  maintenance_mode: false,
};

export default function SiteSettingsPage() {
  const [settings, setSettings] =
    useState<SiteSettings>(
      DEFAULT_SETTINGS
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  async function loadSettings() {
    try {
      setLoading(true);

      const response = await fetch(
        '/api/admin/cms/settings',
        {
          cache: 'no-store',
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            'Failed to load settings'
        );
      }

      setSettings({
        ...DEFAULT_SETTINGS,
        ...(result.data || {}),
      });
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to load settings'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function update(
    field: keyof SiteSettings,
    value: unknown
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  async function saveSettings() {
    try {
      setSaving(true);
      setSaved(false);

      const response = await fetch(
        '/api/admin/cms/settings',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            'Failed to save settings'
        );
      }

      setSettings({
        ...DEFAULT_SETTINGS,
        ...(result.data || {}),
      });

      setSaved(true);

      window.setTimeout(
        () => setSaved(false),
        2500
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to save settings'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#d4a33d]" />
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1117] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#c99634]/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b949e]">
              <Settings className="h-3.5 w-3.5 text-[#d4a33d]" />
              CMS / Global Settings
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Site Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8b949e]">
              Manage the global identity and contact information
              used across First Look Studio.
            </p>
          </div>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c99634] px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saved ? 'Saved' : 'Save Settings'}
          </button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          icon={<Globe2 className="h-4 w-4" />}
          title="Studio Identity"
          description="Basic information about your studio."
        >
          <div className="space-y-5">
            <Field
              label="Studio Name"
              value={settings.site_name || ''}
              onChange={(value) =>
                update('site_name', value)
              }
              placeholder="First Look Studio"
            />

            <Field
              label="Tagline"
              value={settings.tagline || ''}
              onChange={(value) =>
                update('tagline', value)
              }
              placeholder="Photography & Films"
            />

            <Field
              label="Logo URL"
              value={settings.logo_url || ''}
              onChange={(value) =>
                update('logo_url', value)
              }
              placeholder="https://..."
            />

            <Field
              label="Favicon URL"
              value={settings.favicon_url || ''}
              onChange={(value) =>
                update('favicon_url', value)
              }
              placeholder="https://..."
            />

            <Field
              label="Currency"
              value={settings.currency || 'USD'}
              onChange={(value) =>
                update('currency', value)
              }
              placeholder="USD"
            />
          </div>
        </Panel>

        <Panel
          icon={<Mail className="h-4 w-4" />}
          title="Contact Information"
          description="Global contact details displayed throughout the site."
        >
          <div className="space-y-5">
            <Field
              label="Email"
              value={settings.email || ''}
              onChange={(value) =>
                update('email', value)
              }
              placeholder="hello@firstlookstudio.com"
              type="email"
            />

            <Field
              label="Phone"
              value={settings.phone || ''}
              onChange={(value) =>
                update('phone', value)
              }
              placeholder="+1 000 000 0000"
            />

            <Field
              label="WhatsApp"
              value={settings.whatsapp || ''}
              onChange={(value) =>
                update('whatsapp', value)
              }
              placeholder="+10000000000"
            />

            <TextArea
              label="Studio Address"
              value={settings.address || ''}
              onChange={(value) =>
                update('address', value)
              }
              placeholder="Studio address..."
              rows={3}
            />
          </div>
        </Panel>

        <Panel
          icon={<Clock3 className="h-4 w-4" />}
          title="Business Hours"
          description="Tell visitors when the studio is available."
        >
          <TextArea
            label="Business Hours"
            value={
              settings.business_hours || ''
            }
            onChange={(value) =>
              update(
                'business_hours',
                value
              )
            }
            placeholder={`Monday - Friday: 9:00 AM - 6:00 PM
Saturday: 10:00 AM - 4:00 PM
Sunday: Closed`}
            rows={6}
          />
        </Panel>

        <Panel
          icon={<Share2 className="h-4 w-4" />}
          title="Social Media"
          description="Connect the studio's social profiles."
        >
          <div className="space-y-5">
            <Field
              label="Instagram"
              value={
                settings.instagram_url || ''
              }
              onChange={(value) =>
                update(
                  'instagram_url',
                  value
                )
              }
              placeholder="https://instagram.com/..."
            />

            <Field
              label="Facebook"
              value={
                settings.facebook_url || ''
              }
              onChange={(value) =>
                update(
                  'facebook_url',
                  value
                )
              }
              placeholder="https://facebook.com/..."
            />

            <Field
              label="YouTube"
              value={
                settings.youtube_url || ''
              }
              onChange={(value) =>
                update(
                  'youtube_url',
                  value
                )
              }
              placeholder="https://youtube.com/..."
            />

            <Field
              label="TikTok"
              value={
                settings.tiktok_url || ''
              }
              onChange={(value) =>
                update(
                  'tiktok_url',
                  value
                )
              }
              placeholder="https://tiktok.com/@..."
            />
          </div>
        </Panel>

        <Panel
          icon={<Sparkles className="h-4 w-4" />}
          title="Announcement Bar"
          description="Show a global announcement across the public website."
        >
          <div className="space-y-5">
            <Toggle
              label="Enable announcement"
              description="Display the announcement to visitors."
              checked={
                settings.announcement_enabled ===
                true
              }
              onChange={(value) =>
                update(
                  'announcement_enabled',
                  value
                )
              }
            />

            <TextArea
              label="Announcement Text"
              value={
                settings.announcement_text ||
                ''
              }
              onChange={(value) =>
                update(
                  'announcement_text',
                  value
                )
              }
              placeholder="Now booking weddings for 2027..."
              rows={3}
            />
          </div>
        </Panel>

        <Panel
          icon={<Settings className="h-4 w-4" />}
          title="Website Status"
          description="Advanced controls for the public website."
        >
          <div className="space-y-5">
            <Toggle
              label="Maintenance Mode"
              description="Temporarily place the public website into maintenance mode."
              checked={
                settings.maintenance_mode ===
                true
              }
              onChange={(value) =>
                update(
                  'maintenance_mode',
                  value
                )
              }
              danger
            />

            <TextArea
              label="Copyright Text"
              value={
                settings.copyright_text || ''
              }
              onChange={(value) =>
                update(
                  'copyright_text',
                  value
                )
              }
              placeholder="© 2026 First Look Studio. All rights reserved."
              rows={3}
            />
          </div>
        </Panel>
      </div>

      <section className="rounded-2xl border border-white/10 bg-[#0d1117] p-5">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#60491b] bg-[#171208] text-[#d4a33d]">
            <MapPin className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              Important
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#6e7681]">
              These settings are being stored in the CMS
              foundation. We will connect them to the existing
              public UI later so your current website design
              remains unchanged until each section is
              intentionally wired.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Panel({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0d1117] p-5 sm:p-6">
      <div className="mb-6 flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#60491b] bg-[#171208] text-[#d4a33d]">
          {icon}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-[#6e7681]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#8b949e]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-white/10 bg-[#161b22] px-3 text-sm text-white outline-none placeholder:text-[#6e7681] focus:border-[#c99634]/50"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#8b949e]">
        {label}
      </label>

      <textarea
        value={value}
        rows={rows}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#161b22] px-3 py-3 text-xs leading-6 text-white outline-none placeholder:text-[#6e7681] focus:border-[#c99634]/50"
      />
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  danger = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div>
        <p
          className={`text-xs font-semibold ${
            danger && checked
              ? 'text-red-400'
              : 'text-white'
          }`}
        >
          {label}
        </p>

        <p className="mt-1 text-[10px] leading-4 text-[#6e7681]">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? danger
              ? 'bg-red-500'
              : 'bg-[#c99634]'
            : 'bg-[#30363d]'
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked
              ? 'left-6'
              : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}
