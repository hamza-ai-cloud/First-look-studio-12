"use client";

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Star,
  ExternalLink,
  X,
} from 'lucide-react';
import type { GalleryItemRecord } from '@/lib/types';

interface GalleryViewProps {
  gallery: GalleryItemRecord[];
  onSaveItem: (item: Partial<GalleryItemRecord> & { title: string; image_url: string }) => Promise<void> | void;
  onDeleteItem: (id: string) => Promise<void> | void;
}

const GALLERY_CATEGORIES = ['Weddings', 'Portraits', 'Fashion', 'Commercial', 'Events', 'Cinematic'] as const;

export default function GalleryView({
  gallery = [],
  onSaveItem,
  onDeleteItem,
}: GalleryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<Partial<GalleryItemRecord> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<typeof GALLERY_CATEGORIES[number]>('Weddings');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formAspectRatio, setFormAspectRatio] = useState<'portrait' | 'landscape' | 'square'>('landscape');
  const [formFeatured, setFormFeatured] = useState(false);

  const filteredGallery = gallery.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.category && item.category.toLowerCase().includes(term));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('Weddings');
    setFormImageUrl('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800');
    setFormAspectRatio('landscape');
    setFormFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItemRecord) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormImageUrl(item.image_url);
    setFormAspectRatio(item.aspect_ratio || 'landscape');
    setFormFeatured(!!item.featured);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formImageUrl.trim()) return;

    await onSaveItem({
      id: editingItem?._id || editingItem?.id,
      title: formTitle.trim(),
      category: formCategory,
      image_url: formImageUrl.trim(),
      aspect_ratio: formAspectRatio,
      featured: formFeatured,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            Studio Gallery & Artwork Portfolio
          </h2>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Organize photography and video stills, categorize by theme, and manage featured homepage showcases.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Portfolio Artwork
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-purple-500 text-black shadow-md shadow-purple-500/20'
                : 'bg-[#21262d] text-[#8b949e] hover:text-white hover:bg-[#30363d]'
            }`}
          >
            All ({gallery.length})
          </button>
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-purple-500 text-black shadow-md shadow-purple-500/20'
                  : 'bg-[#21262d] text-[#8b949e] hover:text-white hover:bg-[#30363d]'
              }`}
            >
              {cat} ({gallery.filter((g) => g.category === cat).length})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search artworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0b0e14] border border-[#30363d] rounded-xl text-xs text-white placeholder-[#484f58] focus:outline-none focus:border-purple-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredGallery.length === 0 ? (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-12 text-center">
          <ImageIcon className="w-12 h-12 text-[#484f58] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">No Artworks Found</h3>
          <p className="text-xs text-[#8b949e] mt-1 max-w-sm mx-auto">
            {searchTerm || categoryFilter !== 'all'
              ? 'No artwork records match your active category search.'
              : 'Add your first photography piece to feature it on the studio portfolio.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGallery.map((item) => {
            const itemId = item._id || item.id || '';
            return (
              <div
                key={itemId}
                className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden group hover:border-[#484f58] transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 bg-[#0d1117] overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-black/80 text-white backdrop-blur-md">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-amber-500 text-black flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-black" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div className="overflow-hidden pr-2">
                    <h4 className="text-xs font-bold text-white truncate" title={item.title}>
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-[#8b949e] font-mono block">
                      Ratio: {item.aspect_ratio || 'landscape'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      title="Edit Artwork"
                      className="p-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(itemId)}
                      title="Delete Artwork"
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#30363d] flex items-center justify-between bg-[#0d1117]">
              <h3 className="text-sm font-bold text-white">
                {editingItem ? `Edit Artwork: ${editingItem.title}` : 'Add Portfolio Artwork'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8b949e] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs text-[#c9d1d9]">
              <div className="space-y-1.5">
                <label className="font-semibold text-white">Artwork Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Tuscany Sunset Wedding"
                  className="w-full p-2.5 bg-[#0b0e14] border border-[#30363d] rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-[#0b0e14] border border-[#30363d] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white">Aspect Ratio</label>
                  <select
                    value={formAspectRatio}
                    onChange={(e) => setFormAspectRatio(e.target.value as any)}
                    className="w-full p-2.5 bg-[#0b0e14] border border-[#30363d] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="landscape">Landscape (16:9)</option>
                    <option value="portrait">Portrait (3:4)</option>
                    <option value="square">Square (1:1)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white">High-Resolution Image URL *</label>
                <input
                  type="url"
                  required
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-[#0b0e14] border border-[#30363d] rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
                {formImageUrl && (
                  <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-[#30363d] bg-black">
                    <img src={formImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 p-3 bg-[#0d1117] border border-[#30363d] rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
                <div>
                  <span className="font-semibold text-white block">Feature On Homepage</span>
                  <span className="text-[11px] text-[#8b949e]">Showcases in the featured gallery showcase.</span>
                </div>
              </label>

              <div className="p-4 bg-[#0d1117] border-t border-[#30363d] flex justify-end gap-2 -mx-6 -mb-6 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-white rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  Save Artwork
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}