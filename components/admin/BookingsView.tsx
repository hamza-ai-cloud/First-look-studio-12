"use client";

import React, { useState } from 'react';
import {
  CalendarCheck2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  X,
} from 'lucide-react';
import type { BookingRecord, BookingStatus } from '@/lib/types';

interface BookingsViewProps {
  bookings: BookingRecord[];
  onUpdateStatus: (id: string, status: BookingStatus) => Promise<void> | void;
  onUpdateNotes: (id: string, notes: string) => Promise<void> | void;
  onDeleteBooking: (id: string) => Promise<void> | void;
}

export default function BookingsView({
  bookings = [],
  onUpdateStatus,
  onUpdateNotes,
  onDeleteBooking,
}: BookingsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const filteredBookings = bookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (b.client_name && b.client_name.toLowerCase().includes(term)) ||
      (b.client_email && b.client_email.toLowerCase().includes(term)) ||
      (b.service_package && b.service_package.toLowerCase().includes(term)) ||
      (b.location && b.location.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setEditingNotes(booking.notes || '');
  };

  const handleSaveNotes = async () => {
    if (!selectedBooking) return;
    const bookingId = selectedBooking._id || selectedBooking.id;
    if (!bookingId) return;

    setIsSavingNotes(true);
    await onUpdateNotes(bookingId, editingNotes);
    setSelectedBooking({ ...selectedBooking, notes: editingNotes });
    setIsSavingNotes(false);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
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
            <CalendarCheck2 className="w-5 h-5 text-emerald-400" />
            Client Session Bookings
          </h2>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Manage incoming session requests, verify dates, update milestones, and track notes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-[#8b949e]">Total Requests:</span>
          <span className="text-white font-mono bg-[#161b22] px-2.5 py-1 rounded-lg border border-[#30363d]">
            {bookings.length}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'bg-[#21262d] text-[#8b949e] hover:text-white hover:bg-[#30363d]'
              }`}
            >
              {st} ({st === 'all' ? bookings.length : bookings.filter((b) => b.status === st).length})
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client or package..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0b0e14] border border-[#30363d] rounded-xl text-xs text-white placeholder-[#484f58] focus:outline-none focus:border-emerald-500 transition-colors"
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

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-12 text-center">
          <CalendarCheck2 className="w-12 h-12 text-[#484f58] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">No Bookings Found</h3>
          <p className="text-xs text-[#8b949e] mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'No records match your active search filters.'
              : 'Client bookings will appear here immediately upon submission.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0d1117] text-[#8b949e] uppercase font-mono text-[11px] border-b border-[#30363d]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Client</th>
                  <th className="py-3.5 px-4 font-semibold">Service Package</th>
                  <th className="py-3.5 px-4 font-semibold">Event Date</th>
                  <th className="py-3.5 px-4 font-semibold">Value</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]/50">
                {filteredBookings.map((b) => {
                  const bookingId = b._id || b.id || '';
                  return (
                    <tr key={bookingId} className="hover:bg-[#1c2128] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{b.client_name}</div>
                        <div className="text-[11px] text-[#8b949e]">{b.client_email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-white font-medium">{b.service_package}</div>
                        {b.location && (
                          <div className="text-[11px] text-[#8b949e] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#8b949e]" />
                            <span>{b.location}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#c9d1d9]">
                        {b.event_date ? new Date(b.event_date).toLocaleDateString() : 'TBD'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ${Number(b.total_price || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={b.status}
                          onChange={(e) => onUpdateStatus(bookingId, e.target.value as BookingStatus)}
                          className={`text-[11px] font-mono font-bold uppercase rounded-lg px-2.5 py-1 border bg-[#0b0e14] cursor-pointer focus:outline-none ${getStatusBadge(
                            b.status
                          )}`}
                        >
                          <option value="pending" className="bg-[#161b22] text-amber-400">
                            Pending
                          </option>
                          <option value="confirmed" className="bg-[#161b22] text-emerald-400">
                            Confirmed
                          </option>
                          <option value="completed" className="bg-[#161b22] text-blue-400">
                            Completed
                          </option>
                          <option value="cancelled" className="bg-[#161b22] text-rose-400">
                            Cancelled
                          </option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetail(b)}
                            className="px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => onDeleteBooking(bookingId)}
                            title="Delete booking"
                            className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#30363d] flex items-center justify-between bg-[#0d1117]">
              <div>
                <h3 className="text-sm font-bold text-white">Booking Details</h3>
                <span className="text-[10px] text-[#8b949e] font-mono">
                  ID: {selectedBooking._id || selectedBooking.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-[#8b949e] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[#8b949e] block font-mono text-[10px] uppercase">Client</span>
                  <div className="font-bold text-white">{selectedBooking.client_name}</div>
                  <div className="text-[#8b949e]">{selectedBooking.client_email}</div>
                  <div className="text-[#8b949e]">{selectedBooking.client_phone}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[#8b949e] block font-mono text-[10px] uppercase">Service</span>
                  <div className="font-bold text-emerald-400">{selectedBooking.service_package}</div>
                  <div className="text-[#8b949e]">
                    Date: {selectedBooking.event_date ? new Date(selectedBooking.event_date).toLocaleDateString() : 'TBD'}
                  </div>
                  <div className="text-white font-mono font-bold">
                    ${Number(selectedBooking.total_price || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {selectedBooking.location && (
                <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-xl flex items-center gap-2 text-[#c9d1d9]">
                  <MapPin className="w-4 h-4 text-[#8b949e] shrink-0" />
                  <span>{selectedBooking.location}</span>
                </div>
              )}

              {/* Internal Notes Editor */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  Internal Studio Notes & Requirements
                </label>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Add gear checklists, assistant assignments, or special client requests..."
                  className="w-full p-2.5 bg-[#0b0e14] border border-[#30363d] rounded-xl text-xs text-white placeholder-[#484f58] focus:outline-none focus:border-emerald-500"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between">
              <a
                href={`mailto:${selectedBooking.client_email}?subject=Booking Update - First Look Studio`}
                className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Client</span>
              </a>

              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}