'use client';

import {
  ArrowDown,
  ArrowUp,
  Check,
  ExternalLink,
  GripVertical,
  Loader2,
  Menu,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type NavigationItem = {
  id: string;
  label: string;
  href: string;
  location: string;
  sort_order: number;
  is_active: boolean;
  open_new_tab?: boolean;
};

const LOCATIONS = ['header', 'footer', 'mobile'];

const EMPTY_FORM = {
  label: '',
  href: '',
  location: 'header',
  open_new_tab: false,
};

export default function NavigationManagerPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] =
    useState<NavigationItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  async function loadNavigation() {
    try {
      setLoading(true);

      const response = await fetch(
        '/api/admin/cms/navigation',
        {
          cache: 'no-store',
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to load navigation'
        );
      }

      setItems(result.data || []);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to load navigation'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNavigation();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(item: NavigationItem) {
    setEditing(item);

    setForm({
      label: item.label,
      href: item.href,
      location: item.location,
      open_new_tab: Boolean(item.open_new_tab),
    });

    setShowForm(true);
  }

  async function saveItem(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!form.label.trim()) {
      window.alert('Navigation label is required.');
      return;
    }

    if (!form.href.trim()) {
      window.alert('Navigation URL is required.');
      return;
    }

    try {
      setSaving(true);

      const method = editing ? 'PUT' : 'POST';

      const body = editing
        ? {
            id: editing.id,
            ...form,
          }
        : {
            ...form,
            sort_order:
              Math.max(
                -1,
                ...items
                  .filter(
                    (item) =>
                      item.location ===
                      form.location
                  )
                  .map(
                    (item) =>
                      item.sort_order
                  )
              ) + 1,
          };

      const response = await fetch(
        '/api/admin/cms/navigation',
        {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            'Failed to save navigation item'
        );
      }

      if (editing) {
        setItems((current) =>
          current.map((item) =>
            item.id === editing.id
              ? result.data
              : item
          )
        );
      } else {
        setItems((current) => [
          ...current,
          result.data,
        ]);
      }

      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_FORM);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to save navigation item'
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleItem(
    item: NavigationItem
  ) {
    try {
      const response = await fetch(
        '/api/admin/cms/navigation',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: item.id,
            is_active: !item.is_active,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            'Failed to update navigation item'
        );
      }

      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? result.data
            : entry
        )
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to update navigation item'
      );
    }
  }

  async function moveItem(
    item: NavigationItem,
    direction: 'up' | 'down'
  ) {
    const siblings = items
      .filter(
        (entry) =>
          entry.location === item.location
      )
      .sort(
        (a, b) =>
          a.sort_order - b.sort_order
      );

    const index = siblings.findIndex(
      (entry) => entry.id === item.id
    );

    const targetIndex =
      direction === 'up'
        ? index - 1
        : index + 1;

    if (
      index < 0 ||
      targetIndex < 0 ||
      targetIndex >= siblings.length
    ) {
      return;
    }

    const target = siblings[targetIndex];

    try {
      const first = await fetch(
        '/api/admin/cms/navigation',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: item.id,
            sort_order: target.sort_order,
          }),
        }
      );

      const firstResult = await first.json();

      if (!first.ok || !firstResult.success) {
        throw new Error(
          firstResult.error ||
            'Failed to reorder item'
        );
      }

      const second = await fetch(
        '/api/admin/cms/navigation',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: target.id,
            sort_order: item.sort_order,
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
            'Failed to reorder item'
        );
      }

      setItems((current) =>
        current.map((entry) => {
          if (entry.id === item.id) {
            return firstResult.data;
          }

          if (entry.id === target.id) {
            return secondResult.data;
          }

          return entry;
        })
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to reorder navigation'
      );
    }
  }

  async function deleteItem(
    item: NavigationItem
  ) {
    const confirmed = window.confirm(
      `Delete "${item.label}" from ${item.location}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/cms/navigation?id=${encodeURIComponent(
          item.id
        )}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            'Failed to delete navigation item'
        );
      }

      setItems((current) =>
        current.filter(
          (entry) => entry.id !== item.id
        )
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete navigation item'
      );
    }
  }

  return (
    <div className="min-h-full space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1117] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#c99634]/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b949e]">
              <Menu className="h-3.5 w-3.5 text-[#d4a33d]" />
              CMS / Navigation
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Navigation Manager
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8b949e]">
              Manage the links that appear throughout
              the website without editing code.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c99634] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#dfb75c]"
          >
            <Plus className="h-4 w-4" />
            Add Link
          </button>
        </div>
      </section>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1117]">
          <Loader2 className="h-7 w-7 animate-spin text-[#d4a33d]" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          {LOCATIONS.map((location) => {
            const locationItems = items
              .filter(
                (item) =>
                  item.location === location
              )
              .sort(
                (a, b) =>
                  a.sort_order -
                  b.sort_order
              );

            return (
              <section
                key={location}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]"
              >
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div>
                    <h2 className="text-sm font-semibold capitalize text-white">
                      {location}
                    </h2>

                    <p className="mt-1 text-[10px] uppercase tracking-wider text-[#6e7681]">
                      {locationItems.length} links
                    </p>
                  </div>

                  <Menu className="h-4 w-4 text-[#6e7681]" />
                </div>

                <div className="divide-y divide-white/5">
                  {locationItems.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#6e7681]">
                      No links yet.
                    </div>
                  ) : (
                    locationItems.map(
                      (item, index) => (
                        <NavigationRow
                          key={item.id}
                          item={item}
                          first={index === 0}
                          last={
                            index ===
                            locationItems.length -
                              1
                          }
                          onEdit={() =>
                            openEdit(item)
                          }
                          onToggle={() =>
                            toggleItem(item)
                          }
                          onMove={moveItem}
                          onDelete={() =>
                            deleteItem(item)
                          }
                        />
                      )
                    )
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={saveItem}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1117] p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {editing
                    ? 'Edit Navigation Link'
                    : 'Add Navigation Link'}
                </h2>

                <p className="mt-1 text-xs text-[#6e7681]">
                  Changes will be stored in the CMS.
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

            <div className="space-y-4">
              <Field
                label="Label"
                value={form.label}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    label: value,
                  }))
                }
                placeholder="Portfolio"
              />

              <Field
                label="URL"
                value={form.href}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    href: value,
                  }))
                }
                placeholder="/portfolio"
              />

              <div>
                <label className="mb-2 block text-xs font-medium text-[#8b949e]">
                  Location
                </label>

                <select
                  value={form.location}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      location:
                        event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#161b22] px-3 text-sm capitalize text-white outline-none focus:border-[#c99634]/50"
                >
                  {LOCATIONS.map(
                    (location) => (
                      <option
                        key={location}
                        value={location}
                      >
                        {location}
                      </option>
                    )
                  )}
                </select>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <input
                  type="checkbox"
                  checked={
                    form.open_new_tab
                  }
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      open_new_tab:
                        event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[#c99634]"
                />

                <span>
                  <span className="block text-xs font-medium text-white">
                    Open in new tab
                  </span>

                  <span className="block text-[10px] text-[#6e7681]">
                    Useful for external links.
                  </span>
                </span>
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
                  : 'Add Link'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function NavigationRow({
  item,
  first,
  last,
  onEdit,
  onToggle,
  onMove,
  onDelete,
}: {
  item: NavigationItem;
  first: boolean;
  last: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onMove: (
    item: NavigationItem,
    direction: 'up' | 'down'
  ) => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`p-4 transition hover:bg-white/[0.02] ${
        !item.is_active ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <GripVertical className="mt-1 h-4 w-4 shrink-0 text-[#484f58]" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-white">
              {item.label}
            </p>

            {item.open_new_tab && (
              <ExternalLink className="h-3 w-3 shrink-0 text-[#6e7681]" />
            )}
          </div>

          <p className="mt-1 truncate font-mono text-[10px] text-[#6e7681]">
            {item.href}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
            item.is_active
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : 'border-white/10 bg-white/[0.03] text-[#6e7681]'
          }`}
          aria-label={
            item.is_active
              ? 'Disable link'
              : 'Enable link'
          }
        >
          {item.is_active && (
            <Check className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 pl-7">
        <button
          type="button"
          onClick={() =>
            onMove(item, 'up')
          }
          disabled={first}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-[#8b949e] hover:text-white disabled:opacity-25"
          aria-label="Move up"
        >
          <ArrowUp className="h-3 w-3" />
        </button>

        <button
          type="button"
          onClick={() =>
            onMove(item, 'down')
          }
          disabled={last}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-[#8b949e] hover:text-white disabled:opacity-25"
          aria-label="Move down"
        >
          <ArrowDown className="h-3 w-3" />
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="ml-auto flex h-7 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-[10px] text-[#8b949e] hover:text-white"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/5 text-red-400"
          aria-label="Delete"
        >
          <Trash2 className="h-3 w-3" />
        </button>
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
