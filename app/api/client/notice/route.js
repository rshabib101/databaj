import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ClientNotice from '@/models/ClientNotice';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'databaj-super-secret-jwt-key-2026';

function getUserFromRequest(request) {
  const token =
    request.cookies.get('databaj_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'অননুমোদিত' }, { status: 401 });
    }

    // Find active notice for this user
    const notice = await ClientNotice.findOne({
      userId: user.userId,
      isActive: true,
    })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      notice: notice || null,
    });
  } catch (error) {
    console.error('Client notice GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
