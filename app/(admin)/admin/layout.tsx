import type { ReactNode } from "react";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminScrollReset from "@/components/admin/AdminScrollReset";

export const metadata = {
  title: "Admin - First Look Studio",
  description: "First Look Studio administration dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const user = session?.user;

  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/admin/signin");
  }

  const email =
    typeof user?.email === "string"
      ? user.email
      : "Admin";

  const role =
    user && "role" in user
      ? String(user.role || "admin")
      : "admin";

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0b0f14] text-white">
      <AdminScrollReset />

      <AdminHeader email={email} role={role} />

      <main className="fixed inset-x-0 bottom-0 top-16 min-w-0 overflow-hidden lg:left-[250px]">
        <div className="h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain">
          <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
