'use client';

import { useCallback, useEffect, useState } from 'react';
import BookingsList from '@/components/admin/BookingsView';
import type { BookingRecord, BookingStatus } from '@/lib/types';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/bookings', {
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Failed to load bookings'
        );
      }

      setBookings(result.data || []);
    } catch (error) {
      console.error('Load bookings error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const onUpdateStatus = async (
    id: string,
    status: BookingStatus
  ) => {
    if (!id) return;

    const response = await fetch('/api/admin/bookings', {
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
        result.error || 'Failed to update booking'
      );
    }

    await loadBookings();
  };

  const onUpdateNotes = async () => {
    // Notes update is not currently supported by the admin API.
  };

  const onDeleteBooking = async (id: string) => {
    if (!id) return;

    if (
      !window.confirm(
        'Delete this booking permanently?'
      )
    ) {
      return;
    }

    const response = await fetch(
      `/api/admin/bookings?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || 'Failed to delete booking'
      );
    }

    await loadBookings();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-[#8b949e]">
          Loading bookings...
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-white">
        Bookings
      </h1>

      <BookingsList
        bookings={bookings}
        onUpdateStatus={onUpdateStatus}
        onUpdateNotes={onUpdateNotes}
        onDeleteBooking={onDeleteBooking}
      />
    </div>
  );
}
