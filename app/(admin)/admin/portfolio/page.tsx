'use client';

import { useCallback, useEffect, useState } from 'react';
import PortfolioView from '@/components/admin/PortfolioView';
import type { GalleryItemRecord } from '@/lib/types';

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<GalleryItemRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPortfolio = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/portfolio', {
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load portfolio');
      }

      setItems(result.data || []);
    } catch (error) {
      console.error('Load portfolio error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPortfolio();
  }, [loadPortfolio]);

  const onSaveItem = async (
    item: Partial<GalleryItemRecord> & {
      title: string;
      image_url: string;
    }
  ) => {
    const response = await fetch('/api/admin/portfolio', {
      method: item.id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to save portfolio item');
    }

    await loadPortfolio();
  };

  const onDeleteItem = async (id: string) => {
    if (!window.confirm('Delete this portfolio artwork permanently?')) {
      return;
    }

    const response = await fetch(
      `/api/admin/portfolio?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to delete portfolio item');
    }

    await loadPortfolio();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-[#8b949e]">
          Loading portfolio...
        </div>
      </div>
    );
  }

  return (
    <PortfolioView
      portfolio={items}
      onSaveItem={onSaveItem}
      onDeleteItem={onDeleteItem}
    />
  );
}
