import { supabaseAdmin } from '@/lib/supabaseAdmin';
import DashboardView from '@/components/admin/DashboardView';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [
    bookingsResult,
    contactsResult,
    servicesResult,
    galleryResult,
  ] = await Promise.all([
    supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100),

    supabaseAdmin
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100),

    supabaseAdmin
      .from('services')
      .select('*')
      .limit(100),

    supabaseAdmin
      .from('gallery')
      .select('*')
      .limit(100),
  ]);

  return (
    <DashboardView
      bookings={bookingsResult.data || []}
      contacts={contactsResult.data || []}
      services={servicesResult.data || []}
      gallery={galleryResult.data || []}
    />
  );
}
