"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  Eye,
  EyeOff,
  DollarSign,
  Clock,
  X,
} from 'lucide-react';
import type { ServiceRecord } from '@/lib/types';

interface ServicesViewProps {
  services: ServiceRecord[];
  onSaveService: (service: Partial<ServiceRecord> & { title: string; price: number }) => Promise<void> | void;
  onToggleActive: (id: string) => Promise<void> | void;
  onDeleteService: (id: string) => Promise<void> | void;
}

export default function ServicesView({
  services = [],
  onSaveService,
  onToggleActive,
  onDeleteService,
}: ServicesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<Partial<ServiceRecord> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'photography' | 'videography' | 'editing' | 'custom'>('photography');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formPrice, setFormPrice] = useState<number>(1500);
  const [formDuration, setFormDuration] = useState('6 Hours');
  const [formFeatures, setFormFeatures] = useState<string>('2 Lead Photographers\nOnline Gallery\nHigh-Res Retouched Images');
  const [formImage, setFormImage] = useState('');
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);

  const filtered = services.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      (s.title && s.title.toLowerCase().includes(term)) ||
      (s.category && s.category.toLowerCase().includes(term)) ||
      (s.short_description && s.short_description.toLowerCase().includes(term))
    );
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('photography');
    setFormShortDesc('');
    setFormFullDesc('');
    setFormPrice(1800);
    setFormDuration('6 Hours');
    setFormFeatures('Full-Day Shoot\nHigh-End Color Grading\nMaster 4K Delivery\nCloud Backup');
    setFormImage('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800');
    setFormIsPopular(false);
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: ServiceRecord) => {
    setEditingItem(s);
    setFormTitle(s.title);
    setFormCategory(s.category || 'photography');
    setFormShortDesc(s.short_description || '');
    setFormFullDesc(s.full_description || '');
    setFormPrice(s.price || 0);
    setFormDuration(s.duration || '4 Hours');
    setFormFeatures(Array.isArray(s.features) ? s.features.join('\n') : '');
    setFormImage(s.image_url || '');
    setFormIsPopular(!!s.is_popular);
    setFormIsActive(s.is_active !== undefined ? s.is_active : true);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const featureList = formFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    await onSaveService({
      id: editingItem?._id || editingItem?.id,
      title: formTitle.trim(),
      category: formCategory,
      short_description: formShortDesc.trim(),
      full_description: formFullDesc.trim(),
      price: Number(formPrice) || 0,
      duration: formDuration.trim(),
      features: featureList,
      image_url: formImage.trim(),
      is_popular: formIsPopular,
      is_active: formIsActive,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Service Packages & Production Catalog
          </h2>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Manage photography, videography, and commercial offerings displayed on the public site.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Service Package
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="text-xs text-[#8b949e]">
          Showing <span className="text-white font-semibold">{filtered.length}</span> packages (
          {services.filter((s) => s.is_active).length} active on site)
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service..."
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

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-12 text-center">
          <Sparkles className="w-12 h-12 text-[#484f58] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">No Services Found</h3>
          <p className="text-xs text-[#8b949e] mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'No packages match your search filter.'
              : 'Add your first service package to showcase it on the website slider.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const serviceId = item._id || item.id || '';
            return (
              <div
                key={serviceId}
                className={`bg-[#161b22] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:border-[#484f58] ${
                  item.is_active ? 'border-[#30363d]' : 'border-dashed border-[#484f58]/60 opacity-70'
                }`}
              >
                <div>
                  <div className="relative aspect-video bg-[#0d1117] overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-black/80 text-white backdrop-blur-md">
                        {item.category}
                      </span>
                      {item.is_popular && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500 text-black">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-emerald-400">
                          ${Number(item.price || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#8b949e] block font-mono">
                          {item.duration}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#8b949e] line-clamp-2 mb-4">
                      {item.short_description}
                    </p>

                    {/* Features List */}
                    {item.features && item.features.length > 0 && (
                      <div className="space-y-1.5 py-3 border-t border-[#30363d]/60">
                        {item.features.slice(0, 3).map((f: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-[#c9d1d9]">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                        {item.features.length > 3 && (
                          <div className="text-[10px] text-[#8b949e] font-mono pl-5">
                            +{item.features.length - 3} additional features
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between">
                  <button
                    onClick={() => onToggleActive(serviceId)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      item.is_active
                        ? 'text-emerald-400 hover:bg-emerald-500/10'
                        : 'text-amber-400 hover:bg-amber-500/10'
                    }`}
                  >
                    {item.is_active ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        Hidden
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      title="Edit Service"
                      className="p-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteService(serviceId)}
                      title="Delete Service"
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
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-[#30363d] flex items-center justify-between bg-[#0d1117]">
              <h3 className="text-sm font-bold text-white">
                {editingItem ? `Edit Package: ${editingItem.title}` : 'Create New Service Package'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8b949e] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto text-xs text-[#c9d1d9]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white">Package Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Luxury Wedding Film"
                    className="w-full p-2.5 bg-[#0b0e14] border border-[#30363d] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-[#0b0e14] border border-[#30363d] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="photography">Photography</option>
                    <option value="videography">Videography</option>
                    <option value="editing">Editing / Post-Production</option>
                    <option value="custom">Commercial / Custom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white">Price ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    placeholder="2500"
                    className="w-full p-2.5 bg-[#0b0e14] border border-[#30363d] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white">Coverage Duration</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="e.g. 8 Hours or Full Day"
                    className="w-full p-2.5 bg-[#0b0e14] border border-[#30363d] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white">Short Summary Description</label>
                <textarea
                  rows={2}
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Concise overview displayed on preview cards..."
                  className="w-full p-2.5 bg-[#0b0e14] border border-[#30363d] rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white">
                  Included Feature Bullets (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  placeholder="2 Lead Photographers&#10;4K Drone Footage&#10;Private Online Gallery"
                  className="w-full p-2.5 bg-[#0b0e14] border border-[#30363d] rounded-xl text-white font-mono text-[11px] focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white">Cover Image URL</label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-[#0b0e14] border border-[#30363d] rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 p-3 bg-[#0d1117] border border-[#30363d] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPopular}
                    onChange={(e) => setFormIsPopular(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded"
                  />
                  <span className="font-semibold text-white">Mark as Popular</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-[#0d1117] border border-[#30363d] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded"
                  />
                  <span className="font-semibold text-white">Publish to Live Site</span>
                </label>
              </div>

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
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
