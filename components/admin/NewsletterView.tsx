"use client";

import React, { useState } from 'react';
import {
  Mail,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import type {
  NewsletterSubscriberRecord,
  NewsletterStatus,
} from '@/lib/types';

interface NewsletterViewProps {
  subscribers: NewsletterSubscriberRecord[];
  onUpdateStatus: (
    id: string,
    status: NewsletterStatus
  ) => Promise<void> | void;
  onDeleteSubscriber: (id: string) => Promise<void> | void;
}

const STATUSES: Array<'all' | NewsletterStatus> = [
  'all',
  'active',
  'unsubscribed',
];

export default function NewsletterView({
  subscribers = [],
  onUpdateStatus,
  onDeleteSubscriber,
}: NewsletterViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<'all' | NewsletterStatus>('all');

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch = (subscriber.email || '')
      .toLowerCase()
      .includes(term);

    const matchesStatus =
      statusFilter === 'all' ||
      subscriber.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }

    return 'bg-[#21262d] text-[#8b949e] border-[#30363d]';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Mail className="h-5 w-5 text-emerald-400" />
            Newsletter Subscribers
          </h2>

          <p className="mt-0.5 text-xs text-[#8b949e]">
            Manage First Look Studio newsletter subscribers and subscription status.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-[#8b949e]">
            Active Subscribers:
          </span>

          <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-emerald-400">
            {subscribers.filter(
              (subscriber) => subscriber.status === 'active'
            ).length}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#30363d] bg-[#161b22] p-4 md:flex-row">
        <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-2 md:w-auto md:pb-0">
          {STATUSES.map((status) => {
            const count =
              status === 'all'
                ? subscribers.length
                : subscribers.filter(
                    (subscriber) => subscriber.status === status
                  ).length;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  statusFilter === status
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
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
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] py-2 pl-9 pr-9 text-xs text-white placeholder-[#484f58] focus:border-emerald-500 focus:outline-none"
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

      {filteredSubscribers.length === 0 ? (
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-12 text-center">
          <Users className="mx-auto mb-3 h-12 w-12 text-[#484f58]" />

          <h3 className="text-sm font-semibold text-white">
            No Subscribers Found
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs text-[#8b949e]">
            {searchTerm || statusFilter !== 'all'
              ? 'No subscribers match your active filters.'
              : 'Newsletter subscribers will appear here.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="border-b border-[#30363d] bg-[#0d1117]">
                <tr>
                  <th className="px-5 py-3 font-mono text-[10px] uppercase text-[#8b949e]">
                    Subscriber
                  </th>

                  <th className="px-5 py-3 font-mono text-[10px] uppercase text-[#8b949e]">
                    Status
                  </th>

                  <th className="px-5 py-3 font-mono text-[10px] uppercase text-[#8b949e]">
                    Subscribed
                  </th>

                  <th className="px-5 py-3 text-right font-mono text-[10px] uppercase text-[#8b949e]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSubscribers.map((subscriber) => (
                  <tr
                    key={subscriber.id}
                    className="border-b border-[#30363d]/60 last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                          <Mail className="h-3.5 w-3.5" />
                        </div>

                        <a
                          href={`mailto:${subscriber.email}`}
                          className="font-medium text-white hover:text-emerald-400"
                        >
                          {subscriber.email}
                        </a>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={subscriber.status || 'active'}
                        onChange={(event) =>
                          void onUpdateStatus(
                            subscriber.id || '',
                            event.target.value as NewsletterStatus
                          )
                        }
                        className={`cursor-pointer rounded-full border px-2.5 py-1 text-[10px] font-mono font-bold uppercase focus:outline-none ${getStatusBadge(
                          subscriber.status || 'active'
                        )}`}
                      >
                        <option value="active">
                          Active
                        </option>

                        <option value="unsubscribed">
                          Unsubscribed
                        </option>
                      </select>
                    </td>

                    <td className="px-5 py-4 font-mono text-[#8b949e]">
                      {subscriber.created_at
                        ? new Date(
                            subscriber.created_at
                          ).toLocaleDateString()
                        : ''}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          void onDeleteSubscriber(
                            subscriber.id || ''
                          )
                        }
                        title="Delete subscriber"
                        className="rounded-lg p-1.5 text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
