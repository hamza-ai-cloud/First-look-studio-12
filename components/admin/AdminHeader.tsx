"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  CalendarCheck2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  GalleryHorizontalEnd,
  Globe2,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Newspaper,
  Palette,
  PanelLeft,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

interface AdminHeaderProps {
  email: string;
  role: string;
}

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
};

type NavGroup = {
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  items: NavItem[];
  superAdminOnly?: boolean;
};

const groups: NavGroup[] = [
  {
    label: "Main",
    icon: LayoutDashboard,
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Your Business",
    icon: BriefcaseBusiness,
    items: [
      {
        label: "Bookings",
        href: "/admin/bookings",
        icon: CalendarCheck2,
      },
      {
        label: "Messages",
        href: "/admin/messages",
        icon: MessageSquare,
      },
      {
        label: "Services",
        href: "/admin/services",
        icon: FolderOpen,
      },
      {
        label: "Gallery",
        href: "/admin/gallery",
        icon: GalleryHorizontalEnd,
      },
      {
        label: "Careers",
        href: "/admin/careers",
        icon: BriefcaseBusiness,
      },
      {
        label: "Newsletter",
        href: "/admin/newsletter",
        icon: Mail,
      },
    ],
  },
  {
    label: "Website",
    icon: Globe2,
    items: [
      {
        label: "Edit Website",
        href: "/admin/cms",
        icon: Sparkles,
      },
      {
        label: "Pages",
        href: "/admin/cms/pages",
        icon: FileText,
      },
      {
        label: "Photos & Media",
        href: "/admin/cms/media",
        icon: Image,
      },
      {
        label: "Menu",
        href: "/admin/cms/navigation",
        icon: Menu,
      },
      {
        label: "SEO",
        href: "/admin/cms/seo",
        icon: Search,
      },
      {
        label: "Branches",
        href: "/admin/cms/branches",
        icon: Globe2,
      },
      {
        label: "Design",
        href: "/admin/cms/theme",
        icon: Palette,
      },
      {
        label: "Settings",
        href: "/admin/cms/settings",
        icon: Settings,
      },
    ],
  },
  {
    label: "Admin",
    icon: ShieldCheck,
    superAdminOnly: true,
    items: [
      {
        label: "Admin Management",
        href: "/admin/admins",
        icon: Users,
      },
      {
        label: "Activity Log",
        href: "/admin/cms/activity",
        icon: Activity,
      },
    ],
  },
];

export default function AdminHeader({
  email,
  role,
}: AdminHeaderProps) {
  const pathname = usePathname();

  // Sign-in page must stay completely clean:
  // no admin header/sidebar/navigation.
  if (pathname === "/admin/signin") {
    return null;
  }

  const isSuperAdmin =
    role === "super_admin";

  const visibleGroups = groups.filter(
    (group) =>
      !group.superAdminOnly ||
      isSuperAdmin
  );

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [collapsed, setCollapsed] =
    useState(false);

  const [openGroups, setOpenGroups] =
    useState<Record<string, boolean>>(() => {
      const state: Record<
        string,
        boolean
      > = {};

      groups.forEach((group) => {
        state[group.label] = true;
      });

      return state;
    });

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  function toggleGroup(label: string) {
    setOpenGroups((current) => ({
      ...current,
      [label]: !current[label],
    }));
  }

  async function handleSignOut() {
    await signOut({
      redirect: false,
    });

    // Always redirect on the current origin.
    // This prevents local development from jumping to the production domain.
    window.location.assign("/admin/signin");
  }

  const navigation = (
    <nav className="space-y-3">
      {visibleGroups.map((group) => {
        const GroupIcon = group.icon;

        const groupActive =
          group.items.some((item) =>
            isActive(item.href)
          );

        return (
          <div key={group.label}>
            {!collapsed && (
              <button
                type="button"
                onClick={() =>
                  toggleGroup(group.label)
                }
                className={`flex w-full items-center justify-between px-2 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] transition ${
                  groupActive
                    ? "text-[#d4a33d]"
                    : "text-[#6e7681] hover:text-[#c9d1d9]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <GroupIcon className="h-3 w-3" />
                  {group.label}
                </span>

                <ChevronDown
                  className={`h-3 w-3 transition ${
                    openGroups[group.label]
                      ? ""
                      : "-rotate-90"
                  }`}
                />
              </button>
            )}

            {collapsed && (
              <div className="mb-1 flex justify-center">
                <GroupIcon
                  className={`h-3.5 w-3.5 ${
                    groupActive
                      ? "text-[#d4a33d]"
                      : "text-[#6e7681]"
                  }`}
                />
              </div>
            )}

            {(collapsed ||
              openGroups[group.label]) && (
              <div className="space-y-1">
                {group.items.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    const active =
                      isActive(
                        item.href
                      );

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() =>
                          setMobileOpen(
                            false
                          )
                        }
                        title={
                          collapsed
                            ? item.label
                            : undefined
                        }
                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                          active
                            ? "bg-[#c99634]/10 text-[#f0c96b]"
                            : "text-[#8b949e] hover:bg-white/[0.04] hover:text-white"
                        } ${
                          collapsed
                            ? "justify-center px-2"
                            : ""
                        }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[#c99634]" />
                        )}

                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            active
                              ? "text-[#d4a33d]"
                              : "text-[#6e7681] group-hover:text-[#c9d1d9]"
                          }`}
                        />

                        {!collapsed && (
                          <>
                            <span className="truncate">
                              {item.label}
                            </span>

                            {active && (
                              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d4a33d]" />
                            )}
                          </>
                        )}
                      </Link>
                    );
                  }
                )}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/10 bg-[#0b0f14]/95 backdrop-blur-xl">
        <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setMobileOpen(true)
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[#8b949e] hover:text-white lg:hidden"
              aria-label="Open admin navigation"
            >
              <Menu className="h-4 w-4" />
            </button>

            <Link
              href="/admin"
              className="flex min-w-0 items-center gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#60491b] bg-[#171208]">
                <Sparkles className="h-4 w-4 text-[#d4a33d]" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-wide text-white">
                  First Look Studio
                </p>

                <p className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-[#6e7681] sm:block">
                  Command Center
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#8b949e] transition hover:text-white md:flex"
            >
              <Globe2 className="h-3.5 w-3.5" />
              View Website
            </Link>

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <div className="max-w-[180px]">
                <p className="truncate text-[11px] font-medium text-gray-200">
                  {email}
                </p>

                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
                  {role.replace(
                    "_",
                    " "
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                void handleSignOut()
              }
              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="admin-shell-body flex min-h-screen pt-16">
        <aside
          className={`fixed left-0 top-16 hidden h-[calc(100dvh-4rem)] shrink-0 overflow-y-auto border-r border-white/10 bg-[#0b0f14] py-5 transition-all duration-200 lg:block ${
            collapsed
              ? "w-[72px] px-3"
              : "w-[250px] px-4"
          }`}
        >
          <div className="mb-5 flex items-center justify-between">
            {!collapsed && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6e7681]">
                  Navigation
                </p>

                <p className="mt-1 text-[10px] text-[#484f58]">
                  Website control
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                setCollapsed(
                  (current) => !current
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-[#6e7681] hover:text-white"
              title={
                collapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
            >
              {collapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {navigation}

          <div
            className={`mt-6 border-t border-white/5 pt-4 ${
              collapsed
                ? "text-center"
                : ""
            }`}
          >
            {!collapsed && (
              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                  </span>

                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                    System Online
                  </span>
                </div>

                <p className="mt-2 text-[9px] leading-4 text-[#6e7681]">
                  CMS and admin services are available.
                </p>
              </div>
            )}
          </div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <button
              type="button"
              onClick={() =>
                setMobileOpen(false)
              }
              className="absolute inset-0 bg-black/70"
              aria-label="Close navigation"
            />

            <aside className="relative h-full w-[min(290px,85vw)] overflow-y-auto border-r border-white/10 bg-[#0b0f14] p-4 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">
                    Admin Navigation
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#6e7681]">
                    First Look Studio
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-[#8b949e] hover:text-white"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {navigation}

              <div className="mt-6 border-t border-white/5 pt-5">
                <Link
                  href="/"
                  target="_blank"
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-[#8b949e] hover:bg-white/[0.04] hover:text-white"
                >
                  <Globe2 className="h-4 w-4" />
                  View Public Website
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    void handleSignOut()
                  }
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-rose-300 hover:bg-rose-500/5"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
