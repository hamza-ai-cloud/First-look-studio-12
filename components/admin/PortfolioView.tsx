"use client";

import React, { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { createCroppedImage, type CropAreaPixels } from "./image-crop";
import {
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  Edit2,
  Star,
  X,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { GalleryItemRecord } from "@/lib/types";

interface PortfolioViewProps {
  portfolio: GalleryItemRecord[];
  onSaveItem: (
    item: Partial<GalleryItemRecord> & {
      title: string;
      image_url: string;
    }
  ) => Promise<void> | void;
  onDeleteItem: (id: string) => Promise<void> | void;
}

const PORTFOLIO_CATEGORIES = [
  "Weddings",
  "Portraits",
  "Fashion",
  "Commercial",
  "Events",
  "Cinematic",
] as const;

type Toast = {
  type: "success" | "error";
  title: string;
  message: string;
};

export default function PortfolioView({
  portfolio = [],
  onSaveItem,
  onDeleteItem,
}: PortfolioViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingItem, setEditingItem] =
    useState<Partial<GalleryItemRecord> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] =
    useState<(typeof PORTFOLIO_CATEGORIES)[number]>("Weddings");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CropAreaPixels | null>(null);
  const [formAspectRatio, setFormAspectRatio] =
    useState<"portrait" | "landscape" | "square">("landscape");
  const [formFeatured, setFormFeatured] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const filteredGallery = portfolio.filter((item) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.category && item.category.toLowerCase().includes(term));

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const showToast = (nextToast: Toast) => {
    setToast(nextToast);

    window.setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormCategory("Weddings");
    setFormImageUrl("");
    setFormAspectRatio("landscape");
    setFormFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItemRecord) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(
      PORTFOLIO_CATEGORIES.includes(
        item.category as (typeof PORTFOLIO_CATEGORIES)[number]
      )
        ? (item.category as (typeof PORTFOLIO_CATEGORIES)[number])
        : "Weddings"
    );
    setFormImageUrl(item.image_url);
    setFormAspectRatio(item.aspect_ratio || "landscape");
    setFormFeatured(!!item.is_featured);
    setIsModalOpen(true);
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast({
        type: "error",
        title: "Invalid File",
        message: "Please choose an image file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({
        type: "error",
        title: "Image Too Large",
        message: "Please choose an image no larger than 5 MB.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/portfolio/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Image upload failed.");
      }

      setFormImageUrl(result.data.image_url);

      if (!formTitle.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        if (cleanName) {
          setFormTitle(
            cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
          );
        }
      }

      showToast({
        type: "success",
        title: "Image Uploaded",
        message:
          "Your image has been uploaded successfully. You can now save it to your portfolio.",
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Upload Failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to upload the image.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const prepareImageForUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast({
        type: "error",
        title: "Invalid File",
        message: "Please choose an image file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({
        type: "error",
        title: "Image Too Large",
        message: "Please choose an image no larger than 5 MB.",
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setCropSource(objectUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      void prepareImageForUpload(file);
    }

    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      void prepareImageForUpload(file);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formTitle.trim()) {
      showToast({
        type: "error",
        title: "Title Required",
        message: "Please enter a title for this artwork.",
      });
      return;
    }

    if (!formImageUrl.trim()) {
      showToast({
        type: "error",
        title: "Image Required",
        message: "Please upload an image or enter an image URL.",
      });
      return;
    }

    setIsSaving(true);

    try {
      await onSaveItem({
        id: editingItem?.id,
        title: formTitle.trim(),
        category: formCategory,
        image_url: formImageUrl.trim(),
        aspect_ratio: formAspectRatio,
        is_featured: formFeatured,
      });

      setIsModalOpen(false);

      showToast({
        type: "success",
        title: editingItem ? "Artwork Updated Successfully" : "Image Added Successfully",
        message: editingItem
          ? "Your portfolio artwork has been updated. Check your website to see the changes."
          : "Your image has been added to your website portfolio. Check your website to see it live.",
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Could Not Save Artwork",
        message:
          error instanceof Error
            ? error.message
            : "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed right-4 top-4 z-[100] w-[min(420px,calc(100vw-2rem))]">
          <div
            className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
              toast.type === "success"
                ? "border-emerald-500/30 bg-[#071b12]/95"
                : "border-rose-500/30 bg-[#21090d]/95"
            }`}
          >
            <div className="flex gap-3">
              {toast.type === "success" ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              )}

              <div className="min-w-0 flex-1">
                <div className="font-bold text-white">{toast.title}</div>
                <div className="mt-1 text-xs leading-5 text-[#b7c0ca]">
                  {toast.message}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setToast(null)}
                className="text-[#8b949e] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <ImageIcon className="h-5 w-5 text-purple-400" />
            Studio Portfolio
          </h2>

          <p className="mt-0.5 text-xs text-[#8b949e]">
            Organize photography and video stills, categorize by theme, and
            manage featured homepage showcases.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/20 transition-all hover:bg-purple-500"
        >
          <Plus className="h-4 w-4" />
          Add Portfolio Item
        </button>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#30363d] bg-[#161b22] p-4 md:flex-row">
        <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-2 md:w-auto md:pb-0">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              categoryFilter === "all"
                ? "bg-purple-500 text-black shadow-md shadow-purple-500/20"
                : "bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white"
            }`}
          >
            All ({portfolio.length})
          </button>

          {PORTFOLIO_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                categoryFilter === cat
                  ? "bg-purple-500 text-black shadow-md shadow-purple-500/20"
                  : "bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white"
              }`}
            >
              {cat} ({portfolio.filter((g) => g.category === cat).length})
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />
          <input
            type="text"
            placeholder="Search portfolio..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] py-2 pl-9 pr-4 text-xs text-white placeholder-[#484f58] focus:border-purple-500 focus:outline-none"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {filteredGallery.length === 0 ? (
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-12 text-center">
          <ImageIcon className="mx-auto mb-3 h-12 w-12 text-[#484f58]" />
          <h3 className="text-sm font-semibold text-white">
            No Artworks Found
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-[#8b949e]">
            {searchTerm || categoryFilter !== "all"
              ? "No artwork records match your active category search."
              : "Add your first photography piece to feature it on the studio portfolio."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredGallery.map((item) => {
            const itemId = item._id || item.id || "";

            return (
              <div
                key={itemId}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22] transition-all hover:border-[#484f58]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0d1117]">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800";
                    }}
                  />

                  <div className="absolute left-2 top-2 flex items-center gap-1">
                    <span className="rounded-full bg-black/80 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-white backdrop-blur-md">
                      {item.category}
                    </span>

                    {item.is_featured && (
                      <span className="flex items-center gap-0.5 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-black">
                        <Star className="h-2.5 w-2.5 fill-black" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5">
                  <div className="overflow-hidden pr-2">
                    <h4
                      className="truncate text-xs font-bold text-white"
                      title={item.title}
                    >
                      {item.title}
                    </h4>

                    <span className="block font-mono text-[10px] text-[#8b949e]">
                      Ratio: {item.aspect_ratio || "landscape"}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      title="Edit Artwork"
                      className="cursor-pointer rounded-lg bg-[#21262d] p-1.5 text-[#c9d1d9] transition-colors hover:bg-[#30363d] hover:text-white"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteItem(itemId)}
                      title="Delete Artwork"
                      className="cursor-pointer rounded-lg bg-rose-500/10 p-1.5 text-rose-400 transition-colors hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-8 max-h-[calc(100vh-4rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#30363d] bg-[#0d1117] p-5">
              <h3 className="text-sm font-bold text-white">
                {editingItem
                  ? `Edit Artwork: ${editingItem.title}`
                  : "Add Portfolio Item"}
              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8b949e] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 p-6 text-xs text-[#c9d1d9]">
              <div className="space-y-1.5">
                <label className="font-semibold text-white">
                  Artwork Title *
                </label>

                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(event) => setFormTitle(event.target.value)}
                  placeholder="e.g. Wedding Ceremony"
                  className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] p-2.5 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white">Category</label>

                  <select
                    value={formCategory}
                    onChange={(event) =>
                      setFormCategory(
                        event.target.value as (typeof PORTFOLIO_CATEGORIES)[number]
                      )
                    }
                    className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] p-2.5 text-white focus:border-purple-500 focus:outline-none"
                  >
                    {PORTFOLIO_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white">
                    Aspect Ratio
                  </label>

                  <select
                    value={formAspectRatio}
                    onChange={(event) =>
                      setFormAspectRatio(
                        event.target.value as
                          | "portrait"
                          | "landscape"
                          | "square"
                      )
                    }
                    className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] p-2.5 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="landscape">Landscape (16:9)</option>
                    <option value="portrait">Portrait (3:4)</option>
                    <option value="square">Square (1:1)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-white">
                  Upload Image
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                  className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                    isDragging
                      ? "border-purple-400 bg-purple-500/10"
                      : "border-[#30363d] bg-[#0d1117] hover:border-purple-500/60"
                  }`}
                >
                  <Upload className="mx-auto mb-3 h-8 w-8 text-purple-400" />

                  <div className="font-semibold text-white">
                    {isDragging
                      ? "Drop your image here"
                      : "Drag & drop your image here"}
                  </div>

                  <div className="mt-1 text-[11px] text-[#8b949e]">
                    JPG, PNG, WEBP, GIF or AVIF · Max 5 MB
                  </div>

                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 font-bold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Choose Image
                      </>
                    )}
                  </button>

                  <div className="mt-3 text-[10px] text-[#6e7681]">
                    On mobile, this button opens your device&apos;s photo/file picker.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-[#30363d]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e7681]">
                  Or use image URL
                </span>
                <div className="h-px flex-1 bg-[#30363d]" />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 font-semibold text-white">
                  <LinkIcon className="h-3.5 w-3.5 text-purple-400" />
                  Image URL
                </label>

                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(event) => setFormImageUrl(event.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] p-2.5 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              {formImageUrl && (
                <div className="overflow-hidden rounded-2xl border border-[#30363d] bg-black">
                  <div className="border-b border-[#30363d] bg-[#0d1117] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">
                    Image Preview
                  </div>

                  <div className="aspect-video">
                    <img
                      src={formImageUrl}
                      alt="Gallery preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#30363d] bg-[#0d1117] p-3">
                <input
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(event) =>
                    setFormFeatured(event.target.checked)
                  }
                  className="h-4 w-4 rounded accent-purple-500"
                />

                <div>
                  <span className="block font-semibold text-white">
                    Feature On Homepage
                  </span>
                  <span className="text-[11px] text-[#8b949e]">
                    Show this artwork in the featured portfolio showcase.
                  </span>
                </div>
              </label>

              <div className="-mx-6 -mb-6 mt-4 flex justify-end gap-2 border-t border-[#30363d] bg-[#0d1117] p-5">
                <button
                  type="button"
                  disabled={isSaving || isUploading}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-[#21262d] px-4 py-2 text-white hover:bg-[#30363d] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving || isUploading || !formImageUrl.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Save Artwork
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cropSource && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-[#30363d] bg-[#0d1117] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#30363d] px-5 py-4">
              <div>
                <h3 className="font-bold text-white">Edit & Crop Image</h3>
                <p className="mt-0.5 text-xs text-[#8b949e]">
                  Drag the image, zoom in/out, then apply the crop.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(cropSource);
                  setCropSource(null);
                  setZoom(1);
                  setCrop({ x: 0, y: 0 });
                  setCroppedAreaPixels(null);
                }}
                className="rounded-lg p-2 text-[#8b949e] hover:bg-[#21262d] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative h-[55vh] min-h-[320px] bg-black">
              <Cropper
                image={cropSource}
                crop={crop}
                zoom={zoom}
                aspect={
                  formAspectRatio === "portrait"
                    ? 3 / 4
                    : formAspectRatio === "square"
                      ? 1
                      : 16 / 9
                }
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels) =>
                  setCroppedAreaPixels(areaPixels)
                }
                objectFit="contain"
              />
            </div>

            <div className="space-y-4 border-t border-[#30363d] bg-[#0d1117] p-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#8b949e]">
                  Zoom
                </span>

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(event) =>
                    setZoom(Number(event.target.value))
                  }
                  className="flex-1 accent-purple-500"
                />

                <span className="w-12 text-right text-xs text-white">
                  {zoom.toFixed(2)}x
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-[#8b949e]">
                  Ratio:{" "}
                  <span className="font-semibold text-white">
                    {formAspectRatio === "portrait"
                      ? "Portrait 3:4"
                      : formAspectRatio === "square"
                        ? "Square 1:1"
                        : "Landscape 16:9"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(cropSource);
                      setCropSource(null);
                      setZoom(1);
                      setCrop({ x: 0, y: 0 });
                      setCroppedAreaPixels(null);
                    }}
                    className="rounded-xl bg-[#21262d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#30363d]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={!croppedAreaPixels || isUploading}
                    onClick={async () => {
                      if (!cropSource || !croppedAreaPixels) return;

                      try {
                        const croppedFile = await createCroppedImage(
                          cropSource,
                          croppedAreaPixels,
                          "cropped-image.webp"
                        );

                        if (croppedFile.size > 5 * 1024 * 1024) {
                          showToast({
                            type: "error",
                            title: "Cropped Image Too Large",
                            message:
                              "The cropped image is still larger than 5 MB. Please reduce the crop area or zoom out and try again.",
                          });
                          return;
                        }

                        URL.revokeObjectURL(cropSource);
                        setCropSource(null);

                        await uploadFile(croppedFile);

                        setZoom(1);
                        setCrop({ x: 0, y: 0 });
                        setCroppedAreaPixels(null);
                      } catch (error) {
                        showToast({
                          type: "error",
                          title: "Crop Failed",
                          message:
                            error instanceof Error
                              ? error.message
                              : "Could not crop the image.",
                        });
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-sm font-bold text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Apply Crop
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
