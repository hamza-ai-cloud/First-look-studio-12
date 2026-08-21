"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Check,
  ExternalLink,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type Branch = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  hours: string | null;
  maps_url: string | null;
  is_active: boolean;
  sort_order: number;
};

const emptyForm = {
  name: "",
  address: "",
  phone: "",
  email: "",
  hours: "",
  maps_url: "",
  is_active: true,
  sort_order: 0,
};

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Branch | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function loadBranches() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/cms/branches", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to load branches");
      }

      setBranches(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load branches"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBranches();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({
      ...emptyForm,
      sort_order: branches.length,
    });
    setShowForm(true);
    setError("");
  }

  function openEdit(branch: Branch) {
    setEditing(branch);

    setForm({
      name: branch.name || "",
      address: branch.address || "",
      phone: branch.phone || "",
      email: branch.email || "",
      hours: branch.hours || "",
      maps_url: branch.maps_url || "",
      is_active: branch.is_active,
      sort_order: branch.sort_order,
    });

    setShowForm(true);
    setError("");
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  }

  async function saveBranch() {
    if (!form.name.trim()) {
      setError("Branch name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/cms/branches", {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editing
            ? {
                id: editing.id,
                ...form,
              }
            : form
        ),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save branch");
      }

      closeForm();
      await loadBranches();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save branch"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteBranch(branch: Branch) {
    const confirmed = window.confirm(
      `Delete "${branch.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");

    try {
      const response = await fetch(
        `/api/admin/cms/branches?id=${encodeURIComponent(branch.id)}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete branch");
      }

      await loadBranches();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete branch"
      );
    }
  }

  return (
    <div className="min-h-full space-y-6 text-white">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1117] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#c99634]/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#c99634]/20 bg-[#c99634]/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4a33d]">
              <Building2 className="h-3.5 w-3.5" />
              Website Locations
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Branch Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8b949e]">
              Manage studio branches, contact details, opening hours
              and map links without editing website code.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c99634] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#dfb75c]"
          >
            <Plus className="h-4 w-4" />
            Add Branch
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-[#0d1117] py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#d4a33d]" />
        </div>
      ) : branches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d1117] px-6 py-16 text-center">
          <Building2 className="mx-auto h-10 w-10 text-[#484f58]" />
          <h2 className="mt-4 text-lg font-semibold">
            No branches yet
          </h2>
          <p className="mt-2 text-sm text-[#8b949e]">
            Add your first studio branch to start managing locations.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {branches.map((branch) => (
            <article
              key={branch.id}
              className="rounded-2xl border border-white/10 bg-[#0d1117] p-5 transition hover:border-[#c99634]/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <Building2 className="h-5 w-5 text-[#d4a33d]" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold">
                      {branch.name}
                    </h2>

                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          branch.is_active
                            ? "bg-emerald-400"
                            : "bg-gray-500"
                        }`}
                      />

                      <span className="text-xs text-[#8b949e]">
                        {branch.is_active
                          ? "Visible on website"
                          : "Hidden from website"}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] font-semibold text-[#8b949e]">
                  #{branch.sort_order + 1}
                </span>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                {branch.address && (
                  <div className="flex gap-3 text-[#b8c0cc]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d4a33d]" />
                    <span>{branch.address}</span>
                  </div>
                )}

                {branch.phone && (
                  <div className="flex gap-3 text-[#b8c0cc]">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#d4a33d]" />
                    <span>{branch.phone}</span>
                  </div>
                )}

                {branch.hours && (
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-[#8b949e]">
                    {branch.hours}
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-white/5 pt-4">
                {branch.maps_url && (
                  <a
                    href={branch.maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#c9d1d9] hover:bg-white/[0.07]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Maps
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => openEdit(branch)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#c9d1d9] hover:bg-white/[0.07]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => void deleteBranch(branch)}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0d1117] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0d1117]/95 px-5 py-4 backdrop-blur">
              <div>
                <h2 className="text-lg font-semibold">
                  {editing ? "Edit Branch" : "Add Branch"}
                </h2>
                <p className="mt-1 text-xs text-[#8b949e]">
                  Changes will appear wherever this branch is used.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl p-2 text-[#8b949e] hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field
                label="Branch Name"
                value={form.name}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    name: value,
                  }))
                }
                placeholder="First Look Studio"
              />

              <Field
                label="Phone"
                value={form.phone}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    phone: value,
                  }))
                }
                placeholder="+92..."
              />

              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    email: value,
                  }))
                }
                placeholder="hello@example.com"
              />

              <Field
                label="Opening Hours"
                value={form.hours}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    hours: value,
                  }))
                }
                placeholder="Mon - Sat, 10 AM - 8 PM"
              />

              <div className="sm:col-span-2">
                <Field
                  label="Address"
                  value={form.address}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      address: value,
                    }))
                  }
                  placeholder="Full studio address"
                />
              </div>

              <div className="sm:col-span-2">
                <Field
                  label="Google Maps URL"
                  value={form.maps_url}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      maps_url: value,
                    }))
                  }
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <Field
                label="Sort Order"
                type="number"
                value={String(form.sort_order)}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    sort_order: Number(value) || 0,
                  }))
                }
              />

              <label className="flex items-center gap-3 self-end rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      is_active: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[#c99634]"
                />

                <span className="text-sm text-[#c9d1d9]">
                  Visible on website
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-4">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-[#c9d1d9] hover:bg-white/[0.05]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void saveBranch()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#c99634] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#dfb75c] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}

                {editing ? "Save Changes" : "Create Branch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#161b22] px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#484f58] focus:border-[#c99634]/50"
      />
    </label>
  );
}
