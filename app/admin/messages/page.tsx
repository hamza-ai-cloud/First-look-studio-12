'use client';

import { useCallback, useEffect, useState } from 'react';
import MessagesView from '@/components/admin/MessagesView';
import type {
  ContactInquiryRecord,
  InquiryStatus,
} from '@/lib/types';

export default function AdminMessagesPage() {
  const [contacts, setContacts] = useState<ContactInquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadContacts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/contacts', {
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to load messages'
        );
      }

      setContacts(result.data || []);
    } catch (error) {
      console.error('Load contacts error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  const onUpdateStatus = async (
    id: string,
    status: InquiryStatus
  ) => {
    if (!id) return;

    const response = await fetch('/api/admin/contacts', {
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
        result.error || 'Failed to update message'
      );
    }

    await loadContacts();
  };

  const onDeleteContact = async (id: string) => {
    if (!id) return;

    const confirmed = window.confirm(
      'Delete this contact inquiry permanently?'
    );

    if (!confirmed) return;

    const response = await fetch(
      `/api/admin/contacts?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || 'Failed to delete message'
      );
    }

    await loadContacts();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-[#8b949e]">
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <MessagesView
      contacts={contacts}
      onUpdateStatus={onUpdateStatus}
      onDeleteContact={onDeleteContact}
    />
  );
}
