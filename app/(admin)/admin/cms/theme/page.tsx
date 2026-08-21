'use client';

import {
  Check,
  Loader2,
  Palette,
  RotateCcw,
  Save,
  Type,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type ThemeSettings = {
  id?: string;

  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color?: string | null;

  background_color?: string | null;
  surface_color?: string | null;
  text_color?: string | null;
  muted_text_color?: string | null;

  button_background?: string | null;
  button_text?: string | null;
  border_color?: string | null;

  heading_font?: string | null;
  body_font?: string | null;

  border_radius?: number | null;
  button_radius?: number | null;

  container_width?: number | null;

  color_mode?: string | null;

  custom_css?: string | null;
};

const DEFAULT_THEME: ThemeSettings = {
  primary_color: '#c99634',
  secondary_color: '#161b22',
  accent_color: '#d4a33d',

  background_color: '#0b0f14',
  surface_color: '#0d1117',
  text_color: '#ffffff',
  muted_text_color: '#8b949e',

  button_background: '#c99634',
  button_text: '#000000',
  border_color: '#30363d',

  heading_font: 'Inter',
  body_font: 'Inter',

  border_radius: 16,
  button_radius: 12,

  container_width: 1440,

  color_mode: 'dark',

  custom_css: '',
};

const FONT_OPTIONS = [
  'Inter',
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'system-ui',
  'sans-serif',
  'serif',
];

export default function ThemeStudioPage() {
  const [theme, setTheme] =
    useState<ThemeSettings>(
      DEFAULT_THEME
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  async function loadTheme() {
    try {
      setLoading(true);

      const response = await fetch(
        '/api/admin/cms/theme',
        {
          cache: 'no-store',
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            'Failed to load theme'
        );
      }

      setTheme({
        ...DEFAULT_THEME,
        ...(result.data || {}),
      });
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to load theme'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTheme();
  }, []);

  function update(
    field: keyof ThemeSettings,
    value: unknown
  ) {
    setTheme((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  async function saveTheme() {
    try {
      setSaving(true);
      setSaved(false);

      const response = await fetch(
        '/api/admin/cms/theme',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(theme),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            'Failed to save theme'
        );
      }

      setTheme({
        ...DEFAULT_THEME,
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
          : 'Failed to save theme'
      );
    } finally {
      setSaving(false);
    }
  }

  function resetTheme() {
    const confirmed = window.confirm(
      'Reset the Theme Studio values to the default theme?'
    );

    if (!confirmed) return;

    setTheme(DEFAULT_THEME);
    setSaved(false);
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
              <Palette className="h-3.5 w-3.5 text-[#d4a33d]" />
              CMS / Theme Studio
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Theme Studio
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8b949e]">
              Configure the visual design system for First Look
              Studio.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetTheme}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-[#c9d1d9] hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>

            <button
              type="button"
              onClick={saveTheme}
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

              {saved ? 'Saved' : 'Save Theme'}
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <main className="space-y-6">
          <Panel
            icon={
              <Palette className="h-4 w-4" />
            }
            title="Color System"
            description="Define the global color tokens used by the design system."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <ColorField
                label="Primary"
                value={
                  theme.primary_color ||
                  '#c99634'
                }
                onChange={(value) =>
                  update(
                    'primary_color',
                    value
                  )
                }
              />

              <ColorField
                label="Secondary"
                value={
                  theme.secondary_color ||
                  '#161b22'
                }
                onChange={(value) =>
                  update(
                    'secondary_color',
                    value
                  )
                }
              />

              <ColorField
                label="Accent"
                value={
                  theme.accent_color ||
                  '#d4a33d'
                }
                onChange={(value) =>
                  update(
                    'accent_color',
                    value
                  )
                }
              />

              <ColorField
                label="Background"
                value={
                  theme.background_color ||
                  '#0b0f14'
                }
                onChange={(value) =>
                  update(
                    'background_color',
                    value
                  )
                }
              />

              <ColorField
                label="Surface"
                value={
                  theme.surface_color ||
                  '#0d1117'
                }
                onChange={(value) =>
                  update(
                    'surface_color',
                    value
                  )
                }
              />

              <ColorField
                label="Text"
                value={
                  theme.text_color ||
                  '#ffffff'
                }
                onChange={(value) =>
                  update(
                    'text_color',
                    value
                  )
                }
              />

              <ColorField
                label="Muted Text"
                value={
                  theme.muted_text_color ||
                  '#8b949e'
                }
                onChange={(value) =>
                  update(
                    'muted_text_color',
                    value
                  )
                }
              />

              <ColorField
                label="Border"
                value={
                  theme.border_color ||
                  '#30363d'
                }
                onChange={(value) =>
                  update(
                    'border_color',
                    value
                  )
                }
              />

              <ColorField
                label="Button Background"
                value={
                  theme.button_background ||
                  '#c99634'
                }
                onChange={(value) =>
                  update(
                    'button_background',
                    value
                  )
                }
              />

              <ColorField
                label="Button Text"
                value={
                  theme.button_text ||
                  '#000000'
                }
                onChange={(value) =>
                  update(
                    'button_text',
                    value
                  )
                }
              />
            </div>
          </Panel>

          <Panel
            icon={
              <Type className="h-4 w-4" />
            }
            title="Typography"
            description="Choose the global heading and body typefaces."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Heading Font"
                value={
                  theme.heading_font ||
                  'Inter'
                }
                options={FONT_OPTIONS}
                onChange={(value) =>
                  update(
                    'heading_font',
                    value
                  )
                }
              />

              <SelectField
                label="Body Font"
                value={
                  theme.body_font ||
                  'Inter'
                }
                options={FONT_OPTIONS}
                onChange={(value) =>
                  update(
                    'body_font',
                    value
                  )
                }
              />
            </div>
          </Panel>

          <Panel
            icon={
              <Palette className="h-4 w-4" />
            }
            title="Layout & Shape"
            description="Control the global geometry of the design system."
          >
            <div className="grid gap-5 sm:grid-cols-3">
              <NumberField
                label="Border Radius"
                value={
                  theme.border_radius ?? 16
                }
                suffix="px"
                onChange={(value) =>
                  update(
                    'border_radius',
                    value
                  )
                }
              />

              <NumberField
                label="Button Radius"
                value={
                  theme.button_radius ?? 12
                }
                suffix="px"
                onChange={(value) =>
                  update(
                    'button_radius',
                    value
                  )
                }
              />

              <NumberField
                label="Container Width"
                value={
                  theme.container_width ??
                  1440
                }
                suffix="px"
                onChange={(value) =>
                  update(
                    'container_width',
                    value
                  )
                }
              />
            </div>
          </Panel>

          <Panel
            icon={
              <Palette className="h-4 w-4" />
            }
            title="Color Mode"
            description="Set the preferred global appearance mode."
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                'dark',
                'light',
                'system',
              ].map((mode) => {
                const active =
                  theme.color_mode ===
                  mode;

                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() =>
                      update(
                        'color_mode',
                        mode
                      )
                    }
                    className={`rounded-xl border px-4 py-4 text-left transition ${
                      active
                        ? 'border-[#c99634]/60 bg-[#c99634]/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize text-white">
                        {mode}
                      </span>

                      {active && (
                        <Check className="h-4 w-4 text-[#d4a33d]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel
            icon={
              <Type className="h-4 w-4" />
            }
            title="Advanced CSS"
            description="Optional custom CSS for future advanced customization."
          >
            <textarea
              value={theme.custom_css || ''}
              onChange={(event) =>
                update(
                  'custom_css',
                  event.target.value
                )
              }
              rows={14}
              spellCheck={false}
              placeholder={`/* Advanced theme overrides */

:root {
  --studio-primary: #c99634;
}`}
              className="w-full rounded-xl border border-white/10 bg-[#161b22] px-3 py-3 font-mono text-xs leading-6 text-white outline-none placeholder:text-[#6e7681] focus:border-[#c99634]/50"
            />
          </Panel>
        </main>

        <aside className="space-y-4">
          <ThemePreview theme={theme} />

          <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-5">
            <h2 className="text-sm font-semibold text-white">
              Design Tokens
            </h2>

            <div className="mt-4 space-y-3">
              <Token
                label="Primary"
                value={
                  theme.primary_color
                }
              />

              <Token
                label="Background"
                value={
                  theme.background_color
                }

              />

              <Token
                label="Text"
                value={
                  theme.text_color
                }
              />

              <Token
                label="Border Radius"
                value={`${theme.border_radius}px`}
              />

              <Token
                label="Container"
                value={`${theme.container_width}px`}
              />
            </div>
          </div>
        </aside>
      </div>
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

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#8b949e]">
        {label}
      </label>

      <div className="flex gap-2">
        <input
          type="color"
          value={
            /^#[0-9A-Fa-f]{6}$/.test(value)
              ? value
              : '#000000'
          }
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="h-11 w-12 cursor-pointer rounded-xl border border-white/10 bg-[#161b22] p-1"
        />

        <input
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#161b22] px-3 font-mono text-xs text-white outline-none focus:border-[#c99634]/50"
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#8b949e]">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 w-full rounded-xl border border-white/10 bg-[#161b22] px-3 text-sm text-white outline-none focus:border-[#c99634]/50"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberField({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#8b949e]">
        {label}
      </label>

      <div className="relative">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(event) =>
            onChange(
              Number(event.target.value)
            )
          }
          className="h-11 w-full rounded-xl border border-white/10 bg-[#161b22] px-3 pr-10 text-sm text-white outline-none focus:border-[#c99634]/50"
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#6e7681]">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function Token({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
      <span className="text-[10px] uppercase tracking-wider text-[#6e7681]">
        {label}
      </span>

      <span className="max-w-[180px] truncate font-mono text-[10px] text-[#c9d1d9]">
        {String(value || '—')}
      </span>
    </div>
  );
}

function ThemePreview({
  theme,
}: {
  theme: ThemeSettings;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl border p-5"
      style={{
        backgroundColor:
          theme.background_color ||
          '#0b0f14',
        borderColor:
          theme.border_color ||
          '#30363d',
        color:
          theme.text_color ||
          '#ffffff',
      }}
    >
      <div className="mb-5">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{
            color:
              theme.muted_text_color ||
              '#8b949e',
          }}
        >
          Live Preview
        </p>

        <h2
          className="mt-2 text-2xl font-semibold"
          style={{
            fontFamily:
              theme.heading_font ||
              'Inter',
          }}
        >
          First Look Studio
        </h2>

        <p
          className="mt-2 text-xs leading-5"
          style={{
            color:
              theme.muted_text_color ||
              '#8b949e',
            fontFamily:
              theme.body_font ||
              'Inter',
          }}
        >
          Photography, films and visual storytelling.
        </p>
      </div>

      <div
        className="rounded-xl border p-4"
        style={{
          backgroundColor:
            theme.surface_color ||
            '#0d1117',
          borderColor:
            theme.border_color ||
            '#30363d',
          borderRadius:
            theme.border_radius || 16,
        }}
      >
        <div className="flex gap-3">
          <div
            className="h-10 w-10 rounded-xl"
            style={{
              backgroundColor:
                theme.primary_color ||
                '#c99634',
              borderRadius:
                theme.button_radius || 12,
            }}
          />

          <div className="flex-1">
            <div className="h-3 w-24 rounded-full bg-white/10" />
            <div className="mt-2 h-2 w-full rounded-full bg-white/5" />
            <div className="mt-2 h-2 w-3/4 rounded-full bg-white/5" />
          </div>
        </div>

        <button
          type="button"
          className="mt-5 w-full px-4 py-2.5 text-xs font-semibold"
          style={{
            backgroundColor:
              theme.button_background ||
              '#c99634',
            color:
              theme.button_text ||
              '#000000',
            borderRadius:
              theme.button_radius || 12,
          }}
        >
          Book Your Session
        </button>
      </div>
    </div>
  );
}
