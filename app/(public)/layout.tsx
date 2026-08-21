import type { ReactNode } from "react";
import PublicShell from "@/components/layout/PublicShell";
import { getPublicSiteSettings } from "@/lib/cms/public";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const siteSettings = await getPublicSiteSettings();

  return (
    <PublicShell settings={siteSettings}>
      {children}
    </PublicShell>
  );
}
