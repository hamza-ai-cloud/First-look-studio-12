'use client';

import Link from 'next/link';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { use, useEffect, useMemo, useState } from 'react';

type PageStatus = 'draft' | 'published' | 'archived';

type CmsPage = {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  template?: string | null;
  excerpt?: string | null;
};

type CmsSection = {
  id: string;
  page_id: string;
  section_key: string;
  section_type: string;
  title?: string | null;
  content?: Record<string, unknown> | null;
  sort_order: number;
  is_visible: boolean;
};

const SECTION_TYPES = [
  'hero',
  'text',
  'image',
  'gallery',
  'services',
  'portfolio',
  'testimonials',
  'pricing',
  'faq',
  'contact',
  'cta',
  'custom',
];

export default function PageBuilder({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = use(params as Promise<{ id: string }>);

  const pageId = resolvedParams.id;

  const [page, setPage] = useState<CmsPage | null>(null);
  const [sections, setSections] = useState<CmsSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const [newSection, setNewSection] = useState({
    section_key: '',
    section_type: 'text',
    title: '',
  });

  async function loadBuilder() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/cms/pages?slug=${encodeURIComponent(
          ''
        )}`,
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load page');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.error || 'Failed to load page'
        );
      }

      const found = (result.data || []).find(
        (item: CmsPage) => item.id === pageId
      );

      if (!found) {
        throw new Error('Page not found');
      }

      setPage(found);

      const sectionResponse = await fetch(
        `/api/admin/cms/sections?page_id=${encodeURIComponent(
          pageId
        )}`,
        {
          cache: 'no-store',
        }
      );

      const sectionResult =
        await sectionResponse.json();

      if (
        !sectionResponse.ok ||
        !sectionResult.success
      ) {
        throw new Error(
          sectionResult.error ||
            'Failed to load sections'
        );
      }

      setSections(sectionResult.data || []);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to load page builder'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBuilder();
  }, [pageId]);

  const orderedSections = useMemo(
    () =>
      [...sections].sort(
        (a, b) => a.sort_order - b.sort_order
      ),
    [sections]
  );

  async function updateSection(
    section: CmsSection,
    updates: Partial<CmsSection>
  ) {
    try {
      setSaving(section.id);

      const response = await fetch(
        '/api/admin/cms/sections',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: section.id,
            ...updates,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to update section'
        );
      }

      setSections((current) =>
        current.map((item) =>
          item.id === section.id
            ? result.data
            : item
        )
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to update section'
      );
    } finally {
      setSaving(null);
    }
  }

  async function moveSection(
    section: CmsSection,
    direction: 'up' | 'down'
  ) {
    const index = orderedSections.findIndex(
      (item) => item.id === section.id
    );

    const targetIndex =
      direction === 'up' ? index - 1 : index + 1;

    if (
      index < 0 ||
      targetIndex < 0 ||
      targetIndex >= orderedSections.length
    ) {
      return;
    }

    const target = orderedSections[targetIndex];

    try {
      setSaving(section.id);

      const firstResponse = await fetch(
        '/api/admin/cms/sections',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: section.id,
            sort_order: target.sort_order,
          }),
        }
      );

      const firstResult =
        await firstResponse.json();

      if (!firstResponse.ok || !firstResult.success) {
        throw new Error(
          firstResult.error ||
            'Failed to reorder section'
        );
      }

      const secondResponse = await fetch(
        '/api/admin/cms/sections',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: target.id,
            sort_order: section.sort_order,
          }),
        }
      );

      const secondResult =
        await secondResponse.json();

      if (
        !secondResponse.ok ||
        !secondResult.success
      ) {
        throw new Error(
          secondResult.error ||
            'Failed to reorder section'
        );
      }

      setSections((current) =>
        current.map((item) => {
          if (item.id === section.id) {
            return firstResult.data;
          }

          if (item.id === target.id) {
            return secondResult.data;
          }

          return item;
        })
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to reorder section'
      );
    } finally {
      setSaving(null);
    }
  }

  async function deleteSection(
    section: CmsSection
  ) {
    const confirmed = window.confirm(
      `Delete "${section.title || section.section_key}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(section.id);

      const response = await fetch(
        `/api/admin/cms/sections?id=${encodeURIComponent(
          section.id
        )}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to delete section'
        );
      }

      setSections((current) =>
        current.filter(
          (item) => item.id !== section.id
        )
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete section'
      );
    } finally {
      setSaving(null);
    }
  }

  async function addSection(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!newSection.section_key.trim()) {
      window.alert('Section key is required.');
      return;
    }

    try {
      setAdding(true);

      const nextOrder =
        orderedSections.length > 0
          ? Math.max(
              ...orderedSections.map(
                (item) => item.sort_order
              )
            ) + 1
          : 0;

      const response = await fetch(
        '/api/admin/cms/sections',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_id: pageId,
            section_key:
              newSection.section_key
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '_'),
            section_type: newSection.section_type,
            title:
              newSection.title.trim() ||
              newSection.section_key.trim(),
            content: {},
            sort_order: nextOrder,
            is_visible: true,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to add section'
        );
      }

      setSections((current) => [
        ...current,
        result.data,
      ]);

      setNewSection({
        section_key: '',
        section_type: 'text',
        title: '',
      });
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to add section'
      );
    } finally {
      setAdding(false);
    }
  }

  async function updatePageStatus(
    status: PageStatus
  ) {
    if (!page) return;

    try {
      setSaving('page');

      const response = await fetch(
        '/api/admin/cms/pages',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: page.id,
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to update page'
        );
      }

      setPage(result.data);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to update page'
      );
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#d4a33d]" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-400">
        Page not found.
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6">
      <header className="sticky top-0 z-30 -mx-3 border-b border-white/10 bg-[#0b0f14]/95 px-3 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/admin/cms/pages"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[#8b949e] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-semibold text-white">
                  {page.title}
                </h1>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold capitalize text-[#8b949e]">
                  {page.status}
                </span>
              </div>

              <p className="truncate text-xs text-[#6e7681]">
                {page.slug}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={page.slug}
              target="_blank"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#c9d1d9] hover:text-white"
            >
              Preview
            </Link>

            <button
              type="button"
              disabled={saving === 'page'}
              onClick={() =>
                updatePageStatus(
                  page.status === 'published'
                    ? 'draft'
                    : 'published'
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#c99634] px-4 py-2 text-xs font-semibold text-black disabled:opacity-50"
            >
              {saving === 'page' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}

              {page.status === 'published'
                ? 'Save as Draft'
                : 'Publish'}
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <main className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Page Sections
              </h2>

              <p className="mt-1 text-sm text-[#8b949e]">
                Reorder, edit and control visibility of every
                section.
              </p>
            </div>

            <span className="text-xs text-[#6e7681]">
              {orderedSections.length} sections
            </span>
          </div>

          {orderedSections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d1117] p-10 text-center">
              <LayoutIcon />
              <h3 className="mt-3 text-sm font-semibold text-white">
                No sections yet
              </h3>
              <p className="mt-1 text-xs text-[#6e7681]">
                Add your first section from the panel on the right.
              </p>
            </div>
          ) : (
            orderedSections.map((section, index) => (
              <SectionCard
                key={section.id}
                section={section}
                index={index}
                total={orderedSections.length}
                saving={saving === section.id}
                onMove={moveSection}
                onToggle={(item) =>
                  updateSection(item, {
                    is_visible: !item.is_visible,
                  })
                }
                onSave={(item, updates) =>
                  updateSection(item, updates)
                }
                onDelete={deleteSection}
              />
            ))
          )}
        </main>

        <aside className="space-y-4">
          <form
            onSubmit={addSection}
            className="rounded-2xl border border-white/10 bg-[#0d1117] p-5"
          >
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-white">
                Add Section
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#6e7681]">
                Add a new editable content block to this page.
              </p>
            </div>

            <div className="space-y-4">
              <Field
                label="Section key"
                value={newSection.section_key}
                onChange={(value) =>
                  setNewSection((current) => ({
                    ...current,
                    section_key: value,
                  }))
                }
                placeholder="hero_main"
              />

              <div>
                <label className="mb-2 block text-xs font-medium text-[#8b949e]">
                  Section type
                </label>

                <select
                  value={newSection.section_type}
                  onChange={(event) =>
                    setNewSection((current) => ({
                      ...current,
                      section_type:
                        event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#161b22] px-3 text-sm text-white outline-none focus:border-[#c99634]/50"
                >
                  {SECTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <Field
                label="Display title"
                value={newSection.title}
                onChange={(value) =>
                  setNewSection((current) => ({
                    ...current,
                    title: value,
                  }))
                }
                placeholder="Hero"
              />

              <button
                type="submit"
                disabled={adding}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#c99634] text-sm font-semibold text-black disabled:opacity-50"
              >
                {adding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add Section
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-5">
            <h3 className="text-sm font-semibold text-white">
              Page Information
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <InfoRow label="URL" value={page.slug} />
              <InfoRow
                label="Template"
                value={page.template || 'default'}
              />
              <InfoRow
                label="Sections"
                value={String(orderedSections.length)}
              />
            </div>

            <Link
              href="/admin/cms/seo"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-[#c9d1d9] hover:text-white"
            >
              Manage SEO
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SectionCard({
  section,
  index,
  total,
  saving,
  onMove,
  onToggle,
  onSave,
  onDelete,
}: {
  section: CmsSection;
  index: number;
  total: number;
  saving: boolean;
  onMove: (
    section: CmsSection,
    direction: 'up' | 'down'
  ) => void;
  onToggle: (section: CmsSection) => void;
  onSave: (
    section: CmsSection,
    updates: Partial<CmsSection>
  ) => void;
  onDelete: (section: CmsSection) => void;
}) {
  const [title, setTitle] = useState(
    section.title || ''
  );

  const [content, setContent] = useState(
    JSON.stringify(
      section.content || {},
      null,
      2
    )
  );

  useEffect(() => {
    setTitle(section.title || '');
    setContent(
      JSON.stringify(
        section.content || {},
        null,
        2
      )
    );
  }, [section.title, section.content]);

  function save() {
    let parsedContent: Record<string, unknown>;

    try {
      parsedContent = JSON.parse(content);

      if (
        !parsedContent ||
        typeof parsedContent !== 'object' ||
        Array.isArray(parsedContent)
      ) {
        throw new Error();
      }
    } catch {
      window.alert(
        'Content must be valid JSON object syntax.'
      );
      return;
    }

    onSave(section, {
      title,
      content: parsedContent,
    });
  }

  return (
    <article
      className={`rounded-2xl border bg-[#0d1117] ${
        section.is_visible
          ? 'border-white/10'
          : 'border-yellow-500/10 opacity-70'
      }`}
    >
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
        <GripVertical className="h-4 w-4 text-[#484f58]" />

        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-[10px] font-bold text-[#8b949e]">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-white">
            {section.title ||
              section.section_key}
          </h3>

          <p className="text-[10px] uppercase tracking-wider text-[#6e7681]">
            {section.section_type}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onMove(section, 'up')
          }
          disabled={index === 0 || saving}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-[#8b949e] hover:text-white disabled:opacity-30"
          aria-label="Move section up"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() =>
            onMove(section, 'down')
          }
          disabled={
            index === total - 1 || saving
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-[#8b949e] hover:text-white disabled:opacity-30"
          aria-label="Move section down"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onToggle(section)}
          disabled={saving}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-[#8b949e] hover:text-white disabled:opacity-30"
          aria-label={
            section.is_visible
              ? 'Hide section'
              : 'Show section'
          }
        >
          {section.is_visible ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onDelete(section)}
          disabled={saving}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/5 text-red-400 hover:bg-red-500/10 disabled:opacity-30"
          aria-label="Delete section"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-2">
        <Field
          label="Section title"
          value={title}
          onChange={setTitle}
          placeholder="Section title"
        />

        <div>
          <label className="mb-2 block text-xs font-medium text-[#8b949e]">
            Section key
          </label>

          <div className="flex h-11 items-center rounded-xl border border-white/10 bg-[#161b22] px-3 font-mono text-xs text-[#6e7681]">
            {section.section_key}
          </div>
        </div>

        <div className="lg:col-span-2">
          <label className="mb-2 block text-xs font-medium text-[#8b949e]">
            Content JSON
          </label>

          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            rows={10}
            spellCheck={false}
            className="w-full rounded-xl border border-white/10 bg-[#080b0f] px-4 py-3 font-mono text-xs leading-6 text-[#c9d1d9] outline-none focus:border-[#c99634]/50"
          />
        </div>

        <div className="flex items-center justify-between lg:col-span-2">
          <span className="text-xs text-[#6e7681]">
            {section.is_visible
              ? 'Visible on website'
              : 'Hidden from website'}
          </span>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#c99634] px-4 py-2.5 text-xs font-semibold text-black disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save Section
          </button>
        </div>
      </div>
    </article>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#8b949e]">
        {label}
      </label>

      <input
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

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[#6e7681]">
        {label}
      </span>

      <span className="max-w-[190px] truncate text-right text-[#c9d1d9]">
        {value}
      </span>
    </div>
  );
}

function LayoutIcon() {
  return (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
      <GripVertical className="h-5 w-5 text-[#484f58]" />
    </div>
  );
}
