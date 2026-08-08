export const metadata = {
  title: 'Admin - First Look Studio',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Middleware will enforce authentication for protected admin routes.
  // Keep layout simple and render children; do not redirect here to avoid
  // wrapping the public sign-in page and causing redirect loops.
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4">Admin Dashboard</div>
      </header>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}
