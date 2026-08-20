"use client";

import React, { useState } from 'react';
import {
  BriefcaseBusiness,
  Search,
  Mail,
  ExternalLink,
  Trash2,
  X,
} from 'lucide-react';
import type { CareerRecord, CareerStatus } from '@/lib/types';

interface CareerViewProps {
  applications: CareerRecord[];
  onUpdateStatus: (id: string, status: CareerStatus) => Promise<void> | void;
  onDeleteApplication: (id: string) => Promise<void> | void;
}

const STATUSES: Array<'all' | CareerStatus> = [
  'all',
  'new',
  'reviewing',
  'shortlisted',
  'rejected',
  'accepted',
];

export default function CareerView({
  applications = [],
  onUpdateStatus,
  onDeleteApplication,
}: CareerViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<'all' | CareerStatus>('all');
  const [selected, setSelected] = useState<CareerRecord | null>(null);

  const filteredApplications = applications.filter((application) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      (application.name || '').toLowerCase().includes(term) ||
      (application.email || '').toLowerCase().includes(term) ||
      (application.position || '').toLowerCase().includes(term) ||
      (application.message || '').toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === 'all' ||
      application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'reviewing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'shortlisted':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'accepted':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-[#21262d] text-[#8b949e] border-[#30363d]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <BriefcaseBusiness className="h-5 w-5 text-purple-400" />
            Career Applications
          </h2>

          <p className="mt-0.5 text-xs text-[#8b949e]">
            Review candidates and manage recruitment applications.
          </p>
        </div>

        <div className="text-xs font-semibold text-[#8b949e]">
          New Applications:{' '}
          <span className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 font-mono text-blue-400">
            {applications.filter((a) => a.status === 'new').length}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#30363d] bg-[#161b22] p-4 md:flex-row">
        <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-2 md:w-auto md:pb-0">
          {STATUSES.map((status) => {
            const count =
              status === 'all'
                ? applications.length
                : applications.filter(
                    (application) => application.status === status
                  ).length;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  statusFilter === status
                    ? 'bg-purple-500 text-black shadow-md shadow-purple-500/20'
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
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] py-2 pl-9 pr-9 text-xs text-white placeholder-[#484f58] focus:border-purple-500 focus:outline-none"
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

      {filteredApplications.length === 0 ? (
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-12 text-center">
          <BriefcaseBusiness className="mx-auto mb-3 h-12 w-12 text-[#484f58]" />

          <h3 className="text-sm font-semibold text-white">
            No Applications Found
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs text-[#8b949e]">
            {searchTerm || statusFilter !== 'all'
              ? 'No applications match your active filters.'
              : 'Career applications submitted from the website will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 transition-all hover:border-[#484f58]"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-sm font-bold text-purple-400">
                    {(application.name || 'C')[0].toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-bold text-white">
                      {application.name || 'Unknown Candidate'}
                    </h4>

                    <p className="truncate text-[11px] text-[#8b949e]">
                      {application.email || ''}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full border px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${getStatusBadge(
                    (application.status || 'new')
                  )}`}
                >
                  {application.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 border-t border-[#30363d]/60 pt-4 sm:grid-cols-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                    Position
                  </span>

                  <p className="mt-1 text-xs font-semibold text-white">
                    {application.position || 'Not specified'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                    Applied
                  </span>

                  <p className="mt-1 text-xs text-[#c9d1d9]">
                    {application.created_at
                      ? new Date(application.created_at).toLocaleDateString()
                      : ''}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#30363d]/60 pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={application.status}
                    onChange={(event) =>
                      void onUpdateStatus(
                        application.id || '',
                        event.target.value as CareerStatus
                      )
                    }
                    className="cursor-pointer rounded-lg border border-[#30363d] bg-[#0b0e14] px-2.5 py-1 text-[11px] font-mono font-bold uppercase text-white focus:outline-none"
                  >
                    <option value="new">New</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="accepted">Accepted</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setSelected(application)}
                    className="rounded-lg bg-[#21262d] px-3 py-1 text-xs font-semibold text-white hover:bg-[#30363d]"
                  >
                    View Application
                  </button>

                  <a
                    href={`mailto:${application.email}`}
                    className="flex items-center gap-1.5 rounded-lg bg-[#21262d] px-3 py-1 text-xs font-semibold text-white hover:bg-[#30363d]"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => void onDeleteApplication(application.id || '')}
                  className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                  title="Delete application"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117] p-5">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Application Details
                </h3>

                <span className="font-mono text-[10px] text-[#8b949e]">
                  ID: {selected.id}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-[#8b949e] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                    Candidate
                  </span>
                  <p className="mt-1 font-bold text-white">
                    {selected.name}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                    Position
                  </span>
                  <p className="mt-1 font-bold text-purple-400">
                    {selected.position}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                    Email
                  </span>
                  <a
                    href={`mailto:${selected.email}`}
                    className="mt-1 block text-xs text-[#c9d1d9] hover:text-white"
                  >
                    {selected.email}
                  </a>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                    Phone
                  </span>
                  <p className="mt-1 text-xs text-[#c9d1d9]">
                    {selected.portfolio || 'Not provided'}
                  </p>
                </div>
              </div>

              {selected.portfolio && (
                <a
                  href={selected.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-xs font-semibold text-white hover:bg-[#21262d]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open Portfolio
                </a>
              )}

              <div>
                <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                  Candidate Message
                </span>

                <div className="mt-2 whitespace-pre-wrap rounded-xl border border-[#30363d] bg-[#0d1117] p-4 text-xs leading-relaxed text-[#c9d1d9]">
                  {selected.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
