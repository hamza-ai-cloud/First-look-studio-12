"use client";

import React, { useState } from "react";
import {
  CalendarCheck2,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  X,
  UserRound,
} from "lucide-react";
import type { BookingRecord, BookingStatus } from "@/lib/types";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | BookingStatus>("all");
  const [selectedBooking, setSelectedBooking] =
    useState<BookingRecord | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const filteredBookings = bookings.filter((booking) => {
    const term = searchTerm.toLowerCase().trim();

    const searchable = [
      booking.name,
      booking.email,
      booking.phone,
      booking.service,
      booking.package,
      booking.photographer,
      booking.date,
      booking.time,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !term || searchable.includes(term);
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setEditingNotes(booking.notes || "");
  };

  const handleSaveNotes = async () => {
    if (!selectedBooking?.id) return;

    setIsSavingNotes(true);

    try {
      await onUpdateNotes(selectedBooking.id, editingNotes);
      setSelectedBooking({
        ...selectedBooking,
        notes: editingNotes,
      });
    } finally {
      setIsSavingNotes(false);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-[#21262d] text-[#8b949e] border-[#30363d]";
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "TBD";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <CalendarCheck2 className="h-5 w-5 text-emerald-400" />
            Client Session Bookings
          </h2>

          <p className="mt-0.5 text-xs text-[#8b949e]">
            Manage incoming session requests, verify dates, update milestones,
            and track notes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-[#8b949e]">Total Requests:</span>

          <span className="rounded-lg border border-[#30363d] bg-[#161b22] px-2.5 py-1 font-mono text-white">
            {bookings.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#30363d] bg-[#161b22] p-4 md:flex-row">
        <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-2 md:w-auto md:pb-0">
          {(
            [
              "all",
              "pending",
              "confirmed",
              "completed",
              "cancelled",
            ] as const
          ).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                statusFilter === status
                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                  : "bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white"
              }`}
            >
              {status} (
              {status === "all"
                ? bookings.length
                : bookings.filter((b) => b.status === status).length}
              )
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />

          <input
            type="text"
            placeholder="Search client, service, email..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] py-2 pl-9 pr-10 text-xs text-white placeholder-[#484f58] focus:border-emerald-500 focus:outline-none"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-12 text-center">
          <CalendarCheck2 className="mx-auto mb-3 h-12 w-12 text-[#484f58]" />

          <h3 className="text-sm font-semibold text-white">
            No Bookings Found
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs text-[#8b949e]">
            {searchTerm || statusFilter !== "all"
              ? "No records match your active search filters."
              : "Client bookings will appear here immediately upon submission."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#30363d] bg-[#0d1117] font-mono text-[11px] uppercase text-[#8b949e]">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Client</th>
                  <th className="px-4 py-3.5 font-semibold">Service</th>
                  <th className="px-4 py-3.5 font-semibold">Event</th>
                  <th className="px-4 py-3.5 font-semibold">Photographer</th>
                  <th className="px-4 py-3.5 font-semibold">Status</th>
                  <th className="px-4 py-3.5 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#30363d]/50">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-[#1c2128]"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white">
                        {booking.name}
                      </div>

                      <div className="text-[11px] text-[#8b949e]">
                        {booking.email}
                      </div>

                      {booking.phone && (
                        <div className="mt-0.5 text-[10px] text-[#6e7681]">
                          {booking.phone}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-white">
                        {booking.service}
                      </div>

                      <div className="mt-0.5 text-[11px] text-[#8b949e]">
                        {booking.package}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-mono text-[#c9d1d9]">
                        {formatDate(booking.date || undefined)}
                      </div>

                      <div className="mt-0.5 text-[11px] text-[#8b949e]">
                        {booking.time}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-white">
                        <UserRound className="h-3.5 w-3.5 text-[#8b949e]" />
                        {booking.photographer}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <select
                        value={booking.status}
                        onChange={(event) => {
                          if (!booking.id) return;

                          void onUpdateStatus(
                            booking.id,
                            event.target.value as BookingStatus
                          );
                        }}
                        className={`cursor-pointer rounded-lg border bg-[#0b0e14] px-2.5 py-1 text-[11px] font-mono font-bold uppercase focus:outline-none ${getStatusBadge(
                          booking.status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(booking)}
                          className="rounded-lg bg-[#21262d] px-2.5 py-1 text-white transition-colors hover:bg-[#30363d]"
                        >
                          Details
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                              if (!booking.id) return;
                              void onDeleteBooking(booking.id);
                            }}
                          title="Delete booking"
                          className="rounded-lg p-1 text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117] p-5">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Booking Details
                </h3>

                <span className="font-mono text-[10px] text-[#8b949e]">
                  ID: {selectedBooking.id}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-[#8b949e] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 p-6 text-xs">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <span className="block font-mono text-[10px] uppercase text-[#8b949e]">
                    Client
                  </span>

                  <div className="font-bold text-white">
                    {selectedBooking.name}
                  </div>

                  <a
                    href={`mailto:${selectedBooking.email}`}
                    className="flex items-center gap-1.5 text-[#8b949e] hover:text-white"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {selectedBooking.email}
                  </a>

                  {selectedBooking.phone && (
                    <a
                      href={`tel:${selectedBooking.phone}`}
                      className="flex items-center gap-1.5 text-[#8b949e] hover:text-white"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {selectedBooking.phone}
                    </a>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="block font-mono text-[10px] uppercase text-[#8b949e]">
                    Session
                  </span>

                  <div className="font-bold text-emerald-400">
                    {selectedBooking.service}
                  </div>

                  <div className="text-white">
                    {selectedBooking.package}
                  </div>

                  <div className="flex items-center gap-1.5 text-[#8b949e]">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(selectedBooking.date || undefined)} at{" "}
                    {selectedBooking.time}
                  </div>

                  <div className="flex items-center gap-1.5 text-[#8b949e]">
                    <UserRound className="h-3.5 w-3.5" />
                    {selectedBooking.photographer}
                  </div>
                </div>
              </div>

              {selectedBooking.location && (
                <div className="flex items-center gap-2 rounded-xl border border-[#30363d] bg-[#0d1117] p-3 text-[#c9d1d9]">
                  <MapPin className="h-4 w-4 shrink-0 text-[#8b949e]" />
                  <span>{selectedBooking.location}</span>
                </div>
              )}

              {selectedBooking.notes && (
                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-3">
                  <div className="mb-1 flex items-center gap-1.5 font-semibold text-white">
                    <FileText className="h-3.5 w-3.5 text-emerald-400" />
                    Client Notes
                  </div>

                  <p className="whitespace-pre-wrap text-[#8b949e]">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <FileText className="h-3.5 w-3.5 text-emerald-400" />
                  Internal Studio Notes
                </label>

                <textarea
                  rows={4}
                  value={editingNotes}
                  onChange={(event) => setEditingNotes(event.target.value)}
                  placeholder="Add studio notes, gear checklists, assistant assignments, or special requests..."
                  className="w-full rounded-xl border border-[#30363d] bg-[#0b0e14] p-2.5 text-xs text-white placeholder-[#484f58] focus:border-emerald-500 focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-black transition-all hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {isSavingNotes ? "Saving..." : "Save Notes"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#30363d] bg-[#0d1117] p-4">
              <a
                href={`mailto:${selectedBooking.email}?subject=Booking Update - First Look Studio`}
                className="flex items-center gap-1.5 rounded-xl bg-[#21262d] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#30363d]"
              >
                <Mail className="h-3.5 w-3.5" />
                Email Client
              </a>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
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
