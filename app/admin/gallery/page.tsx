'use client';

import { useCallback, useEffect, useState } from 'react';
import GalleryView from '@/components/admin/GalleryView';
import type { GalleryItemRecord } from '@/lib/types';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItemRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGallery = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/gallery', {
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load gallery');
      }

      setGallery(result.data || []);
    } catch (error) {
      console.error('Load gallery error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGallery();
  }, [loadGallery]);

  const onSaveItem = async (
    item: Partial<GalleryItemRecord> & {
      title: string;
      image_url: string;
    }
  ) => {
    const response = await fetch('/api/admin/gallery', {
      method: item.id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to save gallery item');
    }

    await loadGallery();
  };

  const onDeleteItem = async (id: string) => {
    if (!window.confirm('Delete this portfolio artwork permanently?')) {
      return;
    }

    const response = await fetch(
      `/api/admin/gallery?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to delete gallery item');
    }

    await loadGallery();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-[#8b949e]">
          Loading gallery...
        </div>
      </div>
    );
  }

  return (
    <GalleryView
      gallery={gallery}
      onSaveItem={onSaveItem}
      onDeleteItem={onDeleteItem}
    />
  );
}
