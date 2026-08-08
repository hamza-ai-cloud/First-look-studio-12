import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getToken } from 'next-auth/jwt';
import { ObjectId } from 'mongodb';

const secret = process.env.NEXTAUTH_SECRET;

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const token = await getToken({ req: request as any, secret });
  if (!token || token.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('q');

  const { db } = await connectToDatabase();
  const query: any = {};
  if (status) query.status = status;
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

  const items = await db.collection('bookings').find(query).sort({ createdAt: -1 }).limit(500).toArray();
  return NextResponse.json({ success: true, data: items });
}

export async function PUT(request: Request) {
  const token = await getToken({ req: request as any, secret });
  if (!token || token.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as any;
  const { id, status } = body;
  if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });

  const { db } = await connectToDatabase();

  const res = await db.collection('bookings').updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
  if (res.matchedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ success: true });
}
