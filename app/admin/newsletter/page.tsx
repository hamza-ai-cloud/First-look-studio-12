'use client';

import { useCallback, useEffect, useState } from 'react';
import NewsletterView from '@/components/admin/NewsletterView';
import type {
  NewsletterStatus,
  NewsletterSubscriberRecord,
} from '@/lib/types';

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<
    NewsletterSubscriberRecord[]
  >([]);
  const [loading, setLoading] = useState(true);

  const loadSubscribers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/newsletter', {
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to load newsletter subscribers'
        );
      }

      setSubscribers(result.data || []);
    } catch (error) {
      console.error('Load newsletter subscribers error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubscribers();
  }, [loadSubscribers]);

  const onUpdateStatus = async (
    id: string,
    status: NewsletterStatus
  ) => {
    if (!id) return;

    const response = await fetch('/api/admin/newsletter', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        status,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || 'Failed to update subscriber'
      );
    }

    await loadSubscribers();
  };

  const onDeleteSubscriber = async (id: string) => {
    if (!id) return;

    if (
      !window.confirm(
        'Delete this newsletter subscriber permanently?'
      )
    ) {
      return;
    }

    const response = await fetch(
      `/api/admin/newsletter?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || 'Failed to delete subscriber'
      );
    }

    await loadSubscribers();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-[#8b949e]">
          Loading newsletter subscribers...
        </div>
      </div>
    );
  }

  return (
    <NewsletterView
      subscribers={subscribers}
      onUpdateStatus={onUpdateStatus}
      onDeleteSubscriber={onDeleteSubscriber}
    />
  );
}
