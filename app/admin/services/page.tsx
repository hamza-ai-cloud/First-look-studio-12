'use client';

import { useCallback, useEffect, useState } from 'react';
import ServicesView from '@/components/admin/ServicesView';
import type { ServiceRecord } from '@/lib/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServices = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/services', {
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load services');
      }

      setServices(result.data || []);
    } catch (error) {
      console.error('Load services error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const onSaveService = async (
    service: Partial<ServiceRecord> & {
      title: string;
      price: number;
    }
  ) => {
    const isEditing = Boolean(service.id);

    const response = await fetch('/api/admin/services', {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(service),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to save service');
    }

    await loadServices();
  };

  const onToggleActive = async (id: string) => {
    const service = services.find((item) => item.id === id);

    if (!service) return;

    const response = await fetch('/api/admin/services', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        is_active: !service.is_active,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update service');
    }

    await loadServices();
  };

  const onDeleteService = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this service?'
    );

    if (!confirmed) return;

    const response = await fetch(
      `/api/admin/services?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to delete service');
    }

    await loadServices();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-[#8b949e]">
          Loading services...
        </div>
      </div>
    );
  }

  return (
    <ServicesView
      services={services}
      onSaveService={onSaveService}
      onToggleActive={onToggleActive}
      onDeleteService={onDeleteService}
    />
  );
}
