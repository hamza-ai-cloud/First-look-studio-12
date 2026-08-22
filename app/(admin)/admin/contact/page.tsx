'use client';

import { useCallback, useEffect, useState } from 'react';

type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  status?: string | null;
  created_at: string;
};

const STATUSES = ['new', 'read', 'replied', 'archived'];

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadContacts = useCallback(async () => {
    try {
      setError('');

      const response = await fetch('/api/admin/contacts', {
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load contacts');
      }

      setContacts(result.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to load contacts'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  async function updateStatus(id: string, status: string) {
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
      throw new Error(result.error || 'Failed to update contact');
    }

    await loadContacts();
  }

  async function deleteContact(id: string) {
    if (!window.confirm('Delete this contact message permanently?')) {
      return;
    }

    const response = await fetch(
      `/api/admin/contacts?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to delete contact');
    }

    await loadContacts();
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-[#8b949e]">
          Loading contact messages...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Contact
        </h1>
        <p className="mt-1 text-sm text-[#8b949e]">
          Manage messages submitted through your public contact form.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-[#0d1117]">
        <div className="border-b border-white/10 px-5 py-4">
          <p className="text-sm text-[#8b949e]">
            {contacts.length} contact message
            {contacts.length === 1 ? '' : 's'}
          </p>
        </div>

        {contacts.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-[#8b949e]">
              No contact messages yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {contacts.map((contact) => (
              <div key={contact.id} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-medium text-white">
                        {contact.name}
                      </h2>

                      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-[#8b949e]">
                        {contact.status || 'new'}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#8b949e]">
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:text-white"
                      >
                        {contact.email}
                      </a>

                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="hover:text-white"
                        >
                          {contact.phone}
                        </a>
                      )}
                    </div>

                    {contact.subject && (
                      <p className="mt-4 font-medium text-white">
                        {contact.subject}
                      </p>
                    )}

                    {contact.message && (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#8b949e]">
                        {contact.message}
                      </p>
                    )}

                    <p className="mt-4 text-xs text-[#6e7681]">
                      {new Date(contact.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={contact.status || 'new'}
                      onChange={(event) =>
                        void updateStatus(
                          contact.id,
                          event.target.value
                        )
                      }
                      className="rounded-md border border-white/10 bg-[#161b22] px-3 py-2 text-xs text-white outline-none"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => void deleteContact(contact.id)}
                      className="rounded-md border border-red-500/20 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
