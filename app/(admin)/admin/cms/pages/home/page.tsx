"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";

type HeroStat = {
  value: string;
  label: string;
};

type HeroContent = {
  eyebrow: string;
  heading: string;
  heading_highlight: string;
  description: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  stats: HeroStat[];
  show_stats: boolean;
  show_scroll_indicator: boolean;
};

const defaultContent: HeroContent = {
  eyebrow: "",
  heading: "",
  heading_highlight: "",
  description: "",
  primary_button_text: "",
  primary_button_url: "",
  secondary_button_text: "",
  secondary_button_url: "",
  stats: [],
  show_stats: true,
  show_scroll_indicator: true,
};

export default function HomeHeroEditorPage() {
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const [sectionId, setSectionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/admin/cms/pages?slug=home", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Failed to load Home page");
        }

        const page = Array.isArray(result.data)
          ? result.data[0]
          : result.data;

        const hero = page?.sections?.find(
          (section: { section_key?: string }) =>
            section.section_key === "hero"
        );

        if (hero) {
          setSectionId(hero.id);
          setContent({
            ...defaultContent,
            ...(hero.content || {}),
          });
        }
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load Hero"
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  function update<K extends keyof HeroContent>(
    key: K,
    value: HeroContent[K]
  ) {
    setContent((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateStat(
    index: number,
    key: keyof HeroStat,
    value: string
  ) {
    setContent((current) => ({
      ...current,
      stats: current.stats.map((stat, statIndex) =>
        statIndex === index
          ? {
              ...stat,
              [key]: value,
            }
          : stat
      ),
    }));
  }

  function addStat() {
    setContent((current) => ({
      ...current,
      stats: [
        ...current.stats,
        {
          value: "",
          label: "",
        },
      ],
    }));
  }

  function removeStat(index: number) {
    setContent((current) => ({
      ...current,
      stats: current.stats.filter(
        (_, statIndex) => statIndex !== index
      ),
    }));
  }

  async function save() {
    if (!sectionId) {
      setMessage("Hero section was not found.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/cms/sections",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: sectionId,
            content,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Failed to save Hero"
        );
      }

      setMessage("Hero changes saved successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save Hero"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#d4a33d]" />
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/cms/pages"
            className="mb-3 inline-flex items-center gap-2 text-xs text-[#8b949e] hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Pages
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight">
            Home Hero
          </h1>

          <p className="mt-2 text-sm text-[#8b949e]">
            Edit the main hero content without touching the
            website code.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#c99634] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#dfb75c] disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </button>
      </div>

      {message && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#c9d1d9]">
          {message}
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-[#0d1117] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Hero Content</h2>

        <div className="mt-5 grid gap-5">
          <Field
            label="Eyebrow"
            value={content.eyebrow}
            onChange={(value) => update("eyebrow", value)}
          />

          <Field
            label="Main Heading"
            value={content.heading}
            onChange={(value) => update("heading", value)}
          />

          <Field
            label="Highlighted Heading"
            value={content.heading_highlight}
            onChange={(value) =>
              update("heading_highlight", value)
            }
          />

          <label>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
              Description
            </span>

            <textarea
              value={content.description}
              onChange={(event) =>
                update("description", event.target.value)
              }
              rows={4}
              className="w-full resize-y rounded-xl border border-white/10 bg-[#161b22] px-3 py-3 text-sm text-white outline-none placeholder:text-[#484f58] focus:border-[#c99634]/50"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0d1117] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Primary Button</h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field
            label="Button Text"
            value={content.primary_button_text}
            onChange={(value) =>
              update("primary_button_text", value)
            }
          />

          <Field
            label="Button URL"
            value={content.primary_button_url}
            onChange={(value) =>
              update("primary_button_url", value)
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0d1117] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Secondary Button</h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field
            label="Button Text"
            value={content.secondary_button_text}
            onChange={(value) =>
              update("secondary_button_text", value)
            }
          />

          <Field
            label="Button URL"
            value={content.secondary_button_url}
            onChange={(value) =>
              update("secondary_button_url", value)
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0d1117] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Hero Statistics</h2>
            <p className="mt-1 text-sm text-[#8b949e]">
              Control the numbers displayed underneath the hero.
            </p>
          </div>

          <button
            type="button"
            onClick={addStat}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold hover:bg-white/[0.08]"
          >
            <Plus className="h-4 w-4" />
            Add Statistic
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {content.stats.map((stat, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-[1fr_2fr_auto]"
            >
              <Field
                label="Value"
                value={stat.value}
                onChange={(value) =>
                  updateStat(index, "value", value)
                }
              />

              <Field
                label="Label"
                value={stat.label}
                onChange={(value) =>
                  updateStat(index, "label", value)
                }
              />

              <button
                type="button"
                onClick={() => removeStat(index)}
                className="self-end rounded-xl border border-rose-500/20 bg-rose-500/5 p-2.5 text-rose-300 hover:bg-rose-500/10"
                aria-label="Remove statistic"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <label className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <input
            type="checkbox"
            checked={content.show_stats}
            onChange={(event) =>
              update("show_stats", event.target.checked)
            }
            className="h-4 w-4 accent-[#c99634]"
          />

          <span className="text-sm text-[#c9d1d9]">
            Show statistics
          </span>
        </label>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0d1117] p-5 sm:p-6">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={content.show_scroll_indicator}
            onChange={(event) =>
              update(
                "show_scroll_indicator",
                event.target.checked
              )
            }
            className="h-4 w-4 accent-[#c99634]"
          />

          <span className="text-sm text-[#c9d1d9]">
            Show scroll indicator
          </span>
        </label>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#161b22] px-3 py-2.5 text-sm text-white outline-none focus:border-[#c99634]/50"
      />
    </label>
  );
}
