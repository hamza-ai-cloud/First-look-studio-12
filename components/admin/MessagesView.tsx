"use client";

import React, { useState } from 'react';
import {
  Inbox,
  Search,
  Mail,
  Trash2,
  Sparkles,
  X,
} from 'lucide-react';
import type {
  ContactInquiryRecord,
  InquiryStatus,
} from '@/lib/types';

interface MessagesViewProps {
  contacts: ContactInquiryRecord[];
  onUpdateStatus: (
    id: string,
    status: InquiryStatus
  ) => Promise<void> | void;
  onDeleteContact: (id: string) => Promise<void> | void;
}

const STATUSES: Array<'all' | InquiryStatus> = [
  'all',
  'new',
  'read',
  'replied',
  'archived',
];

export default function MessagesView({
  contacts = [],
  onUpdateStatus,
  onDeleteContact,
}: MessagesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<'all' | InquiryStatus>('all');

  const filteredContacts = contacts.filter((contact) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      (contact.name || '').toLowerCase().includes(term) ||
      (contact.email || '').toLowerCase().includes(term) ||
      (contact.subject || '').toLowerCase().includes(term) ||
      (contact.message || '').toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === 'all' ||
      contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';

      case 'read':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';

      case 'replied':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

      case 'archived':
        return 'bg-[#21262d] text-[#8b949e] border-[#30363d]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Inbox className="h-5 w-5 text-blue-400" />
            Client Inquiries & Contact Messages
          </h2>

          <p className="mt-0.5 text-xs text-[#8b949e]">
            Review incoming consultation queries from the website contact forms.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-[#8b949e]">
            New Inquiries:
          </span>

          <span className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 font-mono text-blue-400">
            {contacts.filter((c) => c.status === 'new').length}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#30363d] bg-[#161b22] p-4 md:flex-row">
        <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-2 md:w-auto md:pb-0">
          {STATUSES.map((status) => {
            const count =
              status === 'all'
                ? contacts.length
                : contacts.filter(
                    (contact) => contact.status === status
                  ).length;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  statusFilter === status
                    ? 'bg-blue-500 text-black shadow-md shadow-blue-500/20'
                    : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />

          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] py-2 pl-9 pr-9 text-xs text-white placeholder-[#484f58] focus:border-blue-500 focus:outline-none"
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

      {filteredContacts.length === 0 ? (
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-12 text-center">
          <Inbox className="mx-auto mb-3 h-12 w-12 text-[#484f58]" />

          <h3 className="text-sm font-semibold text-white">
            No Inquiries Found
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs text-[#8b949e]">
            {searchTerm || statusFilter !== 'all'
              ? 'No messages match your active filters.'
              : 'New contact inquiries submitted from the website will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`rounded-2xl border bg-[#161b22] p-5 transition-all hover:border-[#484f58] ${
                contact.status === 'new'
                  ? 'border-blue-500/40'
                  : 'border-[#30363d]'
              }`}
            >
              <div className="flex flex-col justify-between gap-2 border-b border-[#30363d]/60 pb-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#21262d] text-xs font-bold text-white">
                    {contact.name
                      ? contact.name[0].toUpperCase()
                      : 'C'}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {contact.name}
                    </h4>

                    <p className="text-[11px] text-[#8b949e]">
                      {contact.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${getStatusBadge(
                      contact.status
                    )}`}
                  >
                    {contact.status}
                  </span>

                  <span className="font-mono text-[10px] text-[#8b949e]">
                    {contact.created_at
                      ? new Date(contact.created_at).toLocaleDateString()
                      : ''}
                  </span>
                </div>
              </div>

              <div className="py-3 text-xs leading-relaxed text-[#c9d1d9]">
                <div className="mb-2 inline-flex items-center gap-1 rounded-md border border-[#30363d] bg-[#0d1117] px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                  <Sparkles className="h-3 w-3" />
                  <span>{contact.subject}</span>
                </div>

                <p className="text-slate-300">
                  {contact.message}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#30363d]/60 pt-3">
                <div className="flex items-center gap-2">
                  <select
                    value={contact.status}
                    onChange={(event) =>
                      void onUpdateStatus(
                        contact.id || '',
                        event.target.value as InquiryStatus
                      )
                    }
                    className="cursor-pointer rounded-lg border border-[#30363d] bg-[#0b0e14] px-2.5 py-1 text-[11px] font-mono font-bold uppercase text-white focus:outline-none"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>

                  <a
                    href={`mailto:${contact.email}?subject=Regarding Your Inquiry - First Look Studio`}
                    className="flex items-center gap-1.5 rounded-lg bg-[#21262d] px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#30363d]"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Reply via Email
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void onDeleteContact(contact.id || '')
                  }
                  title="Delete Inquiry"
                  className="cursor-pointer rounded-lg p-1.5 text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
