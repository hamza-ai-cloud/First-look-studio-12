import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  Image,
  Building2,
  LayoutTemplate,
  Menu,
  Palette,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react';

const modules = [
  {
    title: 'Site Settings',
    description: 'Control global website information, branding and behaviour.',
    href: '/admin/cms/settings',
    icon: Settings,
  },
  {
    title: 'Theme Studio',
    description: 'Manage colours, typography, buttons, spacing and visual style.',
    href: '/admin/cms/theme',
    icon: Palette,
  },
  {
    title: 'Pages',
    description: 'Create, edit, publish and manage every website page.',
    href: '/admin/cms/pages',
    icon: FileText,
  },
  {
    title: 'Page Builder',
    description: 'Control sections, visibility, content and section ordering.',
    href: '/admin/cms/pages',
    icon: LayoutTemplate,
  },
  {
    title: 'Branches',
    description: 'Manage studio locations, contact details, hours and map links.',
    href: '/admin/cms/branches',
    icon: Building2,
  },
  {
    title: 'Media Library',
    description: 'Manage images and website assets from one central library.',
    href: '/admin/cms/media',
    icon: Image,
  },
  {
    title: 'Navigation',
    description: 'Manage header, footer and mobile navigation menus.',
    href: '/admin/cms/navigation',
    icon: Menu,
  },
  {
    title: 'SEO Manager',
    description: 'Manage metadata, social previews, canonical URLs and robots.',
    href: '/admin/cms/seo',
    icon: Search,
  },
];

export default function CmsDashboardPage() {
  return (
    <div className="min-h-screen space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#151a22] via-[#0d1117] to-[#0b0f14] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#c99634]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c99634]/20 bg-[#c99634]/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4a33d]">
            <Sparkles className="h-3.5 w-3.5" />
            Website Control Center
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Content & Design Studio
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8b949e]">
            Manage your entire First Look Studio website from one place.
            Pages, sections, media, navigation, theme and SEO are being
            brought together into one powerful control system.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/cms/pages"
              className="inline-flex items-center gap-2 rounded-xl bg-[#c99634] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#dfb75c]"
            >
              Open Page Builder
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/admin/cms/theme"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08]"
            >
              Theme Studio
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">
            Website Management
          </h2>
          <p className="mt-1 text-sm text-[#8b949e]">
            Everything you need to control the website without touching code.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.title}
                href={module.href}
                className="group rounded-2xl border border-white/10 bg-[#0d1117] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#c99634]/30 hover:bg-[#11161d]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <Icon className="h-5 w-5 text-[#d4a33d]" />
                  </div>

                  <ArrowRight className="h-4 w-4 text-[#484f58] transition group-hover:translate-x-1 group-hover:text-[#d4a33d]" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-white">
                  {module.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#8b949e]">
                  {module.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0d1117] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Developer-free website management
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#8b949e]">
              The CMS foundation is now connected to the database. We are
              building the visual controls on top of it so future content and
              design changes can be made directly from the admin panel.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
