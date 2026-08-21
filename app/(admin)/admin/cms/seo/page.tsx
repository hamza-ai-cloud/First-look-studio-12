'use client';

import {
  Check,
  Globe2,
  Image as ImageIcon,
  Loader2,
  Save,
  Search,
  Share2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type SeoRecord = {
  id?: string;
  page_id: string;
  title?: string | null;
  description?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
  robots_index?: boolean;
  robots_follow?: boolean;
  keywords?: string[] | null;
  schema_json?: Record<string, unknown> | null;
};

type Page = {
  id: string;
  title: string;
  slug: string;
};

export default function SeoManagerPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] =
    useState('');

  const [seo, setSeo] = useState<SeoRecord | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function loadPages() {
    try {
      setLoading(true);

      const response = await fetch(
        '/api/admin/cms/pages',
        {
          cache: 'no-store',
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to load pages'
        );
      }

      const pageData = result.data || [];

      setPages(pageData);

      if (pageData.length > 0) {
        setSelectedPage(pageData[0].id);
      }
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to load pages'
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadSeo(pageId: string) {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/cms/seo?page_id=${encodeURIComponent(
          pageId
        )}`,
        {
          cache: 'no-store',
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to load SEO settings'
        );
      }

      setSeo({
        page_id: pageId,
        robots_index: true,
        robots_follow: true,
        ...result.data,
      });
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to load SEO settings'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      loadSeo(selectedPage);
    }
  }, [selectedPage]);

  function update(
    field: keyof SeoRecord,
    value: unknown
  ) {
    setSeo((current) => ({
      ...(current || {
        page_id: selectedPage,
      }),
      [field]: value,
    }));
  }

  async function saveSeo() {
    if (!seo) return;

    try {
      setSaving(true);
      setSaved(false);

      const response = await fetch(
        '/api/admin/cms/seo',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...seo,
            page_id: selectedPage,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to save SEO settings'
        );
      }

      setSeo(result.data);
      setSaved(true);

      window.setTimeout(
        () => setSaved(false),
        2500
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to save SEO settings'
      );
    } finally {
      setSaving(false);
    }
  }

  const currentPage = pages.find(
    (page) => page.id === selectedPage
  );

  if (loading && pages.length === 0) {
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
              <Search className="h-3.5 w-3.5 text-[#d4a33d]" />
              CMS / SEO
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              SEO Manager
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8b949e]">
              Control search-engine metadata and social sharing
              information for every CMS page.
            </p>
          </div>

          <button
            type="button"
            onClick={saveSeo}
            disabled={saving || !seo}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c99634] px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saved ? 'Saved' : 'Save SEO'}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0d1117] p-4">
        <label className="mb-2 block text-xs font-medium text-[#8b949e]">
          Select Page
        </label>

        <select
          value={selectedPage}
          onChange={(event) =>
            setSelectedPage(event.target.value)
          }
          className="h-11 w-full max-w-xl rounded-xl border border-white/10 bg-[#161b22] px-3 text-sm text-white outline-none focus:border-[#c99634]/50"
        >
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.title} — {page.slug}
            </option>
          ))}
        </select>
      </section>

      {!seo || !currentPage ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d1117] p-10 text-center">
          <Search className="mx-auto h-8 w-8 text-[#484f58]" />
          <p className="mt-3 text-sm text-[#8b949e]">
            Select a page to manage its SEO settings.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <main className="space-y-6">
            <Panel
              icon={<Globe2 className="h-4 w-4" />}
              title="Search Engine"
              description="The information search engines use when indexing this page."
            >
              <div className="space-y-5">
                <Field
                  label="SEO Title"
                  value={seo.title || ''}
                  maxLength={60}
                  onChange={(value) =>
                    update('title', value)
                  }
                  placeholder={currentPage.title}
                />

                <TextArea
                  label="Meta Description"
                  value={seo.description || ''}
                  maxLength={160}
                  onChange={(value) =>
                    update('description', value)
                  }
                  placeholder="Describe this page for search engines..."
                />

                <Field
                  label="Canonical URL"
                  value={seo.canonical_url || ''}
                  onChange={(value) =>
                    update('canonical_url', value)
                  }
                  placeholder="https://firstlookstudio.com/about"
                />

                <Field
                  label="Keywords"
                  value={
                    seo.keywords?.join(', ') || ''
                  }
                  onChange={(value) =>
                    update(
                      'keywords',
                      value
                        .split(',')
                        .map((item) =>
                          item.trim()
                        )
                        .filter(Boolean)
                    )
                  }
                  placeholder="photography, wedding, studio"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <Toggle
                    label="Index page"
                    checked={
                      seo.robots_index !== false
                    }
                    onChange={(value) =>
                      update(
                        'robots_index',
                        value
                      )
                    }
                  />

                  <Toggle
                    label="Follow links"
                    checked={
                      seo.robots_follow !== false
                    }
                    onChange={(value) =>
                      update(
                        'robots_follow',
                        value
                      )
                    }
                  />
                </div>
              </div>
            </Panel>

            <Panel
              icon={<Share2 className="h-4 w-4" />}
              title="Open Graph"
              description="Control how this page looks when shared on social platforms."
            >
              <div className="space-y-5">
                <Field
                  label="OG Title"
                  value={seo.og_title || ''}
                  onChange={(value) =>
                    update('og_title', value)
                  }
                  placeholder={
                    seo.title ||
                    currentPage.title
                  }
                />

                <TextArea
                  label="OG Description"
                  value={
                    seo.og_description || ''
                  }
                  onChange={(value) =>
                    update(
                      'og_description',
                      value
                    )
                  }
                  placeholder={
                    seo.description ||
                    'Social sharing description...'
                  }
                />

                <Field
                  label="OG Image URL"
                  value={seo.og_image || ''}
                  onChange={(value) =>
                    update('og_image', value)
                  }
                  placeholder="https://..."
                />
              </div>
            </Panel>

            <Panel
              icon={<ImageIcon className="h-4 w-4" />}
              title="Twitter / X"
              description="Social preview metadata for Twitter and X."
            >
              <div className="space-y-5">
                <Field
                  label="Twitter Title"
                  value={
                    seo.twitter_title || ''
                  }
                  onChange={(value) =>
                    update(
                      'twitter_title',
                      value
                    )
                  }
                  placeholder={
                    seo.og_title ||
                    seo.title ||
                    currentPage.title
                  }
                />

                <TextArea
                  label="Twitter Description"
                  value={
                    seo.twitter_description ||
                    ''
                  }
                  onChange={(value) =>
                    update(
                      'twitter_description',
                      value
                    )
                  }
                  placeholder={
                    seo.og_description ||
                    seo.description ||
                    ''
                  }
                />

                <Field
                  label="Twitter Image URL"
                  value={
                    seo.twitter_image || ''
                  }
                  onChange={(value) =>
                    update(
                      'twitter_image',
                      value
                    )
                  }
                  placeholder="https://..."
                />
              </div>
            </Panel>

            <Panel
              icon={<Globe2 className="h-4 w-4" />}
              title="Structured Data"
              description="Optional JSON-LD schema for advanced search visibility."
            >
              <TextArea
                label="Schema JSON"
                value={
                  seo.schema_json
                    ? JSON.stringify(
                        seo.schema_json,
                        null,
                        2
                      )
                    : ''
                }
                onChange={(value) => {
                  if (!value.trim()) {
                    update(
                      'schema_json',
                      null
                    );
                    return;
                  }

                  try {
                    const parsed =
                      JSON.parse(value);

                    update(
                      'schema_json',
                      parsed
                    );
                  } catch {
                    // Keep the editor editable until valid JSON is entered.
                  }
                }}
                placeholder={`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "First Look Studio"
}`}
                mono
              />
            </Panel>
          </main>

          <aside className="space-y-4">
            <SeoPreview
              page={currentPage}
              seo={seo}
            />

            <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-5">
              <h3 className="text-sm font-semibold text-white">
                SEO Checklist
              </h3>

              <div className="mt-4 space-y-3">
                <CheckItem
                  label="SEO title"
                  complete={Boolean(
                    seo.title?.trim()
                  )}
                />

                <CheckItem
                  label="Meta description"
                  complete={Boolean(
                    seo.description?.trim()
                  )}
                />

                <CheckItem
                  label="Canonical URL"
                  complete={Boolean(
                    seo.canonical_url?.trim()
                  )}
                />

                <CheckItem
                  label="Social image"
                  complete={Boolean(
                    seo.og_image?.trim()
                  )}
                />

                <CheckItem
                  label="Structured data"
                  complete={Boolean(
                    seo.schema_json
                  )}
                />
              </div>
            </div>
          </aside>
        </div>
      )}
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
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium text-[#8b949e]">
          {label}
        </label>

        {maxLength && (
          <span className="text-[10px] text-[#6e7681]">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <input
        value={value}
        maxLength={maxLength}
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
  maxLength,
  mono,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium text-[#8b949e]">
          {label}
        </label>

        {maxLength && (
          <span className="text-[10px] text-[#6e7681]">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        value={value}
        maxLength={maxLength}
        rows={mono ? 10 : 4}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        spellCheck={!mono}
        className={`w-full rounded-xl border border-white/10 bg-[#161b22] px-3 py-3 text-xs leading-6 text-white outline-none placeholder:text-[#6e7681] focus:border-[#c99634]/50 ${
          mono ? 'font-mono' : ''
        }`}
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <span className="text-xs font-medium text-white">
        {label}
      </span>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked
            ? 'bg-[#c99634]'
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
    </label>
  );
}

function CheckItem({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full ${
          complete
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-white/[0.04] text-[#484f58]'
        }`}
      >
        <Check className="h-3 w-3" />
      </span>

      <span
        className={
          complete
            ? 'text-[#c9d1d9]'
            : 'text-[#6e7681]'
        }
      >
        {label}
      </span>
    </div>
  );
}

function SeoPreview({
  page,
  seo,
}: {
  page: Page;
  seo: SeoRecord;
}) {
  const title =
    seo.title?.trim() ||
    page.title;

  const description =
    seo.description?.trim() ||
    'Your page description will appear here.';

  const url =
    seo.canonical_url?.trim() ||
    `https://firstlookstudio.com${page.slug}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-sm font-semibold text-white">
          Google Preview
        </h2>
      </div>

      <div className="p-5">
        <p className="truncate text-xs text-[#8ab4f8]">
          {url}
        </p>

        <h3 className="mt-1 line-clamp-2 text-lg font-medium text-[#8ab4f8]">
          {title}
        </h3>

        <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#bdc1c6]">
          {description}
        </p>
      </div>

      {seo.og_image && (
        <div className="border-t border-white/10">
          <img
            src={seo.og_image}
            alt=""
            className="aspect-[1.91/1] w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
