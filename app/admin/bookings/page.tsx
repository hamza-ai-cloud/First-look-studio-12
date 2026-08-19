import { supabaseAdmin } from '@/lib/supabaseAdmin';
import BookingsList from '@/components/admin/BookingsView';

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
  const { data: bookings, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(error.message);
  }

  const initial = (bookings || []).map((b: any) => ({
    id: b.id,
    name: b.name,
    email: b.email,
    phone: b.phone,
    service: b.service,
    date: b.date,
    time: b.time,
    notes: b.notes,
    status: b.status,
    createdAt: b.created_at,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      <BookingsList
        bookings={initial.map((b: any) => ({
          ...b,
          _id: b.id,
          client_name: b.name,
          client_email: b.email,
          service_package: b.service,
          event_date: b.date,
          total_price: 0,
        }))}
        onUpdateStatus={async (id, status) => {
          await fetch('/api/admin/bookings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status }),
          });
        }}
        onUpdateNotes={async () => {}}
        onDeleteBooking={async () => {}}
      />
    </div>
  );

}
