'use client';

import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Page = {
  id: string;
  title: string;
  slug: string;
  status?: string;
  is_active?: boolean;
  sort_order?: number;
};

type Section = {
  id: string;
  page_id: string;
  section_key: string;
  title?: string | null;
  content?: Record<string, unknown> | null;
  is_visible?: boolean;
  sort_order?: number;
};

const EMPTY_SECTION = {
  section_key: '',
  title: '',
  content: '{}',
  is_visible: true,
};

export default function PageBuilderPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] =
    useState<Section[]>([]);

  const [selectedPage, setSelectedPage] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState<Section | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] =
    useState(EMPTY_SECTION);

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
          result.error ||
            'Failed to load pages'
        );
      }

      const data = result.data || [];

      setPages(data);

      if (data.length > 0) {
        setSelectedPage(data[0].id);
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

  async function loadSections(pageId: string) {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/cms/sections?page_id=${encodeURIComponent(
          pageId
        )}`,
        {
          cache: 'no-store',
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            'Failed to load sections'
        );
      }

      setSections(
        (result.data || []).sort(
          (a: Section, b: Section) =>
            (a.sort_order || 0) -
            (b.sort_order || 0)
        )
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to load sections'
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
      loadSections(selectedPage);
    }
  }, [selectedPage]);

  const currentPage = useMemo(
    () =>
      pages.find(
        (page) =>
          page.id === selectedPage
      ),
    [pages, selectedPage]
  );

  function openCreate() {
    setEditing(null);

    setForm({
      ...EMPTY_SECTION,
      section_key: `section_${sections.length + 1}`,
    });

    setShowForm(true);
  }

  function openEdit(section: Section) {
    setEditing(section);

    setForm({
      section_key: section.section_key,
      title: section.title || '',
      content: JSON.stringify(
        section.content || {},
        null,
        2
      ),
      is_visible:
        section.is_visible !== false,
    });

    setShowForm(true);
  }

  async function saveSection(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!form.section_key.trim()) {
      window.alert(
        'Section key is required.'
      );
      return;
    }

    let parsedContent: Record<
      string,
      unknown
    >;

    try {
      parsedContent = JSON.parse(
        form.content || '{}'
      );
    } catch {
      window.alert(
        'Content must contain valid JSON.'
      );
      return;
    }

    try {
      setSaving(true);

      const method = editing
        ? 'PUT'
        : 'POST';

      const body = editing
        ? {
            id: editing.id,
            page_id: selectedPage,
            section_key:
              form.section_key.trim(),
            title: form.title.trim(),
            content: parsedContent,
            is_visible:
              form.is_visible,
          }
        : {
            page_id: selectedPage,
            section_key:
              form.section_key.trim(),
            title: form.title.trim(),
            content: parsedContent,
            is_visible:
              form.is_visible,
            sort_order:
              sections.length,
          };

      const response = await fetch(
        '/api/admin/cms/sections',
        {
          method,
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            'Failed to save section'
        );
      }

      if (editing) {
        setSections((current) =>
          current.map((section) =>
            section.id === editing.id
              ? result.data
              : section
          )
        );
      } else {
        setSections((current) => [
          ...current,
          result.data,
        ]);
      }

      setShowForm(false);
      setEditing(null);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to save section'
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleSection(
    section: Section
  ) {
    try {
      const response = await fetch(
        '/api/admin/cms/sections',
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            id: section.id,
            is_visible:
              !section.is_visible,
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            'Failed to update section'
        );
      }

      setSections((current) =>
        current.map((entry) =>
          entry.id === section.id
            ? result.data
            : entry
        )
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to update section'
      );
    }
  }

  async function moveSection(
    section: Section,
    direction: 'up' | 'down'
  ) {
    const index =
      sections.findIndex(
        (entry) =>
          entry.id === section.id
      );

    const targetIndex =
      direction === 'up'
        ? index - 1
        : index + 1;

    if (
      index < 0 ||
      targetIndex < 0 ||
      targetIndex >=
        sections.length
    ) {
      return;
    }

    const target =
      sections[targetIndex];

    try {
      const first =
        await fetch(
          '/api/admin/cms/sections',
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              id: section.id,
              sort_order:
                target.sort_order,
            }),
          }
        );

      const firstResult =
        await first.json();

      if (
        !first.ok ||
        !firstResult.success
      ) {
        throw new Error(
          firstResult.error ||
            'Failed to reorder section'
        );
      }

      const second =
        await fetch(
          '/api/admin/cms/sections',
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              id: target.id,
              sort_order:
                section.sort_order,
            }),
          }
        );

      const secondResult =
        await second.json();

      if (
        !second.ok ||
        !secondResult.success
      ) {
        throw new Error(
          secondResult.error ||
            'Failed to reorder section'
        );
      }

      await loadSections(
        selectedPage
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to reorder sections'
      );
    }
  }

  async function deleteSection(
    section: Section
  ) {
    const confirmed =
      window.confirm(
        `Delete "${section.title || section.section_key}"?`
      );

    if (!confirmed) return;

    try {
      const response =
        await fetch(
          `/api/admin/cms/sections?id=${encodeURIComponent(
            section.id
          )}`,
          {
            method: 'DELETE',
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            'Failed to delete section'
        );
      }

      setSections((current) =>
        current.filter(
          (entry) =>
            entry.id !== section.id
        )
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete section'
      );
    }
  }

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
              <FileText className="h-3.5 w-3.5 text-[#d4a33d]" />
              CMS / Page Builder
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Page Builder
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8b949e]">
              Manage page sections, content and visibility
              without changing the existing frontend design.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            disabled={!selectedPage}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c99634] px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Section
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0d1117] p-4">
        <label className="mb-2 block text-xs font-medium text-[#8b949e]">
          Page
        </label>

        <select
          value={selectedPage}
          onChange={(event) =>
            setSelectedPage(
              event.target.value
            )
          }
          className="h-11 w-full max-w-xl rounded-xl border border-white/10 bg-[#161b22] px-3 text-sm text-white outline-none focus:border-[#c99634]/50"
        >
          {pages.map((page) => (
            <option
              key={page.id}
              value={page.id}
            >
              {page.title} — {page.slug}
            </option>
          ))}
        </select>
      </section>

      {currentPage && (
        <section className="rounded-2xl border border-white/10 bg-[#0d1117]">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                {currentPage.title}
              </h2>

              <p className="mt-1 font-mono text-[10px] text-[#6e7681]">
                {currentPage.slug}
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <Check className="h-3 w-3" />
              CMS Ready
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {sections.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="mx-auto h-8 w-8 text-[#484f58]" />

                <p className="mt-4 text-sm text-[#8b949e]">
                  No sections configured yet.
                </p>

                <p className="mt-1 text-xs text-[#6e7681]">
                  Add a section to begin managing this page.
                </p>
              </div>
            ) : (
              sections.map(
                (section, index) => (
                  <SectionRow
                    key={section.id}
                    section={section}
                    first={index === 0}
                    last={
                      index ===
                      sections.length - 1
                    }
                    onEdit={() =>
                      openEdit(section)
                    }
                    onToggle={() =>
                      toggleSection(
                        section
                      )
                    }
                    onMove={moveSection}
                    onDelete={() =>
                      deleteSection(
                        section
                      )
                    }
                  />
                )
              )
            )}
          </div>
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={saveSection}
            className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-white/10 bg-[#0d1117] p-6"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {editing
                    ? 'Edit Section'
                    : 'Add Section'}
                </h2>

                <p className="mt-1 text-xs text-[#6e7681]">
                  Section data is stored separately from your
                  existing frontend components.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="text-[#6e7681] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <Field
                label="Section Key"
                value={
                  form.section_key
                }
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    section_key: value,
                  }))
                }
                placeholder="hero"
              />

              <Field
                label="Section Title"
                value={form.title}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    title: value,
                  }))
                }
                placeholder="Homepage Hero"
              />

              <div>
                <label className="mb-2 block text-xs font-medium text-[#8b949e]">
                  Content JSON
                </label>

                <textarea
                  value={
                    form.content
                  }
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        content:
                          event.target.value,
                      })
                    )
                  }
                  rows={16}
                  spellCheck={false}
                  className="w-full rounded-xl border border-white/10 bg-[#161b22] px-3 py-3 font-mono text-xs leading-6 text-white outline-none placeholder:text-[#6e7681] focus:border-[#c99634]/50"
                  placeholder={`{
  "heading": "Your story deserves to be seen.",
  "description": "..."
}`}
                />
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div>
                  <p className="text-xs font-semibold text-white">
                    Section Visible
                  </p>

                  <p className="mt-1 text-[10px] text-[#6e7681]">
                    Keep this section available for future
                    frontend integration.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    form.is_visible
                  }
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        is_visible:
                          event.target
                            .checked,
                      })
                    )
                  }
                  className="h-4 w-4 accent-[#c99634]"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-[#8b949e] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#c99634] px-4 py-2.5 text-xs font-semibold text-black disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : editing ? (
                  <Save className="h-3.5 w-3.5" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}

                {editing
                  ? 'Save Changes'
                  : 'Create Section'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function SectionRow({
  section,
  first,
  last,
  onEdit,
  onToggle,
  onMove,
  onDelete,
}: {
  section: Section;
  first: boolean;
  last: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onMove: (
    section: Section,
    direction: 'up' | 'down'
  ) => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`p-5 transition hover:bg-white/[0.02] ${
        section.is_visible === false
          ? 'opacity-50'
          : ''
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
            <FileText className="h-4 w-4 text-[#d4a33d]" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-white">
                {section.title ||
                  section.section_key}
              </h3>

              {section.is_visible !==
                false && (
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                  Visible
                </span>
              )}
            </div>

            <p className="mt-1 font-mono text-[10px] text-[#6e7681]">
              {section.section_key}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onMove(section, 'up')
            }
            disabled={first}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-[#8b949e] hover:text-white disabled:opacity-20"
            aria-label="Move section up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() =>
              onMove(section, 'down')
            }
            disabled={last}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-[#8b949e] hover:text-white disabled:opacity-20"
            aria-label="Move section down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-[#8b949e] hover:text-white"
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
            onClick={onEdit}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-[10px] text-[#8b949e] hover:text-white"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/5 text-red-400"
            aria-label="Delete section"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
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
