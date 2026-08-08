import { connectToDatabase } from '@/lib/mongodb';
import BookingsList from '@/components/admin/bookings-list';

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
  const { db } = await connectToDatabase();
  const bookings = await db.collection('bookings').find().sort({ createdAt: -1 }).limit(100).toArray();

  const initial = bookings.map((b: any) => ({
    id: b._id.toString(),
    name: b.name,
    email: b.email,
    phone: b.phone,
    service: b.service,
    date: b.date,
    time: b.time,
    notes: b.notes,
    status: b.status,
    createdAt: b.createdAt,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      <div>
        {/* Client-side interactive list */}
        <BookingsList initialData={initial} />
      </div>
    </div>
  );
}
