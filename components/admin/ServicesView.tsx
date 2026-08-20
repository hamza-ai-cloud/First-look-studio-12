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
  X,
} from 'lucide-react';
import type { ServiceRecord, ServiceCategory } from '@/lib/types';

interface ServicesViewProps {
  services: ServiceRecord[];
  onSaveService: (
    service: Partial<ServiceRecord> & {
      title: string;
      price: number;
    }
  ) => Promise<void> | void;
  onToggleActive: (id: string) => Promise<void> | void;
  onDeleteService: (id: string) => Promise<void> | void;
}

const CATEGORIES: ServiceCategory[] = [
  'photography',
  'videography',
  'printing',
  'graphic_design',
  'editing',
  'custom',
];

export default function ServicesView({
  services = [],
  onSaveService,
  onToggleActive,
  onDeleteService,
}: ServicesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] =
    useState<Partial<ServiceRecord> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] =
    useState<ServiceCategory>('photography');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(1500);
  const [formFeatures, setFormFeatures] = useState(
    'Professional Production\nHigh-Resolution Delivery\nOnline Gallery'
  );
  const [formImage, setFormImage] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  const filtered = services.filter((service) => {
    const term = searchTerm.toLowerCase();

    return (
      service.title.toLowerCase().includes(term) ||
      (service.category || '').toLowerCase().includes(term) ||
      (service.description || '').toLowerCase().includes(term)
    );
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('photography');
    setFormDescription('');
    setFormPrice(1800);
    setFormFeatures(
      'Full-Day Shoot\nHigh-End Color Grading\nMaster 4K Delivery\nCloud Backup'
    );
    setFormImage(
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
    );
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: ServiceRecord) => {
    setEditingItem(service);
    setFormTitle(service.title);

    setFormCategory(
      CATEGORIES.includes(service.category as ServiceCategory)
        ? (service.category as ServiceCategory)
        : 'custom'
    );

    setFormDescription(service.description || '');
    setFormPrice(Number(service.price || 0));

    setFormFeatures(
      Array.isArray(service.features)
        ? service.features.join('\n')
        : ''
    );

    setFormImage(service.image_url || '');
    setFormIsActive(service.is_active !== false);
    setIsModalOpen(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    const title = formTitle.trim();

    if (!title) return;

    const features = formFeatures
      .split('\n')
      .map((feature) => feature.trim())
      .filter(Boolean);

    await onSaveService({
      id: editingItem?.id,
      title,
      category: formCategory,
      description: formDescription.trim(),
      price: Number(formPrice) || 0,
      features,
      image_url: formImage.trim() || null,
      is_active: formIsActive,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Service Packages & Production Catalog
          </h2>

          <p className="mt-0.5 text-xs text-[#8b949e]">
            Manage photography, videography, editing and commercial
            services displayed on the public site.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/20 transition-all hover:bg-purple-500"
        >
          <Plus className="h-4 w-4" />
          Add Service Package
        </button>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#30363d] bg-[#161b22] p-4 sm:flex-row">
        <div className="text-xs text-[#8b949e]">
          Showing{' '}
          <span className="font-semibold text-white">
            {filtered.length}
          </span>{' '}
          packages (
          {services.filter((service) => service.is_active).length} active
          on site)
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />

          <input
            type="text"
            placeholder="Search service..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] py-2 pl-9 pr-4 text-xs text-white placeholder-[#484f58] transition-colors focus:border-purple-500 focus:outline-none"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-12 text-center">
          <Sparkles className="mx-auto mb-3 h-12 w-12 text-[#484f58]" />
          <h3 className="text-sm font-semibold text-white">
            No Services Found
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-[#8b949e]">
            {searchTerm
              ? 'No packages match your search filter.'
              : 'Add your first service package.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const serviceId = item.id || '';

            return (
              <div
                key={serviceId}
                className={`flex flex-col justify-between overflow-hidden rounded-2xl border bg-[#161b22] transition-all hover:border-[#484f58] ${
                  item.is_active
                    ? 'border-[#30363d]'
                    : 'border-dashed border-[#484f58]/60 opacity-70'
                }`}
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-[#0d1117]">
                    <img
                      src={item.image_url || ''}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src =
                          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800';
                      }}
                    />

                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-black/80 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-white backdrop-blur-md">
                        {item.category || 'custom'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {item.title}
                      </h4>

                      <span className="whitespace-nowrap text-sm font-mono font-bold text-emerald-400">
                        ${Number(item.price || 0).toLocaleString()}
                      </span>
                    </div>

                    <p className="mb-4 line-clamp-3 text-xs text-[#8b949e]">
                      {item.description || 'No description provided.'}
                    </p>

                    {item.features && item.features.length > 0 && (
                      <div className="space-y-1.5 border-t border-[#30363d]/60 py-3">
                        {item.features.slice(0, 3).map((feature, index) => (
                          <div
                            key={`${feature}-${index}`}
                            className="flex items-center gap-2 text-[11px] text-[#c9d1d9]"
                          >
                            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}

                        {item.features.length > 3 && (
                          <div className="pl-5 text-[10px] text-[#8b949e]">
                            +{item.features.length - 3} additional features
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#30363d] bg-[#0d1117] p-4">
                  <button
                    type="button"
                    onClick={() => void onToggleActive(serviceId)}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      item.is_active
                        ? 'text-emerald-400 hover:bg-emerald-500/10'
                        : 'text-amber-400 hover:bg-amber-500/10'
                    }`}
                  >
                    {item.is_active ? (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        Hidden
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      title="Edit Service"
                      className="rounded-lg bg-[#21262d] p-1.5 text-[#c9d1d9] transition-colors hover:bg-[#30363d] hover:text-white"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => void onDeleteService(serviceId)}
                      title="Delete Service"
                      className="rounded-lg bg-rose-500/10 p-1.5 text-rose-400 transition-colors hover:bg-rose-500/20"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117] p-5">
              <h3 className="text-sm font-bold text-white">
                {editingItem
                  ? `Edit Service: ${editingItem.title}`
                  : 'Create New Service'}
              </h3>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#8b949e] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="space-y-4 overflow-y-auto p-6 text-xs text-[#c9d1d9]"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white">
                    Service Title *
                  </label>

                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(event) =>
                      setFormTitle(event.target.value)
                    }
                    placeholder="e.g. Luxury Wedding Photography"
                    className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] p-2.5 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white">
                    Category
                  </label>

                  <select
                    value={formCategory}
                    onChange={(event) =>
                      setFormCategory(
                        event.target.value as ServiceCategory
                      )
                    }
                    className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] p-2.5 text-white focus:border-purple-500 focus:outline-none"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white">
                  Price ($ USD) *
                </label>

                <input
                  type="number"
                  min="0"
                  required
                  value={formPrice}
                  onChange={(event) =>
                    setFormPrice(Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] p-2.5 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(event) =>
                    setFormDescription(event.target.value)
                  }
                  placeholder="Describe this service..."
                  className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] p-2.5 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white">
                  Included Features — one per line
                </label>

                <textarea
                  rows={5}
                  value={formFeatures}
                  onChange={(event) =>
                    setFormFeatures(event.target.value)
                  }
                  placeholder={'Professional Production\n4K Delivery\nOnline Gallery'}
                  className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] p-2.5 font-mono text-[11px] text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white">
                  Cover Image URL
                </label>

                <input
                  type="url"
                  value={formImage}
                  onChange={(event) =>
                    setFormImage(event.target.value)
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] p-2.5 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#30363d] bg-[#0d1117] p-3">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(event) =>
                    setFormIsActive(event.target.checked)
                  }
                  className="h-4 w-4 accent-purple-500"
                />
                <span className="font-semibold text-white">
                  Publish to Live Site
                </span>
              </label>

              <div className="flex justify-end gap-2 border-t border-[#30363d] pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-[#21262d] px-4 py-2 text-white hover:bg-[#30363d]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-500"
                >
                  {editingItem ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
