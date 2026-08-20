'use client';

import { useCallback, useEffect, useState } from 'react';
import CareerView from '@/components/admin/CareerView';
import type { CareerRecord, CareerStatus } from '@/lib/types';

export default function AdminCareersPage() {
  const [applications, setApplications] = useState<CareerRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/careers', {
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to load career applications'
        );
      }

      setApplications(result.data || []);
    } catch (error) {
      console.error('Load career applications error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const onUpdateStatus = async (
    id: string,
    status: CareerStatus
  ) => {
    if (!id) return;

    const response = await fetch('/api/admin/careers', {
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
        result.error || 'Failed to update application'
      );
    }

    await loadApplications();
  };

  const onDeleteApplication = async (id: string) => {
    if (!id) return;

    if (
      !window.confirm(
        'Delete this career application permanently?'
      )
    ) {
      return;
    }

    const response = await fetch(
      `/api/admin/careers?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || 'Failed to delete application'
      );
    }

    await loadApplications();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-[#8b949e]">
          Loading career applications...
        </div>
      </div>
    );
  }

  return (
    <CareerView
      applications={applications}
      onUpdateStatus={onUpdateStatus}
      onDeleteApplication={onDeleteApplication}
    />
  );
}
