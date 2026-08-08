import { connectToDatabase } from './mongodb';
import bcrypt from 'bcryptjs';

let seeded = false;

export async function seedAdminFromEnv() {
  if (seeded) return;
  seeded = true;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  try {
    const { db } = await connectToDatabase();

    const existing = await db.collection('admins').findOne({ email: email.toLowerCase() });
    if (existing) return;

    const hash = await bcrypt.hash(password, 10);

    await db.collection('admins').insertOne({
      email: email.toLowerCase(),
      passwordHash: hash,
      role: 'admin',
      createdAt: new Date(),
    });
    console.log('Seeded initial admin:', email);
  } catch (err) {
    console.error('Error seeding admin:', err);
  }
}
