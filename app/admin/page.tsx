import { connectToDatabase } from '@/lib/mongodb';
import { format } from 'date-fns';

export default async function AdminPage() {
  const { db } = await connectToDatabase();

  const totalBookings = await db.collection('bookings').countDocuments();
  const newBookings = await db.collection('bookings').countDocuments({ status: 'pending' });
  const pendingBookings = await db.collection('bookings').countDocuments({ status: 'pending' });
  const confirmedBookings = await db.collection('bookings').countDocuments({ status: 'confirmed' });
  const completedBookings = await db.collection('bookings').countDocuments({ status: 'completed' });

  const totalCustomers = await db.collection('bookings').distinct('email').then((r) => r.length).catch(() => 0);

  const recentBookings = await db.collection('bookings').find().sort({ createdAt: -1 }).limit(5).toArray();
  const recentContacts = await db.collection('contacts').find().sort({ createdAt: -1 }).limit(5).toArray();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total bookings</div>
          <div className="text-xl font-semibold">{totalBookings}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">New bookings</div>
          <div className="text-xl font-semibold">{newBookings}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Confirmed</div>
          <div className="text-xl font-semibold">{confirmedBookings}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-xl font-semibold">{completedBookings}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Recent Bookings</h2>
          <ul>
            {recentBookings.map((b: any) => (
              <li key={b._id.toString()} className="py-2 border-b">
                <div className="text-sm font-medium">{b.name} — {b.service}</div>
                <div className="text-xs text-gray-500">{b.email} • {b.phone}</div>
                <div className="text-xs text-gray-400">{format(new Date(b.createdAt), 'PPpp')}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Recent Contacts</h2>
          <ul>
            {recentContacts.map((c: any) => (
              <li key={c._id.toString()} className="py-2 border-b">
                <div className="text-sm font-medium">{c.name} — {c.subject}</div>
                <div className="text-xs text-gray-500">{c.email}</div>
                <div className="text-xs text-gray-400">{format(new Date(c.createdAt), 'PPpp')}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
