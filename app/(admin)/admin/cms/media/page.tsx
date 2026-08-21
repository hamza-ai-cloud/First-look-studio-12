'use client';

import {
  Copy,
  Eye,
  Image as ImageIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type MediaItem = {
  id: string;
  name: string;
  file_url: string;
  alt_text?: string | null;
  media_type?: string | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
  is_active?: boolean;
  created_at?: string;
};

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] =
    useState<MediaItem | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  async function loadMedia() {
    try {
      setLoading(true);

      const response = await fetch(
        '/api/admin/cms/media',
        {
          cache: 'no-store',
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to load media'
        );
      }

      setItems(result.data || []);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to load media'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.alt_text
          ?.toLowerCase()
          .includes(query)
    );
  }, [items, search]);

  async function uploadFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        '/api/admin/cms/media',
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Upload failed'
        );
      }

      setItems((current) => [
        result.data,
        ...current,
      ]);

      setShowUpload(false);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Upload failed'
      );
    } finally {
      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = '';
      }
    }
  }

  async function deleteMedia(item: MediaItem) {
    const confirmed = window.confirm(
      `Delete "${item.name}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/cms/media?id=${encodeURIComponent(
          item.id
        )}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to delete media'
        );
      }

      setItems((current) =>
        current.filter(
          (media) => media.id !== item.id
        )
      );

      if (selected?.id === item.id) {
        setSelected(null);
      }
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete media'
      );
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      window.alert('Media URL copied.');
    } catch {
      window.prompt(
        'Copy this media URL:',
        url
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
              <ImageIcon className="h-3.5 w-3.5 text-[#d4a33d]" />
              CMS / Media
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Media Library
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8b949e]">
              One central library for the images and media
              used throughout the website.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c99634] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#dfb75c]"
          >
            <Upload className="h-4 w-4" />
            Upload Media
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Total Media"
          value={items.length}
        />

        <Stat
          label="Images"
          value={
            items.filter((item) =>
              item.mime_type?.startsWith('image/')
            ).length
          }
        />

        <Stat
          label="Active"
          value={
            items.filter(
              (item) => item.is_active !== false
            ).length
          }
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0d1117] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6e7681]" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search media..."
            className="h-11 w-full rounded-xl border border-white/10 bg-[#161b22] pl-10 pr-4 text-sm text-white outline-none placeholder:text-[#6e7681] focus:border-[#c99634]/50"
          />
        </div>
      </section>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1117]">
          <Loader2 className="h-7 w-7 animate-spin text-[#d4a33d]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d1117] p-12 text-center">
          <ImageIcon className="mx-auto h-9 w-9 text-[#484f58]" />

          <h2 className="mt-4 text-sm font-semibold text-white">
            No media found
          </h2>

          <p className="mt-1 text-xs text-[#6e7681]">
            Upload your first image to start building the library.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onOpen={() => setSelected(item)}
              onCopy={() =>
                copyUrl(item.file_url)
              }
              onDelete={() =>
                deleteMedia(item)
              }
            />
          ))}
        </section>
      )}

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1117] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Upload Media
                </h2>

                <p className="mt-1 text-xs text-[#6e7681]">
                  Add an image to the central media library.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowUpload(false)
                }
                className="text-[#6e7681] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <button
              type="button"
              disabled={uploading}
              onClick={() =>
                fileRef.current?.click()
              }
              className="mt-6 flex min-h-44 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center hover:border-[#c99634]/40"
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-[#d4a33d]" />
              ) : (
                <Upload className="h-8 w-8 text-[#d4a33d]" />
              )}

              <span className="mt-3 text-sm font-medium text-white">
                {uploading
                  ? 'Uploading...'
                  : 'Choose an image'}
              </span>

              <span className="mt-1 text-xs text-[#6e7681]">
                PNG, JPG, WEBP or other supported image
              </span>
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadFile}
            />
          </div>
        </div>
      )}

      {selected && (
        <MediaDetails
          item={selected}
          onClose={() => setSelected(null)}
          onCopy={() =>
            copyUrl(selected.file_url)
          }
          onDelete={() =>
            deleteMedia(selected)
          }
        />
      )}
    </div>
  );
}

function MediaCard({
  item,
  onOpen,
  onCopy,
  onDelete,
}: {
  item: MediaItem;
  onOpen: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]">
      <button
        type="button"
        onClick={onOpen}
        className="relative block aspect-square w-full overflow-hidden bg-[#161b22]"
      >
        <img
          src={item.file_url}
          alt={item.alt_text || item.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
          <Eye className="h-6 w-6 text-white" />
        </div>
      </button>

      <div className="p-3">
        <p className="truncate text-xs font-medium text-white">
          {item.name}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-[10px] text-[#8b949e] hover:text-white"
          >
            <Copy className="h-3 w-3" />
            Copy URL
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/5 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </article>
  );
}

function MediaDetails({
  item,
  onClose,
  onCopy,
  onDelete,
}: {
  item: MediaItem;
  onClose: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl border border-white/10 bg-[#0d1117]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Media Details
            </h2>

            <p className="mt-1 text-xs text-[#6e7681]">
              {item.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#6e7681] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
            <img
              src={item.file_url}
              alt={item.alt_text || item.name}
              className="max-h-[65vh] w-full object-contain"
            />
          </div>

          <div className="space-y-4">
            <Info
              label="File name"
              value={item.name}
            />

            <Info
              label="Type"
              value={
                item.mime_type || 'Unknown'
              }
            />

            <Info
              label="Dimensions"
              value={
                item.width && item.height
                  ? `${item.width} × ${item.height}`
                  : 'Unknown'
              }
            />

            <Info
              label="Alt text"
              value={
                item.alt_text || 'Not set'
              }
            />

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#6e7681]">
                Media URL
              </label>

              <textarea
                readOnly
                value={item.file_url}
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-[#161b22] p-3 font-mono text-[10px] text-[#c9d1d9] outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c99634] px-4 py-2.5 text-xs font-semibold text-black"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy URL
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-2.5 text-xs font-medium text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6e7681]">
        {label}
      </label>

      <p className="break-words text-xs text-[#c9d1d9]">
        {value}
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-5">
      <p className="text-xs text-[#8b949e]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}
