import { getPublicBranches } from "@/lib/cms/branches";
import { getPublicNavigation } from "@/lib/cms/public";
import type { PublicSiteSettings } from "@/lib/cms/public";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

interface PublicShellProps {
  children: React.ReactNode;
  settings: PublicSiteSettings;
}

export default async function PublicShell({
  children,
  settings,
}: PublicShellProps) {
  const [branches, headerNavigation, mobileNavigation] =
    await Promise.all([
      getPublicBranches(),
      getPublicNavigation("header"),
      getPublicNavigation("mobile"),
    ]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar
        navigation={headerNavigation}
        mobileNavigation={mobileNavigation}
      />
      <main className="flex-1">{children}</main>

      <Footer
        branches={branches}
        siteName={settings.identity.name}
        description={settings.footer.description}
        email={settings.contact.email}
        phone={settings.contact.phone}
        address={settings.contact.address}
        hours={settings.contact.hours}
        instagram={settings.social.instagram}
        facebook={settings.social.facebook}
        youtube={settings.social.youtube}
        tiktok={settings.social.tiktok}
        copyright={settings.footer.copyright}
      />
    </div>
  );
}
