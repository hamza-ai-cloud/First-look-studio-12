"use client";

import React, { useState } from 'react';

export default function BookingsList({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState(initialData || []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch('/api/admin/bookings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setItems((prev: any[]) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    } else {
      alert('Unable to update status');
    }
  }

  return (
    <div className="space-y-3">
      {items.map((b) => (
        <div key={b.id} className="bg-white p-4 rounded shadow">
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">{b.name} — {b.service}</div>
              <div className="text-sm text-gray-500">{b.email} • {b.phone}</div>
              <div className="text-xs text-gray-400">{b.date} {b.time}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{b.status}</span>
              <select defaultValue={b.status} onChange={(e) => updateStatus(b.id, e.target.value)} className="border rounded p-1">
                <option value="pending">New</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          {b.notes && <div className="mt-2 text-sm text-gray-700">{b.notes}</div>}
        </div>
      ))}
    </div>
  );
}
