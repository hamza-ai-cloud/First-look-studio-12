"use client";

import React, { useState } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Mail,
  Phone,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  Calendar,
  Sparkles,
  X,
} from 'lucide-react';
import type { ContactInquiryRecord, InquiryStatus } from '@/lib/types';

interface MessagesViewProps {
  contacts: ContactInquiryRecord[];
  onUpdateStatus: (id: string, status: InquiryStatus) => Promise<void> | void;
  onDeleteContact: (id: string) => Promise<void> | void;
}

export default function MessagesView({
  contacts = [],
  onUpdateStatus,
  onDeleteContact,
}: MessagesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactInquiryRecord | null>(null);

  const filteredContacts = contacts.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.message && c.message.toLowerCase().includes(term)) ||
      (c.service_interest && c.service_interest.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'replied':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'archived':
        return 'bg-[#21262d] text-[#8b949e] border-[#30363d]';
      default:
        return 'bg-[#21262d] text-[#8b949e] border-[#30363d]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-400" />
            Client Inquiries & Contact Messages
          </h2>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Review incoming consultation queries from the website contact forms.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-[#8b949e]">Unread Inquiries:</span>
          <span className="text-blue-400 font-mono bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-lg">
            {contacts.filter((c) => c.status === 'new').length}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {(['all', 'new', 'replied', 'archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-blue-500 text-black shadow-md shadow-blue-500/20'
                  : 'bg-[#21262d] text-[#8b949e] hover:text-white hover:bg-[#30363d]'
              }`}
            >
              {st} ({st === 'all' ? contacts.length : contacts.filter((c) => c.status === st).length})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0b0e14] border border-[#30363d] rounded-xl text-xs text-white placeholder-[#484f58] focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages List */}
      {filteredContacts.length === 0 ? (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-12 text-center">
          <Inbox className="w-12 h-12 text-[#484f58] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">No Inquiries Found</h3>
          <p className="text-xs text-[#8b949e] mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'No messages match your active filters.'
              : 'New contact inquiries submitted from the website will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContacts.map((c) => {
            const contactId = c._id || c.id || '';
            return (
              <div
                key={contactId}
                className={`bg-[#161b22] border rounded-2xl p-5 transition-all hover:border-[#484f58] ${
                  c.status === 'new' ? 'border-blue-500/40 bg-[#161b22]/90' : 'border-[#30363d]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#30363d]/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#21262d] flex items-center justify-center font-bold text-white text-xs">
                      {c.name ? c.name[0].toUpperCase() : 'C'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{c.name}</h4>
                      <p className="text-[11px] text-[#8b949e]">{c.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getStatusBadge(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>

                    <span className="text-[10px] text-[#8b949e] font-mono">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>

                <div className="py-3 text-xs text-[#c9d1d9] leading-relaxed">
                  {c.service_interest && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#0d1117] border border-[#30363d] text-[11px] text-emerald-400 font-medium mb-2">
                      <Sparkles className="w-3 h-3" />
                      <span>Interest: {c.service_interest}</span>
                    </div>
                  )}
                  <p className="text-slate-300">{c.message}</p>
                </div>

                <div className="pt-3 border-t border-[#30363d]/60 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={c.status}
                      onChange={(e) => onUpdateStatus(contactId, e.target.value as InquiryStatus)}
                      className="text-[11px] font-mono font-bold uppercase rounded-lg px-2.5 py-1 border border-[#30363d] bg-[#0b0e14] text-white cursor-pointer focus:outline-none"
                    >
                      <option value="new">Mark as New</option>
                      <option value="replied">Mark as Replied</option>
                      <option value="archived">Mark as Archived</option>
                    </select>

                    <a
                      href={`mailto:${c.email}?subject=Regarding Your Inquiry - First Look Studio`}
                      className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>
                  </div>

                  <button
                    onClick={() => onDeleteContact(contactId)}
                    title="Delete Inquiry"
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}