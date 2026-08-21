"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  DollarSign,
  ExternalLink,
  GalleryHorizontalEnd,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  MoreHorizontal,
  Package,
  RefreshCw,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

import type {
  BookingRecord,
  ContactInquiryRecord,
  ServiceRecord,
  GalleryItemRecord,
} from "@/lib/types";

interface DashboardViewProps {
  bookings: BookingRecord[];
  contacts: ContactInquiryRecord[];
  services: ServiceRecord[];
  gallery: GalleryItemRecord[];
}

function formatMoney(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function initials(name?: string) {
  if (!name) return "CL";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
}

function relativeDate(value?: string | Date) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function DashboardView({
  bookings = [],
  contacts = [],
  services = [],
  gallery = [],
}: DashboardViewProps) {
  const pending = bookings.filter((b) => b.status === "pending");
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const completed = bookings.filter((b) => b.status === "completed");

  const newMessages = contacts.filter((c) => c.status === "new");

  const revenue = bookings
    .filter(
      (b) =>
        b.status === "confirmed" ||
        b.status === "completed"
    )
    .reduce(
      (sum, b) => sum + (Number(b.total_price) || 0),
      0
    );

  const pendingValue = pending.reduce(
    (sum, b) => sum + (Number(b.total_price) || 0),
    0
  );

  const customers = new Set(
    bookings
      .map((b) => b.email)
      .filter(Boolean)
  ).size;

  const conversion =
    bookings.length > 0
      ? Math.round(
          ((confirmed.length + completed.length) /
            bookings.length) *
            100
        )
      : 0;

  const recentBookings = bookings.slice(0, 6);
  const recentMessages = contacts.slice(0, 5);

  return (
    <div className="min-h-full space-y-6 text-white">

      {/* ========================================================= */}
      {/* TOP COMMAND HEADER */}
      {/* ========================================================= */}

      <div className="relative overflow-hidden rounded-3xl border border-[#30363d] bg-[#0d1117]">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#c99634]/10 blur-3xl" />
        <div className="absolute -left-24 -bottom-32 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#60491b] bg-[#171208]">
                <LayoutDashboard className="h-4 w-4 text-[#d4a33d]" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8b949e]">
                Business Dashboard
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome back 👋
            </h1>

            <p className="mt-1 text-sm text-[#8b949e]">
              Here is a simple overview of your studio today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Everything is working
              </span>
            </div>

            <button
              type="button"
              className="flex h-9 items-center gap-2 rounded-xl border border-[#30363d] bg-[#161b22] px-3 text-xs font-medium text-[#c9d1d9] transition hover:border-[#c99634]/40 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex h-9 items-center gap-2 rounded-xl border border-[#30363d] bg-[#161b22] px-3 text-xs font-medium text-[#c9d1d9] transition hover:border-[#c99634]/40 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Site
            </Link>
          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* KPI CARDS */}
      {/* ========================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Revenue */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#30363d] bg-[#0d1117] p-5 transition hover:-translate-y-0.5 hover:border-emerald-500/30">

          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/5 blur-2xl transition group-hover:bg-emerald-500/10" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b949e]">
                Money Earned
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                {formatMoney(revenue)}
              </h2>

              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                {confirmed.length + completed.length} confirmed & completed bookings
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/10 p-2.5 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
        </div>


        {/* Pending */}
        <Link
          href="/admin/bookings"
          className="group relative overflow-hidden rounded-2xl border border-[#30363d] bg-[#0d1117] p-5 transition hover:-translate-y-0.5 hover:border-amber-500/40"
        >
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-500/5 blur-2xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b949e]">
                Bookings To Review
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {pending.length}
              </h2>

              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-400">
                <Clock3 className="h-3 w-3" />
                {formatMoney(pendingValue)} waiting for your review
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/10 bg-amber-500/10 p-2.5 text-amber-400">
              <Clock3 className="h-4 w-4" />
            </div>
          </div>
        </Link>


        {/* Customers */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#30363d] bg-[#0d1117] p-5 transition hover:-translate-y-0.5 hover:border-blue-500/30">

          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/5 blur-2xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b949e]">
                Clients
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {customers}
              </h2>

              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-blue-400">
                <Users className="h-3 w-3" />
                people who have booked
              </div>
            </div>

            <div className="rounded-xl border border-blue-500/10 bg-blue-500/10 p-2.5 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
        </div>


        {/* Booking Success */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#30363d] bg-[#0d1117] p-5 transition hover:-translate-y-0.5 hover:border-[#c99634]/40">

          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#c99634]/5 blur-2xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b949e]">
                Booking Success
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {conversion}%
              </h2>

              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#d4a33d]">
                <BarChart3 className="h-3 w-3" />
                confirmed or completed
              </div>
            </div>

            <div className="rounded-xl border border-[#c99634]/10 bg-[#c99634]/10 p-2.5 text-[#d4a33d]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* PIPELINE + QUICK ACTIONS */}
      {/* ========================================================= */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        <div className="rounded-2xl border border-[#30363d] bg-[#0d1117] p-5 xl:col-span-2">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b949e]">
                Booking Status
              </p>
              <h3 className="mt-1 text-sm font-semibold">
                See what needs your attention
              </h3>
            </div>

            <CalendarCheck2 className="h-4 w-4 text-[#8b949e]" />
          </div>

          <div className="grid grid-cols-3 gap-3">

            <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
              <div className="mb-3 flex items-center justify-between">
                <Clock3 className="h-4 w-4 text-amber-400" />
                <span className="text-[9px] font-bold uppercase text-amber-400">
                  Review
                </span>
              </div>

              <div className="text-2xl font-bold">{pending.length}</div>
              <p className="mt-1 text-[10px] text-[#8b949e]">
                Pending
              </p>
            </div>

            <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
              <div className="mb-3 flex items-center justify-between">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-[9px] font-bold uppercase text-blue-400">
                  Active
                </span>
              </div>

              <div className="text-2xl font-bold">{confirmed.length}</div>
              <p className="mt-1 text-[10px] text-[#8b949e]">
                Confirmed
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] p-4">
              <div className="mb-3 flex items-center justify-between">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-[9px] font-bold uppercase text-emerald-400">
                  Done
                </span>
              </div>

              <div className="text-2xl font-bold">{completed.length}</div>
              <p className="mt-1 text-[10px] text-[#8b949e]">
                Completed
              </p>
            </div>

          </div>

          <div className="mt-5">
            <div className="mb-2 flex justify-between text-[10px]">
              <span className="text-[#8b949e]">Bookings completed</span>
              <span className="font-mono text-white">{conversion}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#21262d]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8b6a22] via-[#d4a33d] to-emerald-400 transition-all"
                style={{
                  width: `${Math.min(conversion, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>


        {/* What do you want to do? */}
        <div className="rounded-2xl border border-[#30363d] bg-[#0d1117] p-5">

          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b949e]">
              What do you want to do?
            </p>
            <h3 className="mt-1 text-sm font-semibold">
              What do you want to do?
            </h3>
          </div>

          <div className="space-y-2">

            <Link
              href="/admin/bookings"
              className="flex items-center justify-between rounded-xl border border-[#30363d] bg-[#161b22] p-3 transition hover:border-amber-500/30 hover:bg-[#1c2128]"
            >
              <span className="flex items-center gap-3">
                <CalendarCheck2 className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-medium">Manage Bookings</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#8b949e]" />
            </Link>

            <Link
              href="/admin/messages"
              className="flex items-center justify-between rounded-xl border border-[#30363d] bg-[#161b22] p-3 transition hover:border-blue-500/30 hover:bg-[#1c2128]"
            >
              <span className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-medium">Read Messages</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#8b949e]" />
            </Link>

            <Link
              href="/admin/services"
              className="flex items-center justify-between rounded-xl border border-[#30363d] bg-[#161b22] p-3 transition hover:border-purple-500/30 hover:bg-[#1c2128]"
            >
              <span className="flex items-center gap-3">
                <Package className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-medium">Manage Services</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#8b949e]" />
            </Link>

            <Link
              href="/admin/gallery"
              className="flex items-center justify-between rounded-xl border border-[#30363d] bg-[#161b22] p-3 transition hover:border-pink-500/30 hover:bg-[#1c2128]"
            >
              <span className="flex items-center gap-3">
                <GalleryHorizontalEnd className="h-4 w-4 text-pink-400" />
                <span className="text-xs font-medium">Manage Gallery</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#8b949e]" />
            </Link>

          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* RECENT BOOKINGS + MESSAGES */}
      {/* ========================================================= */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">

        {/* Bookings */}
        <div className="overflow-hidden rounded-2xl border border-[#30363d] bg-[#0d1117] xl:col-span-3">

          <div className="flex items-center justify-between border-b border-[#30363d] p-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b949e]">
                Latest Activity
              </p>
              <h3 className="mt-1 text-sm font-semibold">
                Recent Bookings
              </h3>
            </div>

            <Link
              href="/admin/bookings"
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#d4a33d] hover:text-white"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#21262d]">

            {recentBookings.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <CalendarCheck2 className="mx-auto mb-3 h-7 w-7 text-[#30363d]" />
                <p className="text-xs text-[#8b949e]">
                  No booking activity yet.
                </p>
              </div>
            ) : (
              recentBookings.map((booking) => {

                const name =
                  booking.client_name ||
                  (booking as any).name ||
                  "Client";

                const service =
                  booking.service_package ||
                  (booking as any).service ||
                  "Photography";

                const price =
                  Number(booking.total_price) || 0;

                const status =
                  booking.status || "pending";

                return (
                  <div
                    key={booking._id || booking.id}
                    className="group flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#161b22]"
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#30363d] bg-[#161b22] text-[10px] font-bold text-[#d4a33d]">
                        {initials(name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">
                          {name}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-[#8b949e]">
                          {service}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-4">

                      <div className="hidden text-right sm:block">
                        <p className="text-[10px] font-bold text-white">
                          {formatMoney(price)}
                        </p>
                        <p className="mt-0.5 text-[9px] text-[#8b949e]">
                          {relativeDate(
                            (booking as any).created_at ||
                              (booking as any).createdAt
                          )}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-wider ${
                          status === "confirmed"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : status === "completed"
                            ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                            : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {status}
                      </span>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>


        {/* Messages */}
        <div className="overflow-hidden rounded-2xl border border-[#30363d] bg-[#0d1117] xl:col-span-2">

          <div className="flex items-center justify-between border-b border-[#30363d] p-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b949e]">
                Messages
              </p>

              <h3 className="mt-1 text-sm font-semibold">
                Client Messages
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {newMessages.length > 0 && (
                <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[8px] font-bold text-blue-400">
                  {newMessages.length} NEW
                </span>
              )}

              <Inbox className="h-4 w-4 text-blue-400" />
            </div>
          </div>

          <div className="divide-y divide-[#21262d]">

            {recentMessages.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Inbox className="mx-auto mb-3 h-7 w-7 text-[#30363d]" />
                <p className="text-xs text-[#8b949e]">
                  Inbox is currently empty.
                </p>
              </div>
            ) : (
              recentMessages.map((contact) => {

                const status = contact.status || "new";

                return (
                  <div
                    key={contact._id || contact.id}
                    className="flex gap-3 px-5 py-4 transition hover:bg-[#161b22]"
                  >

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-[10px] font-bold text-blue-400">
                      <UserRound className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-xs font-semibold text-white">
                          {contact.name}
                        </p>

                        <span className="shrink-0 text-[9px] text-[#8b949e]">
                          {relativeDate(
                            (contact as any).created_at ||
                              (contact as any).createdAt
                          )}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-[10px] text-[#8b949e]">
                        {(contact as any).subject ||
                          contact.email ||
                          "Client inquiry"}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="max-w-[180px] truncate text-[10px] text-[#6e7681]">
                          {(contact as any).message || "No message preview"}
                        </span>

                        <span
                          className={`rounded px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                            status === "new"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-[#21262d] text-[#8b949e]"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-[#30363d] p-4">
            <Link
              href="/admin/messages"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#161b22] py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#c9d1d9] transition hover:bg-[#21262d] hover:text-white"
            >
              View All Messages
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* WEBSITE OVERVIEW */}
      {/* ========================================================= */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="flex items-center justify-between rounded-2xl border border-[#30363d] bg-[#0d1117] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-500/10 p-2 text-purple-400">
              <Package className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#8b949e]">
                Services
              </p>
              <p className="mt-0.5 text-sm font-semibold">
                {services.length} packages
              </p>
            </div>
          </div>

          <ArrowUpRight className="h-4 w-4 text-[#484f58]" />
        </div>


        <div className="flex items-center justify-between rounded-2xl border border-[#30363d] bg-[#0d1117] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-pink-500/10 p-2 text-pink-400">
              <GalleryHorizontalEnd className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#8b949e]">
                Gallery
              </p>
              <p className="mt-0.5 text-sm font-semibold">
                {gallery.length} photos
              </p>
            </div>
          </div>

          <ArrowUpRight className="h-4 w-4 text-[#484f58]" />
        </div>


        <div className="flex items-center justify-between rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.025] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#8b949e]">
                Website Status
              </p>
              <p className="mt-0.5 text-sm font-semibold text-emerald-400">
                Website is working normally
              </p>
            </div>
          </div>

          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.6)]" />
        </div>

      </div>

    </div>
  );
}
